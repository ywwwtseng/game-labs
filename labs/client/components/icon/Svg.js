import cx from 'classnames';

function Svg({
  size = 4,
  color = 'text-white',
  className,
  style,
  children,
  ...props
}) {
  return (
    <svg
      className={cx(color, className)}
      style={{ width: `${size * 4}px`, height: `${size * 4}px`, ...style }}
      {...props}
    >
      {children}
    </svg>
  );
}

export { Svg };
