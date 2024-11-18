import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';



const confirmActivitytModal = ({ showConfirmActivityModal, handleClose, completeProject, index }) => {
    //define states

    console.log('index', index);

    const handleComplete = () => {
        if (index !== null) {
            completeProject(index); 
            handleClose(); 
        }
    };


   
    return (
        <Modal className="mt-5" show={showConfirmActivityModal} onHide={handleClose}>
            <Modal.Body className="mt-4 mb-3">
                <Modal.Title><h5 className="mb-3"><b>Complete Activity</b></h5></Modal.Title>
                <h6 className="mb-4"><em>Are you sure you want to complete this activity. This action cannot be undone!</em></h6>
                    
                    <div className="mt-2">
                        <Button className="button cancel mr-1" type="button" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button className="button complete-activity-button fixed-width" type="submit" onClick={() => handleComplete()}>
                            Complete Activity
                        </Button>
                    </div>


            </Modal.Body>
        </Modal>
    );
};

export default confirmActivitytModal;
