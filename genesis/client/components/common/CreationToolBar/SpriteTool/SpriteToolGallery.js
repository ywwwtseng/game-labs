import cx from 'classnames';
import { SpriteToolPalette } from '@/components/common/CreationToolBar/SpriteTool/SpriteToolPalette';

function SpriteToolGallery({ selectedSource, spriteSheets, onClick }) {
  return (
    <div
      className={cx('p-2', {
        'max-h-[224px] h-[224px] min-w-[224px] overflow-y-scroll no-scrollbar':
          !selectedSource,
      })}
      style={
        selectedSource
          ? {
              width: `${spriteSheets[selectedSource].sizeIndex[0] * 16 + 1 + 32}px`,
              maxWidth: `${spriteSheets[selectedSource].sizeIndex[0] * 16 + 1 + 32}px`,
            }
          : {}
      }
    >
      <div
        className={cx({
          'grid grid-cols-3 gap-2 grid-rows-3': !selectedSource,
          'flex items-center gap-2 overflow-x-scroll no-scrollbar px-2 pb-2': selectedSource,
        })}
      >
        {Object.values(spriteSheets).map((spriteSheet) => (
          <div
            key={spriteSheet.source}
            className="cursor-pointer bg-[#353535]"
            onClick={() => onClick(spriteSheet.source === selectedSource ? null : spriteSheet.source)}
          >
            <img
              className={cx('object-scale-down', {
                'border-1 border-white': true,
                'w-16 h-16': !selectedSource,
                'min-w-8 h-8': selectedSource && spriteSheet.source === selectedSource,
                'min-w-7 max-h-7 opacity-60': selectedSource && spriteSheet.source !== selectedSource
              })}
              src={spriteSheet.image.src}
              draggable="false"
            />
          </div>
        ))}
      </div>
      {selectedSource && (
        <SpriteToolPalette
          key={selectedSource}
          spriteSheet={spriteSheets[selectedSource]}
        />
      )}
    </div>
  );
}

export { SpriteToolGallery };
