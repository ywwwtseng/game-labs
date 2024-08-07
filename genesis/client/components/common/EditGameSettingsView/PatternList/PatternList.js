import useSWR from 'swr';
import { PatternItem } from '@/components/common/EditGameSettingsView/PatternList/PatternItem';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { usePatterns } from '@/hooks/usePatterns';

function PatternList({ type }) {
  const patterns = usePatterns();

  return (
    <div className="flex-1 grow basis-0 overflow-y-scroll no-scrollbar">
      {patterns?.map((pattern) => (
        <PatternItem
          key={pattern.id}
          pattern={pattern}
        />
      ))}
    </div>
  );
}

export { PatternList };
