import { SpriteSheetIcon } from '@/components/icon/SpriteSheetIcon';
import { BoxIcon } from '@/components/icon/BoxIcon';
import { CreationToolBarToggle } from '@/components/common/CreationToolBar/CreationToolBarToggle';
import { SpriteTool } from '@/components/common/CreationToolBar/SpriteTool/SpriteTool';
import { Object2DTool } from '@/components/common/CreationToolBar/Object2DTool/Object2DTool';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { useQuery } from '@/hooks/useQuery';
import { sql } from '@/sql';

function CreationToolBar() {
  const spriteSheets = useSpriteSheets();
const { data: object2ds } = useQuery(sql.object2ds.list);

  return (
    <div
      id="creation-bar"
      className="absolute my-auto top-0 bottom-0 left-2 flex flex-col items-center justify-center"
    >
      <CreationToolBarToggle
        icon={SpriteSheetIcon}
        disabled={Object.keys(spriteSheets).length == 0}
        menu={SpriteTool}
      />
      <CreationToolBarToggle
        icon={BoxIcon}
        disabled={object2ds?.length == 0}
        menu={Object2DTool}
      />
    </div>
  );
}

export { CreationToolBar };
