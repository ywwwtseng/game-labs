import { Menu } from '@/components/ui/Menu';
import { BaseButton } from '@/components/ui/BaseButton';
import { CloseIcon } from '@/components/icon/CloseIcon';
import { BoxIcon } from '@/components/icon/BoxIcon';
import { Object2DReview } from '@/components/common/Object2DReview';
import { useObject2Ds } from '@/queries/useObject2Ds';
import { Object2DUtil } from '@/utils/Object2DUtil';

function Object2DTool({ origin, onClose }) {
  const object2ds = useObject2Ds();

  return (
    <Menu origin={origin} id="object2d-tool">
      <Menu.Header>
        <div className="flex items-center self-center text-xs whitespace-nowrap text-white mr-auto">
          <BoxIcon />
          <div className="ml-0.5">
            Object2D Palette
          </div>
        </div>
        <BaseButton onClick={onClose}>
          <CloseIcon />
        </BaseButton>
      </Menu.Header>
      <div
        className="p-2 max-h-[224px] h-[224px] min-w-[224px] overflow-y-scroll no-scrollbar"
      >
        <div
          className="grid grid-cols-3 grid-rows-3 gap-2"
        >
          {object2ds?.map((object2d) => (
            <Object2DReview 
              key={object2d.id}
              object2d={object2d}
              tiles={Object2DUtil.tiles(object2d)}
              draggable={{ dragArea: 'object2d-tool' }}
            />
          ))}
        </div>
      </div>
    </Menu>
  );
}

export { Object2DTool };
