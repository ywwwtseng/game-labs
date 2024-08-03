import cx from 'classnames';
import { BaseButton } from '@/components/ui/BaseButton';

function Button({ className, ...props }) {
  return (
    <BaseButton
      className={cx(
        'rounded bg-[#1D1D1D] inline-flex px-2 py-1 justify-center text-xs text-white shadow-sm focus:outline-none',
        className,
      )}
      type="button"
      {...props}
    />
  );
}

export { Button };
