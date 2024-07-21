function AreaHeader({ icon, title, actions }) {
  return (
    <div className="flex items-center p-1">
      {icon}
      <span className="self-center text-xs whitespace-nowrap text-white mr-auto">
        {title}
      </span>
      {actions}
    </div>
  );
}

export { AreaHeader };
