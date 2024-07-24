import { useState, useMemo } from "react";
import { BoundingBox } from "@/helpers/BoundingBox";

function useAnchor() {
  const [anchor, setAnchor] = useState(null);
  const close = () => setAnchor(null);
  const toggle = (event) => {
    setAnchor(
      anchor
        ? null
        : event.target.getAttribute("data-toggle")
        ? event.target
        : event.target.closest("div")
    );
  };
  const bounds = useMemo(() => {
    if (!anchor) {
      return null;
    }

    return new BoundingBox(anchor);
  }, [anchor]);

  const open = Boolean(anchor || bounds);

  return {
    open,
    bounds,
    toggle,
    close,
  };
}

export { useAnchor };
