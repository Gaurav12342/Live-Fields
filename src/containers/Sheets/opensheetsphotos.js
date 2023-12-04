import { Modal, ModalBody } from "react-bootstrap";
import React, { useState } from "react";


function OpenPhotoSheets(props) {
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
          <Modal.Title>{props?.data?.description}</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <div>
            <img alt="livefield" src={props?.file} className="image-full" />
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}
export default OpenPhotoSheets;


