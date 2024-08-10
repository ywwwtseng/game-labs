import {
  createContext,
  useEffect,
  useState,
  useContext,
} from 'react';
import { LoaderUtil } from '@/utils/LoaderUtil';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { ImageUtil } from '@/utils/ImageUtil';
import { useQuery } from '@/features/query/QueryClientContext';
import { sql } from '@/sql';

export const SpriteSheetContext = createContext({ spriteSheets: {} });

export const SpriteSheetProvider = ({ children }) => {
  const { data: sprites } = useQuery(sql.sprites.list);
  const [spriteSheets, setSpriteSheets] = useState({});

  useEffect(() => {
    if (sprites.length > 0) {
      Promise.all(
        sprites
          // .filter(({ id }) => !Object.keys(spriteSheets).includes(id))
          .map((spriteSheet) =>
            Promise.all([
              spriteSheet,
              LoaderUtil.loadImage(
                `${window.location.origin}${spriteSheet.file}`,
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

            acc[spriteSheet.id] = {
              image,
              name: spriteSheet.name,
              source: spriteSheet.id,
              tiles,
              sizeIndex,
              transparent: spriteSheet.transparent.split(','),
            };

            return acc;
          }, {});
        })
        .then(setSpriteSheets);
    }
  }, [sprites]);

  return (
    <SpriteSheetContext.Provider value={{ spriteSheets }}>
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
