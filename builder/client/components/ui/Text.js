import cx from 'classnames';

function Text({
  children,
  size = 'xs',
  color = 'white',
  weight = 'normal',
  className,
  ...props
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
      {...props}
    >
      {children}
    </span>
  );
}

export { Text };
