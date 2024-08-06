import { useAnchor } from '@/hooks/useAnchor';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function useDropdownState({ key, options }) {
  const { open, toggle } = useAnchor({ clickAwayListener: true });
  const [selected, setSelected] = useLocalStorage(key, options[0].id);
  const selectedOption = options.find((option) => option.id === selected);

  return {
    selectedOption,
    register: {
      open,
      label: selectedOption.label,
      options: options.map((option) => ({
        ...option,
        onClick: () => setSelected(option.id)
      })),
      onClick: toggle,
    }
  }
}

export { useDropdownState };