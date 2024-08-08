import { BaseDropdown } from '@/components/ui/Dropdown/BaseDropdown';
import { useDropdownState } from '@/hooks/useDropdownState';

function DropDown({ key, value, onChange, options, className, ...props }) {
  const { register } = useDropdownState({
    key,
    value,
    onChange,
    options,
  });

  return (
    <div className="absolute top-1.5 left-1.5 z-20">
      <BaseDropdown
        triggerProps={{
          className
        }}
        {...register}
        {...props}
      />
    </div>
  );
}

export { DropDown };