import { useContext, useState } from "react";
import { AppContext } from "@/store/AppContext";
import { SelectIcon } from "@/components/icon/SelectIcon";
import { SpriteSheetIcon } from "@/components/icon/SpriteSheetIcon";
import { SpriteSheetMenu } from "@/components/common/SpriteSheetMenu";
import { useAnchor } from "@/hooks/useAnchor";

function CreationBar() {
  const { state } = useContext(AppContext);
  const { open, origin, close, toggle } = useAnchor();

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
        className="relative z-20 rounded bg-black/30 p-2 cursor-pointer my-0.5">
        <SpriteSheetIcon size="4" />
      </div>

      {Object.keys(state.spriteSheets)[0] && open && (
        <SpriteSheetMenu origin={origin} onClose={close} />
      )}
    </div>
  );
}

export { CreationBar };
