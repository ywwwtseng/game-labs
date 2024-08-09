import { OperableItem } from '@/components/common/OperableItem';
import { Text } from '@/components/ui/Text';
import { Object2DReview } from '@/components/common/Object2DReview';
import { BaseButton } from '@/components/ui/BaseButton';
import { AreaHeader } from '@/components/common/AreaHeader';
import { DomUtil } from '@/utils/DomUtil';
import { PlusIcon } from '@/components/icon/PlusIcon';
import { CirclePlusIcon } from '@/components/icon/CirclePlusIcon';
import { CircleMinusIcon } from '@/components/icon/CircleMinusIcon';
import { CloseIcon } from '@/components/icon/CloseIcon';
import { Object2DAnimAttribute } from '@/components/common/EditGameSettingsView/Object2DList/Object2DAnimAttribute/Object2DAnimAttribute';
import { Object2DUtil } from '@/utils/Object2DUtil';
import { useEnableObject2DAnim } from '@/mutations/useEnableObject2DAnim';
import { useDisableObject2DAnim } from '@/mutations/useDisableObject2DAnim';
import { MatrixUtil } from '@/utils/MatrixUtil';


function Object2DDetail({ object2d, onClose }) {
  const disableObject2DAnim = useDisableObject2DAnim();
  const enableObject2DAnim = useEnableObject2DAnim();
  const hasAnimation = Object2DUtil.hasAnimation(object2d);

  return (
    <div className="absolute flex flex-col top-0 left-0 w-full h-full bg-[#282828] rounded" onClick={DomUtil.stopPropagation}>
      <AreaHeader
        className="bg-[#282828]"
        label={object2d.name}
        actions={[
          <BaseButton key="create-animation" onClick={onClose}>
            <CloseIcon />
          </BaseButton>
        ]}
      />
      <div className="p-1">
        <Object2DReview
          className="rounded"
          object2d={object2d}
          tiles={Object2DUtil.tiles(object2d)}
        />
      </div>
      
      <Object2DAnimAttribute object2d={object2d} />
    </div>
  );
}

export { Object2DDetail };
