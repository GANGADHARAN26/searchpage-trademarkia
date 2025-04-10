import React, { useEffect, useRef, ReactNode } from "react";
import classes from "../components/Modal.module.css";
import ReactPortal from "./ReactPortal";

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  handleClose: (event: MouseEvent | TouchEvent) => void;
};

const Modal: React.FC<ModalProps> = ({ children, isOpen, handleClose }) => {
  const modalRef = useRef<HTMLDivElement>(null); // Ref for modal element

  // Effect to handle click outside modal to close
  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      if (!modalRef.current || modalRef.current.contains(event.target as Node)) {
        return;
      }

      handleClose(event);
    }

    document.addEventListener("mousedown", listener); // Mouse click
    document.addEventListener("touchstart", listener); // Touch event

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="timewrapper">
      <div className={classes.modal}>
        <div ref={modalRef} id="modal" className={classes.modalcontent}>
          {children}
        </div>
      </div>
    </ReactPortal>
  );
};

export default Modal;
