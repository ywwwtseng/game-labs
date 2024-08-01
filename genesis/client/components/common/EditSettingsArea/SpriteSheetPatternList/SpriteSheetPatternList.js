import { SpriteSheetPattern } from "@/components/common/EditSettingsArea/SpriteSheetPatternList/SpriteSheetPattern";
import { MatrixUtil } from "@/utils/MatrixUtil";

function SpriteSheetPatternList({ spriteSheet }) {
  return (
    <div className="flex-1 grow basis-0 overflow-y-scroll no-scrollbar">
      {spriteSheet.patterns.map((pattern) => (
        <SpriteSheetPattern
          key={`${spriteSheet.source}-${pattern.name}`}
          spriteSheet={spriteSheet}
          pattern={pattern}
        />
      ))}
    </div>
  );
}

export { SpriteSheetPatternList };
