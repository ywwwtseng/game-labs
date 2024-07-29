function SpriteToolGallery({ spriteSheets, onClick }) {
  return (
    <div
      className="p-2 max-h-[224px] h-[224px] overflow-y-scroll no-scrollbar"
    >
      <div className="grid grid-cols-3 gap-2 grid-rows-3">
        {Object.values(spriteSheets).map((spriteSheet) => (
          <div
            key={spriteSheet.source}
            className="cursor-pointer bg-[#353535]"
            onClick={() => onClick(spriteSheet.source)}
          >
            <img
              className="w-16 h-16 object-scale-down"
              src={spriteSheet.image.src}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export { SpriteToolGallery };
