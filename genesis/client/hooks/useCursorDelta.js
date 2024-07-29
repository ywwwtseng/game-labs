import { useMemo, useRef } from "react";

function useCursorDelta() {
  const startingPointRef = useRef(null);
  const previousPointRef = useRef(null);

  return useMemo(() => ({
    start: (event) => {
      startingPointRef.current = {
        x: event.pageX,
        y: event.pageY,
      };

      previousPointRef.current = {
        x: event.pageX,
        y: event.pageY,
      };
    },
    move: (event) => {
      let delta = null;
      let deltaTotal = null;

      if (startingPointRef.current) {
        deltaTotal = {
          x: event.pageX - startingPointRef.current.x,
          y: event.pageY - startingPointRef.current.y,
        };
      }

      if (previousPointRef.current) {
        delta = {
          x: event.pageX - previousPointRef.current.x,
          y: event.pageY - previousPointRef.current.y,
        };

        previousPointRef.current = {
          x: event.pageX,
          y: event.pageY,
        };
      }

      return {
        delta,
        deltaTotal,
      }
    },
    end: (event) => {
      startingPointRef.current = previousPointRef.current = null;
    }
  }), []);
}

export { useCursorDelta };