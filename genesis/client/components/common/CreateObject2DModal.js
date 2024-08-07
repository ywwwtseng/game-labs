import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '@/components/ui/Modal';
import { BaseInput } from '@/components/ui/BaseInput';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { selectedLand } from '@/features/appState/appStateSlice';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { selectedSelectModeSelectorRectDefault } from '@/features/selectMode/selectModeSlice';
import { useCreateObject2D } from '@/mutations/useCreateObject2D';

function CreateObject2DModal() {
  const land = useSelector(selectedLand);
  const selectedRect = useSelector(selectedSelectModeSelectorRectDefault);
  const spriteSheets = useSpriteSheets();
  const createObject2D = useCreateObject2D();

  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const tiles = useMemo(() => {
    return CanvasUtil.cloneLandSelectedTiles(
      selectedRect,
      land,
      ({ tile }) => {
        return spriteSheets?.[tile?.source]?.tiles?.[tile?.index?.[0]]?.[tile?.index?.[1]];
      },
    );
  }, [selectedRect, land]);

  const layers = useMemo(
    () => [
      CANVAS_LAYER.SPRITE_LAYERS({
        layers: [{ tiles }],
        width: selectedRect[2] * 16,
        height: selectedRect[3] * 16,
      }),
    ],
    [selectedRect, tiles],
  );

  const disabled = !name.trim();

  return (
    <Modal>
      <Modal.Header title="Create Object2D" showCloseButton />
      <Modal.Body className="flex">
        <div>
          <Canvas2D
            layers={layers}
            width={selectedRect[2] * 16}
            height={selectedRect[3] * 16}
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
            const tiles = CanvasUtil.cloneLandSelectedTiles(
              selectedRect,
              land,
              ({ tile }) => (tile ? { index: tile.index, source: tile.source } : null),
            );

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
