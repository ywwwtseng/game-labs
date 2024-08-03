import { useEffect, useState, useMemo } from 'react';

function useLocalStorage(key, defaultValue) {
  const itemKey = `genesis:${key}`;
  const [_state, _setState] = useState(
    localStorage.getItem(itemKey) || defaultValue,
  );

  const state = useMemo(() => {
    return ['null', 'undefined'].includes(_state) ? undefined : _state;
  }, [_state]);

  const setState = (value) => {
    localStorage.setItem(itemKey, value);
    _setState(value);
  };

  useEffect(() => {
    if (defaultValue && !localStorage.getItem(itemKey)) {
      localStorage.setItem(itemKey, defaultValue);
    }
  }, [defaultValue]);

  return [state, setState];
}

export { useLocalStorage };
