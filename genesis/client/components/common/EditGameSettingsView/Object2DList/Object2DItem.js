import { OperableItem } from '@/components/common/OperableItem';
import { Text } from '@/components/ui/Text';
import { Object2DReview } from '@/components/common/Object2DReview';
import { Object2DDetail } from '@/components/common/EditGameSettingsView/Object2DList/Object2DDetail';
import { Object2DUtil } from '@/utils/Object2DUtil';
import { useAnchor } from '@/hooks/useAnchor';

function Object2DItem({ object2d }) {
  const { open, toggle } = useAnchor();

  return (
    <OperableItem
      className="w-full"
      label={
        <div className="w-full" data-toggle="true" onClick={toggle}>
          <div className="p-1 flex items-start">
            <Object2DReview draggable object2d={object2d} tiles={Object2DUtil.tiles(object2d)} />
            <div className="p-2">
              <Text>Name: {object2d.name}</Text>
            </div>
          </div>
          {open && (
            <Object2DDetail object2d={object2d} onClose={toggle} />
          )}
        </div>
      }
    />
  );
}

export { Object2DItem };
