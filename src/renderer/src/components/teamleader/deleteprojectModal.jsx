import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const DeleteProjectModal = ({ showDeleteModal, handleClose, projectName }) => {

    //define states
    const [deleteInputValue, setDeleteInputValue] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");

    const navigate = useNavigate();


    const handleCancel = () => {
        setDeleteMessage("");
        setDeleteInputValue("");
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

                setDeleteMessage("");
                localStorage.removeItem("project_id");

                navigate("/currwork_teamleader");

            } catch (error) {
                console.error('Error deleting project:', error);
            }

        } else {
            console.log("Do not match");
            setDeleteMessage("Input does not match with project name");
        }
    };


    return (
        <Modal className="mt-5" show={showDeleteModal} onHide={handleClose}>
            <Modal.Body className="mt-3 mb-3">
                <Modal.Title><h6 className="mb-2" style={{ color: "red" }}><b>Delete project "{projectName}"?</b></h6></Modal.Title>
                <h6 className="mb-3"><em>Type in "{projectName}" to delete the project </em></h6>
                {/* <h6 className="mb-4" style={{ color: "red", textDecoration: "underline" }}>This action can not be undone</h6> */}

                <input
                    className="form-input-field"
                    placeholder="Project name"
                    style={{ border: "1px solid red", width: "20em" }}
                    value={deleteInputValue}
                    onChange={handleInputChange}
                />

                <div style={{ textAlign: "left", marginLeft: "4.5em" }}>

                    {deleteMessage && (
                        <div className="error mb-3 mr-5">
                            <h6>{deleteMessage}</h6>
                        </div>
                    )}
                </div>
                
                <div className="mt-2">
                    <Button className="button cancel fixed-width mr-1" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button className="button delete fixed-width " onClick={handleDelete}>
                        Delete
                    </Button>
                </div>

            </Modal.Body>
        </Modal>
    );
};

export default DeleteProjectModal;
