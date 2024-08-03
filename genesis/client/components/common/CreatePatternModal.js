import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '@/components/ui/Modal';
import { BaseInput } from '@/components/ui/BaseInput';
import { Text } from '@/components/ui/Text';
import { Canvas2D, CANVAS_LAYER } from '@/components/common/Canvas2D';
import { selectedLayerSelector } from '@/features/appState/appStateSlice';
import {
  useSpriteSheets,
  useUpdateSpriteSheets,
} from '@/context/SpriteSheetContext';
import { AlertIcon } from '@/components/icon/AlertIcon';
import { useMutation } from '@/hooks/useMutation';
import { ArrayUtil } from '@/utils/ArrayUtil';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { selectedSelectModeSeletorRectDefault } from '@/features/selectMode/selectModeSlice';

function CreatePatternModal() {
  const layer = useSelector(selectedLayerSelector);
  const selectedRect = useSelector(selectedSelectModeSeletorRectDefault);
  const spriteSheets = useSpriteSheets();
  const updateSpriteSheets = useUpdateSpriteSheets();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const tiles = useMemo(() => {
    return CanvasUtil.getSceneSelectedTiles(selectedRect, layer, (tile) => {
      return spriteSheets?.[tile?.source]?.tiles?.[tile?.index?.[0]]?.[
        tile?.index?.[1]
      ];
    });
  }, [selectedRect, layer.tiles]);

  const layers = useMemo(
    () => [
      CANVAS_LAYER.SPRITE_LAYER({
        layers: tiles,
        width: selectedRect[2] * 16,
        height: selectedRect[3] * 16,
      }),
    ],
    [selectedRect, tiles],
  );

  const source = useMemo(() => {
    const sources = ArrayUtil.uniq(
      CanvasUtil.getSceneSelectedTiles(selectedRect, layer, (tile) => {
        return tile?.source;
      }).flat(),
    ).filter(Boolean);
    return sources.length === 1 ? sources[0] : undefined;
  }, [selectedRect, layer.tiles]);

  const { trigger } = useMutation(`/api/sprites/${source}/patterns`);

  const disabled = source && !name.trim();

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
          {!source && (
            <div className="flex items-center mt-1">
              <AlertIcon className="mr-2" color="fill-red-600" />
              <Text size="xs" color="white">
                Need the same source
              </Text>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Action
          disabled={disabled}
          onClick={async () => {
            const res = await trigger({
              name,
              type,
              tiles: CanvasUtil.getSceneSelectedTiles(
                selectedRect,
                layer,
                (tile) => tile?.index,
              ),
            });

            updateSpriteSheets();
          }}
        >
          {source ? 'Create' : 'Close'}
        </Modal.Action>
      </Modal.Footer>
    </Modal>
  );
}

export { CreatePatternModal };
