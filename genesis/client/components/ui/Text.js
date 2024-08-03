import cx from 'classnames';

function Text({
  children,
  size = 'xs',
  color = 'white',
  weight = 'normal',
  className,
}) {
  return (
    <span
      className={cx(
        'self-center whitespace-nowrap',
        `text-${size}`,
        `text-${color}`,
        `font-${weight}`,
        className,
      )}
    >
      {children}
    </span>
  );
}

export { Text };
