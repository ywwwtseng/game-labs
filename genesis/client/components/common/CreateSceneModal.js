import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "@/components/ui/Modal";
import { BaseInput } from "@/components/ui/BaseInput";
import { addScene } from "@/features/appState/appStateSlice";

function CreateSceneModal() {
  const scene = useSelector((state) => state.appState.scene);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const disabled = !name.trim() || isNaN(width) || isNaN(height);

  return (
    <Modal width="172px">
      <Modal.Header title="Create Scene" showCloseButton={Boolean(scene)} />
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

export { CreateSceneModal };
