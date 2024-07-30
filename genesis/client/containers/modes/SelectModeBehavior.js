import { useEffect, useMemo } from "react";
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
import { useDropToDraw } from "@/hooks/useDropToDraw";
import { useKeyBoard } from "@/hooks/useKeyBoard";

function SelectModeBehavior({ children }) {
  const position = useSelector((state) => state.appState.cursor.position);
  const scene = useSelector((state) => state.appState.scene);
  const selected = useSelector((state) => state.selectMode.selected);
  const dispatch = useDispatch();

  const { register, connect } = useICanvasSelectArea({
    canvasId: "canvas",
    selected,
    draggable: true,
    position,
    selectAreaStart: (index) => dispatch(selectAreaStart(index)),
    selectArea: (index) => dispatch(selectArea(index)),
    selectAreaStop: () => dispatch(selectAreaStop()),
    setCursorPosition: (position) => dispatch(setCursorPosition(position)),
    onMoveDown: (selected) => {
      console.log(selected);
    }
  });

  const inputMapping = useMemo(() => ({
    ArrowLeft: (event) => {
      if (!selected.index || !scene) return;
      const index = CanvasUtil.normalizeRect(selected.index);
      const sizeIndexX = index[2];
      const sizeIndexY = index[3];

      dispatch(
        selectArea([Math.max(0, index[0] - 1), index[1], sizeIndexX, sizeIndexY])
      );
    },
    ArrowRight: (event) => {
      if (!selected.index || !scene) return;
      const index = CanvasUtil.normalizeRect(selected.index);
      const sizeIndexX = index[2];
      const sizeIndexY = index[3];

      const maxIndex = CanvasUtil.positionToIndex({
        x: scene.width,
        y: scene.height,
      });

      dispatch(
        selectArea([
          Math.min(maxIndex[0] - sizeIndexX + 1, index[0] + 1),
          index[1],
          sizeIndexX,
          sizeIndexY,
        ])
      );
    },
    ArrowUp: (event) => {
      if (!selected.index || !scene) return;
      const index = CanvasUtil.normalizeRect(selected.index);
      const sizeIndexX = index[2];
      const sizeIndexY = index[3];

      dispatch(
        selectArea([index[0], Math.max(0, index[1] - 1), sizeIndexX, sizeIndexY])
      );
    },
    ArrowDown: (event) => {
      if (!selected.index || !scene) return;
      const index = CanvasUtil.normalizeRect(selected.index);
      const sizeIndexX = index[2];
      const sizeIndexY = index[3];

      const maxIndex = CanvasUtil.positionToIndex({
        x: scene.width,
        y: scene.height,
      });
      dispatch(
        selectArea([
          index[0],
          Math.min(maxIndex[1] - sizeIndexY + 1, index[1] + 1),
          sizeIndexX,
          sizeIndexY,
        ])
      );

    },
    Backspace: (event) => {
      if (!selected.index || !scene) return;
      const index = CanvasUtil.normalizeRect(selected.index);
      const sizeIndexX = index[2];
      const sizeIndexY = index[3];

      MatrixUtil.traverse([sizeIndexX, sizeIndexY], (x, y) => {
        dispatch(
          addSceneTile({
            index: [index[0] + x, index[1] + y],
            tile: undefined,
          })
        );
      });
    },
  }), [selected, scene]);

  useKeyBoard(inputMapping);

  const { setup: setupDropToDraw } = useDropToDraw({ id: "canvas" });

  return children({ register, connect: { ...connect, ...setupDropToDraw } });
}

export { SelectModeBehavior };
