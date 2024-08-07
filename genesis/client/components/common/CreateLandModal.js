import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '@/components/ui/Modal';
import { BaseInput } from '@/components/ui/BaseInput';
import { addLand } from '@/features/appState/appStateSlice';

function CreateLandModal() {
  const land = useSelector((state) => state.appState.land);
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const disabled = !name.trim() || isNaN(width) || isNaN(height);

  return (
    <Modal width="172px">
      <Modal.Header title="Create Land" showCloseButton={Boolean(land)} />
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
                String(
                  Math.max(1, Math.ceil(Number(e.target.value) / 16)) * 16,
                ),
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
                String(
                  Math.max(1, Math.ceil(Number(e.target.value) / 16)) * 16,
                ),
              );
            }
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Modal.Action
          disabled={disabled}
          onClick={() => {
            dispatch(
              addLand({
                name,
                width: Number(width),
                height: Number(height),
              }),
            );
          }}
        >
          Create
        </Modal.Action>
      </Modal.Footer>
    </Modal>
  );
}

export { CreateLandModal };
