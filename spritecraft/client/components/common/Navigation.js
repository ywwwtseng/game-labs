import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "@/store/AppContext";
import { Text } from "@/components/ui/Text";
import { Dropdown } from "@/components/ui/Dropdown/Dropdown";
import { CreateSceneModal } from "@/components/common/CreateSceneModal";
import { useExportPng } from "@/hooks/useExportPng";
import { BoundingBox } from "@/helpers/BoundingBox";
import logo from "@/icon.png";

console.log(logo);
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
          <img src={logo} alt="logo" />

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
              if (event.pageY && event.pageY > bounds.size.y) {
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
