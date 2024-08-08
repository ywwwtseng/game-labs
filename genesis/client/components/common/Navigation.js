import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text } from '@/components/ui/Text';
import { BaseDropdown } from '@/components/ui/Dropdown/BaseDropdown';
import { CreateLandModal } from '@/components/common/CreateLandModal';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { getBoundingBox } from '@/helpers/BoundingBox';
import { selectedLand } from '@/features/appState/appStateSlice';
import { useModal } from '@/context/ModalContext';
import { useSpriteSheets } from '@/context/SpriteSheetContext';
import { useObject2Ds } from '@/queries/useObject2Ds';
import logo from '@/icon.png';

function Navigation() {
  const land = useSelector(selectedLand);
  const spriteSheets = useSpriteSheets();
  const object2ds = useObject2Ds();

  const [focus, setFocus] = useState(false);
  const [opened, setOpened] = useState(null);
  const { open } = useModal(CreateLandModal);

  const dropdowns = [
    {
      id: 'file',
      label: 'File',
      options: [
        {
          type: 'option',
          label: 'New Land',
          onClick: open,
        },
        {
          type: 'option',
          label: 'Export PNG File',
          onClick: () => {
            CanvasUtil.exportLand({ land, spriteSheets, object2ds });
          },
        },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      options: [
        {
          type: 'option',
          label: 'Genesis Help',
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
    if (land === undefined) {
      openCreateLandModal();
    }
  }, [land]);

  return (
    <>
      <nav className="flex w-full items-center mx-auto px-2 bg-[#1D1D1D]">
        <div className="flex items-center h-full space-x-3 mr-4 rtl:space-x-reverse">
          <img src={logo} alt="logo" />
          <Text weight="medium" size="xs" color="white">
            Genesis
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
