import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const sendProjectModal = ({ showSendProjectModal, project_id, handleClose }) => {

    //define states
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);





    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        console.log(username);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        console.log(password);
    };


    const logIn = () => {
        if (password === "" && username === "") {
            console.log("Enter username and password");
        } else if (password === "") {
            console.log("Enter password");
        } else if (username === "") {
            console.log("Enter username");
            
        } else {
            console.log("ok");
            setPassword("");
            setUsername("");
            handleClose();
            setShowConfirmationModal(true); // Show confirmation modal
        }
    };

    const handleConfirmation = () => {
        setPassword("");
        setUsername("");
        handleClose();
        setShowConfirmationModal(false); // Close confirmation modal
    };

    const sendJob = async () => {
        try {
            const sentProject = await window.api.sendProjectToDb(project_id);
            console.log('Sent:', sentProject);
            
            setShowConfirmationModal(false);

        } catch (error) {
            console.error('Error sending project:', error);
            console.log("Job could not be sent");
        }
    }

    return (

        <>

            <Modal className="mt-5" show={showSendProjectModal} onHide={handleClose}>
                <Modal.Body className="mt-3 mb-3">
                    <Modal.Title><h5 className="mb-2" ><b>Send in work</b></h5></Modal.Title>
                    <h6 className="mb-3">You must log in to be able to send in this work</h6>
                    <div>
                        <input
                            className="form-input-field"
                            placeholder="Username/Email"
                            type="text"
                            style={{ width: "20em" }}
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <input
                            className="form-input-field"
                            placeholder="Password"
                            type="password"
                            style={{ width: "20em" }}
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>

                    <div className="mt-2">
                        <Button className="button cancel fixed-width mr-1" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button className="button standard fixed-width" onClick={logIn}>
                            Send in work
                        </Button>
                    </div>

                </Modal.Body>
            </Modal>


            <Modal className="mt-5" show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Body className="mt-3 mb-3">
                    <Modal.Title><h5 className="mb-2" ><b>Are you sure you want to send in the work?</b></h5></Modal.Title>
                    <h6 className="mb-3">This action can not be undone. <br></br> You will find this project under previous work</h6>

                    <div className="mt-2">
                        <Button className="button cancel fixed-width mr-1" onClick={handleConfirmation}>
                            Cancel
                        </Button>
                        <Button className="button standard fixed-width" onClick={sendJob}>
                            Send in work
                        </Button>
                    </div>

                </Modal.Body>
            </Modal>

        </>
    );
};

export default sendProjectModal;
