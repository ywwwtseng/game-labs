import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from '@/components/ui/Menu';
import { BaseButton } from '@/components/ui/BaseButton';
import { CloseIcon } from '@/components/icon/CloseIcon';
import { SpriteSheetIcon } from '@/components/icon/SpriteSheetIcon';
import { SpriteToolGallery } from '@/components/common/SpriteTool/SpriteToolGallery';
import { SpriteToolPalette } from '@/components/common/SpriteTool/SpriteToolPalette';
import { setMode } from '@/features/appState/appStateSlice';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { MODE } from '@/constants';

function SpriteTool({ origin, onClose }) {
  const menuRef = useRef();
  const spriteSheets = useSpriteSheets();
  const dispatch = useDispatch();
  const drawMode = useSelector((state) => state.drawMode);
  const [selectedSource, setSelectedSource] = useState(drawMode.source);
  const spriteSheet = spriteSheets[selectedSource];

  useEffect(() => {
    menuRef.current.checkPos();
  }, [selectedSource]);

  return (
    <Menu ref={menuRef} origin={origin}>
      <Menu.Header>
        <div className="flex items-center self-center text-xs whitespace-nowrap text-white mr-auto">
          <SpriteSheetIcon size={4} />
          <div className="ml-0.5">
            {selectedSource ? (
              <div>
                <span onClick={() => setSelectedSource(null)}>
                  Sprite Palette
                </span>{' '}
                | <span>{spriteSheet.name}</span>
              </div>
            ) : (
              'Sprite Palette'
            )}
          </div>
        </div>
        <BaseButton onClick={onClose}>
          <CloseIcon />
        </BaseButton>
      </Menu.Header>
      {selectedSource ? (
        <SpriteToolPalette
          spriteSheet={spriteSheet}
          defaultSelected={drawMode.rect}
          onSelected={(selected) => {
            if (selected) {
              dispatch(setMode({ mode: MODE.DRAW, payload: selected }));
            } else {
              dispatch(setMode({ mode: MODE.SELECT }));
            }
          }}
        />
      ) : (
        <SpriteToolGallery
          spriteSheets={spriteSheets}
          onClick={setSelectedSource}
        />
      )}
    </Menu>
  );
}

export { SpriteTool };
