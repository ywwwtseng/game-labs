import cx from "classnames"
import { DropdownItem } from "./DropdownItem"

function Dropdown({ label, icon, open, options, ...props }) {
  return (
    <div className="relative inline-block text-left">
      <button 
        {...props}
        type="button"
        className={cx("inline-flex w-full items-center justify-center rounded bg-[#1D1D1D] px-2 py-1 text-xs text-white", {'bg-zinc-700': open})} aria-expanded="true" aria-haspopup="true">
        {label}
        {icon && (
          <svg className="-mr-1 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">2222
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-[1px] py-0.5 w-56 origin-top-right rounded-md bg-zinc-800 shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none flex flex-col items-center" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
          {options.map((option) => (
            <DropdownItem key={option.label} option={option} />
          ))}
        </div>
      )}
    </div>
  )
}

export { Dropdown }