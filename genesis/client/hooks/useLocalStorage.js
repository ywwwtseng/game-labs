import { useEffect, useState } from "react"

function useLocalStorage(key, defaultValue) {
  const itemKey = `genesis:${key}`;
  const [state ,_setState] = useState(localStorage.getItem(itemKey) || defaultValue);

  const setState = (value) => {
    localStorage.setItem(itemKey, value);
    _setState(value);
  };

  useEffect(() => {
    if (!localStorage.getItem(itemKey)) {
      localStorage.setItem(itemKey, defaultValue);
    }
  }, [defaultValue]);

  return [state, setState];
}

export { useLocalStorage };