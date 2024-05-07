import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';



const connectUserModal = ({ handleCloseConnectUserModal, showConnectUserModal, refreshUser, updateFeedbackMessage }) => {

    //define states
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [passwordMessage, setPasswordMessage] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [errorLogginginMessage, setErrorLogginginMessage] = useState("");



    //when closing modal
    const closeModal = () => {
        setPasswordMessage("");
        setUsernameMessage("");
        setErrorLogginginMessage("");
        handleCloseConnectUserModal();
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setUsernameMessage("");
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordMessage("");
    };


    const connectUser = async () => {
        if (password === "" && username === "") {
            console.log("Enter username and password");
            setPasswordMessage(true);
            setUsernameMessage(true);
            setErrorLogginginMessage("");
        }
        if (password === "") {
            console.log("Enter password");
            setPasswordMessage(true);
        } else {
            setPasswordMessage("");
        }
        if (username === "") {
            console.log("Enter username");
            setUsernameMessage(true);
        } else {
            setUsernameMessage("");
        }

        if (password !== "" && username !== "") {
            console.log("password and username entered");
            // localStorage.setItem("username", username);
            // localStorage.setItem("password", password);

            try {
                console.log("Connecting user.... ");

                const response = await axios.post('https://backend.expressbild.org/index.php/rest/photographer_portal/login', {
                    'email': username,
                    'password': password
                });
                if (response && response.data) {
                    console.log('User:', response.data);
                    console.log('User result:', response.data.result);

                    try {
                        const updatedResult = { ...response.data.result, password };
                        console.log(updatedResult);
                        const responseData = await window.api.createUser(updatedResult);
                        console.log(responseData);

                        if (responseData.success === true) {
                            console.log("User created successfully");
                            setPassword("");
                            setUsername("");
                            setErrorLogginginMessage("");
                            updateFeedbackMessage("Photographer connected successfully");
                            refreshUser();
                            closeModal();
                        } else {
                            console.log("Error creating user");
                            setErrorLogginginMessage("Photographer is already connected");
                        }
                    } catch (error) {
                        console.log("error:", error);
                    }
                } else {
                    console.error('Empty response received');
                    return null;
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (!error.response) {
                        console.error('Network Error: Please check your internet connection');
                        setErrorLogginginMessage("Network error connection");
                    } else {
                        console.error('Request failed with status code:', error.response.status);
                        setErrorLogginginMessage("Username and password doesn't exists in company database. Contact the office if problem is not resolved.");
                    }
                } else {
                    console.error('Error fetching projects:', error.message);
                }
                return null;
            }
        }
    };






    return (
        <>
            <Modal className="mt-5" show={showConnectUserModal} onHide={handleCloseConnectUserModal}>
                <Modal.Body className="mt-3 mb-3">
                    <Modal.Title><h5 className="mb-4" ><b>Connect new photographer</b></h5></Modal.Title>
                    {/* <h6 className="mb-3">You must log in to be able to send in this work</h6> */}

                    <div style={{ textAlign: "left", marginLeft: "3em", width: "23em" }}>
                        {usernameMessage || passwordMessage || errorLogginginMessage ? (
                            <ul className="error">
                                {/* {usernameMessage ? <li>{usernameMessage}</li> : ""}
                                {passwordMessage ? <li>{passwordMessage}</li> : ""} */}
                                {errorLogginginMessage ? <li>{errorLogginginMessage}</li> : ""}
                            </ul>
                        ) : (
                            <>
                            </>
                        )}
                    </div>

                    <div>
                        <input
                            className={`form-input-field-fp ${usernameMessage ? "error-border" : ""}`}
                            placeholder="Email"
                            type="text"
                            style={{ width: "20em" }}
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <input
                            className={`form-input-field-fp ${passwordMessage ? "error-border" : ""}`}
                            placeholder="Password"
                            type="password"
                            style={{ width: "20em" }}
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>

                    <div className="mt-3">
                        <Button className="button cancel-fp fixed-width mr-1" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button className="button normal fixed-width" onClick={connectUser}>
                            Connect
                        </Button>
                    </div>

                </Modal.Body>
            </Modal>

        </>
    );
};

export default connectUserModal;
