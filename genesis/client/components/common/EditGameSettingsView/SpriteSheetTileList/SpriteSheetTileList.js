import { useSpriteSheet } from '@/context/SpriteSheetContext';
import { SpriteSheetTile } from '@/components/common/EditGameSettingsView/SpriteSheetTileList/SpriteSheetTile';
import { AreaHeader } from '@/components/common/AreaHeader';
import { Text } from '@/components/ui/Text';
import { CogIcon } from '@/components/icon/CogIcon';
import { MatrixUtil } from '@/utils/MatrixUtil';

function SpriteSheetTileList({ source }) {
  const spriteSheet = useSpriteSheet(source);

  return (
    <div className="flex-1 flex flex-col">
      <AreaHeader
        icon={
          <CogIcon />
        }
        label="SpriteSheet Settings"
      />
      <div className="p-1">
        <img
          draggable="false"
          className="object-scale-down w-full h-40"
          src={spriteSheet.image.src}
          alt="spritesheet-preview"
        />
      </div>
      <div className="flex items-center p-1">
        <Text>Tiles</Text>
      </div>
      <div className="flex-1 grow basis-0 overflow-y-scroll no-scrollbar">
        {MatrixUtil.map(spriteSheet.sizeIndex, (x, y) => (
          <SpriteSheetTile
            key={`${spriteSheet}-[${x},${y}]`}
            spriteSheet={spriteSheet}
            index={[x, y]}
          />
        ))}
      </div>
    </div>
  );
}

export { SpriteSheetTileList };
