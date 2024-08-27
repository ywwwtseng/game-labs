function BaseDropdownItem({ option }) {
  if (option.type === 'divide') {
    return <div className="w-[93%] h-[1px] bg-white/50 my-0.5"></div>;
  }

  return (
    <div
      className="block w-full px-2 py-1 text-xs text-white whitespace-nowrap"
      role="menuitem"
      tabIndex="-1"
      onClick={(event) => {
        if (option.onClick) {
          option.onClick(event, option.id);
        }
      }}
    >
      {option.label}
    </div>
  );
}

export { BaseDropdownItem };
