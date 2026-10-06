import { useStore } from '@nanostores/react';
import * as Tabs from '@radix-ui/react-tabs';
import { memo, useMemo } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { toast } from 'react-toastify';
import { FileBreadcrumb } from './FileBreadcrumb';
import { FileTree } from './FileTree';
import { LockManager } from './LockManager'; // <-- Import LockManager
import { Search } from './Search'; // <-- Ensure Search is imported
import { DEFAULT_TERMINAL_SIZE, TerminalTabs } from './terminal/TerminalTabs';
import {
  CodeMirrorEditor,
  type EditorDocument,
  type EditorSettings,
  type OnChangeCallback as OnEditorChange,
  type OnSaveCallback as OnEditorSave,
  type OnScrollCallback as OnEditorScroll,
} from '~/components/editor/codemirror/CodeMirrorEditor';
import { PanelHeader } from '~/components/ui/PanelHeader';
import { PanelHeaderButton } from '~/components/ui/PanelHeaderButton';
import type { FileMap } from '~/lib/stores/files';
import {
  isProLicensedStore,
  openPaywall,
  openActivationModal,
  openDePayCheckout,
  STRIPE_CHECKOUT_URL,
} from '~/lib/stores/license';
import { themeStore } from '~/lib/stores/theme';
import { workbenchStore } from '~/lib/stores/workbench';
import type { FileHistory } from '~/types/actions';
import { classNames } from '~/utils/classNames'; // <-- Import classNames if not already present
import { WORK_DIR } from '~/utils/constants';
import { renderLogger } from '~/utils/logger';
import { isMobile } from '~/utils/mobile';

interface EditorPanelProps {
  files?: FileMap;
  unsavedFiles?: Set<string>;
  editorDocument?: EditorDocument;
  selectedFile?: string | undefined;
  isStreaming?: boolean;
  fileHistory?: Record<string, FileHistory>;
  onEditorChange?: OnEditorChange;
  onEditorScroll?: OnEditorScroll;
  onFileSelect?: (value?: string) => void;
  onFileSave?: OnEditorSave;
  onFileReset?: () => void;
}

const DEFAULT_EDITOR_SIZE = 100 - DEFAULT_TERMINAL_SIZE;

const editorSettings: EditorSettings = { tabSize: 2 };

export const EditorPanel = memo(
  ({
    files,
    unsavedFiles,
    editorDocument,
    selectedFile,
    isStreaming,
    fileHistory,
    onFileSelect,
    onEditorChange,
    onEditorScroll,
    onFileSave,
    onFileReset,
  }: EditorPanelProps) => {
    renderLogger.trace('EditorPanel');

    const theme = useStore(themeStore);
    const showTerminal = useStore(workbenchStore.showTerminal);
    const isLicensed = useStore(isProLicensedStore);

    const activeFileSegments = useMemo(() => {
      if (!editorDocument) {
        return undefined;
      }

      return editorDocument.filePath.split('/');
    }, [editorDocument]);

    const activeFileUnsaved = useMemo(() => {
      if (!editorDocument || !unsavedFiles) {
        return false;
      }

      // Make sure unsavedFiles is a Set before calling has()
      return unsavedFiles instanceof Set && unsavedFiles.has(editorDocument.filePath);
    }, [editorDocument, unsavedFiles]);

    return (
      <Group orientation="vertical">
        <Panel defaultSize={showTerminal ? DEFAULT_EDITOR_SIZE : 100} minSize={20}>
          <Group orientation="horizontal">
            <Panel defaultSize={20} minSize={15} collapsible className="border-r border-bolt-elements-borderColor">
              <div className="h-full">
                <Tabs.Root defaultValue="files" className="flex flex-col h-full">
                  <PanelHeader className="w-full text-sm font-medium text-bolt-elements-textSecondary px-1">
                    <div className="h-full flex-shrink-0 flex items-center justify-between w-full">
                      <Tabs.List className="h-full flex-shrink-0 flex items-center">
                        <Tabs.Trigger
                          value="files"
                          className={classNames(
                            'h-full bg-transparent hover:bg-bolt-elements-background-depth-3 py-0.5 px-2 rounded-lg text-sm font-medium text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary data-[state=active]:text-bolt-elements-textPrimary',
                          )}
                        >
                          Files
                        </Tabs.Trigger>
                        <Tabs.Trigger
                          value="search"
                          className={classNames(
                            'h-full bg-transparent hover:bg-bolt-elements-background-depth-3 py-0.5 px-2 rounded-lg text-sm font-medium text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary data-[state=active]:text-bolt-elements-textPrimary',
                          )}
                        >
                          Search
                        </Tabs.Trigger>
                        <Tabs.Trigger
                          value="locks"
                          className={classNames(
                            'h-full bg-transparent hover:bg-bolt-elements-background-depth-3 py-0.5 px-2 rounded-lg text-sm font-medium text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary data-[state=active]:text-bolt-elements-textPrimary',
                          )}
                        >
                          Locks
                        </Tabs.Trigger>
                      </Tabs.List>
                    </div>
                  </PanelHeader>

                  <Tabs.Content value="files" className="flex-grow overflow-auto focus-visible:outline-none">
                    <FileTree
                      className="h-full"
                      files={files}
                      hideRoot
                      unsavedFiles={unsavedFiles}
                      fileHistory={fileHistory}
                      rootFolder={WORK_DIR}
                      selectedFile={selectedFile}
                      onFileSelect={onFileSelect}
                    />
                  </Tabs.Content>

                  <Tabs.Content value="search" className="flex-grow overflow-auto focus-visible:outline-none">
                    <Search />
                  </Tabs.Content>

                  <Tabs.Content value="locks" className="flex-grow overflow-auto focus-visible:outline-none">
                    <LockManager />
                  </Tabs.Content>
                </Tabs.Root>
              </div>
            </Panel>

            <Separator />
            <Panel className="flex flex-col" defaultSize={80} minSize={20}>
              <PanelHeader className="overflow-x-auto">
                {activeFileSegments?.length && (
                  <div className="flex items-center flex-1 text-sm">
                    <FileBreadcrumb pathSegments={activeFileSegments} files={files} onFileSelect={onFileSelect} />
                    <div className="flex gap-1 ml-auto -mr-1.5 items-center">
                      {editorDocument && (
                        <PanelHeaderButton
                          onClick={() => {
                            if (!isLicensed) {
                              openPaywall();
                              return;
                            }

                            if (editorDocument.value) {
                              navigator.clipboard.writeText(editorDocument.value);
                              toast.success('Code copied to clipboard!');
                            }
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="i-ph:copy-duotone" />
                            <span>Copy</span>
                            {!isLicensed && (
                              <span className="text-[9px] font-mono font-bold text-[#D4AF37] border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-1 py-0.2 rounded ml-0.5">
                                PRO
                              </span>
                            )}
                          </div>
                        </PanelHeaderButton>
                      )}
                      {activeFileUnsaved && (
                        <>
                          <PanelHeaderButton onClick={onFileSave}>
                            <div className="i-ph:floppy-disk-duotone" />
                            Save
                          </PanelHeaderButton>
                          <PanelHeaderButton onClick={onFileReset}>
                            <div className="i-ph:clock-counter-clockwise-duotone" />
                            Reset
                          </PanelHeaderButton>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </PanelHeader>
              <div className="relative h-full flex-1 overflow-hidden modern-scrollbar">
                <div
                  className="h-full w-full transition-all duration-300"
                  style={{
                    filter: !isLicensed ? 'blur(6px)' : 'none',
                    pointerEvents: !isLicensed ? 'none' : 'auto',
                    userSelect: !isLicensed ? 'none' : 'auto',
                  }}
                >
                  <CodeMirrorEditor
                    theme={theme}
                    editable={!isStreaming && editorDocument !== undefined && isLicensed}
                    settings={editorSettings}
                    doc={editorDocument}
                    autoFocusOnDocumentChange={!isMobile()}
                    onScroll={onEditorScroll}
                    onChange={onEditorChange}
                    onSave={onFileSave}
                  />
                </div>

                {!isLicensed && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-[#08080B]/60 backdrop-blur-sm">
                    <div className="max-w-md w-full p-6 rounded-2xl bg-[#0D0D12]/95 border border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.2)] text-center flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-3">
                        <div className="i-ph:lock-key-fill text-2xl" />
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-semibold mb-2">
                        FOUNDING DEVELOPER PASS
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Unlock Full Source & Workbench</h3>
                      <p className="text-xs text-white/70 mt-2 mb-4 leading-relaxed">
                        Full source code editing, real-time AST transformations, unlimited exports, and terminal access
                        are reserved for Zoth Pro founders.
                      </p>
                      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                        <a
                          href={STRIPE_CHECKOUT_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5E6AB] text-black font-semibold text-xs text-center shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                        >
                          <div className="i-ph:credit-card-bold text-sm" />
                          <span>Unlock Pro — $19</span>
                          <span className="line-through text-black/50 text-[10px]">$79</span>
                        </a>
                        <button
                          onClick={openDePayCheckout}
                          className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#14141E] hover:bg-[#1C1C2A] border border-[#D4AF37]/30 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <div className="i-ph:currency-circle-dollar-bold text-[#D4AF37] text-sm" />
                          <span>Pay SOL</span>
                        </button>
                      </div>
                      <button
                        onClick={openActivationModal}
                        className="mt-3 text-[11px] text-[#D4AF37]/80 hover:text-[#D4AF37] underline transition-colors"
                      >
                        Already have a license key or receipt? Activate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          </Group>
        </Panel>
        <Separator />
        <TerminalTabs />
      </Group>
    );
  },
);
