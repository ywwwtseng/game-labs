import { useState } from 'react';
import cx from "classnames";
import { CheckIcon } from "@/components/icon/CheckIcon";

function OperableItem({ checkIcon, selected, label, className, actions, onClick }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={cx(
        "flex items-center cursor-pointer text-xs whitespace-nowrap px-1 w-full h-[20px] odd:bg-[#2B2B2B] hover:text-white",
        {
          "text-zinc-400": !selected,
          "text-white": selected,
        },
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {checkIcon && (
        <div className="w-4 h-4 mr-1">{selected && <CheckIcon />}</div>
      )}
      {label}
      {showActions && (
        <div className="flex items-center ml-auto">
          {actions}
        </div>
      )}
      
    </div>
  );
}

export { OperableItem };
