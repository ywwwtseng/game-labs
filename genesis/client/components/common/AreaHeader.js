import cx from 'classnames';

function AreaHeader({ icon, label, actions, className }) {
  return (
    <div className={cx('flex items-center p-1', className)}>
      {icon}
      <span className={cx('self-center text-xs whitespace-nowrap text-white mr-auto', { 'ml-1': icon })}>
        {label}
      </span>
      {actions}
    </div>
  );
}

export { AreaHeader };
