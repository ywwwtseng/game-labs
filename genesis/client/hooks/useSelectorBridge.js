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

  const onMouseMove = useCallback(
    (event) => {
      event.target.style.cursor = 'default';

      const pos = CanvasUtil.getPosition(event, canvasId);
      const index = CanvasUtil.positionToIndex(pos);

      if (pos.within) {
        setCursorIndex(index);
      }

      if (
        draggable &&
        [selector.rect.default, ...selector.rect.follows].some((rect) =>
          contain(event, { in: { rect, with: canvasId } }),
        )
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
          follow: [],
        });
      } else if (isPressRef.current === true) {
        hasMoveDownBehaviorRef.current = true;
        const { genesis } = dataTransfer.getData();

        if (Vec2Util.diff(selector.rect.default, index)) {
          const next = genesis.default.follow({ event, rect: selector.rect.default });

          const predict = ({ rect, follow }) => {
            const { index } = follow(next);

            return [index[0], index[1], rect[2], rect[3]];
          };

          console.log(selector.rect.follows.map((rect, index) =>
            predict({ rect, follow: genesis.follows[index].follow }),
          ))

          

          selectArea({
            default: next,
            follows: selector.rect.follows.map((rect, index) =>
              predict({ rect, follow: genesis.follows[index].follow }),
            ),
          });
          onMoveDown({
            default: {
              genesis: genesis.default.rect,
              next,
            },
            follows: selector.rect.follows.map((rect, index) => ({
              genesis: genesis.follows[index].rect,
              next: predict({ rect, follow: genesis.follows[index].follow }),
            })),
          });
        }
      }
    },
    [draggable, selector],
  );

  const onMouseDown = useCallback(
    (event) => {
      if (draggable && selector.rect.default) {
        if (
          [selector.rect.default, ...selector.rect.follows].some((rect) =>
            contain(event, { in: { rect, with: canvasId } }),
          )
        ) {
          isPressRef.current = true;

          dataTransfer.setData({
            type: 'tiles',
            genesis: {
              default: {
                rect: selector.rect.default,
                follow: CanvasUtil.createFollowCursor({
                  event,
                  rect: selector.rect.default,
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
    [draggable, selector, cursorIndex],
  );

  const onMouseUp = useCallback(
    (event) => {
      dataTransfer.setData(null);

      const rect = CanvasUtil.normalizeRect(selector.rect.default);
      selectArea({ default: rect });
      selectAreaStop();
      onSelected({
        default: rect,
      });

      if (isPressRef.current === true) {
        isPressRef.current = false;

        if (hasMoveDownBehaviorRef.current === true) {
          hasMoveDownBehaviorRef.current = false;
          onMoveDownEnd(event, selector);
        }
      }
    },
    [selector],
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
        selectArea({ default: rect });
        selectAreaStop();
      }
    },
    [selector],
  );

  const onClick = useCallback(
    (event) => {
      if (event.detail === 2) {
        if (selector.rect.default) {
          onSelected({
            default: null,
          });
          selectAreaStart([]);
        }
      }
    },
    [selector],
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
