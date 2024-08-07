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
import { Object2DUtil } from '@/utils/Object2DUtil';
import { useEnableObject2DAnim } from '@/mutations/useEnableObject2DAnim';
import { useDisableObject2DAnim } from '@/mutations/useDisableObject2DAnim';
import { useCreateObject2DFrame } from '@/mutations/useCreateObject2DFrame';
import { setupDropzone } from '@/context/DragAndDropContext';
import { useMemo } from 'react';
import { MatrixUtil } from '@/utils/MatrixUtil';


function Object2DDetail({ object2d, onClose }) {
  const disableObject2DAnim = useDisableObject2DAnim();
  const enableObject2DAnim = useEnableObject2DAnim();
  const createObject2DFrame = useCreateObject2DFrame();
  const hasAnimation = Object2DUtil.hasAnimation(object2d);

  const events = useMemo(() => ({
    tiles: (_, data) => {
      const source = data.source;
      const rect = data.rect;

      const tiles = MatrixUtil.create(rect, (_, { x, y }) => [{
        index: [x, y],
        source,
      }]);

      createObject2DFrame.mutate({id: object2d.id, tiles});
    },
  }), []);

  const setup = setupDropzone({ id: `create-object2d-anim-frame-${object2d.id}`, accept: Object.keys(events), events });

  console.log(object2d.frames, 'object2d')

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-[#282828] rounded" onClick={DomUtil.stopPropagation} {...setup}>
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
          
          {object2d.frames.map((frame, index) => (
            <div className="flex flex-col">
              <Object2DReview
                key={`${object2d.id}-frame-${index}`}
                className="rounded"
                object2d={object2d}
                tiles={frame}
              />
              <Text className="mt-0.5">{`Frame #${index}`}</Text>
            </div>
          ))}
          <div className="min-w-16 h-16 rounded border border-dashed border-white/80 flex items-center justify-center">
            <PlusIcon size={5} />
          </div>
        </div>
      )}
    </div>
  );
}

export { Object2DDetail };
