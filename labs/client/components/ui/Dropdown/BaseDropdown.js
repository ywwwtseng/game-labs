import cx from 'classnames';
import { BaseDropdownItem } from './BaseDropdownItem';

function BaseDropdown({ label, icon, open, options, menuProps = {}, triggerProps = {}, ...props }) {
  return (
    <div className="relative z-40 flex text-left">
      <button
        {...props}
        type="button"
        data-toggle="true"
        className={cx(
          'flex h-full items-center justify-center rounded my-auto text-xs text-white whitespace-nowrap',
          {
            'bg-zinc-700': open,
          },
          triggerProps.className,
        )}
        aria-expanded="true"
        aria-haspopup="true"
      >
        {label}
        {icon && (
          <svg
            className="-mr-1 h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
          {...menuProps}
          className={cx(
            'absolute left-0 top-[100%] z-10 mt-[1px] py-0.5 origin-top-right rounded-md bg-zinc-800 shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none flex flex-col items-center',
            menuProps.className,
          )}
        >
          {options.map((option) => (
            <BaseDropdownItem key={option.label} option={option} />
          ))}
        </div>
      )}
    </div>
  );
}

export { BaseDropdown };
