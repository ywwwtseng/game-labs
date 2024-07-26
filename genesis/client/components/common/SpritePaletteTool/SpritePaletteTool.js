import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "@/components/ui/Menu";
import { BaseButton } from "@/components/ui/BaseButton";
import { CloseIcon } from "@/components/icon/CloseIcon";
import { SpriteSheetIcon } from "@/components/icon/SpriteSheetIcon";
import { SpritePaletteToolSelect } from "@/components/common/SpritePaletteTool/SpritePaletteToolSelect";
import { SpritePaletteToolMain } from "@/components/common/SpritePaletteTool/SpritePaletteToolMain";
import { setMode } from "@/features/appState/appStateSlice";
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { MODE } from "@/constants";

function SpritePaletteTool({ origin, onClose }) {
  const menuRef = useRef();
  const spriteSheets = useSpriteSheets();
  const dispatch = useDispatch();
  const [selectedFilename, setSelectedFilename] = useState(null);
  const spriteSheet = spriteSheets[selectedFilename];

  useEffect(() => {
    menuRef.current.checkPos();
  }, [selectedFilename]);

  return (
    <Menu ref={menuRef} origin={origin}>
      <Menu.Header>
        <div className="flex items-center self-center text-xs whitespace-nowrap text-white mr-auto">
          <SpriteSheetIcon size={4} />
          <div className="ml-0.5">
            {selectedFilename ? (
              <div>
                <span onClick={() => setSelectedFilename(null)}>
                  Sprite Palette
                </span>{" "}
                | <span>{selectedFilename}</span>
              </div>
            ) : (
              "Sprite Palette"
            )}
          </div>
        </div>
        <BaseButton onClick={onClose}>
          <CloseIcon />
        </BaseButton>
      </Menu.Header>
      {selectedFilename ? (
        <SpritePaletteToolMain
          spriteSheet={spriteSheet}
          onSelected={(selected) => {
            onClose();
            dispatch(setMode({ mode: MODE.DRAW, payload: selected }));
          }}
        />
      ) : (
        <SpritePaletteToolSelect
          spriteSheets={spriteSheets}
          onClick={setSelectedFilename}
        />
      )}
    </Menu>
  );
}

export { SpritePaletteTool };
