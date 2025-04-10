import React, { useEffect, useRef } from "react"; 
import classes from "../components/Modal.module.css"; 
import ReactPortal from "./ReactPortal"; 


function Modal({ children, isOpen, handleClose }) {
  const modalRef = useRef(); // Ref for modal element

  // Effect to handle click outside modal to close
  useEffect(() => {
    function listener(event) {
      if (!modalRef.current || modalRef.current.contains(event.target)) {
        return;
      }

      handleClose(event);
    }

    document.addEventListener("mousedown", listener); // Adding event listener for mouse click
    document.addEventListener("touchstart", listener); // Adding event listener for touch

    return () => {
      document.removeEventListener("mousedown", listener); // Removing event listener for mouse click
      document.removeEventListener("touchstart", listener); // Removing event listener for touch
    };
  }, [handleClose, modalRef]); // Dependencies for effect

  // If modal is not open, return null
  if (!isOpen) return null;

  // Rendering the modal
  return (
    <ReactPortal wrapperId="timewrapper">
      {" "}
      {/* Rendering modal using ReactPortal for better performance */}
      <div className={classes.modal}>
        <div ref={modalRef} id="modal" className={classes.modalcontent}>
          {" "}
          {/* Ref for modal content */}
          {children} {/* Rendering children inside modal */}
        </div>
      </div>
    </ReactPortal>
  );
}
export default Modal; // Exporting Modal component
