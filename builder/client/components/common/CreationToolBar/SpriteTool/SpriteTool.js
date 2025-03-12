import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from '@/components/ui/Menu';
import { BaseButton } from '@/components/ui/BaseButton';
import { Text } from '@/components/ui/Text';
import { CloseIcon } from '@/components/icon/CloseIcon';
import { SpriteSheetIcon } from '@/components/icon/SpriteSheetIcon';
import { SpriteToolGallery } from '@/components/common/CreationToolBar/SpriteTool/SpriteToolGallery';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { AngleRightIcon } from '@/components/icon/AngleRightIcon';

function SpriteTool({ origin, onClose }) {
  const menuRef = useRef();
  const spriteSheets = useSpriteSheets();
  const dispatch = useDispatch();
  const [selectedSource, setSelectedSource] = useState(null);
  const spriteSheet = spriteSheets[selectedSource];

  useEffect(() => {
    menuRef.current.checkPos();
  }, [selectedSource]);

  return (
    <Menu ref={menuRef} origin={origin}>
      <Menu.Header>
        <div className="flex items-center self-center text-xs whitespace-nowrap text-white mr-auto">
          <SpriteSheetIcon />
          <div className="ml-0.5">
            Sprite Palette
          </div>
        </div>
        <BaseButton onClick={onClose}>
          <CloseIcon />
        </BaseButton>
      </Menu.Header>
      <SpriteToolGallery
        selectedSource={selectedSource}
        spriteSheets={spriteSheets}
        onClick={setSelectedSource}
      />
    </Menu>
  );
}

export { SpriteTool };
