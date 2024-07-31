import { useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCursorPosition,
  addTileToScene,
  addTilesToScene,
  moveSceneTiles,
  deleteSceneTiles,
  selectedLayerSelector
} from "@/features/appState/appStateSlice";
import {
  selectAreaStart,
  selectArea,
  selectAreaStop,
} from "@/features/selectMode/selectModeSlice";
import { useICanvasSelectArea } from "@/hooks/useCanvasSelectArea";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { useDropToDraw } from "@/hooks/useDropToDraw";
import { 
  useKeyBoard,
  BACKSPACE_KEY,
  ARROW_LEFT_KEY,
  ARROW_UP_KEY,
  ARROW_RIGHT_KEY,
  ARROW_DOWN_KEY,
  D_KEY,
  P_KEY,
  S_KEY,
} from "@/hooks/useKeyBoard";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { useModal } from '@/context/ModalContext';
import { CreatePatternModal } from '@/components/common/CreatePatternModal';

function SelectModeBehavior({ children }) {
  const cacheSelectedTilesRef = useRef(null);
  const originSelectedRectRef = useRef(null);
  const spriteSheets = useSpriteSheets();
  const selectedLayer = useSelector(selectedLayerSelector);
  const dispatch = useDispatch();
  const position = useSelector((state) => state.appState.cursor.position);
  const scene = useSelector((state) => state.appState.scene);
  const selected = useSelector((state) => state.selectMode.selected);
  const selectedArea = selected.rect;

  const { open: openCreatePatternModal } = useModal(CreatePatternModal);

  const inputMapping = useMemo(() => ({
    [P_KEY]: () => {
      if (cacheSelectedTilesRef.current || originSelectedRectRef.current) {
        return;
      }

      if (!selectedArea) {
        return;
      }

      openCreatePatternModal();
    },
    [ARROW_LEFT_KEY]: (event) => {
      if (!selectedArea || !scene) return;
      const rect = CanvasUtil.normalizeRect(selectedArea);
      const sizeIndexX = rect[2];
      const sizeIndexY = rect[3];

      dispatch(
        selectArea([Math.max(0, rect[0] - 1), rect[1], sizeIndexX, sizeIndexY])
      );
    },
    [ARROW_RIGHT_KEY]: (event) => {
      if (!selectedArea || !scene) return;
      const rect = CanvasUtil.normalizeRect(selectedArea);
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
    [ARROW_UP_KEY]: (event) => {
      if (!selectedArea || !scene) return;
      const rect = CanvasUtil.normalizeRect(selectedArea);
      const sizeIndexX = rect[2];
      const sizeIndexY = rect[3];

      dispatch(
        selectArea([rect[0], Math.max(0, rect[1] - 1), sizeIndexX, sizeIndexY])
      );
    },
    [ARROW_DOWN_KEY]: (event) => {
      if (!selectedArea || !scene) return;
      const rect = CanvasUtil.normalizeRect(selectedArea);
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
    [BACKSPACE_KEY]: (event) => {
      if (!selectedArea || !scene) return;

      dispatch(deleteSceneTiles({
        selectedArea: selectedArea
      }));
    },
  }), [selectedArea, scene]);

  const { isHolding } = useKeyBoard(inputMapping);

  const isMoveAddTilesMode = () => isHolding(S_KEY) && isHolding(D_KEY);

  const { register, connect } = useICanvasSelectArea({
    canvasId: "canvas",
    selected,
    draggable: true,
    position,
    selectAreaStart: (index) => dispatch(selectAreaStart(index)),
    selectArea: (index) => dispatch(selectArea(index)),
    selectAreaStop: () => dispatch(selectAreaStop()),
    setCursorPosition: (position) => dispatch(setCursorPosition(position)),
    onMoveDown: (area) => {
      const [originX, originY, ...sizeIndex] = area.origin;

      if (!cacheSelectedTilesRef.current) {
        cacheSelectedTilesRef.current = MatrixUtil.createBySize(sizeIndex, (x, y) => {
          const tile = selectedLayer.tiles?.[originX + x]?.[originY + y];
 
          if (tile && !isHolding(S_KEY)) {
           dispatch(addTileToScene({
             index: [originX + x, originY + y],
             tile: undefined,
           }));
          }
 
          return tile;
       });
      }

      if (isMoveAddTilesMode()) {
        if (area.next && originSelectedRectRef.current) {
          dispatch(addTilesToScene({
            selectedArea,
            firstTileOriginInSprite: [area.next[0], area.next[1]],
            tiles: cacheSelectedTilesRef.current,
            transparent: MatrixUtil.find(cacheSelectedTilesRef.current, (tile) => tile === undefined)
              .map(([x, y]) => `${x + area.next[0]}.${y + area.next[1]}`),
          }));
        }
      }

      if (!originSelectedRectRef.current) {
        originSelectedRectRef.current = area.origin;
      }
    },
    onMoveDownEnd: () => {
      if (selectedArea && cacheSelectedTilesRef.current) {
        dispatch(moveSceneTiles({
          selectedArea,
          firstTileOriginInSprite: [selectedArea[0], selectedArea[1]],
          tiles: cacheSelectedTilesRef.current,
          transparent: MatrixUtil.find(cacheSelectedTilesRef.current, (tile) => tile === undefined)
            .map(([x, y]) => `${x + selectedArea[0]}.${y + selectedArea[1]}`),
          restoreArea: isMoveAddTilesMode() ? null : originSelectedRectRef.current,
        }));
      }

      cacheSelectedTilesRef.current = null;
      originSelectedRectRef.current = null;
    }
  });

  const cache = useCallback((ctx) => {
    if (selectedArea && cacheSelectedTilesRef.current) {
      MatrixUtil.traverse([selectedArea[2], selectedArea[3]], (x, y) => {
        const tile = cacheSelectedTilesRef.current[x][y];

        if (tile) {
          ctx.drawImage(
            spriteSheets[tile.source].tiles[tile.index[0]][tile.index[1]].buffer,
            0,
            0,
            16,
            16,
            (selectedArea[0] + x) * 16,
            (selectedArea[1] + y) * 16,
            16,
            16
          );
        }
      });
    }

    CanvasUtil.selected(ctx, selectedArea);
  }, [selectedArea]);

  const { setup: setupDropToDraw } = useDropToDraw({ id: "canvas" });

  return children({ register, connect: { ...connect, ...setupDropToDraw, cache } });
}

export { SelectModeBehavior };
