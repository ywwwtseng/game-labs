import { useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTileToScene,
  addTilesToScene,
  moveSceneTiles,
  deleteSelectedElements,
  selectedLayerSelector
} from "@/features/appState/appStateSlice";
import {
  setCursorPosition,
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
import { contain, overlaps } from "@/helpers/BoundingBox";
import { selectedSelectedRectList, selectedUserSelectedState } from "@/features/selectMode/selectModeSlice";

function SelectModeBehavior({ children }) {
  const cacheSelectedTilesRef = useRef(null);
  const originSelectedRectRef = useRef(null);
  const spriteSheets = useSpriteSheets();
  const selectedLayer = useSelector(selectedLayerSelector);
  const dispatch = useDispatch();
  const position = useSelector((state) => state.selectMode.cursor.position);
  const scene = useSelector((state) => state.appState.scene);
  const selected = useSelector(selectedUserSelectedState);
  const { user: userSelectedArea, patterns: selectedPatterns } = useSelector(selectedSelectedRectList);

  const { open: openCreatePatternModal } = useModal(CreatePatternModal);

  const inputMapping = useMemo(() => ({
    [P_KEY]: () => {
      if (cacheSelectedTilesRef.current || originSelectedRectRef.current) {
        return;
      }

      if (!userSelectedArea) {
        return;
      }

      openCreatePatternModal();
    },
    [ARROW_LEFT_KEY]: (event) => {
      if (!userSelectedArea || !scene) return;
      const rect = CanvasUtil.normalizeRect(userSelectedArea);
      const sizeIndexX = rect[2];
      const sizeIndexY = rect[3];

      dispatch(
        selectArea([Math.max(0, rect[0] - 1), rect[1], sizeIndexX, sizeIndexY])
      );
    },
    [ARROW_RIGHT_KEY]: (event) => {
      if (!userSelectedArea || !scene) return;
      const rect = CanvasUtil.normalizeRect(userSelectedArea);
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
      if (!userSelectedArea || !scene) return;
      const rect = CanvasUtil.normalizeRect(userSelectedArea);
      const sizeIndexX = rect[2];
      const sizeIndexY = rect[3];

      dispatch(
        selectArea([rect[0], Math.max(0, rect[1] - 1), sizeIndexX, sizeIndexY])
      );
    },
    [ARROW_DOWN_KEY]: (event) => {
      if (!userSelectedArea || !scene) return;
      const rect = CanvasUtil.normalizeRect(userSelectedArea);
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
      if (!userSelectedArea || !scene) return;
      dispatch(deleteSelectedElements());
    },
  }), [userSelectedArea, scene]);

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
        cacheSelectedTilesRef.current = MatrixUtil.create(sizeIndex, (x, y) => {
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
            userSelectedArea,
            firstTileOriginInSprite: [area.next[0], area.next[1]],
            tiles: cacheSelectedTilesRef.current,
            transparent: MatrixUtil.findIndexArray(cacheSelectedTilesRef.current, (tile) => tile === undefined)
              .map(([x, y]) => `${x + area.next[0]}.${y + area.next[1]}`),
          }));
        }
      }

      if (!originSelectedRectRef.current) {
        originSelectedRectRef.current = area.origin;
      }
    },
    onMoveDownEnd: () => {
      if (userSelectedArea && cacheSelectedTilesRef.current) {
        dispatch(moveSceneTiles({
          selectedArea: userSelectedArea,
          firstTileOriginInSprite: [userSelectedArea[0], userSelectedArea[1]],
          tiles: cacheSelectedTilesRef.current,
          transparent: MatrixUtil.findIndexArray(cacheSelectedTilesRef.current, (tile) => tile === undefined)
            .map(([x, y]) => `${x + userSelectedArea[0]}.${y + userSelectedArea[1]}`),
          restoreArea: isMoveAddTilesMode() ? null : originSelectedRectRef.current,
        }));
      }

      cacheSelectedTilesRef.current = null;
      originSelectedRectRef.current = null;
    }
  });

  const cache = useCallback((ctx) => {
    const patterns = selectedLayer.patterns;

    if (userSelectedArea && cacheSelectedTilesRef.current) {
      MatrixUtil.traverse(userSelectedArea, (selectedIndex, index) => {
        const tile = cacheSelectedTilesRef.current[selectedIndex.x][selectedIndex.y];
        


        if (tile && tile.pattern_id) {
          const pattern = patterns[tile.pattern_id]
          const source = pattern.id.split(".")[0];

          MatrixUtil.traverse(pattern.tiles, ({ x, y }) => {
            CanvasUtil.drawBufferOnCanvas(
              ctx,
              spriteSheets[source].tiles[x][y].buffer,
              (index.x + x),
              (index.y + y),
            );
          });
        } else if (tile) {
          CanvasUtil.drawBufferOnCanvas(
            ctx,
            spriteSheets[tile.source].tiles[tile.index[0]][tile.index[1]].buffer,
            index.x,
            index.y,
          )
        }
      });
    }

    if (userSelectedArea) {
      selectedPatterns.forEach((rect) => {
        CanvasUtil.selected(ctx, rect, 'rgba(255,255,255,0.8)');
      });
    }

    CanvasUtil.selected(ctx, userSelectedArea);
  }, [userSelectedArea, selectedPatterns, selectedLayer]);

  const { setup: setupDropToDraw } = useDropToDraw({ id: "canvas" });

  return children({ register, connect: { ...connect, ...setupDropToDraw, cache } });
}

export { SelectModeBehavior };
