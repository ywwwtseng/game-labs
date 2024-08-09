import cx from 'classnames';
import { Text } from '@/components/ui/Text';

function Chip({ bg = 'bg-blue-500', children }) {
  return (
    <div
      className={cx(bg, 'relative grid select-none items-center whitespace-nowrap rounded-[9999px] py-0.5 px-2 font-sans text-xs w-fit uppercase text-white')}>
      <Text>{children}</Text>
    </div>
  );
}

export { Chip };