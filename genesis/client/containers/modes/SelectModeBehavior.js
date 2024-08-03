import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTileToScene,
  addTilesToScene,
  moveSceneTiles,
  deleteSelectedElements,
  selectedLayerSelector,
} from '@/features/appState/appStateSlice';
import {
  setCursorIndex,
  selectAreaStart,
  selectArea,
  selectAreaStop,
} from '@/features/selectMode/selectModeSlice';
import { useSelectorBridge } from '@/hooks/useSelectorBridge';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { useDropToDraw } from '@/hooks/useDropToDraw';
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
} from '@/hooks/useKeyBoard';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { useModal } from '@/context/ModalContext';
import { CreatePatternModal } from '@/components/common/CreatePatternModal';
import { selectedCursorIndex } from '@/features/selectMode/selectModeSlice';
import { selectedSelectModeSeletor } from '@/features/selectMode/selectModeSlice';

function SelectModeBehavior({ children }) {
  const cacheSelectedTilesRef = useRef(null);
  const originSelectedRectRef = useRef(null);
  const spriteSheets = useSpriteSheets();
  const selectedLayer = useSelector(selectedLayerSelector);
  const dispatch = useDispatch();
  const cursorIndex = useSelector(selectedCursorIndex);
  const scene = useSelector((state) => state.appState.scene);
  const selector = useSelector(selectedSelectModeSeletor);

  const { open: openCreatePatternModal } = useModal(CreatePatternModal);

  const inputMapping = useMemo(
    () => ({
      [P_KEY]: () => {
        if (cacheSelectedTilesRef.current || originSelectedRectRef.current) {
          return;
        }

        if (!selector.rect.default) {
          return;
        }

        openCreatePatternModal();
      },
      [ARROW_LEFT_KEY]: (event) => {
        if (!selector.rect.default || !scene) return;
        const rect = CanvasUtil.normalizeRect(selector.rect.default);
        const sizeIndexX = rect[2];
        const sizeIndexY = rect[3];

        dispatch(
          selectArea([
            Math.max(0, rect[0] - 1),
            rect[1],
            sizeIndexX,
            sizeIndexY,
          ]),
        );
      },
      [ARROW_RIGHT_KEY]: (event) => {
        if (!selector.rect.default || !scene) return;
        const rect = CanvasUtil.normalizeRect(selector.rect.default);
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
          ]),
        );
      },
      [ARROW_UP_KEY]: (event) => {
        if (!selector.rect.default || !scene) return;
        const rect = CanvasUtil.normalizeRect(selector.rect.default);
        const sizeIndexX = rect[2];
        const sizeIndexY = rect[3];

        dispatch(
          selectArea([
            rect[0],
            Math.max(0, rect[1] - 1),
            sizeIndexX,
            sizeIndexY,
          ]),
        );
      },
      [ARROW_DOWN_KEY]: (event) => {
        if (!selector.rect.default || !scene) return;
        const rect = CanvasUtil.normalizeRect(selector.rect.default);
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
          ]),
        );
      },
      [BACKSPACE_KEY]: (event) => {
        if (!selector.rect.default || !scene) return;
        dispatch(deleteSelectedElements());
      },
    }),
    [selector.rect.default, scene],
  );

  const { isHolding } = useKeyBoard(inputMapping);

  const isMoveAddTilesMode = () => isHolding(S_KEY) && isHolding(D_KEY);

  const { register, connect } = useSelectorBridge({
    canvasId: 'canvas',
    selector,
    draggable: true,
    cursorIndex,
    selectAreaStart: (index) => dispatch(selectAreaStart(index)),
    selectArea: (index) => dispatch(selectArea(index)),
    selectAreaStop: () => dispatch(selectAreaStop()),
    setCursorIndex: (cursorIndex) => dispatch(setCursorIndex(cursorIndex)),
    onMoveDown: (area) => {
      const [originX, originY, ...sizeIndex] = area.origin;

      if (!cacheSelectedTilesRef.current) {
        cacheSelectedTilesRef.current = MatrixUtil.create(sizeIndex, (x, y) => {
          const tile = selectedLayer.tiles?.[originX + x]?.[originY + y];

          if (tile && !isHolding(S_KEY)) {
            dispatch(
              addTileToScene({
                index: [originX + x, originY + y],
                tile: undefined,
              }),
            );
          }

          return tile;
        });
      }

      if (isMoveAddTilesMode()) {
        if (area.next && originSelectedRectRef.current) {
          dispatch(
            addTilesToScene({
              selectedArea: selector.rect.default,
              localOriginIndex: [area.next[0], area.next[1]],
              tiles: cacheSelectedTilesRef.current,
              transparent: MatrixUtil.findIndexArray(
                cacheSelectedTilesRef.current,
                (tile) => tile === undefined,
              ).map(([x, y]) => `${x + area.next[0]}.${y + area.next[1]}`),
            }),
          );
        }
      }

      if (!originSelectedRectRef.current) {
        originSelectedRectRef.current = area.origin;
      }
    },
    onMoveDownEnd: () => {
      if (selector.rect.default && cacheSelectedTilesRef.current) {
        dispatch(
          moveSceneTiles({
            selectedArea: selector.rect.default,
            localOriginIndex: [
              selector.rect.default[0],
              selector.rect.default[1],
            ],
            tiles: cacheSelectedTilesRef.current,
            transparent: MatrixUtil.findIndexArray(
              cacheSelectedTilesRef.current,
              (tile) => tile === undefined,
            ).map(
              ([x, y]) =>
                `${x + selector.rect.default[0]}.${y + selector.rect.default[1]}`,
            ),
          }),
        );
      }

      cacheSelectedTilesRef.current = null;
      originSelectedRectRef.current = null;
    },
  });

  const cache = useCallback(
    (ctx) => {
      const patterns = selectedLayer.patterns;

      if (selector.rect.default && cacheSelectedTilesRef.current) {
        MatrixUtil.traverse(selector.rect.default, (selectedIndex, index) => {
          const tile =
            cacheSelectedTilesRef.current[selectedIndex.x][selectedIndex.y];

          if (tile && tile.pattern_id) {
            const pattern = patterns[tile.pattern_id];
            const source = pattern.id.split('.')[0];

            MatrixUtil.traverse(pattern.tiles, ({ x, y }) => {
              CanvasUtil.drawBufferOnCanvas(
                ctx,
                spriteSheets[source].tiles[x][y].buffer,
                index.x + x,
                index.y + y,
              );
            });
          } else if (tile) {
            CanvasUtil.drawBufferOnCanvas(
              ctx,
              spriteSheets[tile.source].tiles[tile.index[0]][tile.index[1]]
                .buffer,
              index.x,
              index.y,
            );
          }
        });
      }

      if (selector.rect.default) {
        selector.rect.follows.forEach((rect) => {
          CanvasUtil.selected(ctx, rect, 'rgba(255,255,255,0.8)');
        });
      }

      CanvasUtil.selected(ctx, selector.rect.default);
    },
    [selector.rect, selectedLayer],
  );

  const { setup: setupDropToDraw } = useDropToDraw({ id: 'canvas' });

  return children({
    register,
    connect: { ...connect, ...setupDropToDraw, cache },
  });
}

export { SelectModeBehavior };
