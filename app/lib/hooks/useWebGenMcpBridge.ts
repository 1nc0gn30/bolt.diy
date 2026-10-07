import { useStore } from '@nanostores/react';
import { useEffect, useRef } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import type { DesignScheme } from '~/types/design-scheme';
import { curatedPaletteMaps, STUDIO_PRESETS } from '~/types/design-scheme';
import type { ProviderInfo } from '~/types/model';

interface UseWebGenMcpBridgeProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setModel?: (model: string) => void;
  setProvider?: (provider: ProviderInfo) => void;
  providerList?: ProviderInfo[];
  isStreaming?: boolean;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
}

export function useWebGenMcpBridge({
  textareaRef,
  sendMessage,
  handleInputChange,
  setModel,
  setProvider,
  providerList,
  isStreaming = false,
  designScheme,
  setDesignScheme,
}: UseWebGenMcpBridgeProps) {
  const files = useStore(workbenchStore.files);
  const previews = useStore(workbenchStore.previews);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state back to server whenever files, streaming, or previews change
  useEffect(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      const activePreview = previews?.[0];
      const previewUrl = activePreview?.baseUrl || null;

      // Extract serializable file map
      const serializableFiles: Record<string, { type: 'file'; content: string; isLocked?: boolean }> = {};

      for (const [path, fileObj] of Object.entries(files)) {
        if (fileObj && fileObj.type === 'file' && typeof fileObj.content === 'string') {
          serializableFiles[path] = {
            type: 'file',
            content: fileObj.content,
            isLocked: fileObj.isLocked,
          };
        }
      }

      fetch('/api/webgen/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_state',
          isStreaming,
          previewUrl,
          files: serializableFiles,
        }),
      }).catch(() => {
        // Ignore background sync errors
      });
    }, 400);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [files, isStreaming, previews]);

  // Connect to SSE event stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    function connect() {
      try {
        eventSource = new EventSource('/api/webgen/events');

        eventSource.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);

            if (data.type === 'SET_PROMPT') {
              const promptText = data.prompt || '';

              if (handleInputChange) {
                handleInputChange({ target: { value: promptText } } as any);
              }

              if (textareaRef?.current) {
                textareaRef.current.value = promptText;
                textareaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
                textareaRef.current.focus();
              }
            } else if (data.type === 'APPEND_PROMPT') {
              const currentVal = textareaRef?.current?.value || '';
              const addition = data.prompt || data.text || '';
              const updatedVal = (currentVal ? `${currentVal}\n\n` : '') + addition;

              if (handleInputChange) {
                handleInputChange({ target: { value: updatedVal } } as any);
              }

              if (textareaRef?.current) {
                textareaRef.current.value = updatedVal;
                textareaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
                textareaRef.current.focus();
              }
            } else if (data.type === 'SUBMIT') {
              if (sendMessage && textareaRef?.current) {
                const prompt = textareaRef.current.value;

                if (prompt.trim()) {
                  sendMessage({} as any, prompt);
                }
              }
            } else if (data.type === 'PROMPT_AND_BUILD') {
              if (data.provider && setProvider && providerList) {
                const found = providerList.find((p) => p.name.toLowerCase() === data.provider.toLowerCase());

                if (found) {
                  setProvider(found);
                }
              }

              if (data.model && setModel) {
                setModel(data.model);
              }

              if (data.template && setDesignScheme) {
                const current = designScheme || ({} as DesignScheme);
                setDesignScheme({ ...current, framework: data.template });
              }

              const promptText = data.prompt || '';

              if (handleInputChange) {
                handleInputChange({ target: { value: promptText } } as any);
              }

              if (textareaRef?.current) {
                textareaRef.current.value = promptText;
                textareaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
              }

              if (sendMessage && promptText) {
                // Short delay to allow state propagation
                setTimeout(() => {
                  sendMessage({} as any, promptText);
                }, 120);
              }
            } else if (data.type === 'SET_FRAMEWORK') {
              if (data.framework && setDesignScheme) {
                const current = designScheme || ({} as DesignScheme);
                setDesignScheme({ ...current, framework: data.framework });
              }
            } else if (data.type === 'SET_DESIGN_SCHEME') {
              if (setDesignScheme) {
                let updated = designScheme ? { ...designScheme } : ({} as DesignScheme);

                if (data.presetId) {
                  const preset = STUDIO_PRESETS.find((p) => p.id === data.presetId);

                  if (preset) {
                    updated = { ...updated, ...preset.scheme };
                  } else if (curatedPaletteMaps[data.presetId]) {
                    updated = {
                      ...updated,
                      palette: { ...(updated.palette || {}), ...curatedPaletteMaps[data.presetId] },
                    };
                  }
                }

                if (data.scheme) {
                  updated = { ...updated, ...data.scheme };
                }

                setDesignScheme(updated);
              }
            } else if (data.type === 'INSERT_MEDIA_PACK') {
              if (data.destination === 'workspace' && data.assets) {
                workbenchStore.createFile('src/assets/media-manifest.json', JSON.stringify(data.assets, null, 2));
              } else if (data.assets && Array.isArray(data.assets)) {
                const assetLines = data.assets
                  .slice(0, 5)
                  .map((a: any) => `- ![${a.title}](${a.url}) (Alt: "${a.alt}")`)
                  .join('\n');

                const snippet = `\n\n<verified_media_pack industry="${data.industry}">\n${assetLines}\n</verified_media_pack>`;

                const currentVal = textareaRef?.current?.value || '';
                const updatedVal = currentVal + snippet;

                if (handleInputChange) {
                  handleInputChange({ target: { value: updatedVal } } as any);
                }

                if (textareaRef?.current) {
                  textareaRef.current.value = updatedVal;
                  textareaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
                  textareaRef.current.focus();
                }
              }
            } else if (data.type === 'WRITE_FILE') {
              if (data.path && typeof data.content === 'string') {
                workbenchStore.createFile(data.path, data.content);
              }
            }
          } catch {
            // Ignore non-json lines
          }
        };

        eventSource.onerror = () => {
          eventSource?.close();
          reconnectTimer = setTimeout(connect, 3000);
        };
      } catch {
        reconnectTimer = setTimeout(connect, 5000);
      }
    }

    connect();

    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      eventSource?.close();
    };
  }, [textareaRef, sendMessage, handleInputChange, setModel, setProvider, providerList, setDesignScheme, designScheme]);
}
