import React, { ReactNode } from "react";
import "./style.css";
export interface ModalProps {
  children: ReactNode;
  Footer?: ()  => JSX.Element;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, Footer, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <span>Search Products</span>
          <span className="modal__close-icon" onClick={onClose}>
            <i className="fa fa-close"></i>{" "}
          </span>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
        {Footer ? (
          <Footer />
        ) : (
          <>
            <span>1 Product selected</span>
            <div>
              <button className="btn" onClick={onClose}>Cancel</button>
              <button className="btn">Add</button>
            </div>
            </>
        )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
