import {
  createContext,
  useEffect,
  useState,
  useContext,
} from 'react';
import useSWR from 'swr';
import { LoaderUtil } from '@/utils/LoaderUtil';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { ImageUtil } from '@/utils/ImageUtil';

export const SpriteSheetContext = createContext({ spriteSheets: {}, object2ds: {} });

export const SpriteSheetProvider = ({ children }) => {
  const { data } = useSWR('/api/sprites');
  const [spriteSheets, setSpriteSheets] = useState({});
  const [object2ds, setObject2Ds] = useState({});


  useEffect(() => {
    if (data && data.list) {
      Promise.all(
        data.list
          // .filter(({ id }) => !Object.keys(spriteSheets).includes(id))
          .map((spriteSheet) =>
            Promise.all([
              spriteSheet,
              LoaderUtil.loadImage(
                `${window.location.origin}${spriteSheet.path}`,
              ),
            ]),
          ),
      )
        .then((spriteSheets) => {
          return spriteSheets.reduce((acc, [spriteSheet, image]) => {
            const sizeIndex = ImageUtil.getSizeIndex(image);

            const tiles = MatrixUtil.create(sizeIndex, ({ x, y }) => {
              const buffer = CanvasUtil.createBufferBySource(
                image,
                x * 16,
                y * 16,
                16,
                16,
              );
              return {
                type: 'tile',
                buffer,
              };
            });

            acc.spriteSheets[spriteSheet.id] = {
              image,
              name: spriteSheet.name,
              source: spriteSheet.id,
              tiles,
              sizeIndex,
              transparent: spriteSheet.transparent.split(','),
            };

            return acc;
          }, { spriteSheets: {}, object2ds: {} });
        })
        .then(({ spriteSheets, object2ds }) => {
          setObject2Ds(object2ds);
          setSpriteSheets(spriteSheets);
        });
    }
  }, [data?.list]);

  return (
    <SpriteSheetContext.Provider value={{ spriteSheets, object2ds }}>
      {children}
    </SpriteSheetContext.Provider>
  );
};

export function useSpriteSheets() {
  const { spriteSheets } = useContext(SpriteSheetContext);
  return spriteSheets;
}

export function useSpriteSheet(source) {
  const { spriteSheets } = useContext(SpriteSheetContext);
  return spriteSheets[source];
}

export function useUpdateSpriteSheets() {
  const { mutate } = useSWR('/api/sprites');
  return mutate;
}
