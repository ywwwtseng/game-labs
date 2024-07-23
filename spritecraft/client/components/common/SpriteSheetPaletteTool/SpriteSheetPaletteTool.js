import { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "@/store/AppContext";
import { Menu } from "@/components/ui/Menu";
import { BaseButton } from "@/components/ui/BaseButton";
import { CloseIcon } from "@/components/icon/CloseIcon";
import { SpriteSheetIcon } from "@/components/icon/SpriteSheetIcon";
import { SpriteSheetPaletteToolSelect } from "@/components/common/SpriteSheetPaletteTool/SpriteSheetPaletteToolSelect";
import { SpriteSheetPaletteToolMain } from "@/components/common/SpriteSheetPaletteTool/SpriteSheetPaletteToolMain";

function SpriteSheetPaletteTool({ origin, onClose }) {
  const menuRef = useRef();
  const { state } = useContext(AppContext);
  // const [selectedFilename, setSelectedFilename] = useState(Object.keys(state.spriteSheets)[0]);
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
                <span onClick={() => setSelectedFilename(null)}>Palette</span> |{" "}
                <span>{selectedFilename}</span>
              </div>
            ) : (
              "Palette"
            )}
          </div>
        </div>
        <BaseButton onClick={onClose}>
          <CloseIcon />
        </BaseButton>
      </Menu.Header>
      {selectedFilename ? (
        <SpriteSheetPaletteToolMain spriteSheet={spriteSheet} />
      ) : (
        <SpriteSheetPaletteToolSelect
          spriteSheets={state.spriteSheets}
          onClick={setSelectedFilename}
        />
      )}
    </Menu>
  );
}

export { SpriteSheetPaletteTool };
