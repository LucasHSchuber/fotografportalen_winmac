import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const NewProjectModal = ({ projectName, projectType, showNewProjectModal, handleClose, CreateNewProject }) => {

    //define states


    const confirmNewProject = () => {
        console.log("Ok");
        handleClose();
        CreateNewProject();
    }

    return (
        <Modal className="mt-5" show={showNewProjectModal} onHide={handleClose}>
            <Modal.Body className="mt-3 mb-4">
                <Modal.Title><h5><b>Are you sure you want to create a new {projectType.toLowerCase()} photography project??</b></h5></Modal.Title>
                <h6 className="mb-3"><em>"{projectName}"</em></h6>

                <div className="mt-4">
                    <Button className="button cancel mr-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className="button standard" onClick={confirmNewProject}>
                        Create New Project
                    </Button>
                </div>

            </Modal.Body>
        </Modal>
    );
};

export default NewProjectModal;
