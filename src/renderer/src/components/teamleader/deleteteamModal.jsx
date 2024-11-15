import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const DeleteTeamModal = ({ showDeleteTeamModal, handleClose, projectType, teamName, teamId, refreshTeamData, updateFeedbackMessage }) => {

    //define states
    const [deleteInputValue, setDeleteInputValue] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");

    const handleCancel = () => {
        setDeleteMessage("");
        setDeleteInputValue("");
        handleClose();
    };

    const handleInputChange = (e) => {
        setDeleteInputValue(e.target.value);
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        console.log("deleteInputValue", deleteInputValue.toLocaleLowerCase());
        console.log("teamName", teamName.toLocaleLowerCase());
        if (deleteInputValue.toLocaleLowerCase() === teamName.toLocaleLowerCase()) {
            console.log("Delete");
            console.log(teamId);
            try {
                const deletedTeam = await window.api.deleteTeam(teamId);
                console.log('deletedTeam:', deletedTeam);

                if (deletedTeam.status === 200) {
                    setDeleteMessage("");
                    handleCancel();
                    updateFeedbackMessage(`${projectType === "school" ? "Class deleted successfully" : "Team deleted successfully"}`);
                    refreshTeamData(); //refresh team data in parent
                    localStorage.removeItem("team_id");
                } else {
                    console.log("Error when deleting team");
                    updateFeedbackMessage(`${projectType === "school" ? "Error when deleting class" : "Error when deleting team"}`);

                }
                
            } catch (error) {
                console.error('Error deleting team:', error);
            }

        } else {
            console.log("Do not match");
            setDeleteMessage(projectType === "school" ? "Input does not match with class name" : "Input does not match with team name");
            return;
        }
    };


    return (
        <Modal className="mt-5" show={showDeleteTeamModal} onHide={handleClose}>
            <Modal.Body className="mt-3 mb-3">
                <Modal.Title><h5 className="mb-2 error" ><b>{projectType === "school" ? "Delete class" : "Delete team"}</b></h5></Modal.Title>
                <h6 className="mb-3"><em>Type in "{teamName}" to delete the {projectType === "school" ? "class" : "team"} </em></h6>
                {/* <h6 className="mb-4" style={{ color: "red", textDecoration: "underline" }}>This action can not be undone</h6> */}
                <form>
                    <input
                        className="form-input-field"
                        placeholder={projectType === "school" ? "Class name" : "Team name"}
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

                    <div className="mt-2">
                        <Button className="button cancel fixed-width mr-1" type="button" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button className="button delete fixed-width" type="submit" onClick={handleDelete}>
                            Delete {projectType === "school" ? "class" : "team"}
                        </Button>
                    </div>
                </form>

            </Modal.Body>
        </Modal>
    );
};

export default DeleteTeamModal;
