import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '@/components/ui/Modal';
import { BaseInput } from '@/components/ui/BaseInput';
import { useMutation } from '@/hooks/useMutation';
import { sql } from '@/sql';

function CreateLandModal() {
  const land = useSelector((state) => state.appState.land);
  const createLand = useMutation(sql.lands.create);
  const [name, setName] = useState('');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);

  return (
    <Modal width="172px">
      <Modal.Header title="Create Land" showCloseButton={Boolean(land)} />
      <Modal.Body>
        <BaseInput
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <BaseInput
          disabled
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
          disabled
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
          onClick={() => {
            createLand.mutate({
              data: {
                dir: 'lands/draft',
                land: {
                  id: 'auto_increment()',
                  name,
                  width: Number(width),
                  height: Number(height),
                  layers: [
                    {
                      name: 'Background Layer',
                      tiles: [],
                      object2ds: [],
                    },
                    {
                      name: 'Entity Layer',
                      tiles: [],
                      object2ds: [],
                    },
                    {
                      name: 'Foreground Layer',
                      tiles: [],
                      object2ds: [],
                    },
                  ],
                },
              }
            });
          }}
        >
          Create
        </Modal.Action>
      </Modal.Footer>
    </Modal>
  );
}

export { CreateLandModal };
