import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTileToScene,
  addTilesToScene,
  moveSceneTiles,
  deleteSelectedElements,
  selectedScene,
  selectedCurrentLayerSelector,
} from '@/features/appState/appStateSlice';
import {
  setCursorIndex,
  selectAreaStart,
  selectArea,
  selectAreaStop,
} from '@/features/selectMode/selectModeSlice';
import { selectedCursorIndex, selectedSelectModeSeletor } from '@/features/selectMode/selectModeSlice';
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
import { CANVAS_ELEMENT } from '@/constants';

function SelectModeBehavior({ children }) {
  const bufferRef = useRef({});
  const genesisRef = useRef({});
  const spriteSheets = useSpriteSheets();
  const scene = useSelector(selectedScene);
  const selectedLayer = useSelector(selectedCurrentLayerSelector);
  const dispatch = useDispatch();
  const cursorIndex = useSelector(selectedCursorIndex);
  const selector = useSelector(selectedSelectModeSeletor);

  const { open: openCreatePatternModal } = useModal(CreatePatternModal);

  const inputMapping = useMemo(
    () => ({
      [P_KEY]: () => {
        if (bufferRef.current.default || genesisRef.current.default) {
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
    onMoveDown: (selected) => {
      const type = selected.follows.length === 0 ? CANVAS_ELEMENT.TILE : CANVAS_ELEMENT.PATTERN;

      if (type === CANVAS_ELEMENT.PATTERN) {
        if (!bufferRef.current.follows) {

        }
        // bufferRef.current.follows = selected.follows.genesis.map(rect => {
        //   return MatrixUtil.create(rect, (_, { x, y }) => {

        //   });
        // });
      }

    
      if (type === CANVAS_ELEMENT.TILE) {
        if (!bufferRef.current.default) {
          bufferRef.current.default = CanvasUtil.cloneSceneSelectedTiles(selected.default.genesis, scene, ({ tile, x, y }) => {            
            if (tile && !isHolding(S_KEY)) {
              dispatch(
                addTileToScene({
                  index: [x, y],
                  tile: undefined,
                }),
              );
            }
            
            return tile;
          });
        }
        
        if (isMoveAddTilesMode()) {
          if (selected.default.next && genesisRef.current.default) {
            dispatch(
              addTilesToScene({
                selectedArea: selector.rect.default,
                localOriginIndex: [selected.default.next[0], selected.default.next[1]],
                tiles: bufferRef.current.default,
                transparent: MatrixUtil.findIndexArray(
                  bufferRef.current.default,
                  (tile) => tile === undefined,
                ).map(([x, y]) => `${x + selected.default.next[0]}.${y + selected.default.next[1]}`),
              }),
            );
          }
        }
        
        if (!genesisRef.current.default) {
          genesisRef.current.default = selected.default.genesis;
        }
      }
    },
    onMoveDownEnd: () => {
      if (selector.rect.follows.length === 0) {
        if (selector.rect.default && bufferRef.current.default) {
          dispatch(
            moveSceneTiles({
              selectedArea: selector.rect.default,
              localOriginIndex: [
                selector.rect.default[0],
                selector.rect.default[1],
              ],
              tiles: bufferRef.current.default,
              transparent: MatrixUtil.findIndexArray(
                bufferRef.current.default,
                (tile) => tile === undefined,
              ).map(
                ([x, y]) =>
                  `${x + selector.rect.default[0]}.${y + selector.rect.default[1]}`,
              ),
            }),
          );
        }

        bufferRef.current.default = null;
        genesisRef.current.default = null;
      }
    },
  });

  const cache = useCallback(
    (ctx) => {
      const patterns = selectedLayer.patterns;

      if (selector.rect.default && bufferRef.current.default) {
        MatrixUtil.traverse(selector.rect.default, (selectedIndex, index) => {
          const tile =
            bufferRef.current.default[selectedIndex.x][selectedIndex.y];

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
