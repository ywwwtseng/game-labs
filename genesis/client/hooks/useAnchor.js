import { useState, useMemo, useCallback } from "react";
import { getBoundingBox } from "@/helpers/BoundingBox";

const defaultProps = {
  clickAwayListener: false,
};

function useAnchor({ clickAwayListener = false } = defaultProps) {
  const [anchor, setAnchor] = useState(null);
  const close = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    setAnchor(null);

    if (clickAwayListener) {
      window.removeEventListener("click", close);
    }
  }, []);
  const open = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    setAnchor(event.target.getAttribute("data-toggle")
      ? event.target
      : event.target.closest("[data-toggle]")
    );

    if (clickAwayListener) {
      window.addEventListener("click", close);
    }
  }, []);
  const toggle = (event) => {
    if (anchor) {
      close(event);
    } else {
      open(event);
    }
  };
  const bounds = useMemo(() => {
    if (!anchor) {
      return null;
    }

    return getBoundingBox(anchor);
  }, [anchor]);

  return {
    open: Boolean(anchor || bounds),
    bounds,
    toggle,
    close,
  };
}

export { useAnchor };
