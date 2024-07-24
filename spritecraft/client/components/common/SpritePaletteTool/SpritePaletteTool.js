import { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "@/store/AppContext";
import { Menu } from "@/components/ui/Menu";
import { BaseButton } from "@/components/ui/BaseButton";
import { CloseIcon } from "@/components/icon/CloseIcon";
import { SpriteSheetIcon } from "@/components/icon/SpriteSheetIcon";
import { SpritePaletteToolSelect } from "@/components/common/SpritePaletteTool/SpritePaletteToolSelect";
import { SpritePaletteToolMain } from "@/components/common/SpritePaletteTool/SpritePaletteToolMain";

function SpritePaletteTool({ origin, onClose }) {
  const menuRef = useRef();
  const { state } = useContext(AppContext);
  const [selectedFilename, setSelectedFilename] = useState(null);
  const spriteSheet = state.spriteSheets[selectedFilename];

  useEffect(() => {
    menuRef.current.checkPos();
  }, [selectedFilename])

  return (
    <Menu ref={menuRef} origin={origin}>
      <Menu.Header>
        <div className="flex items-center self-center text-xs whitespace-nowrap text-white mr-auto">
          <SpriteSheetIcon size="4" />
          <div className="ml-0.5">
            {selectedFilename ? (
              <div>
                <span onClick={() => setSelectedFilename(null)}>Sprite Palette</span> |{" "}
                <span>{selectedFilename}</span>
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
        <SpritePaletteToolMain spriteSheet={spriteSheet} />
      ) : (
        <SpritePaletteToolSelect
          spriteSheets={state.spriteSheets}
          onClick={setSelectedFilename}
        />
      )}
    </Menu>
  );
}

export { SpritePaletteTool };
