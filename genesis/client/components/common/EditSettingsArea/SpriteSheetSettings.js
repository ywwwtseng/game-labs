import { memo } from "react";

import { AreaHeader } from "@/components/common/AreaHeader";
import { SpriteSheetTile } from "@/components/common/EditSettingsArea/SpriteSheetTile";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { useTileFill } from '@/hooks/useTileFill';

const SpriteSheetSettings = memo(({ spriteSheet }) => {
  const tileFill = useTileFill();

  return (
    <div className="flex-1 flex flex-col">
      <AreaHeader
        icon={
          <svg
            className="w-4 h-4 text-gray-800 dark:text-white mr-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M20 10H4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8ZM9 13v-1h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"
              clipRule="evenodd"
            />
            <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2Z" />
          </svg>
        }
        title="SpriteSheet Settings"
      />
      <div className="p-1">
        <img
          draggable="false"
          className="object-scale-down w-full h-40"
          src={spriteSheet.image.src}
        />
      </div>
      <div className="flex-1 grow basis-0 overflow-y-scroll no-scrollbar">
        {MatrixUtil.rangeByIndex(spriteSheet.index, (x, y) => (
          <SpriteSheetTile
            key={`${spriteSheet}-[${x},${y}]`}
            spriteSheet={spriteSheet}
            index={[x, y]}
            onTileFill={tileFill}
          />
        ))}
      </div>
    </div>
  );
});

export { SpriteSheetSettings };
