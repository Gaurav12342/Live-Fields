import { Modal, ModalBody } from "react-bootstrap";
import React, { useState } from "react";
function Photo(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      {React.cloneElement(props.children, { onClick: handleShow })}

      <Modal
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.file.title}</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <div>
            <img alt="livefield" src={props.file.file}
              width="100px" className="image-full" />
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}
export default Photo;


