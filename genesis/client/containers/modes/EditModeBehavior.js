import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  cmd,
  deleteSelectedElements,
  selectedLand,
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
  Z_KEY,
} from '@/hooks/useKeyBoard';
import { useSpriteSheets } from '@/features/appState/SpriteSheetContext';
import { useQuery } from '@/hooks/useQuery';
import { sql } from '@/sql';
import { useModal } from '@/context/ModalContext';
import { CreateObject2DModal } from '@/components/common/CreateObject2DModal';
import { EventUtil } from '@/utils/EventUtil';
import { useCache } from '@/hooks/useCache';
import { MoveSelectAreaContext } from '@/helpers/MoveSelectAreaContext';

function EditModeBehavior({ children }) {
  const dispatch = useDispatch();
  const context = useCache(new MoveSelectAreaContext());
  const spriteSheets = useSpriteSheets();
  const land = useSelector(selectedLand);
  const cursorIndex = useSelector(selectedCursorIndex);
  const selector = useSelector(selectedEditModeSelector);
  const { data: object2ds } = useQuery(sql.object2ds.list);

  const { open: openCreateObject2DModal } = useModal(CreateObject2DModal);

  const { isHolding } = useKeyBoard(
    {
      [O_KEY]: (event) => {
        if (selector.mode !== SELECT_MODE.TILE) {
          return;
        }

        if (context.data.default || context.origin.default) {
          return;
        }

        const rect = selector.rect.default;

        if (!rect) {
          return;
        }

        const notEmptyTiles = CanvasUtil.copyLandTiles(rect, land)
          .some((column) => column.some((tile) => tile?.length > 0));

        if (notEmptyTiles) {
          const tiles = CanvasUtil.copyLandTiles(rect, land);
          
          openCreateObject2DModal({ tiles, onSuccess: (res) => {
            dispatch(cmd.tiles.delete({ rect }));
            dispatch(cmd.object2ds.add({
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
        dispatch(cmd.object2ds.depart({
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

        dispatch(cmd.tiles.flat({ rect }));
      },
      [Z_KEY]: (event) => {
        if (event.metaKey && event.shiftKey) {
          EventUtil.stop(event);
          dispatch(cmd.redo());
        } else if (event.metaKey) {
          EventUtil.stop(event);
          dispatch(cmd.undo());
        }
      },
      [ARROW_LEFT_KEY]: (event) => {},
      [ARROW_RIGHT_KEY]: (event) => {},
      [ARROW_UP_KEY]: (event) => {},
      [ARROW_DOWN_KEY]: (event) => {},
      [BACKSPACE_KEY]: (event) => {
        if (!selector.rect.default || !land) return;
        dispatch(deleteSelectedElements());
      },
    },
    [selector.rect.default, land]
  );

  const isDuplicate = () => isHolding(S_KEY);
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
          follows = CanvasUtil.getFollowedSelectedRects(rects.default, land);

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

      context.init(() => {
        context.duplicate = isDuplicate() && !isMoveAddTilesMode();

        if (mode === SELECT_MODE.OBJECT_2D) {
          context.data.follows = rects.follows.map(
            ({ origin: rect }) => {
              const object2d = CanvasUtil.cloneLandSelectedObject2D(rect, land, object2ds);
              return object2d.tiles;
            }
          );

          context.origin.follows = rects.follows.map(
            ({ origin }) => ({
              origin,
              object2d: CanvasUtil.findObject2DBySelectedRect(origin, land),
            })
          );

          if (!context.duplicate) {
            dispatch(cmd.object2ds.delete({ rects: rects.follows.map(({ origin }) => origin) }));
          }
        }

        if (mode === SELECT_MODE.TILE) {
          context.data.default = CanvasUtil.copyLandTiles(
            rects.default.origin,
            land,
          );

          context.origin.default = rects.default.origin;

          if (!context.duplicate) {
            dispatch(cmd.tiles.delete({ rect: rects.default.origin }));
          }
        }
      });

      if (mode === SELECT_MODE.TILE) {
        if (isMoveAddTilesMode()) {
          if (rects.default.next && context.origin.default) {
            dispatch(
              cmd.tiles.add({
                merge: true,
                rect: selector.rect.default,
                tilesMatrix: context.data.default,
              })
            );
          }
        }    
      }
    },
    onMoveDownEnd: () => {
      if (selector.mode === SELECT_MODE.TILE) {
        if (selector.rect.default && context.data.default) {
          dispatch(
            cmd.tiles.add({
              merge: !context.duplicate,
              rect: selector.rect.default,
              tilesMatrix: context.data.default,
            })
          );
        }
      } else {
        if (selector.rect.follows && context.origin.follows) {
          selector.rect.follows.forEach((rect, index) => {
            dispatch(
              cmd.object2ds.add({
                merge: !context.duplicate,
                rect,
                object2d: context.origin.follows[index].object2d,
              })
            );
          });
        }
      }

      context.destroy();
    },
  });

  const cache = useCallback(
    (ctx) => {
      if (selector.rect.default && context.data.default) {
        MatrixUtil.traverse(
          context.data.default,
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

      if (selector.rect.follows && context.data.follows) {
        selector.rect.follows.forEach((rect, index) => {
          MatrixUtil.traverse(
            context.data.follows[index],
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
