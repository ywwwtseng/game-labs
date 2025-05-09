import { useEffect } from 'react';

import { FileInput } from '@/components/ui/FileInput';
import { AreaHeader } from '@/components/common/AreaHeader';
import { CirclePlusIcon } from '@/components/icon/CirclePlusIcon';
import { GridIcon } from '@/components/icon/GridIcon';
import { GameStructureView } from '@/components/common/EditGameSettingsView/GameStructureView';
import { OperableItem } from '@/components/common/OperableItem';
import { BaseDropdown } from '@/components/ui/Dropdown/BaseDropdown';
import { SpriteSheetTileList } from '@/components/common/EditGameSettingsView/SpriteSheetTileList/SpriteSheetTileList';
import { Object2DList } from '@/components/common/EditGameSettingsView/Object2DList/Object2DList';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDropdownState } from '@/hooks/useDropdownState';
import { CreateSpriteSheetInput } from '@/components/common/CreateSpriteSheetInput';

function EditGameSettingsView() {
  const spriteSheets = useSpriteSheets();
  const [selected, setSelected] = useLocalStorage('selected:spritesheet_or_object2d');

  const { selectedOption, register } = useDropdownState({
    key: 'selected:spritesheets_or_object2ds_type',
    options: [
      {
        type: 'option',
        id: 'spritesheets',
        label: 'SpriteSheets',
        actions: () => [
          <CreateSpriteSheetInput key="create-spritesheet-input">
            <CirclePlusIcon />
          </CreateSpriteSheetInput>,
        ],
        list: () => (
          <div className="flex-1 overflow-y-scroll no-scrollbar">
            {Object.values(spriteSheets).map((spriteSheet) => (
              <OperableItem
                className="px-1"
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
        detail: () => spriteSheets[selected] && (
          <SpriteSheetTileList
            key={selected}
            source={selected}
          />)
        },
      {
        type: 'option',
        id: 'object2ds',
        label: 'Object2Ds',
        list: () => (
          <OperableItem
            className="px-1"
            key="all"
            checkIcon
            selected
            onClick={() => {}}
            label="All"
          />
        ),
        detail: () => (
          <Object2DList type={selected} />
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
    <div className="relative rounded w-[220px] h-full max-h-full flex flex-col ml-1 z-10">
      <GameStructureView />
      <div className="flex flex-col rounded w-full max-h-[124px] h-[124px] bg-[#282828] mt-1">
        <AreaHeader
          icon={<GridIcon />}
          label={<BaseDropdown icon {...register} />}
          actions={selectedOption.actions?.()}
        />
        {selectedOption.list?.()}
      </div>
      <div id="settings-area" className="relative rounded w-full flex-1 bg-[#282828] mt-1 flex flex-col">
        {selectedOption?.detail?.()}
      </div>
    </div>
  );
}

export { EditGameSettingsView };
