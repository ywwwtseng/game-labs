function AreaHeader({ icon, label, actions }) {
  return (
    <div className="flex items-center p-1">
      {icon}
      <span className="self-center text-xs whitespace-nowrap text-white ml-1 mr-auto">
        {label}
      </span>
      {actions}
    </div>
  );
}

export { AreaHeader };
