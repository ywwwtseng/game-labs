import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTileToLand,
  addTilesToLand,
  moveLandTiles,
  deleteLandObject2Ds,
  deleteSelectedElements,
  selectedLand,
  drawObject2D,
  deleteLandTiles,
  addObject2DToLand,
  departObject2D,
  flatSelectedTiles,
} from '@/features/appState/appStateSlice';
import {
  setCursorIndex,
  selectAreaStart,
  selectArea,
  selectAreaStop,
  selectAreaEnd,
  SELECT_MODE,
  KEEP_FOLLOWS,
} from '@/features/editMode/editModeSlice';
import {
  selectedCursorIndex,
  selectedEditModeSelector,
} from '@/features/editMode/editModeSlice';
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
  F_KEY,
  O_KEY,
  S_KEY,
  X_KEY,
} from '@/hooks/useKeyBoard';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { useObject2Ds } from '@/queries/useObject2Ds';
import { useModal } from '@/context/ModalContext';
import { CreateObject2DModal } from '@/components/common/CreateObject2DModal';

function EditModeBehavior({ children }) {
  const dispatch = useDispatch();
  const bufferRef = useRef({});
  const genesisRef = useRef({});
  const spriteSheets = useSpriteSheets();
  const land = useSelector(selectedLand);
  const cursorIndex = useSelector(selectedCursorIndex);
  const selector = useSelector(selectedEditModeSelector);
  const object2ds = useObject2Ds();

  const { open: openCreateObject2DModal } = useModal(CreateObject2DModal);

  const inputMapping = useMemo(
    () => ({
      [O_KEY]: (event) => {
        if (selector.mode !== SELECT_MODE.TILE) {
          return;
        }

        if (bufferRef.current.default || genesisRef.current.default) {
          return;
        }

        const rect = selector.rect.default;

        if (!rect) {
          return;
        }

        const notEmptyTiles = CanvasUtil.cloneLandSelectedTiles(rect, land)
          .some((column) => column.some((tile) => tile?.length > 0));

        if (notEmptyTiles) {
          const tiles = CanvasUtil.cloneLandSelectedTiles(
            rect,
            land,
            ({ tile }) => (tile ? { index: tile.index, source: tile.source } : null),
          );
          
          openCreateObject2DModal({ tiles, onSuccess: (res) => {
            dispatch(deleteLandTiles(rect));
            dispatch(addObject2DToLand({
              rect,
              object2d: res.data,
            }));
            dispatch(selectAreaEnd());
          }});
        }
      },
      [X_KEY]: (event) => {
        if (selector.mode !== SELECT_MODE.OBJECT_2D) {
          return;
        }

        if (selector.rect.follows.length !== 1) {
          return;
        }

        const rect = selector.rect.follows[0];
        const object2d = CanvasUtil.findObject2DBySelectedRect(rect, land);

        dispatch(deleteSelectedElements());
        dispatch(departObject2D({
          rect,
          object2d: object2ds.find(({ id }) => id === object2d.id),
        }));
      },
      [F_KEY]: (event) => {
        if (selector.mode !== SELECT_MODE.TILE) {
          return;
        }

        const rect = selector.rect.default;

        if (!rect) {
          return;
        }

        dispatch(flatSelectedTiles({ rect }));
      },
      [ARROW_LEFT_KEY]: (event) => {},
      [ARROW_RIGHT_KEY]: (event) => {},
      [ARROW_UP_KEY]: (event) => {},
      [ARROW_DOWN_KEY]: (event) => {},
      [BACKSPACE_KEY]: (event) => {
        if (!selector.rect.default || !land) return;
        dispatch(deleteSelectedElements());
      },
    }),
    [selector.rect.default, land]
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
        if (mode === SELECT_MODE.OBJECT_2D_OR_TILE && isHolding(E_KEY)) {
          mode = SELECT_MODE.TILE;
        }

        if (mode === SELECT_MODE.OBJECT_2D_OR_TILE) {
          follows = CanvasUtil.getFollowedSelectedObject2DRects(rects.default, land);

          if (follows.length === 0) {
            mode = SELECT_MODE.TILE;
          } else {
            mode = SELECT_MODE.OBJECT_2D;
          }
        }

        if (mode === SELECT_MODE.OBJECT_2D && selector.rect.follows.length !== 0) {
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

      if (mode === SELECT_MODE.OBJECT_2D) {
        if (!bufferRef.current.follows) {
         
          bufferRef.current.follows = rects.follows.map(
            ({ genesis: rect }) => {
              const object2d = CanvasUtil.cloneLandSelectedObject2D(rect, land, object2ds);
              return object2d.tiles;
            }
          );

          if (!genesisRef.current.default) {
            genesisRef.current.follows = rects.follows.map(
              ({ genesis }) => ({
                genesis,
                object2d: CanvasUtil.findObject2DBySelectedRect(genesis, land),
              })
            );
          }

          if (!isHolding(S_KEY)) {
            dispatch(deleteLandObject2Ds({ rects: selector.rect.follows }));
          }

        }

      } else if (mode === SELECT_MODE.TILE) {
        if (!bufferRef.current.default) {
          bufferRef.current.default = CanvasUtil.cloneLandSelectedTiles(
            rects.default.genesis,
            land,
            ({ tile, x, y }) => {
              if (tile && !isHolding(S_KEY)) {
                dispatch(
                  addTileToLand({
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
              addTilesToLand({
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
            moveLandTiles({
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
              drawObject2D({
                rect,
                object2d: genesisRef.current.follows[index].object2d,
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

      if (selector.mode === SELECT_MODE.OBJECT_2D) {
        selector.rect.follows.forEach((rect) => {
          CanvasUtil.selected(ctx, rect, 'rgba(255,255,255,0.8)');
        });
      } else {
        CanvasUtil.selected(ctx, selector.rect.default);
      }
    },
    [selector, land]
  );

  const { setup: setupDropToDraw } = useDropToDraw({ id: 'canvas' });

  return children({
    register,
    connect: { ...connect, ...setupDropToDraw, cache },
  });
}

export { EditModeBehavior };
