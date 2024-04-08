import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const DeleteProjectModal = ({ showModal, handleClose, projectName }) => {

    //define states
    const [deleteInputValue, setDeleteInputValue] = useState("");

    const navigate = useNavigate();


    const handleCancel = () => {
        // Close the modal
        handleClose();
    };

    const handleInputChange = (e) => {
        setDeleteInputValue(e.target.value);
    };

    const handleDelete = async () => {
        if (deleteInputValue === projectName) {
            console.log("Delete");
            let project_id = localStorage.getItem("project_id");

            try {
                const deleted = await window.api.deleteProject(project_id);
                console.log('Delete:', deleted);

                localStorage.removeItem("project_id");

                navigate("/currwork_teamleader");

            } catch (error) {
                console.error('Error deleting project:', error);
            }

        } else {
            console.log("Do not match");
        }
    };


    return (
        <Modal className="mt-5" show={showModal} onHide={handleClose}>
            <Modal.Body className="mt-3 mb-4">
                <Modal.Title><h5 className="mb-4" style={{ color: "red" }}>Delete project "{projectName}"?</h5></Modal.Title>
                <h6 className="mb-3">Type in "{projectName}" to delete the project </h6>
                <input
                    className="form-input-field"
                    style={{ border: "1px solid red" }}
                    value={deleteInputValue}
                    onChange={handleInputChange}
                />

                <div className="mt-4">
                    <Button className="button cancel fixed-width mr-1" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button className="button delete fixed-width" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>

            </Modal.Body>
        </Modal>
    );
};

export default DeleteProjectModal;
