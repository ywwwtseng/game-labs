import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { BaseInput } from "@/components/ui/BaseInput";
import { addScene } from "@/features/appState/appStateSlice";

function CreateSceneModal({ onClose }) {
  const scene = useSelector((state) => state.appState.scene);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const disabled = !name.trim() || isNaN(width) || isNaN(height);

  return (
    <Modal width={172}>
      <Modal.Header title="Create Scene" onClose={scene ? onClose : () => {}} />
      <Modal.Body>
        <BaseInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <BaseInput
          label="Width"
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
        <BaseInput
          label="Height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          onBlur={(e) => {
            if (!isNaN(e.target.value)) {
              setHeight(
                String(Math.max(1, Math.ceil(Number(e.target.value) / 16)) * 16)
              );
            }
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={disabled}
          onClick={() => {
            dispatch(addScene({
              name,
              width: Number(width),
              height: Number(height),
            }));
            onClose();
          }}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export { CreateSceneModal };
