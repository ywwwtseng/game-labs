import { createPortal } from "react-dom";

function Menu({ children, ...props }) {
  return (
    createPortal(
      <div className="select-none absolute z-30 rounded bg-[#282828] top-0" {...props}>
        {children}
      </div>,
      document.body
    )
  );
}

export { Menu };