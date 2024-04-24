import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const loginModal = ({ showLoginModal, handleCloseLoginModal, refreshProjects }) => {

    //define states
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordMessage, setPasswordMessage] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")

    const navigate = useNavigate();

    const closeModal = () => {
        setPasswordMessage("");
        setUsernameMessage("");
        handleCloseLoginModal();
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const logIn = async () => {
        if (password === "" && username === "") {
            console.log("Enter username and password");
            setPasswordMessage("Enter password");
            setUsernameMessage("Enter username");
        }
        if (password === "") {
            console.log("Enter password");
            setPasswordMessage("Enter password");
        } else {
            setPasswordMessage("");
        }
        if (username === "") {
            console.log("Enter username");
            setUsernameMessage("Enter username");
        } else {
            setUsernameMessage("");
        }

        if (password !== "" && username !== "") {
            console.log("ok");

            try {

                //first log in and see if there is a user stored on sqlite database,
                //if not store user from big database

                const response = await axios.post('https://backend.expressbild.org/index.php/rest/photographer_portal/login', {
                    'email': username,
                    'password': password
                });

                if (response && response.data) {
                    console.log('User:', response.data);
                    console.log('User result:', response.data.result);

                    setPassword("");
                    setUsername("");

                    try {
                        const responseData = await window.api.createUser(response.data.result);
                        console.log(responseData);
                        handleCloseLoginModal();
                    } catch (error) {

                    }
                    return response.data;
                } else {
                    console.error('Empty response received');
                    return null;
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (!error.response) {
                        console.error('Network Error: Please check your internet connection');
                    } else {
                        console.error('Request failed with status code:', error.response.status);
                    }
                } else {
                    console.error('Error fetching projects:', error.message);
                }
                return null;
            }
        }
    };



    //send job to database
    const sendJob = async () => {
        console.log(alertSale);
        alertSale === "true" ? 1 : 0;

        try {
            const sentProject = await window.api.sendProjectToDb(project_id, alertSale);
            console.log('Sent:', sentProject);

            setShowConfirmationModal(false);
            navigate("/currwork_teamleader");
            refreshProjects();

        } catch (error) {
            console.error('Error sending project:', error);
            console.log("Job could not be sent");
        }
    }


    return (
        <>
            <Modal className="mt-5" show={showLoginModal} onHide={closeModal}>
                <Modal.Body className="mt-3 mb-3">
                    <Modal.Title><h5 className="mb-3" ><b>Log in</b></h5></Modal.Title>
                    <div style={{ textAlign: "left", marginLeft: "3em" }}>
                        {usernameMessage || passwordMessage ? (
                            <ul className="error">
                                {usernameMessage ? <li>{usernameMessage}</li> : ""}
                                {passwordMessage ? <li>{passwordMessage}</li> : ""}
                            </ul>
                        ) : (
                            <>
                            </>
                        )}
                    </div>
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

                    <div className="mt-3">
                        <Button className="button cancel fixed-width mr-1" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button className="button standard fixed-width" onClick={logIn}>
                            Log in
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default loginModal;
