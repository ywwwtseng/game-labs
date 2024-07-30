import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCursorPosition, addSceneTile, selectedLayerSelector } from "@/features/appState/appStateSlice";
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
import { useSpriteSheets } from "@/context/SpriteSheetContext";

function SelectModeBehavior({ children }) {
  const cacheSelectedTilesRef = useRef(null);
  const position = useSelector((state) => state.appState.cursor.position);
  const scene = useSelector((state) => state.appState.scene);
  const selected = useSelector((state) => state.selectMode.selected);
  const spriteSheets = useSpriteSheets();
  const selectedLayer = useSelector(selectedLayerSelector);
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
      const [originX, originY, ...sizeIndex] = selected.origin;

      if (!cacheSelectedTilesRef.current) {
        cacheSelectedTilesRef.current = MatrixUtil.createBySize(sizeIndex, (x, y) => {
          const tile = selectedLayer.tiles?.[originX + x]?.[originY + y];
 
          if (tile) {
           dispatch(addSceneTile({
             index: [originX + x, originY + y],
             tile: undefined,
           }));
          }
 
          return tile;
       });
      }
    },
    onMoveDownEnd: () => {
      if (selected.index && cacheSelectedTilesRef.current) {
        // TODO: cant put them on existed tile
        MatrixUtil.traverse([selected.index[2], selected.index[3]], (x, y) => {
          dispatch(
            addSceneTile({
              index: [selected.index[0] + x, selected.index[1] + y],
              tile: cacheSelectedTilesRef.current[x][y],
            })
          );
        });
      }

      cacheSelectedTilesRef.current = null;
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

  const cache = useCallback((ctx) => {
    if (selected.index && cacheSelectedTilesRef.current) {
      MatrixUtil.traverse([selected.index[2], selected.index[3]], (x, y) => {
        const tile = cacheSelectedTilesRef.current[x][y];

        if (tile) {
          ctx.drawImage(
            spriteSheets[tile.source].tiles[tile.index[0]][tile.index[1]].buffer,
            0,
            0,
            16,
            16,
            (selected.index[0] + x) * 16,
            (selected.index[1] + y) * 16,
            16,
            16
          );
        }
      });
    }
    CanvasUtil.selected(ctx, selected.index);
  }, [selected.index]);

  const { setup: setupDropToDraw } = useDropToDraw({ id: "canvas" });

  return children({ register, connect: { ...connect, ...setupDropToDraw, cache } });
}

export { SelectModeBehavior };
