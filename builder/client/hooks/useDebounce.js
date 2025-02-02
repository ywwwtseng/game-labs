import { useMemo } from 'react';

function debounce(callback, timeout = 500) {
  let timer;
  
  return (...arg) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(this, arg);
    }, timeout);
  }
}

function useDebounce(callback) {
  return useMemo(() => debounce((...args) => callback(...args)), []);
}

export { useDebounce };