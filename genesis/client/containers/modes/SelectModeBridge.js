import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCursorPosition, addSceneTile } from "@/features/appState/appStateSlice";
import {
  selectAreaStart,
  selectArea,
  selectAreaStop,
} from "@/features/selectMode/selectModeSlice";
import { useICanvasSelectArea } from "@/hooks/useCanvasSelectArea";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

function SelectModeBridge({ children }) {
  const position = useSelector((state) => state.appState.cursor.position);
  const scene = useSelector((state) => state.appState.scene);
  const selected = useSelector((state) => state.selectMode.selected);
  const dispatch = useDispatch();

  const { register, connect } = useICanvasSelectArea({
    canvasId: "canvas",
    selected,
    position,
    selectAreaStart: (index) => dispatch(selectAreaStart(index)),
    selectArea: (index) => dispatch(selectArea(index)),
    selectAreaStop: () => dispatch(selectAreaStop()),
    setCursorPosition: (position) => dispatch(setCursorPosition(position)),
  });

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

  useEffect(() => {
    return () => {
      dispatch(selectAreaStart(null));
    };
  }, []);

  return children({ register, connect });
}

export { SelectModeBridge };
