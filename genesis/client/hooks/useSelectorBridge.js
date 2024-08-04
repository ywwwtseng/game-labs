import { useCallback, useRef } from 'react';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { contain, overlaps } from '@/helpers/BoundingBox';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { Vec2Util } from '@/utils/Vec2Util';

function useSelectorBridge({
  canvasId,
  selectedWhenMouseLeave,
  draggable = false,
  icon = null,
  selector,
  cursorIndex,
  selectAreaStart,
  selectArea,
  selectAreaStop,
  setCursorIndex,
  onMoveDown = () => {},
  onMoveDownEnd = () => {},
  onSelected = () => {},
}) {
  const isPressRef = useRef(false);
  const hasMoveDownBehaviorRef = useRef(false);
  const ref = useRef(null);
  const { dataTransfer, handleMouseDown } = useDragAndDrop({
    icon,
    beforeDrop: (_, { iconEl }) => {
      if (ref.current && iconEl && overlaps(ref.current, iconEl)) {
        return false;
      }

      return true;
    },
  });

  const onMouseDown = useCallback(
    (event) => {
      if (draggable && selector.rect.default) {
        const group =
          !selector.rect.follows || selector.rect.follows.length === 0
            ? [selector.rect.default]
            : selector.rect.follows;
        if (
          group.some((rect) =>
            contain(event, { in: { rect, with: canvasId } })
          )
        ) {
          isPressRef.current = true;

          dataTransfer.setData({
            genesis: {
              default: {
                rect: selector.rect.default,
                follow: CanvasUtil.createFollowCursor({
                  event,
                  rect: selector.rect.default,
                  groupRect: CanvasUtil.getGroupRect(group),
                  canvas: canvasId,
                }),
              },
              follows: selector.rect.follows.map((rect) => ({
                rect,
                follow: CanvasUtil.createFollowIndex({
                  index: [selector.rect.default[0], selector.rect.default[1]],
                  rect,
                }),
              })),
            },
          });
      
          handleMouseDown(event);
          return;
        }
      }

      selectAreaStart(cursorIndex ? [...cursorIndex, 1, 1] : null);
    },
    [draggable, selector, cursorIndex]
  );

  const onMouseMove = useCallback(
    (event) => {
      event.target.style.cursor = 'default';

      const pos = CanvasUtil.getPosition(event, canvasId);
      const index = CanvasUtil.positionToIndex(pos);

      if (pos.within) {
        setCursorIndex(index);
      }

      const group =
        !selector.rect.follows || selector.rect.follows.length === 0
            ? [selector.rect.default]
            : selector.rect.follows;

      if (
        draggable &&
        group.some((rect) => contain(event, { in: { rect, with: canvasId } }))
      ) {
        event.target.style.cursor = 'pointer';
      }

      // 正在選取
      if (selector.progress && selector.rect.default) {
        const dx = index[0] - selector.rect.default[0];
        const dy = index[1] - selector.rect.default[1];

        selectArea({
          default: [
            selector.rect.default[0],
            selector.rect.default[1],
            dx > 0 ? dx + 1 : dx === 0 ? 1 : dx - 1,
            dy > 0 ? dy + 1 : dy === 0 ? 1 : dy - 1,
          ],
          follows: [],
        }, 'mousemove');
      } else if (isPressRef.current === true) {
        hasMoveDownBehaviorRef.current = true;
        const { genesis } = dataTransfer.getData();

        if (Vec2Util.diff(selector.rect.default, index)) {
          const next = genesis.default.follow({event});

          selectArea({
            default: next,
            follows: selector.rect.follows.map((_, index) =>
              genesis.follows[index].follow(next)
            ),
          }, 'mosuemove');
          onMoveDown({
            default: {
              genesis: genesis.default.rect,
              next,
            },
            follows: selector.rect.follows.map((_, index) => ({
              genesis: genesis.follows[index].rect,
              next: genesis.follows[index].follow(next),
            })),
          });
        }
      }
    },
    [draggable, selector]
  );

  const onMouseUp = useCallback(
    (event) => {
      if (isPressRef.current === true) {
        isPressRef.current = false;
      }

      if (hasMoveDownBehaviorRef.current === true) {
        const { genesis } = dataTransfer.getData();
        const next = genesis.default.follow({ event });
        onMoveDownEnd({
          default: {
            genesis: genesis.default.rect,
            next,
          },
          follows: selector.rect.follows.map((_, index) => ({
            genesis: genesis.follows[index].rect,
            next: genesis.follows[index].follow(next),
          })),
        });
        hasMoveDownBehaviorRef.current = false;
      } else {
        const rect = CanvasUtil.normalizeRect(selector.rect.default);
        selectArea({ default: rect, follows: [] }, 'mouseup');
        onSelected({
          default: rect,
        });
      }

      selectAreaStop();


      dataTransfer.setData(null);
    },
    [selector]
  );

  const onMouseLeave = useCallback(
    (event) => {
      event.target.style.cursor = 'default';
      setCursorIndex(null);

      if (selector.progress && selectedWhenMouseLeave) {
        const rect = CanvasUtil.normalizeRect(selector.rect.default);

        onSelected({
          default: rect,
        });
        selectArea({ default: rect, follows: [] }, 'mouseleave');
        selectAreaStop();
      }
    },
    [selector]
  );

  const onClick = useCallback(
    (event) => {
      if (event.detail === 2 && !selector.progress) {
        if (selector.rect.default) {
          onSelected({
            default: null,
          });
          selectAreaStart(null);
        }
      }
    },
    [selector]
  );

  return {
    selector,
    cursorIndex,
    register: {
      ref,
      onMouseMove,
      onMouseDown,
      onMouseUp,
      onClick,
    },
    connect: {
      onMouseLeave,
    },
  };
}

export { useSelectorBridge };
