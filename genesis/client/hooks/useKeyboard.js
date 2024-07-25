import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectArea } from "@/features/sceneSelectArea/sceneSelectAreaSlice";
import { addSceneTile } from "@/features/appState/appStateSlice";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

function useKeyboard() {
  const selected = useSelector((state) => state.sceneSelectArea.selected);
  const scene = useSelector((state) => state.appState.scene);
  const dispatch = useDispatch();

  useEffect(() => {
    const handlePress = (event) => {
      if (!selected.index || !scene) return;
      const index = CanvasUtil.rect(selected.index);
      const sizeX = index[2];
      const sizeY = index[3];

      if (event.key === "ArrowLeft") {
        dispatch(
          selectArea([Math.max(0, index[0] - 1), index[1], sizeX, sizeY])
        );
      }

      if (event.key === "ArrowRight") {
        const maxIndex = CanvasUtil.positionToIndex({
          x: scene.width,
          y: scene.height,
        });
        dispatch(
          selectArea([
            Math.min(maxIndex[0] - sizeX + 1, index[0] + 1),
            index[1],
            sizeX,
            sizeY,
          ])
        );
      }

      if (event.key === "ArrowUp") {
        dispatch(
          selectArea([index[0], Math.max(0, index[1] - 1), sizeX, sizeY])
        );
      }

      if (event.key === "ArrowDown") {
        const maxIndex = CanvasUtil.positionToIndex({
          x: scene.width,
          y: scene.height,
        });
        dispatch(
          selectArea([
            index[0],
            Math.min(maxIndex[1] - sizeY + 1, index[1] + 1),
            sizeX,
            sizeY,
          ])
        );
      }

      if (event.key === "Backspace") {
        MatrixUtil.traverse([sizeX, sizeY], (x, y) => {
          dispatch(
            addSceneTile({
              index: [index[0] + x, index[1] + y],
              tile: undefined,
            })
          );
        });
      }
    };
    window.addEventListener("keydown", handlePress);

    return () => {
      window.removeEventListener("keydown", handlePress);
    };
  }, [selected]);
}

export { useKeyboard };
