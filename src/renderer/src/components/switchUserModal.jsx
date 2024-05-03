import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';



const switchUserModal = ({ handleCloseSwitchUserModal, showSwitchUserModal, chosenUser, refreshUser, updateFeedbackMessage }) => {

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
        setPassword("");
        setErrorLogginginMessage("");
        handleCloseSwitchUserModal();
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordMessage("");
    };


    const switchUser = async () => {
        if (password === "") {
            console.log("Enter password");
            setPasswordMessage(true);
            setErrorLogginginMessage("");
        } else {
            setPasswordMessage("");
        }

        if (password !== "" && chosenUser.email !== "") {
            console.log("password and username entered");

            try {
                const data = { email: chosenUser.email, password: password };
                console.log(data);
                const responseData = await window.api.loginUser(data);
                console.log(responseData);

                if (responseData.success === true) {
                    console.log("Log in successful");
                    localStorage.removeItem("user_id");
                    localStorage.setItem("user_id", responseData.user.user_id);
                    refreshUser();
                    updateFeedbackMessage("Photographer switched successfully");
                    localStorage.setItem("username", chosenUser.email);
                    closeModal();
                } else {
                    console.log("Invalid email or/and password");
                    setErrorLogginginMessage("Invalid email and/or password");
                }

            } catch (error) {
                console.log("Error logging in");
                console.log("error:", error);
            }

        } else {
            console.error('Password or Username is missing');
            return null;
        }
    };






    return (
        <>
            <Modal className="mt-5" show={showSwitchUserModal} onHide={handleCloseSwitchUserModal}>
                <Modal.Body className="mt-3 mb-3">
                    <Modal.Title><h5 className="mb-4" ><b>Switch photographer</b></h5></Modal.Title>
                    {/* <h6 className="mb-3">You must log in to be able to send in this work</h6> */}

                    <div style={{ textAlign: "left", marginLeft: "3em" }}>
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
                            className="form-input-field-fp"
                            // placeholder="email"
                            type="text"
                            style={{ width: "20em" }}
                            value={chosenUser.email}
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
                        <Button className="button normal fixed-width" onClick={switchUser}>
                            Switch
                        </Button>
                    </div>

                </Modal.Body>
            </Modal>

        </>
    );
};

export default switchUserModal;
