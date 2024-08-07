import { OperableItem } from '@/components/common/OperableItem';
import { Text } from '@/components/ui/Text';
import { Pattern } from '@/components/common/Pattern';

function PatternItem({ pattern }) {
  return (
    <OperableItem
      label={
        <div className="flex items-start justify-center">
          <Pattern pattern={pattern} />
          <div className="p-2">
            <Text>Name: {pattern.name}</Text>
          </div>
        </div>
      }
    />
  );
}

export { PatternItem };
