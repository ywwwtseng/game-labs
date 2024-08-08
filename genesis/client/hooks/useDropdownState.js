import { useAnchor } from '@/hooks/useAnchor';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function useDropdownState({ key, options, value, onChange }) {
  const { open, toggle } = useAnchor({ clickAwayListener: true, identity: 'data-toggle' });
  const [selected, setSelected] = useLocalStorage(key, value || options[0].id);
  const selectedOption = options.find((option) => option.id === selected);

  return {
    selectedOption,
    register: {
      open,
      label: selectedOption.label,
      options: options.map((option) => ({
        ...option,
        onClick: () => {
          setSelected(option.id);
          onChange?.(option.id);
        }
      })),
      onClick: toggle,
    }
  }
}

export { useDropdownState };