import { useCallback } from "react";
import { useSelector } from 'react-redux';

function useExportPng() {
  const scene = useSelector(state => state.appState.scene);
  const spriteSheets = useSelector(state => state.appState.spriteSheets);

  const exportPng = useCallback(() => {
    if (!scene) return;

    const canvas = document.createElement("canvas");
    canvas.width = scene.width;
    canvas.height = scene.height;
    const ctx = canvas.getContext("2d");

    scene.layers.forEach((layer) => {
      layer.tiles.forEach((column, x) => {
        column.forEach((value, y) => {
          if (value) {
            ctx.drawImage(
              spriteSheets[value.path].image,
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
    });

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${scene.name}.png`;
    link.click();
  }, [scene, spriteSheets]);

  return exportPng;
}

export { useExportPng };