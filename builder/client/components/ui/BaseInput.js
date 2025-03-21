import cx from 'classnames';
import { EventUtil } from '@/utils/EventUtil';

function BaseInput({ className, label, ...props }) {
  return (
    <label
      className="block flex items-center py-1 w-18"
      onKeyDown={EventUtil.stopPropagation}
      onKeyUp={EventUtil.stopPropagation}
    >
      <span className="block text-xs text-white whitespace-nowrap mr-2 min-w-9">{label}</span>
      <input
        className={cx(
          'focus:outline-none text-xs text-white px-1 bg-[#353535] w-28 ml-auto',
          className,
        )}
        {...props}
      />
    </label>
  );
}

export { BaseInput };
