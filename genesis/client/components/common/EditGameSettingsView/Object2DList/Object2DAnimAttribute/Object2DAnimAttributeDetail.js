import { useMemo, useState } from 'react';
import { Text } from '@/components/ui/Text';
import { Object2DReview } from '@/components/common/Object2DReview';
import { BaseButton } from '@/components/ui/BaseButton';
import { AreaHeader } from '@/components/common/AreaHeader';
import { PlusIcon } from '@/components/icon/PlusIcon';
import { CircleMinusIcon } from '@/components/icon/CircleMinusIcon';
import { Object2DUtil } from '@/utils/Object2DUtil';
import { setupDropzone } from '@/context/DragAndDropContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useCreateObject2DAnimFrame } from '@/mutations/useCreateObject2DAnimFrame';
import { useDeleteObject2DAnimFrame } from '@/mutations/useDeleteObject2DAnimFrame';
import { useUpdateObject2DAnimRate } from '@/mutations/useUpdateObject2DAnimRate';

function Object2DAnimAttributeDetail({ object2d }) {
  const [animRate, setAnimRate] = useState(object2d.anim.rate || 5);
  const createObject2DAnimFrame = useCreateObject2DAnimFrame();
  const deleteObject2DAnimFrame = useDeleteObject2DAnimFrame();
  const updateObject2DAnimRate = useUpdateObject2DAnimRate();
  const hasAnimation = Object2DUtil.hasAnimation(object2d);
  const onDebounceChange = useDebounce((rate) => {
    updateObject2DAnimRate.mutate({id: object2d.id, rate});
  });

  const events = useMemo(() => ({
    tiles: (_, data) => {
      const source = data.source;
      const rect = data.rect;

      const tiles = MatrixUtil.create(rect, (_, { x, y }) => [{
        index: [x, y],
        source,
      }]);

      createObject2DAnimFrame.mutate({id: object2d.id, tiles});
    },
  }), []);

  const setup = setupDropzone({ id: `create-object2d-anim-frame-${object2d.id}`, accept: Object.keys(events), events });

  return (
    <div {...setup}>
      <AreaHeader label="Animation Rate" />
      <div className="px-1 py-2 flex items-center">
        <input 
          type="range" 
          className="w-full h-1 bg-[#353535] rounded-lg appearance-none cursor-pointer focus:outline-none"
          min="0"
          max="4"
          value={animRate}
          onChange={(e) => {
            const rate = Number(e.target.value);
            setAnimRate(rate);
            onDebounceChange(rate);
          }}
        >
        </input>

      </div>
      <AreaHeader label="Frames" />
      <div className="grid grid-cols-3 grid-rows-3 gap-2 p-1 overflow-y-scroll no-scrollbar">
        {object2d.anim.frames.map((frame, index) => (
          <div className="relative group" key={`${object2d.id}-frame-${index}`}>
            <Object2DReview
              className="rounded"
              object2d={object2d}
              tiles={frame}
            />
            <Text className="absolute top-0 left-1">{`#${index + 1}`}</Text>
            <div className="absolute top-0 right-0 px-1 py-0.5 hidden group-hover:block">
              <BaseButton onClick={() => {
                deleteObject2DAnimFrame.mutate({ id: object2d.id, index });
              }}>
                <CircleMinusIcon />
              </BaseButton>
            </div>
          </div>
        ))}
        <div className="max-w-16 min-h-16 rounded border border-dashed border-white/80 flex items-center justify-center">
          <PlusIcon size={5} />
        </div>
      </div>
    </div>
  );
}

export { Object2DAnimAttributeDetail };
