import { useState, useEffect } from 'react';

import { FileInput } from '@/components/ui/FileInput';
import { AreaHeader } from '@/components/common/AreaHeader';
import { PlusIcon } from '@/components/icon/PlusIcon';
import { GridIcon } from '@/components/icon/GridIcon';
import { GameStructureView } from '@/components/common/EditGameSettingsView/GameStructureView';
import { OperableItem } from '@/components/common/OperableItem';
import { Dropdown } from '@/components/ui/Dropdown/Dropdown';
import { SpriteSheetTileList } from '@/components/common/EditGameSettingsView/SpriteSheetTileList/SpriteSheetTileList';
import { PatternList } from '@/components/common/EditGameSettingsView/PatternList/PatternList';
import {
  useSpriteSheets,
  useUpdateSpriteSheets,
} from '@/context/SpriteSheetContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDropdownState } from '@/hooks/useDropdownState';
import { LoaderUtil } from '@/utils/LoaderUtil';
import { ImageUtil } from '@/utils/ImageUtil';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { CanvasUtil } from '@/utils/CanvasUtil';

function EditGameSettingsView() {
  const spriteSheets = useSpriteSheets();
  const updateSpriteSheets = useUpdateSpriteSheets();
  const [selected, setSelected] = useLocalStorage('selected:spritesheet_or_pattern');

  const { selectedOption, register } = useDropdownState({
    key: 'selected:spritesheets_or_patterns_type',
    options: [
      {
        type: 'option',
        id: 'spritesheets',
        label: 'SpriteSheets',
        actions: () => [
          <FileInput
            key="create-spritesheet"
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
              formData.append('transparent', transparent);
          
              try {
                const response = await fetch('/api/image/upload', {
                  method: 'POST',
                  body: formData,
                });
          
                const result = await response.json();
                if (result.ok) {
                  updateSpriteSheets();
                }
              } catch (error) {
                console.error('Error uploading image:', error);
              }
            }}>
            <PlusIcon />
          </FileInput>,
        ],
        list: () => (
          <div className="flex-1 overflow-y-scroll no-scrollbar">
            {Object.values(spriteSheets).map((spriteSheet) => (
              <OperableItem
                key={spriteSheet.source}
                checkIcon
                selected={selected === spriteSheet.source}
                onClick={() =>
                  setSelected(
                    selected === spriteSheet.source
                      ? null
                      : spriteSheet.source,
                  )
                }
                label={spriteSheet.name}
              />
            ))}
          </div>
        ),
        detail: () => (
          <div className="rounded w-full flex-1 bg-[#282828] mt-1 flex flex-col">
            {spriteSheets[selected] && (
              <SpriteSheetTileList
                key={selected}
                source={selected}
              />
            )}
          </div>
        )
      },
      {
        type: 'option',
        id: 'patterns',
        label: 'Patterns',
        list: () => (
          <OperableItem
            key="all"
            checkIcon
            selected
            onClick={() => {}}
            label="All"
          />
        ),
        detail: () => (
          <div className="rounded w-full flex-1 bg-[#282828] mt-1 flex flex-col">
            <PatternList type={selected} />
          </div>
        )
      },
    ]
  });

  useEffect(() => {
    if (selectedOption.id === 'spritesheets' && !selected) {
      const spriteSheet = Object.values(spriteSheets)[0];

      if (spriteSheet) {
        setSelected(spriteSheet.source);
      }
    }

  }, [selectedOption, selected, spriteSheets]);

  return (
    <div className="relative rounded w-64 h-full max-h-full flex flex-col ml-1 z-10">
      <GameStructureView />
      <div className="flex flex-col rounded w-full max-h-[124px] h-[124px] bg-[#282828] mt-1">
        <AreaHeader
          icon={<GridIcon />}
          label={<Dropdown icon {...register} />}
          actions={selectedOption.actions?.()}
        />
        {selectedOption.list?.()}
      </div>
      {selectedOption?.detail?.()}
    </div>
  );
}

export { EditGameSettingsView };
