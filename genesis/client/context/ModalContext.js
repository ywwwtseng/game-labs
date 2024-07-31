import {
  Fragment,
  createContext,
  useCallback,
  useState,
  useContext,
} from "react";
import { createPortal } from "react-dom";

export const ModalContext = createContext({
  openModal: () => {},
  closeModal: () => {},
});

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((modal) => {
    setModals(modals => [...modals, modal]);
  }, []);

  const closeModal = useCallback(() => {
    setModals(modals => modals.filter((_, index) => index + 1 !== modals.length));
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      {children}
      {modals.map((modal, index) => (
        <Fragment key={`modal-${index}`}>
          {createPortal(modal, document.body)}
        </Fragment>
      ))}
    </ModalContext.Provider>
  );
};

export const useModal = (Modal, modalProps = {}) => {
  const { openModal } = useContext(ModalContext);

  const open = useCallback(() => {
    openModal(<Modal {...modalProps} />);
  }, []);

  return {
    open,
  };
};

export const useCloseModal = () => {
  const { closeModal } = useContext(ModalContext);
  return closeModal;
};