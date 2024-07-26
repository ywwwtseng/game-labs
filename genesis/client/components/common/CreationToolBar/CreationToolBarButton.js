import cx from "classnames";
import { BaseButton } from "@/components/ui/BaseButton";

function CreationToolBarButton({ icon: Icon, disabled, ...props }) {
  return (
    <BaseButton
      className={cx(
        "relative z-20 rounded bg-black/30 p-2 cursor-pointer my-0.5",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
      disabled={disabled}
      {...props}
    >
      <Icon color={disabled ? "text-white/50" : "text-white"} />
    </BaseButton>
  );
}

export { CreationToolBarButton };