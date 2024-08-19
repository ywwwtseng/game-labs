import { useSelector } from 'react-redux';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { ModeConnectToCanvas } from '@/containers/ModeConnectToCanvas';
import { selectedLand } from '@/features/appState/appStateSlice';
import { sql } from '@/sql';
import { META_KEY, S_KEY, useKeyBoard } from '@/hooks/useKeyBoard';
import { EventUtil } from '@/utils/EventUtil';
import { useMutation } from '@/hooks/useMutation';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { LandCanvas } from '@/components/common/LandCanvasEditArea/LandCanvas';

function LandCanvasEditArea() {
  const land = useSelector(selectedLand);
  const updateLand = useMutation(sql.lands.update);

  useKeyBoard(
    {
      [META_KEY.with(S_KEY)]: (event) => {
        EventUtil.stop(event);

        if (land) {
          updateLand.mutate({
            params: {
              id: land.id,
            },
            data: {
              land: {
                layers: land.layers.map((layer) => ({
                  name: layer.name,
                  object2ds: layer.object2ds,
                  tiles: MatrixUtil.create([land.width/16, land.height/16], ({ x, y }) => {
                    return layer.tiles?.[x]?.[y] || [];
                  }),
                }))
              }
            },
          });
        }
      }
    },
    [land]
  );

  return (
    <ModeConnectToCanvas>
      {({ register, connect, grid }) => (
        <div
          id="edit-area"
          className="relative z-10 rounded w-full h-full overflow-hidden flex items-center justify-center bg-[#353535]"
          {...register}
        >
          {land && (
            <LandCanvas
              grid={grid}
              land={land}
              {...connect}
            />
          )}
        </div>
      )}
    </ModeConnectToCanvas>
  );
}

LandCanvasEditArea.Empty = () => {
  return (
    <div className="relative z-10 rounded w-full h-full overflow-hidden flex items-center justify-center bg-[#353535]" />
  )
};

export { LandCanvasEditArea };
