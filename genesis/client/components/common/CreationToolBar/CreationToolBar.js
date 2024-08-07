import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectIcon } from '@/components/icon/SelectIcon';
import { SpriteSheetIcon } from '@/components/icon/SpriteSheetIcon';
import { BoxIcon } from '@/components/icon/BoxIcon';
import { CreationToolBarButton } from '@/components/common/CreationToolBar/CreationToolBarButton';
import { CreationToolBarToggle } from '@/components/common/CreationToolBar/CreationToolBarToggle';
import { SpriteTool } from '@/components/common/CreationToolBar/SpriteTool/SpriteTool';
import { PatternTool } from '@/components/common/CreationToolBar/PatternTool/PatternTool';
import { setMode } from '@/features/appState/appStateSlice';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { MODE } from '@/constants';
import { usePatterns } from '@/hooks/usePatterns';

function CreationToolBar() {
  const mode = useSelector((state) => state.appState.mode);
  const dispatch = useDispatch();
  const spriteSheets = useSpriteSheets();
  const patterns = usePatterns();

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
        disabled={patterns.length == 0}
        menu={PatternTool}
      />
    </div>
  );
}

export { CreationToolBar };
