import cx from "classnames";

function SelectIcon({ size = "4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cx("text-white", `w-${size} h-${size}`)}
      aria-hidden="true"
      role="presentation"
      focusable="false"
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M7 19l4.394-2.59 1.86 4.661a1 1 0 0 0 1.3.558l.499-.2a1 1 0 0 0 .557-1.3l-1.86-4.66L18.5 14 7 2v17z"
        fillRule="evenodd"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export { SelectIcon };
