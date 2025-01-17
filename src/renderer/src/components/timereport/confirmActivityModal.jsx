import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';


const confirmActivitytModal = ({ showConfirmActivityModal, handleClose, completeProject, index }) => {
    //define states


    const handleComplete = () => {
        if (index !== null) {
            completeProject(index); 
            handleClose(); 
        }
    };


    return (
        <Modal className="mt-5" show={showConfirmActivityModal} onHide={handleClose}>
            <Modal.Body className="mt-4 mb-3">
                <Modal.Title><h5 className="mb-3"><b>Complete Job</b></h5></Modal.Title>
                <h6 className="mb-4">Are you sure you want to complete this job?</h6>
                    
                    <div className="mt-2">
                        <Button className="button cancel mr-1" type="button" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button className="button complete-activity-button " type="submit" onClick={() => handleComplete()}>
                            <FontAwesomeIcon icon={faCheck} />{" "}
                            Complete 
                        </Button>
                    </div>
            </Modal.Body>
        </Modal>
    );
};

export default confirmActivitytModal;
