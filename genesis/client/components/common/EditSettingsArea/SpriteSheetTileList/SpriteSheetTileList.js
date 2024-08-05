import { SpriteSheetTile } from '@/components/common/EditSettingsArea/SpriteSheetTileList/SpriteSheetTile';
import { useSpriteSheet } from '@/context/SpriteSheetContext';
import { MatrixUtil } from '@/utils/MatrixUtil';

function SpriteSheetTileList({ source }) {
  const spriteSheet = useSpriteSheet(source);
  return (
    <div className="flex-1 grow basis-0 overflow-y-scroll no-scrollbar">
      {MatrixUtil.map(spriteSheet.sizeIndex, (x, y) => (
        <SpriteSheetTile
          key={`${spriteSheet}-[${x},${y}]`}
          spriteSheet={spriteSheet}
          index={[x, y]}
        />
      ))}
    </div>
  );
}

export { SpriteSheetTileList };
