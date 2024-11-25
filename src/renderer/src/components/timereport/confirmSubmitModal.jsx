import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';


const confirmSubmitModal = ({ showConfirmSubmitModal, handleClose, completeMonthPermanent }) => {
    //define states


    const handleComplete = () => {
            completeMonthPermanent(); 
            handleClose(); 
    };


    return (
        <Modal className="mt-5" show={showConfirmSubmitModal} onHide={handleClose}>
            <Modal.Body className="mt-4 mb-3 px-5">
                <Modal.Title><h5 className="mb-3"><b>Submit & Lock Month</b></h5></Modal.Title>
                <h6 className="mb-4">Are you sure you want to submit & lock this report period <br></br> <br></br><em>This action cannot be undone</em></h6>
                    
                    <div className="mt-2">
                        <Button className="button cancel mr-1" type="button" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button className="button complete-activity-button" type="submit" onClick={() => handleComplete()}>
                            Submit & Lock Month <FontAwesomeIcon icon={faLock} />
                        </Button>
                    </div>
            </Modal.Body>
        </Modal>
    );
};

export default confirmSubmitModal;
