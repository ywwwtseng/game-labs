import cx from "classnames";

function CheckIcon({ size = "4", className, ...props }) {
  return (
    <svg
      className={cx("text-white", `w-${size} h-${size}`, className)}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 11.917 9.724 16.5 19 7.5"
      />
    </svg>
  );
}

export { CheckIcon };
