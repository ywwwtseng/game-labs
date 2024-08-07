import { Object2DItem } from '@/components/common/EditGameSettingsView/Object2DList/Object2DItem';
import { useObject2Ds } from '@/queries/useObject2Ds';

function Object2DList({ type }) {
  const object2ds = useObject2Ds();

  return (
    <div className="relative flex-1 grow basis-0 overflow-y-scroll no-scrollbar">
      {object2ds?.map((object2d) => (
        <Object2DItem
          key={object2d.id}
          object2d={object2d}
        />
      ))}
    </div>
  );
}

export { Object2DList };
