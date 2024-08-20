import { useState, useMemo, useCallback } from 'react';
import { getBoundingBox } from '@/helpers/BoundingBox';

const defaultProps = {
  clickAwayListener: false,
  identity: null,
};

function useAnchor({ clickAwayListener = false, identity = null } = defaultProps) {
  const [anchor, setAnchor] = useState(null);
  const close = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    setAnchor(null);

    if (clickAwayListener) {
      window.removeEventListener('click', close);
    }
  }, []);
  const open = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    if (identity) {
      setAnchor(
        event.target.getAttribute(identity) || event.button === 2
          ? event.target
          : event.target.closest(`[${identity}]`),
      );
    } else {
      setAnchor(event);
    }

    if (clickAwayListener) {
      window.addEventListener('click', close);
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
