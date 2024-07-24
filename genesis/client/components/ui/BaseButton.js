import cx from "classnames"

function BaseButton({ className, ...props }) {
  return (
    <button className={cx("focus:outline-none", className)} type="button" {...props} />
  );
}

export { BaseButton };