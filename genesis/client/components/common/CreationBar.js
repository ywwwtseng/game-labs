import { useSelector } from "react-redux";
import { SelectIcon } from "@/components/icon/SelectIcon";
import { SpriteSheetIcon } from "@/components/icon/SpriteSheetIcon";
import { SpritePaletteTool } from "@/components/common/SpritePaletteTool/SpritePaletteTool";
import { useAnchor } from "@/hooks/useAnchor";
import { useSpriteSheets } from '@/context/SpriteSheetContext';

function CreationBar() {
  const spriteSheets = useSpriteSheets();
  const { open, bounds, close, toggle } = useAnchor();

  return (
    <div
      id="creation-bar"
      className="absolute my-auto top-0 bottom-0 left-2 flex flex-col items-center justify-center"
    >
      <div className="relative z-20 rounded bg-black/30 p-2 cursor-pointer my-0.5">
        <SelectIcon size="4" />
      </div>

      <div
        data-toggle="true"
        onClick={toggle}
        className="relative z-20 rounded bg-black/30 p-2 cursor-pointer my-0.5"
      >
        <SpriteSheetIcon size="4" />
      </div>

      {Object.keys(spriteSheets)[0] && open && (
        <SpritePaletteTool
          origin={{
            x: bounds.right + 4,
            y: bounds.top,
          }}
          onClose={close}
        />
      )}
    </div>
  );
}

export { CreationBar };
