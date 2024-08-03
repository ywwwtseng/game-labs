import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text } from '@/components/ui/Text';
import { Dropdown } from '@/components/ui/Dropdown/Dropdown';
import { CreateSceneModal } from '@/components/common/CreateSceneModal';
import { useExportPng } from '@/hooks/useExportPng';
import { getBoundingBox } from '@/helpers/BoundingBox';
import { useModal } from '@/context/ModalContext';
import logo from '@/icon.png';

function Navigation() {
  const scene = useSelector((state) => state.appState.scene);
  const [focus, setFocus] = useState(false);
  const [opened, setOpened] = useState(null);
  const exportPng = useExportPng();
  const { open } = useModal(CreateSceneModal);

  const dropdowns = [
    {
      id: 'file',
      label: 'File',
      options: [
        {
          type: 'option',
          label: 'New Scene',
          onClick: open,
        },
        {
          type: 'option',
          label: 'Export PNG File',
          onClick: exportPng,
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
    if (scene === undefined) {
      openCreateSceneModal();
    }
  }, [scene]);

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
          <Dropdown
            key={dropdown.id}
            id={dropdown.id}
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
