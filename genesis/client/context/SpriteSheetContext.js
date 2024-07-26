import {
  createContext,
  useEffect,
  useCallback,
  useState,
  useContext,
} from "react";
import useSWR from "swr";
import { produce } from "immer";
import { LoaderUtil } from "@/utils/LoaderUtil";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

export const SpriteSheetContext = createContext({});

export const SpriteSheetProvider = ({ children }) => {
  const { data } = useSWR("/api/sprites");
  const [spriteSheets, setSpriteSheets] = useState({});

  const updateSpriteSheets = useCallback((spriteSheets) => {
    setSpriteSheets(produce((draft) => {
      Object.assign(draft, spriteSheets);
    }));
  }, []);
  

  useEffect(() => {
    if (data && data.filenames) {
      Promise.all(
        data.filenames
          .filter(
            (filename) => !Object.keys(spriteSheets).includes(filename)
          )
          .map((filename) =>
            Promise.all([
              filename,
              LoaderUtil.loadImage(
                `${window.location.origin}/sprites/${filename}`
              ),
            ])
          )
      )
        .then((spriteSheets) => {
          return spriteSheets.reduce((acc, [filename, image]) => {
            const index = [
              Math.ceil(image.naturalWidth / 16 - 1),
              Math.ceil(image.naturalHeight / 16 - 1),
            ];

            const tiles = MatrixUtil.createByIndex(index, (x, y) => {
              const buffer = CanvasUtil.createBuffer(
                image,
                x * 16,
                y * 16,
                16,
                16
              );
              return {
                type: "tile",
                buffer,
                transparent: buffer.toDataURL() === CanvasUtil.transparent,
              };
            });

            acc[filename] = {
              image,
              filename,
              index,
              tiles,
              // TODO:
              patterns: [],
              animations: [],
            };
            return acc;
          }, {});
        })
        .then(updateSpriteSheets);
    }
  }, [data?.filenames]);

  return <SpriteSheetContext.Provider value={spriteSheets}>{children}</SpriteSheetContext.Provider>;
};

export function useSpriteSheets() {
  const spriteSheets = useContext(SpriteSheetContext);
  return spriteSheets;
}

export function useUpdateSpriteSheets() {
  const { mutate } = useSWR("/api/sprites");
  return mutate;
}
