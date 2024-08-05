import { SpriteSheetPattern } from '@/components/common/EditSettingsArea/SpriteSheetPatternList/SpriteSheetPattern';
import { useSpriteSheetPatterns, useSpriteSheet } from '@/context/SpriteSheetContext';

function SpriteSheetPatternList({ source }) {
  const spriteSheet = useSpriteSheet(source);
  const patterns = useSpriteSheetPatterns(source);

  return (
    <div className="flex-1 grow basis-0 overflow-y-scroll no-scrollbar">
      {Object.values(patterns).map((pattern) => (
        <SpriteSheetPattern
          key={`${source}-${pattern.name}`}
          spriteSheet={spriteSheet}
          pattern={pattern}
        />
      ))}
    </div>
  );
}

export { SpriteSheetPatternList };
