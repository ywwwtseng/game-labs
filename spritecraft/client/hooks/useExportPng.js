import { useCallback, useContext } from "react";
import { AppContext } from "@/store/AppContext";

function useExportPng() {
  const { state } = useContext(AppContext);

  const exportPng = useCallback(() => {
    if (!state.scene) return;

    const canvas = document.createElement("canvas");
    canvas.width = state.scene.width;
    canvas.height = state.scene.height;
    const ctx = canvas.getContext("2d");

    state.scene.tiles.layers[0].forEach((column, x) => {
      column.forEach((value, y) => {
        if (value) {
          ctx.drawImage(
            state.spriteSheets[value.filename].image,
            value.index[0] * 16,
            value.index[1] * 16,
            16,
            16,
            x * 16,
            y * 16,
            16,
            16
          );
        }
      });
    });

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${state.scene.name}.png`;
    link.click();
  }, [state.scene]);

  return exportPng;
}

export { useExportPng };