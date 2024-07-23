import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "@/store/AppContext";
import { Text } from "@/components/ui/Text";
import { Dropdown } from "@/components/ui/Dropdown/Dropdown";
import { CreateSceneModal } from "@/components/common/CreateSceneModal";
import { useExportPng } from "@/hooks/useExportPng";
import { BoundingBox } from "@/helpers/BoundingBox";

function Navigation() {
  const { state } = useContext(AppContext);
  const [focus, setFocus] = useState(false);
  const [opened, setOpened] = useState(null);
  const [createSceneModal, setCreateSceneModal] = useState({ open: false });
  const exportPng = useExportPng();

  const dropdowns = [
    {
      id: "file",
      label: "File",
      options: [
        {
          type: "option",
          label: "New Scene",
          onClick: () => {
            setCreateSceneModal({ open: true });
          },
        },
        {
          type: "option",
          label: "Export PNG File",
          onClick: exportPng,
        },
      ],
    },
    {
      id: "help",
      label: "Help",
      options: [
        {
          type: "option",
          label: "Spritecraft Help",
        },
      ],
    },
  ];

  const closeDropdown = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpened(null);

    if (event.type === "click") {
      setFocus(false);
      window.removeEventListener("click", closeDropdown);
    }
  }, []);

  const openDropdown = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    setOpened(event.target.id);

    if (event.type === "click") {
      setFocus(true);
      window.addEventListener("click", closeDropdown);
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
    [opened]
  );

  useEffect(() => {
    if (state.scene === undefined) {
      setCreateSceneModal({ open: true });
    }
  }, [state.scene]);

  return (
    <nav className="bg-[#1D1D1D]">
      <div className="flex flex-wrap items-center mx-auto px-2">
        <div className="flex items-center space-x-3 mr-4 rtl:space-x-reverse">
          <svg
            className="w-4 h-4 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 7h.01m3.486 1.513h.01m-6.978 0h.01M6.99 12H7m9 4h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 3.043 12.89 9.1 9.1 0 0 0 8.2 20.1a8.62 8.62 0 0 0 3.769.9 2.013 2.013 0 0 0 2.03-2v-.857A2.036 2.036 0 0 1 16 16Z"
            />
          </svg>

          <Text weight="medium" size="xs" color="white">
            Spritecraft
          </Text>
        </div>

        {dropdowns.map((dropdown) => (
          <Dropdown
            key={dropdown.id}
            id={dropdown.id}
            label={dropdown.label}
            options={dropdown.options}
            open={opened === dropdown.id}
            onClick={toggleDropdown}
            onMouseEnter={(event) => {
              if (focus) {
                openDropdown(event);
              }
            }}
            onMouseLeave={(event) => {
              const bounds = new BoundingBox(event.target);
              if (
                event.pageY &&
                event.pageY > bounds.size.y
              ) {
                return;
              }

              closeDropdown(event);
            }}
          />
        ))}
      </div>
      {createSceneModal.open && (
        <CreateSceneModal
          onClose={() => setCreateSceneModal({ open: false })}
        />
      )}
    </nav>
  );
}

export { Navigation };
