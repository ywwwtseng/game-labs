import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '@/components/ui/Modal';
import { BaseInput } from '@/components/ui/BaseInput';
import { Text } from '@/components/ui/Text';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { selectedScene } from '@/features/appState/appStateSlice';
import {
  useSpriteSheets,
  useUpdateSpriteSheets,
} from '@/context/SpriteSheetContext';
import { AlertIcon } from '@/components/icon/AlertIcon';
import { useMutation } from '@/hooks/useMutation';
import { ArrayUtil } from '@/utils/ArrayUtil';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { selectedSelectModeSelectorRectDefault } from '@/features/selectMode/selectModeSlice';

function CreatePatternModal() {
  const scene = useSelector(selectedScene);
  const selectedRect = useSelector(selectedSelectModeSelectorRectDefault);
  const spriteSheets = useSpriteSheets();
  const updateSpriteSheets = useUpdateSpriteSheets();

  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const tiles = useMemo(() => {
    return CanvasUtil.cloneSceneSelectedTiles(
      selectedRect,
      scene,
      ({ tile }) => {
        return spriteSheets?.[tile?.source]?.tiles?.[tile?.index?.[0]]?.[tile?.index?.[1]];
      },
    );
  }, [selectedRect, scene]);

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

  const { trigger } = useMutation('/api/patterns');

  const disabled = !name.trim();

  return (
    <Modal>
      <Modal.Header title="Create Pattern" showCloseButton />
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
            const tiles = CanvasUtil.cloneSceneSelectedTiles(
              selectedRect,
              scene,
              ({ tile }) => (tile ? { index: tile.index, source: tile.source } : null),
            );

            const res = await trigger({
              name,
              type,
              tiles,
            });

            updateSpriteSheets();
          }}
        >
          Create
        </Modal.Action>
      </Modal.Footer>
    </Modal>
  );
}

export { CreatePatternModal };
