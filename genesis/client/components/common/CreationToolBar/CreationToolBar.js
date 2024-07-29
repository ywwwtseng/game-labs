import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectIcon } from "@/components/icon/SelectIcon";
import { SpriteSheetIcon } from "@/components/icon/SpriteSheetIcon";
import { SpriteTool } from "@/components/common/SpriteTool/SpriteTool";
import { CreationToolBarButton } from "@/components/common/CreationToolBar/CreationToolBarButton";
import { CreationToolBarToggle } from "@/components/common/CreationToolBar/CreationToolBarToggle";
import { setMode } from "@/features/appState/appStateSlice";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { MODE } from "@/constants";

function CreationToolBar() {
  const menuRef = useRef(null);
  const mode = useSelector((state) => state.appState.mode);
  const dispatch = useDispatch();
  const spriteSheets = useSpriteSheets();


  return (
    <div
      id="creation-bar"
      className="absolute my-auto top-0 bottom-0 left-2 flex flex-col items-center justify-center"
    >
      <CreationToolBarButton
        icon={SelectIcon}
        onClick={() => {
          menuRef.current.close();
          dispatch(setMode({
            mode: mode === MODE.SELECT ? MODE.EDIT : MODE.SELECT
          }));
        }}
      />
      <CreationToolBarToggle
        ref={menuRef}
        icon={SpriteSheetIcon}
        disabled={Object.keys(spriteSheets).length == 0}
        menu={SpriteTool}
      />
    </div>
  );
}

export { CreationToolBar };
