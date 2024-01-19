import * as React from 'react';

// Import necessary components from 'react' and 'headlessui/react' for the Popover
import { Popover, Transition } from '@headlessui/react';

export function CloseableMenu(props: {
  open: boolean,
  anchorEl: HTMLElement | null,
  onClose: () => void,
  dense?: boolean,
  placement?: string, // Tailwind doesn't use PopperPlacementType, so this should be a string
  placementOffset?: number[],
  maxHeightGapPx?: number,
  noTopPadding?: boolean,
  noBottomPadding?: boolean,
  zIndex?: number,
  listRef?: React.Ref<HTMLUListElement>,
  children?: React.ReactNode,
}) {

  const handleClose = (event: MouseEvent | TouchEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    props.onClose();
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      handleClose(event);
      if (event.key === 'Escape' && props.anchorEl) {
        props.anchorEl.focus();
      }
    }
  };

  return (
    <Popover as="div" className={`relative ${props.zIndex ? `z-${props.zIndex}` : ''}`}>
      {({ open }: { open: boolean}) => (
        <>
          <Transition
            show={open && props.anchorEl !== null}
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel
              static
              className={`absolute ${props.placement} ${props.noTopPadding ? 'pt-0' : ''} ${props.noBottomPadding ? 'pb-0' : ''}`}
              onKeyDown={handleListKeyDown}
            >
              <ul
                ref={props.listRef as React.Ref<HTMLUListElement>}
                className={`bg-white shadow-md overflow-hidden ${props.dense ? 'p-2' : 'p-4'} ${props.maxHeightGapPx ? `max-h-[calc(100vh-${props.maxHeightGapPx}px)] overflow-y-auto` : ''}`}
              >
                {props.children}
              </ul>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}