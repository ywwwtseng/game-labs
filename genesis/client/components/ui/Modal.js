import { CloseIcon } from "@/components/icon/CloseIcon";
import { BaseButton } from "@/components/ui/BaseButton";
import { Button } from "@/components/ui/Button";
import { useCloseModal } from "@/context/ModalContext";

function Modal({ width, children }) {
  return (
    <div
      className="select-none absolute top-0 left-0 inset-0 z-50 h-full w-full overflow-y-auto"
      data-modal="true"
    >
      <div className="flex h-full min-h-full justify-center text-center items-center">
        <div
          className="relative transform overflow-hidden rounded text-left shadow-xl transition-all bg-[#282828]"
          style={{ width: `${width}px` }}
        >
          <div className="flex flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}

Modal.Header = ({ title, showCloseButton = true }) => {
  const closeModal = useCloseModal();

  return (
    <div className="flex items-center justify-between px-2 py-1 bg-[#1D1D1D]">
      <h3 className="text-xs text-white" id="modal-title">
        {title}
      </h3>
      {showCloseButton && (
        <BaseButton onClick={closeModal}>
          <CloseIcon />
        </BaseButton>
      )}
    </div>
  );
};

Modal.Body = ({ children }) => {
  return <div className="px-2 py-1">{children}</div>;
};

Modal.Footer = ({ children }) => {
  return <div className="px-2 py-1 flex justify-end">{children}</div>;
};

Modal.Action = ({ children, onClick, ...props }) => {
  const closeModal = useCloseModal();

  return (
    <Button
      onClick={() => {
        onClick?.();
        closeModal();
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export { Modal };
