import { createPortal } from 'react-dom';
import { Text } from '@/components/ui/Text';
import { CreateObject2DModal } from '@/components/common/CreateObject2DModal';
import { useModal } from '@/context/ModalContext';
import { MatrixUtil } from '@/utils/MatrixUtil';

function SpriteToolPaletteRightMenu({ spriteSheet, selectedRect, ...props }) {
  const { open: openCreateObject2DModal } = useModal(CreateObject2DModal);

  return createPortal(
    <div
      className='absolute z-40 origin-top-right px-1 py-0.5 rounded bg-zinc-800 shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none flex flex-col items-cente cursor-pointer'
      {...props}>
      <Text onClick={() => {
        const tiles = MatrixUtil.create(selectedRect, (_, { x, y }) => {
          return [{
            index: [x, y],
            source: spriteSheet.source
          }];
        });

        openCreateObject2DModal({ tiles });
      }}>
        Create Object2D
      </Text>
    </div>,
    document.body
  );
}

export { SpriteToolPaletteRightMenu }; 