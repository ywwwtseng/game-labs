import { useContext, useState } from "react";
import { AppContext } from "@/store/AppContext";
import { Canvas2D } from "@/components/common/Canvas2D";
import { Menu } from "@/components/ui/Menu";
import { BaseButton } from "@/components/ui/BaseButton";
import { CloseIcon } from "@/components/icon/CloseIcon";
import { useCanvasSelector } from '@/hooks/useCanvasSelector';

function SpriteSheetMenu({ origin, onClose }) {
  const { state } = useContext(AppContext);
  const [selectedFilename, setSelectedFilename] = useState(Object.keys(state.spriteSheets)[0]);
  const spriteSheet = state.spriteSheets[selectedFilename];

  const { selected, register, connect } = useCanvasSelector({
    draggable: true,
    canvasId: `spriteSheet-${spriteSheet.filename}`,
  });

  return (
    <Menu style={origin}>
      <div className="flex items-center px-2 py-1">
        <span className="self-center text-xs whitespace-nowrap text-white mr-auto">
          {spriteSheet.filename}
        </span>
        <BaseButton onClick={onClose}><CloseIcon /></BaseButton>
      </div>
      <div className="px-2 pt-0.5 pb-2" {...register}>
        <Canvas2D
          crop
          id={`spriteSheet-${spriteSheet.filename}`}
          scale={1}
          selected={selected.index}
          width={spriteSheet.image.naturalWidth}
          height={spriteSheet.image.naturalHeight}
          tiles={spriteSheet.tiles}
          {...connect}
        />
      </div>
      
    </Menu>
  );
}

export { SpriteSheetMenu };