function DropdownItem({ option }) {
  if (option.type === 'divide') {
    return (<div className="w-[208px] h-[1px] bg-white/50 my-0.5"></div>);
  }

  return (
    <div
      className="block w-full px-2 py-1 text-xs text-white" role="menuitem" 
      tabIndex="-1"
      onClick={(event) => {
        // event.preventDefault();
        // event.stopPropagation();

        if (option.onClick) {
          option.onClick(event);
        }

      }}>
      {option.label}
    </div>
  );
}

export { DropdownItem };