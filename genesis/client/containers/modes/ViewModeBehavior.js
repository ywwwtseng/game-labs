import { updateCameraPos, normalizeCameraPos } from '@/features/camera/cameraSlice';
import { destroy as destroyEditMode } from '@/features/editMode/editModeSlice';
import { useCursor } from '@/hooks/useCursor';
import { useDispatch } from 'react-redux';

function ViewModeBehavior({ children }) {
  const dispatch = useDispatch();

  const { setup } = useCursor({
    onMoveStart: (event) => {
      event.target.style.cursor = 'pointer';
    },
    onDownMove: (_, { delta }) => {
      if (delta) {
        dispatch(destroyEditMode());
        dispatch(updateCameraPos({ delta }));
      }
    },
    onMoveEnd: (event) => {
      event.target.style.cursor = 'default';
      dispatch(normalizeCameraPos());
    },
  });

  return children({
    register: {},
    connect: setup,
  });
}

export { ViewModeBehavior };
