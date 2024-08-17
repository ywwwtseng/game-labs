import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWindowSize } from '@/context/WindowSizeContext';
import { selectedCamera, updateCameraSize } from '@/features/camera/cameraSlice';
import { destroy as destroyEditMode } from '@/features/editMode/editModeSlice';

function useCameraResizer() {
  const dispatch = useDispatch();
  const camera = useSelector(selectedCamera);
  const windowSize = useWindowSize();

  useEffect(() => {
    dispatch(destroyEditMode());
    dispatch(updateCameraSize());
  }, [windowSize]);

  return camera;
}

function useCamera() {
  const camera = useSelector(selectedCamera);

  return camera;
}

export { useCamera, useCameraResizer };
