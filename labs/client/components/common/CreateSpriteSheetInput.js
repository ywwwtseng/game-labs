import { FileInput } from '@/components/ui/FileInput';
import { LoaderUtil } from '@/utils/LoaderUtil';
import { ImageUtil } from '@/utils/ImageUtil';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { useMutation } from '@/hooks/useMutation';
import { sql } from '@/sql';

function CreateSpriteSheetInput({ className, children }) {
  const createSprite = useMutation(sql.sprites.create);

  return (
    <FileInput
      className={className}
      filetypes={['image/png']}
      onChange={async (file) => {
        const image = await LoaderUtil.readFile(file).then(LoaderUtil.loadImage);
        const sizeIndex = ImageUtil.getSizeIndex(image);
    
        const transparent = [];
    
        MatrixUtil.traverse(sizeIndex, ({ x, y }) => {
          const buffer = CanvasUtil.createBufferBySource(
            image,
            x * 16,
            y * 16,
            16,
            16,
          );
          if (buffer.toDataURL() === CanvasUtil.transparent) {
            transparent.push(`${x}.${y}`);
          }
        });
    
        const formData = new FormData();
        formData.append('image', file);
        formData.append('data.sprite.id', 'relate(file)');
        formData.append('data.sprite.name', file.name.replace('.png', ''));
        formData.append('data.sprite.transparent', transparent);
    
        createSprite.mutate({
          formData
        });
      }}>
      {children}
    </FileInput>
  );
}

export { CreateSpriteSheetInput }
