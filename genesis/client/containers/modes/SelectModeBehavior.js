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
  const originSelectedRectRef = useRef(null);
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

      if (!originSelectedRectRef.current) {
        originSelectedRectRef.current = selected.origin;
      }
    },
    onMoveDownEnd: () => {
      if (selected.rect && cacheSelectedTilesRef.current) {
        if (CanvasUtil.hasExistedTile({
          selectedRect: selected.rect,
          origin: [selected.rect[0], selected.rect[1]],
          layer: selectedLayer,
          transparent: MatrixUtil.find(
            cacheSelectedTilesRef.current,
            (tile) => tile === undefined,
          ).map(([x, y]) => `${x + selected.rect[0]}.${y + selected.rect[1]}`),
        })) {
          const originSelectedRect = originSelectedRectRef.current;
          dispatch(selectArea(originSelectedRect));
          MatrixUtil.traverse([originSelectedRect[2], originSelectedRect[3]], (x, y) => {
            dispatch(
              addSceneTile({
                index: [originSelectedRect[0] + x, originSelectedRect[1] + y],
                tile: cacheSelectedTilesRef.current[x][y],
              })
            );
          });
        } else {
          MatrixUtil.traverse([selected.rect[2], selected.rect[3]], (x, y) => {
            if (cacheSelectedTilesRef.current[x][y]) {
              dispatch(
                addSceneTile({
                  index: [selected.rect[0] + x, selected.rect[1] + y],
                  tile: cacheSelectedTilesRef.current[x][y],
                })
              );
            }
          });
        }
      }

      cacheSelectedTilesRef.current = null;
      originSelectedRectRef.current = null;
    }
  });

  const inputMapping = useMemo(() => ({
    ArrowLeft: (event) => {
      if (!selected.rect || !scene) return;
      const rect = CanvasUtil.normalizeRect(selected.rect);
      const sizeIndexX = rect[2];
      const sizeIndexY = rect[3];

      dispatch(
        selectArea([Math.max(0, rect[0] - 1), rect[1], sizeIndexX, sizeIndexY])
      );
    },
    ArrowRight: (event) => {
      if (!selected.rect || !scene) return;
      const rect = CanvasUtil.normalizeRect(selected.rect);
      const sizeIndexX = rect[2];
      const sizeIndexY = rect[3];

      const maxIndex = CanvasUtil.positionToIndex({
        x: scene.width,
        y: scene.height,
      });

      dispatch(
        selectArea([
          Math.min(maxIndex[0] - sizeIndexX + 1, rect[0] + 1),
          rect[1],
          sizeIndexX,
          sizeIndexY,
        ])
      );
    },
    ArrowUp: (event) => {
      if (!selected.rect || !scene) return;
      const rect = CanvasUtil.normalizeRect(selected.rect);
      const sizeIndexX = rect[2];
      const sizeIndexY = rect[3];

      dispatch(
        selectArea([rect[0], Math.max(0, rect[1] - 1), sizeIndexX, sizeIndexY])
      );
    },
    ArrowDown: (event) => {
      if (!selected.rect || !scene) return;
      const rect = CanvasUtil.normalizeRect(selected.rect);
      const sizeIndexX = rect[2];
      const sizeIndexY = rect[3];

      const maxIndex = CanvasUtil.positionToIndex({
        x: scene.width,
        y: scene.height,
      });
      dispatch(
        selectArea([
          rect[0],
          Math.min(maxIndex[1] - sizeIndexY + 1, rect[1] + 1),
          sizeIndexX,
          sizeIndexY,
        ])
      );

    },
    Backspace: (event) => {
      if (!selected.rect || !scene) return;
      const rect = CanvasUtil.normalizeRect(selected.rect);
      const sizeIndexX = rect[2];
      const sizeIndexY = rect[3];

      MatrixUtil.traverse([sizeIndexX, sizeIndexY], (x, y) => {
        dispatch(
          addSceneTile({
            rect: [rect[0] + x, rect[1] + y],
            tile: undefined,
          })
        );
      });
    },
  }), [selected, scene]);

  useKeyBoard(inputMapping);

  const cache = useCallback((ctx) => {
    if (selected.rect && cacheSelectedTilesRef.current) {
      MatrixUtil.traverse([selected.rect[2], selected.rect[3]], (x, y) => {
        const tile = cacheSelectedTilesRef.current[x][y];

        if (tile) {
          ctx.drawImage(
            spriteSheets[tile.source].tiles[tile.index[0]][tile.index[1]].buffer,
            0,
            0,
            16,
            16,
            (selected.rect[0] + x) * 16,
            (selected.rect[1] + y) * 16,
            16,
            16
          );
        }
      });
    }

    CanvasUtil.selected(ctx, selected.rect);
  }, [selected.rect]);

  const { setup: setupDropToDraw } = useDropToDraw({ id: "canvas" });

  return children({ register, connect: { ...connect, ...setupDropToDraw, cache } });
}

export { SelectModeBehavior };
