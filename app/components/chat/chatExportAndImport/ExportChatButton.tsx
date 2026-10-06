import { useStore } from '@nanostores/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { isProLicensedStore, openPaywall } from '~/lib/stores/license';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';

export const ExportChatButton = ({ exportChat }: { exportChat?: () => void }) => {
  const isLicensed = useStore(isProLicensedStore);

  return (
    <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="rounded-md items-center justify-center [&:is(:disabled,.disabled)]:cursor-not-allowed [&:is(:disabled,.disabled)]:opacity-60 px-3 py-1.5 text-xs bg-accent-500 text-black font-semibold hover:text-black [&:not(:disabled,.disabled)]:hover:bg-[#F5E6AB] outline-accent-500 flex gap-1.5">
          Export
          <span className={classNames('i-ph:caret-down transition-transform text-black')} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className={classNames(
            'z-[250]',
            'bg-bolt-elements-background-depth-2',
            'rounded-lg shadow-lg',
            'border border-bolt-elements-borderColor',
            'animate-in fade-in-0 zoom-in-95',
            'py-1 min-w-[180px]',
          )}
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item
            className={classNames(
              'cursor-pointer flex items-center justify-between w-full px-4 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive gap-2 rounded-md group relative',
            )}
            onClick={() => {
              if (!isProLicensedStore.get()) {
                openPaywall();
                return;
              }

              workbenchStore.downloadZip();
            }}
          >
            <div className="flex items-center gap-2">
              <div className="i-ph:code size-4.5 text-[#D4AF37]"></div>
              <span>Download Code</span>
            </div>
            {!isLicensed && (
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-1.5 py-0.2 rounded">
                PRO
              </span>
            )}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={classNames(
              'cursor-pointer flex items-center justify-between w-full px-4 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive gap-2 rounded-md group relative',
            )}
            onClick={() => {
              if (!isProLicensedStore.get()) {
                openPaywall();
                return;
              }

              exportChat?.();
            }}
          >
            <div className="flex items-center gap-2">
              <div className="i-ph:chat size-4.5 text-[#D4AF37]"></div>
              <span>Export Chat</span>
            </div>
            {!isLicensed && (
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-1.5 py-0.2 rounded">
                PRO
              </span>
            )}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};
