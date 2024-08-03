import cx from 'classnames';
import { DomUtil } from '@/utils/DomUtil';

function BaseInput({ className, label, ...props }) {
  return (
    <label
      className="block flex items-center py-1 w-18"
      onKeyDown={DomUtil.stopPropagation}
      onKeyUp={DomUtil.stopPropagation}
    >
      <span className="block text-xs text-white mr-2 w-9">{label}</span>
      <input
        className={cx(
          'focus:outline-none text-xs text-white px-1 bg-[#353535] w-28',
          className,
        )}
        {...props}
      />
    </label>
  );
}

export { BaseInput };
