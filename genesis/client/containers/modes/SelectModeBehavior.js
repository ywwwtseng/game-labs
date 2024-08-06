import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTileToScene,
  addTilesToScene,
  moveSceneTiles,
  deleteScenePatterns,
  deleteSelectedElements,
  selectedScene,
  drawPattern,
} from '@/features/appState/appStateSlice';
import {
  setCursorIndex,
  selectAreaStart,
  selectArea,
  selectAreaStop,
  SELECT_MODE,
  KEEP_FOLLOWS,
} from '@/features/selectMode/selectModeSlice';
import {
  selectedCursorIndex,
  selectedSelectModeSelector,
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
  E_KEY,
  P_KEY,
  S_KEY,
} from '@/hooks/useKeyBoard';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { usePatterns } from '@/hooks/usePatterns';
import { useModal } from '@/context/ModalContext';
import { CreatePatternModal } from '@/components/common/CreatePatternModal';

function SelectModeBehavior({ children }) {
  const dispatch = useDispatch();
  const bufferRef = useRef({});
  const genesisRef = useRef({});
  const spriteSheets = useSpriteSheets();
  const scene = useSelector(selectedScene);
  const cursorIndex = useSelector(selectedCursorIndex);
  const selector = useSelector(selectedSelectModeSelector);
  const patterns = usePatterns();

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

        if (selector.mode !== SELECT_MODE.TILE) {
          return;
        }

        const notEmptyTiles = CanvasUtil.cloneSceneSelectedTiles(selector.rect.default, scene)
          .some((column) => column.some((tile) => tile?.length > 0));

        if (notEmptyTiles) {
          openCreatePatternModal();
        }
      },
      [ARROW_LEFT_KEY]: (event) => {},
      [ARROW_RIGHT_KEY]: (event) => {},
      [ARROW_UP_KEY]: (event) => {},
      [ARROW_DOWN_KEY]: (event) => {},
      [BACKSPACE_KEY]: (event) => {
        if (!selector.rect.default || !scene) return;
        dispatch(deleteSelectedElements());
      },
    }),
    [selector.rect.default, scene]
  );

  const { isHolding } = useKeyBoard(inputMapping);

  const isMoveAddTilesMode = () => isHolding(S_KEY) && isHolding(D_KEY);

  const { register, connect } = useSelectorBridge({
    canvasId: 'canvas',
    selector,
    draggable: true,
    cursorIndex,
    selectAreaStart: (index) => dispatch(selectAreaStart(index)),
    selectArea: (rects, type) => {
      let mode = selector.mode;
      let follows = rects.follows;

      if (type === 'mouseup') {
        if (mode === SELECT_MODE.PATTERN_OR_TILE && isHolding(E_KEY)) {
          mode = SELECT_MODE.TILE;
        }

        if (mode === SELECT_MODE.PATTERN_OR_TILE) {
          follows = CanvasUtil.getFollowedSelectedPatternRects(rects.default, scene);

          if (follows.length === 0) {
            mode = SELECT_MODE.TILE;
          } else {
            mode = SELECT_MODE.PATTERN;
          }
        }

        if (mode === SELECT_MODE.PATTERN && selector.rect.follows.length !== 0) {
          follows = KEEP_FOLLOWS;
        }
      }

      dispatch(
        selectArea({
          mode: mode,
          default: rects.default,
          follows,
        })
      );
      
    },
    selectAreaStop: () => dispatch(selectAreaStop()),
    setCursorIndex: (cursorIndex) => dispatch(setCursorIndex(cursorIndex)),
    onMoveDown: (rects) => {
      const mode = selector.mode;

      if (mode === SELECT_MODE.PATTERN) {
        if (!bufferRef.current.follows) {
         
          bufferRef.current.follows = rects.follows.map(
            ({ genesis: rect }) => {
              const pattern = CanvasUtil.cloneSceneSelectedPattern(rect, scene, patterns);
              return pattern.tiles;
            }
          );

          if (!genesisRef.current.default) {
            genesisRef.current.follows = rects.follows.map(
              ({ genesis }) => ({
                genesis,
                pattern: CanvasUtil.findPatternBySelectedRect(genesis, scene),
              })
            );
          }

          if (!isHolding(S_KEY)) {
            dispatch(deleteScenePatterns({ rects: selector.rect.follows }));
          }

        }

      } else if (mode === SELECT_MODE.TILE) {
        if (!bufferRef.current.default) {
          bufferRef.current.default = CanvasUtil.cloneSceneSelectedTiles(
            rects.default.genesis,
            scene,
            ({ tile, x, y }) => {
              if (tile && !isHolding(S_KEY)) {
                dispatch(
                  addTileToScene({
                    index: [x, y],
                    tile: undefined,
                  })
                );
              }

              return tile;
            }
          );
        }

        if (isMoveAddTilesMode()) {
          if (rects.default.next && genesisRef.current.default) {
            dispatch(
              addTilesToScene({
                selectedArea: selector.rect.default,
                localOriginIndex: [
                  rects.default.next[0],
                  rects.default.next[1],
                ],
                tiles: bufferRef.current.default,
                transparent: MatrixUtil.findIndexArray(
                  bufferRef.current.default, (tile) => tile === undefined
                ).map(([x, y]) => `${x + rects.default.next[0]}.${y + rects.default.next[1]}`),
              })
            );
          }
        }

        if (!genesisRef.current.default) {
          genesisRef.current.default = rects.default.genesis;
        }
      }
    },
    onMoveDownEnd: () => {
      if (selector.mode === SELECT_MODE.TILE) {
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
                (tile) => tile === undefined
              ).map(([x, y]) => `${x + selector.rect.default[0]}.${y + selector.rect.default[1]}`),
            })
          );
        }

        bufferRef.current.default = null;
        genesisRef.current.default = null;
      } else {
        if (selector.rect.follows && genesisRef.current.follows) {
          selector.rect.follows.forEach((rect, index) => {
            dispatch(
              drawPattern({
                rect,
                pattern: genesisRef.current.follows[index].pattern,
              })
            );
          });
        }

        bufferRef.current.follows = null;
        genesisRef.current.follows = null;
      }
    },
  });

  const cache = useCallback(
    (ctx) => {
      if (selector.rect.default && bufferRef.current.default) {
        MatrixUtil.traverse(
          bufferRef.current.default,
          ({ value: tileItems, x, y }) => {
            tileItems?.forEach((tile) => {
              if (tile) {
                CanvasUtil.drawBufferOnCanvas(
                  ctx,
                  spriteSheets[tile.source].tiles[tile.index[0]][tile.index[1]].buffer,
                  selector.rect.default[0] + x,
                  selector.rect.default[1] + y
                );
              }
            });
            
          }
        );
      }

      if (selector.rect.follows && bufferRef.current.follows) {
        selector.rect.follows.forEach((rect, index) => {
          MatrixUtil.traverse(
            bufferRef.current.follows[index],
            ({ value: tileItems, x, y }) => {
              if (tileItems) {
                tileItems.forEach((tile) => {
                  CanvasUtil.drawBufferOnCanvas(
                    ctx,
                    spriteSheets[tile.source].tiles[tile.index[0]][tile.index[1]].buffer,
                    rect[0] + x,
                    rect[1] + y
                  );
                });
                
              }
            }
          );
        });
      }

      if (selector.mode === SELECT_MODE.PATTERN) {
        selector.rect.follows.forEach((rect) => {
          CanvasUtil.selected(ctx, rect, 'rgba(255,255,255,0.8)');
        });
      } else {
        CanvasUtil.selected(ctx, selector.rect.default);
      }
    },
    [selector, scene]
  );

  const { setup: setupDropToDraw } = useDropToDraw({ id: 'canvas' });

  return children({
    register,
    connect: { ...connect, ...setupDropToDraw, cache },
  });
}

export { SelectModeBehavior };
