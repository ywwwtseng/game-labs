import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "@/components/ui/Modal";
import { BaseInput } from "@/components/ui/BaseInput";
import { Canvas2D, CANVAS_LAYER } from "@/components/common/Canvas2D";
import { addScene, selectedLayerSelector } from "@/features/appState/appStateSlice";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { MatrixUtil } from "@/utils/MatrixUtil";

function CreatePatternModal() {
  const layer = useSelector(selectedLayerSelector);
  const selectedArea = useSelector((state) => state.selectMode.selected.rect);
  const spriteSheets = useSpriteSheets();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const disabled = !name.trim() || isNaN(width);

  const layers = useMemo(() => ([
    CANVAS_LAYER.TILES({
      tiles: [{
        tiles: MatrixUtil.createByRect(selectedArea, (x, y) => {
          const tile = layer.tiles?.[selectedArea[0] + x]?.[selectedArea[1] + y];
          return spriteSheets?.[tile?.source]?.tiles?.[tile?.index?.[0]]?.[tile?.index?.[1]];
        })
      }],
      width: selectedArea[2] * 16,
      height: selectedArea[3] * 16,
    })
  ]), [selectedArea, layer.tiles]);

  return (
    <Modal>
      <Modal.Header title="Create Pattern" showCloseButton />
      <Modal.Body className="flex">
        <Canvas2D
          layers={layers}
          width={selectedArea[2] * 16}
          height={selectedArea[3] * 16}
        />
        <div className="pl-2">
          <BaseInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <BaseInput
            label="Type"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            onBlur={(e) => {
              if (!isNaN(e.target.value)) {
                setWidth(
                  String(Math.max(1, Math.ceil(Number(e.target.value) / 16)) * 16)
                );
              }
            }}
          />
        </div>
        
      </Modal.Body>
      <Modal.Footer>
        <Modal.Action
          disabled={disabled}
          onClick={() => {
            dispatch(addScene({
              name,
              width: Number(width),
              height: Number(height),
            }));
          }}
        >
          Create
        </Modal.Action>
      </Modal.Footer>
    </Modal>
  );
}

export { CreatePatternModal };
