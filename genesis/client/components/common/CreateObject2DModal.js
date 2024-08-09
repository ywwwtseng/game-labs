import { useMemo, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { BaseInput } from '@/components/ui/BaseInput';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { useSpriteSheets } from '@/features/appState/SpriteSheetContext';
import { useCreateObject2D } from '@/mutations/useCreateObject2D';
import { MatrixUtil } from '@/utils/MatrixUtil';

function CreateObject2DModal({ tiles, onSuccess }) {
  const createObject2D = useCreateObject2D({ onSuccess });
  const spriteSheets = useSpriteSheets();
  const size = MatrixUtil.size(tiles);

  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const layers = useMemo(
    () => [
      CANVAS_LAYER.SPRITE_LAYERS({
        layers: [{ 
          tiles: MatrixUtil.create(tiles, ({ value: tileItems }) => {
            return tileItems?.map((tile) => {
              return spriteSheets?.[tile?.source]?.tiles?.[tile?.index?.[0]]?.[tile?.index?.[1]];
            });
          })
        }],
        width: size.x,
        height: size.y,
      }),
    ],
    [tiles],
  );

  const disabled = !name.trim();

  return (
    <Modal>
      <Modal.Header title="Create Object2D" showCloseButton />
      <Modal.Body className="flex">
        <div>
          <Canvas2D
            layers={layers}
            width={size.x}
            height={size.y}
          />
        </div>
        <div className="pl-2">
          <BaseInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <BaseInput
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Action
          disabled={disabled}
          onClick={async () => {
            createObject2D.mutate({
              name,
              type,
              tiles,
            });
          }}
        >
          Create
        </Modal.Action>
      </Modal.Footer>
    </Modal>
  );
}

export { CreateObject2DModal };
