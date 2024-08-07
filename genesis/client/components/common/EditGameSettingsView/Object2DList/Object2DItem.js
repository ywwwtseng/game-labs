import { OperableItem } from '@/components/common/OperableItem';
import { Text } from '@/components/ui/Text';
import { Object2DReview } from '@/components/common/Object2DReview';
import { BaseButton } from '@/components/ui/BaseButton';
import { AreaHeader } from '@/components/common/AreaHeader';
import { useAnchor } from '@/hooks/useAnchor';
import { DomUtil } from '@/utils/DomUtil';
import { PlusIcon } from '@/components/icon/PlusIcon';
import { CirclePlusIcon } from '@/components/icon/CirclePlusIcon';
import { CircleMinusIcon } from '@/components/icon/CircleMinusIcon';
import { Object2DUtil } from '@/utils/Object2DUtil';
import { useEnableObject2DAnim } from '@/mutations/useEnableObject2DAnim';
import { useDisableObject2DAnim } from '@/mutations/useDisableObject2DAnim';

function Object2DItem({ object2d }) {
  const { open, toggle } = useAnchor();
  const disableObject2DAnim = useDisableObject2DAnim();
  const enableObject2DAnim = useEnableObject2DAnim();
  const hasAnimation = Object2DUtil.hasAnimation(object2d);
  console.log(hasAnimation)

  return (
    <OperableItem
      className="w-full"
      label={
        <div className="w-full" data-toggle="true" onClick={toggle}>
          <div className="p-1 flex items-start">
            <Object2DReview draggable object2d={object2d} />
            <div className="p-2">
              <Text>Name: {object2d.name}</Text>
            </div>
          </div>
          {open && (
            <div onClick={DomUtil.stopPropagation}>
              <AreaHeader
                className="bg-[#282828]"
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
                <div className="flex p-1 gap-2 overflow-x-scroll no-scrollbar">
                  <div className="flex flex-col">
                    <Object2DReview
                      className="rounded"
                      object2d={object2d}
                    />
                    <Text className="mt-0.5">Frame #1</Text>
                  </div>
                  <div className="min-w-16 h-16 rounded border border-dashed border-white/80 flex items-center justify-center">
                    <PlusIcon size={5} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      }
    />
  );
}

export { Object2DItem };
