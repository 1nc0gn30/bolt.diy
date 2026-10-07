import { useStore } from '@nanostores/react';
import { useEffect, useRef } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import type { ProviderInfo } from '~/types/model';

interface UseWebGenMcpBridgeProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  setModel?: (model: string) => void;
  setProvider?: (provider: ProviderInfo) => void;
  providerList?: ProviderInfo[];
  isStreaming?: boolean;
}

export function useWebGenMcpBridge({
  textareaRef,
  sendMessage,
  setModel,
  setProvider,
  providerList,
  isStreaming = false,
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
              if (textareaRef?.current) {
                textareaRef.current.value = data.prompt || '';
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

              if (textareaRef?.current) {
                textareaRef.current.value = data.prompt || '';
                textareaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
              }

              if (sendMessage && data.prompt) {
                // Short delay to allow state propagation
                setTimeout(() => {
                  sendMessage({} as any, data.prompt);
                }, 100);
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
  }, [textareaRef, sendMessage, setModel, setProvider, providerList]);
}
