import { BaseButton } from '@/components/ui/BaseButton';
import { AreaHeader } from '@/components/common/AreaHeader';
import { CirclePlusIcon } from '@/components/icon/CirclePlusIcon';
import { CircleMinusIcon } from '@/components/icon/CircleMinusIcon';
import { Object2DAnimAttributeDetail } from '@/components/common/EditGameSettingsView/Object2DList/Object2DAnimAttribute/Object2DAnimAttributeDetail';
import { Object2DUtil } from '@/utils/Object2DUtil';
import { useMutation } from '@/features/query/QueryClientContext';
import { sql } from '@/sql';

function Object2DAnimAttribute({ object2d }) {
  const disableObject2DAnim = useMutation(sql.object2ds.anim.disable);
  const enableObject2DAnim = useMutation(sql.object2ds.anim.enable);
  const hasAnimation = Object2DUtil.hasAnimation(object2d);

  return (
    <>
      <AreaHeader
        className="bg-[#1D1D1D]"
        label="Animation"
        actions={[
          <BaseButton key="create-animation" onClick={() => {
            if (hasAnimation) {
              disableObject2DAnim.mutate({
                params: {
                  id: object2d.id
                }
              });
            } else {
              enableObject2DAnim.mutate({
                params: {
                  id: object2d.id,
                },
                data: {
                  anim: {
                    rate: 2,
                    frames: [object2d.tiles],
                  },
                }
              });
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
