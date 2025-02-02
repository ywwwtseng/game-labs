import cx from 'classnames';
import { CheckIcon } from '@/components/icon/CheckIcon';

function OperableItem({
  checkIcon,
  selected,
  label,
  className,
  actions,
  onClick,
}) {
  return (
    <div
      className={cx(
        'group flex items-center cursor-pointer text-xs whitespace-nowrap w-full min-h-[20px] odd:bg-[#2B2B2B] hover:text-white',
        {
          'text-zinc-400': !selected,
          'text-white': selected,
        },
        className,
      )}
      onClick={onClick}>
      {checkIcon && (
        <div className="w-4 h-4 mr-1">{selected && <CheckIcon />}</div>
      )}
      {label}
      <div className="flex items-center ml-auto hidden group-hover:block">{actions}</div>
    </div>
  );
}

export { OperableItem };
