import useSWR from 'swr';
import { Pattern } from '@/components/common/EditGameSettingsView/PatternList/Pattern';
import { useSpriteSheetPatterns, useSpriteSheets } from '@/context/SpriteSheetContext';

function PatternList({ source }) {
  const { data } = useSWR('/api/patterns');
  const spriteSheets = useSpriteSheets();

  return (
    <div className="flex-1 grow basis-0 overflow-y-scroll no-scrollbar">
      {data?.list?.map((pattern) => (
        <Pattern
          key={`${source}-${pattern.name}`}
          spriteSheets={spriteSheets}
          pattern={pattern}
        />
      ))}
    </div>
  );
}

export { PatternList };
