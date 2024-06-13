import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const sendProjectModal = ({ showSendProjectModal, project_id, handleCloseProjectModal, alertSale, project, teams }) => {

    //define states
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [errorLogginginMessage, setErrorLogginginMessage] = useState("");

    const navigate = useNavigate();

    console.log(teams);
    console.log(project);

    // get username and password from localstorage after mount
    useEffect(() => {
        setUsername(localStorage.getItem("username") ? localStorage.getItem("username") : "");
    }, [])

    //press enter to trigger sendJob method
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Enter" && showConfirmationModal) {
                sendJob();
                event.preventDefault();  
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showConfirmationModal]);  


    const closeModal = () => {
        setPasswordMessage("");
        setUsernameMessage("");
        handleCloseProjectModal();
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const logIn = async () => {
        let user_id = localStorage.getItem("user_id");
        console.log(user_id);
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
                const response = await axios.post('https://backend.expressbild.org/index.php/rest/photographer_portal/login', {
                    'email': username,
                    'password': password
                });

                if (response && response.data) {
                    console.log('User:', response.data);

                    setPassword("");
                    setUsername("");
                    handleCloseProjectModal();
                    setShowConfirmationModal(true); // Show confirmation modal

                    const tokenResponse = await window.api.updateUserToken(response.data.result.token, user_id);
                    console.log(tokenResponse);
                    localStorage.setItem("token", response.data.result.token);
                    console.log(response.data.result.token);
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
                        setErrorLogginginMessage("Invalid username and/or password");
                    }
                } else {
                    console.error('Error fetching projects:', error.message);
                }
                return null;
            }
        }
    };



    const cancelConfirmation = () => {
        setPassword("");
        setUsername("");
        handleCloseProjectModal();
        setShowConfirmationModal(false); // Close confirmation modal
    };


    //send job to database
    const sendJob = async () => {
        const token = localStorage.getItem("token");
        console.log("token", token);
        console.log(alertSale);
        alertSale === "true" ? 1 : 0;

        const data = {
            project: {
                "project_uuid": project.project_uuid,
                "merged_teams": project.merged_teams,
                "anomaly": project.anomaly,
                "alert_sale": alertSale
            },
            teams: []
        }
        teams.forEach(team => {
            data.teams.push({
                "teamname": team.teamname,
                "sold_calendar": team.sold_calendar === null ? 0 : team.sold_calendar,
                "leader_firstname": team.leader_firstname,
                "leader_lastname": team.leader_lastname,
                "leader_address": team.leader_address,
                "leader_postalcode": team.leader_postalcode,
                "leader_county": team.leader_county,
                "leader_mobile": team.leader_mobile,
                "leader_email": team.leader_email,
                "leader_ssn": team.leader_ssn,
                "amount": team.amount,
                "calendar_amount": team.calendar_amount === null ? 0 : team.calendar_amount,
                "portrait": team.portrait,
                "reason_not_portrait": team.reason_not_portrait,
                "crowd": team.crowd,
                "protected_id": team.protected_id
            });
        });
        console.log("data", data);

        try {
            const response = await axios.post("https://backend.expressbild.org/index.php/rest/teamleader/Upload", data, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })         
            console.log("Response:", response.data);
            console.log(response.data.project_id);
            const responseId = response.data.project_id;
            
            try {
                const sentProject = await window.api.sendProjectToDb(project_id, alertSale, responseId);
                console.log('Sent:', sentProject);
                console.log(project_id);
                console.log(alertSale);
                console.log(responseId);

                setShowConfirmationModal(false);
                sessionStorage.setItem("feedbackMessage_sentproject", "Job successfully sent");
                navigate("/prevwork_teamleader");
            } catch (error) {
                console.error('Error sending project:', error);
                console.log("Job could not be sent");
            }

        }catch(error){
            console.log("error when sending data to company database");
            console.log("error:", error);
        }   
    }


    return (
        <>
            <Modal className="mt-5" show={showSendProjectModal} onHide={handleCloseProjectModal}>
                <Modal.Body className="mt-3 mb-3">
                    <Modal.Title><h5 className="mb-2" ><b>Send in work</b></h5></Modal.Title>
                    <h6 className="mb-3">You must log in to be able to send in this work</h6>

                    <div style={{ textAlign: "left", marginLeft: "3em" }}>
                        {usernameMessage || passwordMessage || errorLogginginMessage ? (
                            <ul className="error">
                                {usernameMessage ? <li>{usernameMessage}</li> : ""}
                                {passwordMessage ? <li>{passwordMessage}</li> : ""}
                                {errorLogginginMessage ? <li>{errorLogginginMessage}</li> : ""}
                            </ul>
                        ) : (
                            <>
                            </>
                        )}
                    </div>

                    <div>
                        <input
                            className="form-input-field"
                            placeholder="Email"
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
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    logIn();
                                }
                            }}
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


            <Modal className="mt-5" show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Body className="mt-3 mb-3">
                    <Modal.Title><h5 className="mb-2" ><b>Are you sure you want to send in the work?</b></h5></Modal.Title>
                    <h6 className="mb-3" style={{ textDecoration: "underline" }}>This action can not be undone</h6>

                    <div className="mt-4">
                        <Button className="button cancel fixed-width mr-1" onClick={cancelConfirmation}>
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
