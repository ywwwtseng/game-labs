import { useSpriteSheet } from '@/context/SpriteSheetContext';
import { SpriteSheetTile } from '@/components/common/EditGameSettingsView/SpriteSheetTileList/SpriteSheetTile';
import { AreaHeader } from '@/components/common/AreaHeader';
import { Text } from '@/components/ui/Text';
import { CogIcon } from '@/components/icon/CogIcon';
import { VirtualList } from '@/components/common/VirtualList';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { ArrayUtil } from '@/utils/ArrayUtil';
import { useBoundary } from '@/hooks/useBoundary';

function SpriteSheetTileList({ source }) {
  const { ref, bounds } = useBoundary();
  const spriteSheet = useSpriteSheet(source);
  const total = spriteSheet.sizeCount[0] * spriteSheet.sizeCount[1];

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
      <div ref={ref} className="flex-1 grow basis-0 overflow-y-scroll no-scrollbar">
        {bounds && (
          <VirtualList
            width={bounds.width}
            height={bounds.height}
            itemHeight={20}
            total={total}
            renderItem={(index) => {
              const x = index % 16;
              const y = Math.floor(index / 16);
              return (
                <SpriteSheetTile
                  key={`${spriteSheet}-[${x},${y}]`}
                  spriteSheet={spriteSheet}
                  index={[x, y]}
                />
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

export { SpriteSheetTileList };
