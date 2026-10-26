/*
 * @ts-nocheck
 * Preventing TS checks with files presented in the video for a better presentation.
 */
import { useStore } from '@nanostores/react';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { JSONValue, Message } from 'ai';
import Cookies from 'js-cookie';
import React, { type RefCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ClientOnly } from 'remix-utils/client-only';
import { getApiKeysFromCookies } from './APIKeyManager';
import styles from './BaseChat.module.scss';
import ChatAlert from './ChatAlert';
import { ChatBox } from './ChatBox';
import GitCloneButton from './GitCloneButton';
import LlmErrorAlert from './LLMApiAlert';
import { Messages } from './Messages.client';
import ProgressCompilation from './ProgressCompilation';
import { BuildLogStream } from './BuildLogStream';
import { PromptPresetStack } from './PromptPresetStack';
import StarterTemplates from './StarterTemplates';
import { ZothBentoFeatures } from './ZothBentoFeatures';
import { pendingPromptAppendAtom } from '~/lib/stores/studioStore';
import { pushBuildLog } from '~/lib/stores/buildLog';
import { ExamplePrompts } from '~/components/chat/ExamplePrompts';
import { SupabaseChatAlert } from '~/components/chat/SupabaseAlert';
import { ImportButtons } from '~/components/chat/chatExportAndImport/ImportButtons';
import DeployChatAlert from '~/components/deploy/DeployAlert';
import { KineticHeroCanvas } from '~/components/motion/KineticHeroCanvas';
import { MotionShowreelModal } from '~/components/motion/MotionShowreelModal';
import { Menu } from '~/components/sidebar/Menu.client';
import type { ElementInfo } from '~/components/workbench/Inspector';
import { Workbench } from '~/components/workbench/Workbench.client';
import { StickToBottom, useStickToBottomContext } from '~/lib/hooks';
import { useWebGenMcpBridge } from '~/lib/hooks/useWebGenMcpBridge';
import type { ModelInfo } from '~/lib/modules/llm/types';
import { expoUrlAtom } from '~/lib/stores/qrCodeStore';
import type { ActionAlert, SupabaseAlert, DeployAlert, LlmErrorAlertType } from '~/types/actions';
import type { ProgressAnnotation } from '~/types/context';
import type { DesignScheme } from '~/types/design-scheme';
import type { ProviderInfo } from '~/types/model';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';

const TEXTAREA_MIN_HEIGHT = 76;

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement | null> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  onStreamingChange?: (streaming: boolean) => void;
  messages?: Message[];
  description?: string;
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  model?: string;
  setModel?: (model: string) => void;
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  providerList?: ProviderInfo[];
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
  importChat?: (description: string, messages: Message[]) => Promise<void>;
  exportChat?: () => void;
  uploadedFiles?: File[];
  setUploadedFiles?: (files: File[]) => void;
  imageDataList?: string[];
  setImageDataList?: (dataList: string[]) => void;
  actionAlert?: ActionAlert;
  clearAlert?: () => void;
  supabaseAlert?: SupabaseAlert;
  clearSupabaseAlert?: () => void;
  deployAlert?: DeployAlert;
  clearDeployAlert?: () => void;
  llmErrorAlert?: LlmErrorAlertType;
  clearLlmErrorAlert?: () => void;
  data?: JSONValue[] | undefined;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  append?: (message: Message) => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: (element: ElementInfo | null) => void;
  addToolResult?: ({ toolCallId, result }: { toolCallId: string; result: any }) => void;
  onWebSearchResult?: (result: string) => void;
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      onStreamingChange,
      model,
      setModel,
      provider,
      setProvider,
      providerList,
      input = '',
      enhancingPrompt,
      handleInputChange,

      // promptEnhanced,
      enhancePrompt,
      sendMessage,
      handleStop,
      importChat,
      exportChat,
      uploadedFiles = [],
      setUploadedFiles,
      imageDataList = [],
      setImageDataList,
      messages,
      actionAlert,
      clearAlert,
      deployAlert,
      clearDeployAlert,
      supabaseAlert,
      clearSupabaseAlert,
      llmErrorAlert,
      clearLlmErrorAlert,
      data,
      chatMode,
      setChatMode,
      append,
      designScheme,
      setDesignScheme,
      selectedElement,
      setSelectedElement,
      addToolResult = () => {
        throw new Error('addToolResult not implemented');
      },
      onWebSearchResult,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    const [apiKeys, setApiKeys] = useState<Record<string, string>>(getApiKeysFromCookies());
    const [modelList, setModelList] = useState<ModelInfo[]>([]);
    const [isModelSettingsCollapsed, setIsModelSettingsCollapsed] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [transcript, setTranscript] = useState('');
    const [isModelLoading, setIsModelLoading] = useState<string | undefined>('all');
    const [progressAnnotations, setProgressAnnotations] = useState<ProgressAnnotation[]>([]);
    const lastProgressOrderRef = useRef(-1);
    const expoUrl = useStore(expoUrlAtom);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [showreelOpen, setShowreelOpen] = useState(false);

    useWebGenMcpBridge({
      textareaRef,
      sendMessage,
      handleInputChange,
      setModel,
      setProvider,
      providerList,
      isStreaming,
      designScheme,
      setDesignScheme,
    });

    useEffect(() => {
      if (expoUrl) {
        setQrModalOpen(true);
      }
    }, [expoUrl]);

    useEffect(() => {
      if (!data || data.length === 0) {
        lastProgressOrderRef.current = -1;
        return;
      }

      const progressList = data.filter(
        (x) => typeof x === 'object' && (x as any).type === 'progress',
      ) as ProgressAnnotation[];
      setProgressAnnotations(progressList);

      for (const item of progressList) {
        if (item.order <= lastProgressOrderRef.current || !item.message) {
          continue;
        }

        lastProgressOrderRef.current = item.order;
        pushBuildLog(
          item.status === 'failed' ? 'error' : item.label?.startsWith('continue') ? 'continue' : 'progress',
          item.message,
        );
      }
    }, [data]);

    useEffect(() => {
      const unsub = pendingPromptAppendAtom.subscribe((snippet) => {
        if (!snippet || !handleInputChange) {
          return;
        }

        const current = textareaRef?.current?.value || input || '';
        const next = current.trim() ? `${current.trim()}\n\n${snippet}` : snippet;
        handleInputChange({ target: { value: next } } as any);

        if (textareaRef?.current) {
          textareaRef.current.value = next;
          textareaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
          textareaRef.current.focus();
        }

        pendingPromptAppendAtom.set(null);
      });

      return () => unsub();
    }, [handleInputChange, input, textareaRef]);
    useEffect(() => {
      console.log(transcript);
    }, [transcript]);

    useEffect(() => {
      onStreamingChange?.(isStreaming);
    }, [isStreaming, onStreamingChange]);

    useEffect(() => {
      if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');

          setTranscript(transcript);

          if (handleInputChange) {
            const syntheticEvent = {
              target: { value: transcript },
            } as React.ChangeEvent<HTMLTextAreaElement>;
            handleInputChange(syntheticEvent);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }, []);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        let parsedApiKeys: Record<string, string> | undefined = {};

        try {
          parsedApiKeys = getApiKeysFromCookies();
          setApiKeys(parsedApiKeys);
        } catch (error) {
          console.error('Error loading API keys from cookies:', error);
          Cookies.remove('apiKeys');
        }

        setIsModelLoading('all');
        fetch('/api/models')
          .then((response) => response.json())
          .then((data) => {
            const typedData = data as { modelList: ModelInfo[] };
            setModelList(typedData.modelList);
          })
          .catch((error) => {
            console.error('Error fetching model list:', error);
          })
          .finally(() => {
            setIsModelLoading(undefined);
          });
      }
    }, [providerList, provider]);

    const onApiKeysChange = async (providerName: string, apiKey: string) => {
      const newApiKeys = { ...apiKeys, [providerName]: apiKey };
      setApiKeys(newApiKeys);
      Cookies.set('apiKeys', JSON.stringify(newApiKeys));

      setIsModelLoading(providerName);

      let providerModels: ModelInfo[] = [];

      try {
        const response = await fetch(`/api/models/${encodeURIComponent(providerName)}`);
        const data = await response.json();
        providerModels = (data as { modelList: ModelInfo[] }).modelList;
      } catch (error) {
        console.error('Error loading dynamic models for:', providerName, error);
      }

      // Only update models for the specific provider
      setModelList((prevModels) => {
        const otherModels = prevModels.filter((model) => model.provider !== providerName);
        return [...otherModels, ...providerModels];
      });
      setIsModelLoading(undefined);
    };

    const startListening = () => {
      if (recognition) {
        recognition.start();
        setIsListening(true);
      }
    };

    const stopListening = () => {
      if (recognition) {
        recognition.stop();
        setIsListening(false);
      }
    };

    const handleSendMessage = (event: React.UIEvent, messageInput?: string) => {
      if (sendMessage) {
        sendMessage(event, messageInput);
        setSelectedElement?.(null);

        if (recognition) {
          recognition.abort(); // Stop current recognition
          setTranscript(''); // Clear transcript
          setIsListening(false);

          // Clear the input by triggering handleInputChange with empty value
          if (handleInputChange) {
            const syntheticEvent = {
              target: { value: '' },
            } as React.ChangeEvent<HTMLTextAreaElement>;
            handleInputChange(syntheticEvent);
          }
        }
      }
    };

    const handleFileUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];

        if (file) {
          const reader = new FileReader();

          reader.onload = (e) => {
            const base64Image = e.target?.result as string;
            setUploadedFiles?.([...uploadedFiles, file]);
            setImageDataList?.([...imageDataList, base64Image]);
          };
          reader.readAsDataURL(file);
        }
      };

      input.click();
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;

      if (!items) {
        return;
      }

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();

          const file = item.getAsFile();

          if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
              const base64Image = e.target?.result as string;
              setUploadedFiles?.([...uploadedFiles, file]);
              setImageDataList?.([...imageDataList, base64Image]);
            };
            reader.readAsDataURL(file);
          }

          break;
        }
      }
    };

    const baseChat = (
      <div
        ref={ref}
        className={classNames(styles.BaseChat, 'relative flex h-full w-full overflow-hidden')}
        data-chat-visible={showChat}
      >
        <ClientOnly>{() => <Menu />}</ClientOnly>
        <div className="flex flex-col lg:flex-row overflow-y-auto w-full h-full">
          <div className={classNames(styles.Chat, 'flex flex-col flex-grow lg:min-w-[var(--chat-min-width)] h-full')}>
            {!chatStarted && (
              <>
                <ClientOnly>{() => <KineticHeroCanvas />}</ClientOnly>
                <div id="intro" className="relative z-10 mt-3 sm:mt-5 max-w-2xl mx-auto text-center px-4 lg:px-0">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-[11px] font-mono font-medium uppercase tracking-wider mb-2.5 animate-fade-in">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    <span>Zoth Bolt · Any AI Provider &amp; Agent · Motion &amp; Pixel Vault</span>
                  </div>
                  <h1 className="font-space-grotesk text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-bolt-elements-textPrimary mb-2 animate-fade-in">
                    Zoth Bolt Full-Stack Architect
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base mb-2 text-bolt-elements-textSecondary animate-fade-in animation-delay-200 max-w-[44rem] mx-auto">
                    Build Awwwards-grade full-stack apps &amp; 15s motion edits with any cloud LLM, Ollama model, or local CLI agent (AGY, Hermes, Grok, Claude, OpenCode, Cline, Aider) plus 200k+ free SVG &amp; pixel-art assets.
                  </p>
                </div>
                <ClientOnly>
                  {() => (
                    <ZothBentoFeatures
                      onSelectCloudModel={() => {
                        const googleProv = (providerList || PROVIDER_LIST)?.find((p: any) => p.name === 'Google');

                        if (googleProv) {
                          setProvider?.(googleProv as any);
                          setModel?.('gemini-2.5-flash');
                          toast.success('🌟 Frontier Cloud Model Active: Google Gemini 2.5 Flash');
                        }
                      }}
                      onSelectStarter={() => {
                        textareaRef?.current?.focus();
                      }}
                    />
                  )}
                </ClientOnly>
              </>
            )}
            <StickToBottom
              className={classNames('pt-6 px-2 sm:px-6 relative', {
                'h-full flex flex-col modern-scrollbar': chatStarted,
              })}
              resize="smooth"
              initial="smooth"
            >
              <StickToBottom.Content className="flex flex-col gap-4 relative ">
                <ClientOnly>
                  {() => {
                    return chatStarted ? (
                      <Messages
                        className="flex flex-col w-full flex-1 max-w-chat pb-4 mx-auto z-1"
                        messages={messages}
                        isStreaming={isStreaming}
                        append={append}
                        chatMode={chatMode}
                        setChatMode={setChatMode}
                        provider={provider}
                        model={model}
                        addToolResult={addToolResult}
                      />
                    ) : null;
                  }}
                </ClientOnly>
                <ScrollToBottom />
              </StickToBottom.Content>
              <div
                className={classNames('my-auto flex flex-col gap-2 w-full max-w-chat mx-auto z-prompt mb-6', {
                  'sticky bottom-2': chatStarted,
                })}
              >
                <div className="flex flex-col gap-2">
                  {deployAlert && (
                    <DeployChatAlert
                      alert={deployAlert}
                      clearAlert={() => clearDeployAlert?.()}
                      postMessage={(message: string | undefined) => {
                        sendMessage?.({} as any, message);
                        clearSupabaseAlert?.();
                      }}
                    />
                  )}
                  {supabaseAlert && (
                    <SupabaseChatAlert
                      alert={supabaseAlert}
                      clearAlert={() => clearSupabaseAlert?.()}
                      postMessage={(message) => {
                        sendMessage?.({} as any, message);
                        clearSupabaseAlert?.();
                      }}
                    />
                  )}
                  {actionAlert && (
                    <ChatAlert
                      alert={actionAlert}
                      clearAlert={() => clearAlert?.()}
                      postMessage={(message) => {
                        sendMessage?.({} as any, message);
                        clearAlert?.();
                      }}
                    />
                  )}
                  {llmErrorAlert && <LlmErrorAlert alert={llmErrorAlert} clearAlert={() => clearLlmErrorAlert?.()} />}
                </div>
                {progressAnnotations && <ProgressCompilation data={progressAnnotations} />}
                {(isStreaming || chatStarted) && <BuildLogStream isStreaming={isStreaming} />}
                {chatStarted && (
                  <PromptPresetStack
                    compact
                    input={input}
                    onInput={(next) => {
                      handleInputChange?.({ target: { value: next } } as any);
                    }}
                  />
                )}
                <ChatBox
                  isModelSettingsCollapsed={isModelSettingsCollapsed}
                  setIsModelSettingsCollapsed={setIsModelSettingsCollapsed}
                  provider={provider}
                  setProvider={setProvider}
                  providerList={providerList || (PROVIDER_LIST as ProviderInfo[])}
                  model={model}
                  setModel={setModel}
                  modelList={modelList}
                  apiKeys={apiKeys}
                  isModelLoading={isModelLoading}
                  onApiKeysChange={onApiKeysChange}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  imageDataList={imageDataList}
                  setImageDataList={setImageDataList}
                  textareaRef={textareaRef}
                  input={input}
                  handleInputChange={handleInputChange}
                  handlePaste={handlePaste}
                  TEXTAREA_MIN_HEIGHT={TEXTAREA_MIN_HEIGHT}
                  TEXTAREA_MAX_HEIGHT={TEXTAREA_MAX_HEIGHT}
                  isStreaming={isStreaming}
                  handleStop={handleStop}
                  handleSendMessage={handleSendMessage}
                  enhancingPrompt={enhancingPrompt}
                  enhancePrompt={enhancePrompt}
                  isListening={isListening}
                  startListening={startListening}
                  stopListening={stopListening}
                  chatStarted={chatStarted}
                  exportChat={exportChat}
                  qrModalOpen={qrModalOpen}
                  setQrModalOpen={setQrModalOpen}
                  handleFileUpload={handleFileUpload}
                  chatMode={chatMode}
                  setChatMode={setChatMode}
                  designScheme={designScheme}
                  setDesignScheme={setDesignScheme}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                  onWebSearchResult={onWebSearchResult}
                />
              </div>
            </StickToBottom>
            <div className="flex flex-col justify-center">
              {!chatStarted && (
                <div className="flex justify-center gap-2">
                  {ImportButtons(importChat)}
                  <GitCloneButton importChat={importChat} />
                </div>
              )}
              <div className="flex flex-col gap-5">
                {!chatStarted &&
                  ExamplePrompts((_event, messageInput) => {
                    const next = input?.trim()
                      ? `${input.trim()}\n\n${messageInput}`
                      : messageInput || '';
                    handleInputChange?.({ target: { value: next } } as any);
                  })}
                {!chatStarted && (
                  <PromptPresetStack
                    input={input}
                    onInput={(next) => {
                      handleInputChange?.({ target: { value: next } } as any);
                    }}
                  />
                )}
                {!chatStarted && (
                  <StarterTemplates
                    onSelectPrompt={(selectedPrompt) => {
                      const next = input?.trim()
                        ? `${input.trim()}\n\n${selectedPrompt}`
                        : selectedPrompt;
                      handleInputChange?.({ target: { value: next } } as any);
                    }}
                  />
                )}
              </div>
              {!chatStarted && (
                <footer className="mt-8 mb-4 text-center text-xs text-bolt-elements-textTertiary flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <span>Engineered by</span>
                    <a
                      href="https://github.com/1nc0gn30"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#D4AF37] hover:text-[#F5E6AB] underline underline-offset-2 transition-colors"
                    >
                      Neal Frazier Tech (@1nc0gn30)
                    </a>
                    <span>•</span>
                    <a
                      href="https://zothos.nullai.tech"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-bolt-elements-textSecondary transition-colors"
                    >
                      zothos.nullai.tech
                    </a>
                    <span>•</span>
                    <a
                      href="https://zoth.nullai.tech"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-bolt-elements-textSecondary transition-colors"
                    >
                      Studio
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-[11px] text-bolt-elements-textTertiary/80">
                    <a href="/terms" className="hover:text-white transition-colors">
                      Terms of Service
                    </a>
                    <span>•</span>
                    <a href="/privacy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                    <span>•</span>
                    <a href="/support" className="hover:text-white transition-colors">
                      Support & FAQs
                    </a>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setShowreelOpen(true)}
                      className="hover:text-white transition-colors bg-transparent border-0 p-0 text-[11px] text-bolt-elements-textTertiary/80 cursor-pointer"
                    >
                      15s showreel
                    </button>
                  </div>
                </footer>
              )}
            </div>
          </div>
          <ClientOnly>
            {() => (
              <Workbench chatStarted={chatStarted} isStreaming={isStreaming} setSelectedElement={setSelectedElement} />
            )}
          </ClientOnly>
        </div>
        <ClientOnly>
          {() => <MotionShowreelModal isOpen={showreelOpen} onClose={() => setShowreelOpen(false)} />}
        </ClientOnly>
      </div>
    );

    return <Tooltip.Provider delayDuration={200}>{baseChat}</Tooltip.Provider>;
  },
);

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <>
        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-bolt-elements-background-depth-1 to-transparent h-20 z-10" />
        <button
          className="sticky z-50 bottom-0 left-0 right-0 text-4xl rounded-lg px-1.5 py-0.5 flex items-center justify-center mx-auto gap-2 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor text-bolt-elements-textPrimary text-sm"
          onClick={() => scrollToBottom()}
        >
          Go to last message
          <span className="i-ph:arrow-down animate-bounce" />
        </button>
      </>
    )
  );
}
