import { useEffect, useState, useMemo } from 'react';

function useLocalStorage(key, defaultValue) {
  const itemKey = useMemo(() => {
    return key ? `genesis:${key}` : undefined;
  }, []);

  const [_state, _setState] = useState(
    (itemKey && localStorage.getItem(itemKey)) || defaultValue,
  );

  const state = useMemo(() => {
    return ['null', 'undefined'].includes(_state) ? undefined : _state;
  }, [_state]);

  const setState = (value) => {
    if (itemKey) {
      localStorage.setItem(itemKey, value);
    }
    _setState(value);
  };

  useEffect(() => {
    if (itemKey && defaultValue && !localStorage.getItem(itemKey)) {
      localStorage.setItem(itemKey, defaultValue);
    }
  }, [itemKey, defaultValue]);

  return [state, setState];
}

export { useLocalStorage };
