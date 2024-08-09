import { createPortal } from 'react-dom';
import { OperableItem } from '@/components/common/OperableItem';
import { Text } from '@/components/ui/Text';
import { Object2DReview } from '@/components/common/Object2DReview';
import { Object2DDetail } from '@/components/common/EditGameSettingsView/Object2DList/Object2DDetail';
import { Chip } from '@/components/ui/Chip';
import { useAnchor } from '@/hooks/useAnchor';
import { Object2DUtil } from '@/utils/Object2DUtil';
import { palette } from '@/constants';
import { useMemo } from 'react';

function Object2DItem({ object2d }) {
  const { open, toggle } = useAnchor({ identity: 'data-toggle' });

  const chips = useMemo(() => {
    const array = [];

    array.push({
      bg: `bg-${palette[0]}`,
      children: 'Object2D',
    });

    if (Object2DUtil.hasAnimation(object2d)) {
      console.log( `bg-${palette[1]}`)
      array.push({
        bg: `bg-${palette[1]}`,
        children: 'Animation',
      });
    }

    return array;
  }, [object2d]);

  return (
    <OperableItem
      className="w-full"
      label={
        <div className="w-full" data-toggle="true" onClick={toggle}>
          <div className="p-1 flex items-start">
            <Object2DReview draggable object2d={object2d} tiles={Object2DUtil.tiles(object2d)} />
            <div className="pt-2 pl-2 flex-1">
              <Text>{object2d.name}</Text>
              <div className="w-full grid grid-cols-2 grid-rows-2 gap-x-6 scale-75 origin-left">
                {chips.map((chip) => (
                  <Chip key={chip.children} {...chip} />
                ))}
              </div>
            </div>
           
          </div>
          {open && createPortal(
            <Object2DDetail object2d={object2d} onClose={toggle} />,
            document.getElementById('settings-area')
          )}
        </div>
      }
    />
  );
}

export { Object2DItem };
