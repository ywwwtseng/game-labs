import { useRef } from 'react';
import { useObservableRef } from '@/hooks/useObservableRef';
import { getBoundingBox } from '@/helpers/BoundingBox';
import { useCursorDelta } from '@/hooks/useCursorDelta';
import { EventUtil } from '@/utils/EventUtil';

function useCursor({ icon, onDownMoveStart, onDownMoveEnd, onMove, onDownMove }) {
  const cursorDelta = useCursorDelta();
  const isPressRef = useRef(false);
  const iconElRef = useRef(null);
  const upHandlerRef = useRef(null);
  const moveHandlerRef = useRef(null);
  const iconRef = useObservableRef(icon);

  const onMouseMove = (event) => {
    EventUtil.stop(event);

    if (iconRef.current && iconRef.current.display) {
      if (!iconElRef.current) {
        iconElRef.current = iconRef.current.display(event, iconRef.current.id);
        document.body.append(iconElRef.current);
      }

      if (iconElRef.current.id !== iconRef.current.id) {
        iconElRef.current.remove();
        iconElRef.current = iconRef.current.display(
          event,
          displayIdRef.current,
        );
        document.body.append(iconElRef.current);
      }

      const bounds = getBoundingBox(iconElRef.current);
      const position = {
        x: event.pageX - bounds.size.x / 2,
        y: event.pageY - bounds.size.y / 2,
      };
      iconElRef.current.style.left = `${position.x}px`;
      iconElRef.current.style.top = `${position.y}px`;
      iconElRef.current.style.pointerEvents = 'none';
      iconElRef.current.style.position = 'fixed';
      iconElRef.current.style.zIndex = 9999;
    }

    const { delta } = cursorDelta.move(event);

    if (isPressRef.current) {
      onDownMove?.(event, { delta, iconEl: iconElRef.current });
    }

    onMove?.(event, { delta, iconEl: iconElRef.current });
  };

  const onMouseEnter = (event) => {
    EventUtil.stop(event);
    moveHandlerRef.current = onMouseMove;
    window.addEventListener('mousemove', moveHandlerRef.current);
  };

  const onMouseLeave = (event) => {
    EventUtil.stop(event);

    if (iconElRef.current) {
      iconElRef.current.remove();
      iconElRef.current = null;
    }

    if (moveHandlerRef.current) {
      window.removeEventListener('mousemove', moveHandlerRef.current);
      moveHandlerRef.current = null;
    }
  };

  const onMouseUp = (event) => {
    EventUtil.stop(event);

    onDownMoveEnd?.(event);
    cursorDelta.end(event);

    isPressRef.current = false;

    // if (iconElRef.current) {
    //   iconElRef.current.remove();
    //   iconElRef.current = null;
    // }

    if (upHandlerRef.current) {
      document.removeEventListener('mouseup', upHandlerRef.current);
    }
  };

  const onMouseDown = (event) => {
    EventUtil.stop(event);
    
    onDownMoveStart?.(event);

    isPressRef.current = true;

    cursorDelta.start(event);

    if (isPressRef.current) {
      onDownMove?.(event, { delta: null, iconEl: iconElRef.current });
    }

    onMove?.(event, { delta: null, iconEl: iconElRef.current });

    upHandlerRef.current = onMouseUp;
    document.addEventListener('mouseup', upHandlerRef.current);
  };

  return {
    setup: {
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
    },
  };
}

export { useCursor };
