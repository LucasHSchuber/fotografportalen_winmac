import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const NewProjectModal = ({ showModal, handleClose }) => {

    //define states


    const navigate = useNavigate();
    const location = useLocation();


    const navigateToNewproject = () => {
        if (location.pathname === '/newproject_teamleader') {
            handleClose(); // Close the modal if already on the new project page
        } else {
            navigate('/newproject_teamleader');
        }
    }
    // Check if the user is already on the /newproject_teamleader page
    const isOnNewProjectPage = location.pathname === '/newproject_teamleader';


    return (
        <Modal className="mt-5" show={showModal} onHide={handleClose}>
            <Modal.Body className="mt-3 mb-4">
                <Modal.Title><h5 ><b>Do you want to create a new project?</b></h5></Modal.Title>
                <div className="mt-4">
                    <Button className="button cancel mr-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className="button standard" onClick={navigateToNewproject}>
                        Create New Project
                    </Button>
                </div>

            </Modal.Body>
        </Modal>
    );
};

export default NewProjectModal;
