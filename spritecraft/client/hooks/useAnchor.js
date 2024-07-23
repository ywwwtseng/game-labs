import {  useState, useMemo } from "react";

function useAnchor() {
  const [anchor, setAnchor] = useState(null);
  const close = () => setAnchor(null);
  const toggle = (event) => {
    setAnchor(anchor ? null : event.target.getAttribute("data-toggle") ? event.target : event.target.closest("div"))
  };
  const open = Boolean(anchor);
  const origin = useMemo(() => {
    if (!anchor) {
      return {
        left: 0,
        top: 0
      };
    }

    const bounds = anchor.getBoundingClientRect();

    return {
      left: `${bounds.right + 4}px`,
      top: `${bounds.top}px`,

    };
  }, [anchor]);

  return {
    open,
    origin,
    toggle,
    close,
  };
}

export { useAnchor };