import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";
import '../../assets/css/global.css';


const DeleteProjectModal = ({ showDeleteModal, handleClose, projectName }) => {

    console.log('projectName', projectName);
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
        const deleteString = "delete project";
        const inputValue = deleteInputValue.toLocaleLowerCase();
        const projectNameLower = projectName.toLocaleLowerCase();

        console.log("deleteInputValue", inputValue);
        console.log("projectName", projectNameLower);

        if (inputValue !== projectNameLower) {
            console.log("Input does not match!");
            setDeleteMessage('Input must match with ' + '"' + projectNameLower + '"');
            return;
        }

        const project_id = localStorage.getItem("project_id");
        if (!project_id) {
            console.error("No project ID found in local storage.");
            return;
        }

        const user_id = localStorage.getItem("user_id");
        try {
            const deletedResponse = await window.api.deleteProject(project_id, user_id);
            console.log('deletedResponse:', deletedResponse);
            // if (deletedResponse && deletedResponse.result.status === 200){
                if (deletedResponse?.result?.status === 200) {
                setDeleteMessage("");
                // localStorage.removeItem("project_id");
                sessionStorage.setItem("feedbackMessage_deletedproject", "Project successfully deleted");
                handleClose();
                setTimeout(() => navigate("/prevwork_teamleader"), 500);
            } 
            else{
                console.log("Error deleting project")
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };


    return (
        <Modal className="mt-5" show={showDeleteModal} onHide={handleClose}>
            <Modal.Body className="mt-3 mb-3">
                <Modal.Title><h5 className="mb-2 error"><b>Delete Job</b></h5></Modal.Title>
                <h6 className="mb-3"><em>Type in "<b>{projectName}</b>" to delete the job </em></h6>
                {/* <h6 className="mb-4" style={{ color: "red", textDecoration: "underline" }}>This action can not be undone</h6> */}
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        className="form-input-field"
                        placeholder="Enter job name.."
                        style={{ border: "1px solid red", width: "20em" }}
                        value={deleteInputValue}
                        onChange={handleInputChange}
                    />

                    <div style={{ textAlign: "left", marginLeft: "4.5em" }}>
                        {deleteMessage && (
                            <div className="error mb-3 mr-5">
                                <p>{deleteMessage}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <Button className="button cancel fixed-width mr-1" type="button" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button className="button delete fixed-width" type="submit" onClick={handleDelete}>
                            Delete Job
                        </Button>
                    </div>
                </form>

            </Modal.Body>
        </Modal>
    );
};

export default DeleteProjectModal;
