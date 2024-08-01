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
import { ImageUtil } from "@/utils/ImageUtil";

export const SpriteSheetContext = createContext({});

export const SpriteSheetProvider = ({ children }) => {
  const { data } = useSWR("/api/sprites");
  const [spriteSheets, setSpriteSheets] = useState({});

  const updateSpriteSheets = useCallback((spriteSheets) => {
    setSpriteSheets(
      produce((draft) => {
        Object.assign(draft, spriteSheets);
      })
    );
  }, []);

  useEffect(() => {
    if (data && data.list) {
      Promise.all(
        data.list
          // .filter(({ id }) => !Object.keys(spriteSheets).includes(id))
          .map((spriteSheet) =>
            Promise.all([
              spriteSheet,
              LoaderUtil.loadImage(
                `${window.location.origin}${spriteSheet.path}`
              ),
            ])
          )
      )
        .then((spriteSheets) => {
          return spriteSheets.reduce((acc, [spriteSheet, image]) => {
            const index = ImageUtil.getIndex(image);

            const tiles = MatrixUtil.createByIndex(index, (x, y) => {
              const buffer = CanvasUtil.createBufferBySource(
                image,
                x * 16,
                y * 16,
                16,
                16
              );
              return {
                type: "tile",
                buffer,
              };
            });

            acc[spriteSheet.id] = {
              image,
              name: spriteSheet.name,
              source: spriteSheet.id,
              index,
              tiles,
              transparent: spriteSheet.transparent.split(","),
              patterns: spriteSheet.patterns,
              animations: [],
            };
            return acc;
          }, {});
        })
        .then(updateSpriteSheets);
    }
  }, [data?.list]);

  return (
    <SpriteSheetContext.Provider value={spriteSheets}>
      {children}
    </SpriteSheetContext.Provider>
  );
};

export function useSpriteSheets() {
  const spriteSheets = useContext(SpriteSheetContext);
  return spriteSheets;
}

export function useSpriteSheet(source) {
  const spriteSheets = useContext(SpriteSheetContext);
  return spriteSheets?.[source];
}

export function useUpdateSpriteSheets() {
  const { mutate } = useSWR("/api/sprites");
  return mutate;
}
