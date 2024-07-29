import { useRef, useMemo } from "react";

function useDataTransfer({ defaultData } = { defaultData: null }) {
  const dataRef = useRef(defaultData);
  const dataTransfer = useMemo(() => ({
    getData: () => dataRef.current,
    setData: (data) => (dataRef.current = data),
  }), []);

  return dataTransfer;
}

export { useDataTransfer };