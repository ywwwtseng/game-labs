import { useContext, useState } from "react";
import { AppContext } from "@/store/AppContext";
import { Canvas2D } from "@/components/common/Canvas2D";
import { Menu } from "@/components/ui/Menu";
import { BaseButton } from "@/components/ui/BaseButton";
import { CloseIcon } from "@/components/icon/CloseIcon";

function SpriteSheetMenu({ origin, onClose }) {
  const { state } = useContext(AppContext);
  const [selectedFilename, setSelectedFilename] = useState(Object.keys(state.spriteSheets)[0]);
  const spriteSheet = state.spriteSheets[selectedFilename];

  return (
    <Menu style={origin}>
      <div className="flex items-center px-2 py-1">
        <span className="self-center text-xs whitespace-nowrap text-white mr-auto">
          {spriteSheet.filename}
        </span>
        <BaseButton onClick={onClose}><CloseIcon /></BaseButton>
      </div>
      <div className="px-2 pt-0.5 pb-2">
        <Canvas2D
          id={`spriteSheet-${spriteSheet.filename}`}
          scale={1}
          width={spriteSheet.image.naturalWidth}
          height={spriteSheet.image.naturalHeight}
          tiles={spriteSheet.tiles}
        />
      </div>
      
    </Menu>
  );
}

export { SpriteSheetMenu };