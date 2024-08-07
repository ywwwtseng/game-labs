import { useState } from 'react';
import { OperableItem } from '@/components/common/OperableItem';
import { Text } from '@/components/ui/Text';
import { Object2DReview } from '@/components/common/Object2DReview';
import { BaseButton } from '@/components/ui/BaseButton';
import { AreaHeader } from '@/components/common/AreaHeader';
import { useAnchor } from '@/hooks/useAnchor';
import { useMutation } from '@/hooks/useMutation';
import { DomUtil } from '@/utils/DomUtil';
import { PlusIcon } from '@/components/icon/PlusIcon';
import { CirclePlusIcon } from '@/components/icon/CirclePlusIcon';
import { CircleMinusIcon } from '@/components/icon/CircleMinusIcon';
import { Object2D } from '@/utils/Object2D';

function Object2DItem({ object2d }) {
  const { open, toggle } = useAnchor();
  const { trigger: enableAnim } = useMutation(`/api/object2ds/${object2d.id}/anim/enable`, ['/api/object2ds']);
  const { trigger: disableAnim } = useMutation(`/api/object2ds/${object2d.id}/anim/disable`, ['/api/object2ds']);
  const hasAnimation = Object2D.hasAnimation(object2d);

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
                      disableAnim();
                    } else {
                      enableAnim();
                    }
                  }}>
                    {hasAnimation ? <CircleMinusIcon /> : <CirclePlusIcon />}
                  </BaseButton>
                ]}
              />
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
            </div>
          )}
        </div>
      }
    />
  );
}

export { Object2DItem };
