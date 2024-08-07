import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectIcon } from '@/components/icon/SelectIcon';
import { SpriteSheetIcon } from '@/components/icon/SpriteSheetIcon';
import { BoxIcon } from '@/components/icon/BoxIcon';
import { CreationToolBarButton } from '@/components/common/CreationToolBar/CreationToolBarButton';
import { CreationToolBarToggle } from '@/components/common/CreationToolBar/CreationToolBarToggle';
import { SpriteTool } from '@/components/common/CreationToolBar/SpriteTool/SpriteTool';
import { Object2DTool } from '@/components/common/CreationToolBar/Object2DTool/Object2DTool';
import { setMode } from '@/features/appState/appStateSlice';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { MODE } from '@/constants';
import { useObject2Ds } from '@/queries/useObject2Ds';

function CreationToolBar() {
  const mode = useSelector((state) => state.appState.mode);
  const dispatch = useDispatch();
  const spriteSheets = useSpriteSheets();
  const object2ds = useObject2Ds();

  return (
    <div
      id="creation-bar"
      className="absolute my-auto top-0 bottom-0 left-2 flex flex-col items-center justify-center"
    >
      <CreationToolBarButton
        icon={SelectIcon}
        onClick={(event) => {
          dispatch(
            setMode({
              mode: mode === MODE.SELECT ? MODE.EDIT : MODE.SELECT,
            }),
          );
        }}
      />
      <CreationToolBarToggle
        icon={SpriteSheetIcon}
        disabled={Object.keys(spriteSheets).length == 0}
        menu={SpriteTool}
      />
      <CreationToolBarToggle
        icon={BoxIcon}
        disabled={object2ds.length == 0}
        menu={Object2DTool}
      />
    </div>
  );
}

export { CreationToolBar };
