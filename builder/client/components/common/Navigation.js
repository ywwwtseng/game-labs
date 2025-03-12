import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text } from '@/components/ui/Text';
import { BaseDropdown } from '@/components/ui/Dropdown/BaseDropdown';
import { CreateLandModal } from '@/components/common/CreateLandModal';
import { GamePreviewModal } from '@/components/common/GamePreviewModal';
import { CreateSpriteSheetInput } from '@/components/common/CreateSpriteSheetInput';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { getBoundingBox } from '@/helpers/BoundingBox';
import { selectedLand } from '@/features/appState/appStateSlice';
import { useModal } from '@/context/ModalContext';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { useQuery } from '@/hooks/useQuery';
import { sql } from '@/sql';
import logo from '@/icon.png';

function Navigation() {
  const { data: object2ds } = useQuery(sql.object2ds.list);
  const { data: lands } = useQuery(sql.lands.list);
  const land = useSelector(selectedLand);
  const spriteSheets = useSpriteSheets();

  const [focus, setFocus] = useState(false);
  const [opened, setOpened] = useState(null);
  const { open: openCreateLandModal } = useModal(CreateLandModal);
  const { open: openGamePreviewModal } = useModal(GamePreviewModal);

  const dropdowns = [
    {
      id: 'game',
      label: 'Game',
      options: [
        {
          type: 'option',
          label: 'New Land',
          onClick: openCreateLandModal,
        },
        {
          type: 'option',
          label: (
            <CreateSpriteSheetInput className="w-full h-full">
              <Text className="w-full">New SpriteSheet</Text>
            </CreateSpriteSheetInput>
          ),
        },
        {
          type: 'divide',
        },
        {
          type: 'option',
          label: 'Export Land As PNG File',
          onClick: () => {
            CanvasUtil.exportLand({ land, spriteSheets, object2ds });
          },
        },
        {
          type: 'divide',
        },
        {
          type: 'option',
          label: 'Game Review',
          onClick: openGamePreviewModal,
        },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      options: [
        {
          type: 'option',
          label: 'Game Labs Help',
        },
      ],
    },
  ];

  const closeDropdown = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpened(null);

    if (event.type === 'click') {
      setFocus(false);
      window.removeEventListener('click', closeDropdown);
    }
  }, []);

  const openDropdown = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    setOpened(event.target.id);

    if (event.type === 'click') {
      setFocus(true);
      window.addEventListener('click', closeDropdown);
    }
  }, []);

  const toggleDropdown = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!opened) {
        openDropdown(event);
      } else {
        closeDropdown(event);
      }
    },
    [opened],
  );

  useEffect(() => {
    if (lands?.length === 0) {
      openCreateLandModal();
    }
  }, [lands]);
  
  return (
    <>
      <nav className="flex w-full items-center mx-auto px-2 bg-[#1D1D1D]">
        <div className="flex items-center h-full space-x-3 mr-4 rtl:space-x-reverse">
          <img src={logo} draggable="false" alt="logo" />
          <Text weight="medium" size="xs" color="white">
            Game Labs
          </Text>
        </div>

        {dropdowns.map((dropdown) => (
          <BaseDropdown
            key={dropdown.id}
            id={dropdown.id}
            triggerProps={{
              className: 'px-2 py-1'
            }}
            label={dropdown.label}
            options={dropdown.options}
            open={opened === dropdown.id}
            menuProps={{ className: 'w-56' }}
            onClick={toggleDropdown}
            onMouseEnter={(event) => {
              if (focus) {
                openDropdown(event);
              }
            }}
            onMouseLeave={(event) => {
              const bounds = getBoundingBox(event.target);
              if (event.pageY && event.pageY >= bounds.size.y) {
                return;
              }

              closeDropdown(event);
            }}
          />
        ))}
      </nav>
    </>
  );
}

export { Navigation };
