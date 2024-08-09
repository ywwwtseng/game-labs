import { BaseButton } from '@/components/ui/BaseButton';
import { AreaHeader } from '@/components/common/AreaHeader';
import { CirclePlusIcon } from '@/components/icon/CirclePlusIcon';
import { CircleMinusIcon } from '@/components/icon/CircleMinusIcon';
import { Object2DAnimAttributeDetail } from '@/components/common/EditGameSettingsView/Object2DList/Object2DAnimAttribute/Object2DAnimAttributeDetail';
import { Object2DUtil } from '@/utils/Object2DUtil';
import { useEnableObject2DAnim } from '@/mutations/useEnableObject2DAnim';
import { useDisableObject2DAnim } from '@/mutations/useDisableObject2DAnim';

function Object2DAnimAttribute({ object2d }) {
  const disableObject2DAnim = useDisableObject2DAnim();
  const enableObject2DAnim = useEnableObject2DAnim();
  const hasAnimation = Object2DUtil.hasAnimation(object2d);

  return (
    <>
      <AreaHeader
        className="bg-[#1D1D1D]"
        label="Animation"
        actions={[
          <BaseButton key="create-animation" onClick={() => {
            if (hasAnimation) {
              disableObject2DAnim.mutate(object2d.id);
            } else {
              enableObject2DAnim.mutate(object2d.id);
            }
          }}>
            {hasAnimation ? <CircleMinusIcon /> : <CirclePlusIcon />}
          </BaseButton>
        ]}
      />
      {hasAnimation && (
        <Object2DAnimAttributeDetail object2d={object2d} />
        
      )}
    </>
  );
}

export { Object2DAnimAttribute };
