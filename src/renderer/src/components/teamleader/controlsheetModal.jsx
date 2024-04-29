import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// import "../../assets/css/teamleader/newprojectModal.css";


const ControlSheetModal = ({ showcControlSheetModal, projectForControlSheet, handleClose, project_id, projectType, teamsForControlSheet }) => {

    //define states
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const user_name = localStorage.getItem("user_name");
        setUserName(user_name);
    }, [])


    return (
        <Modal className="controlsheet-teamleader mt-1" show={showcControlSheetModal} onHide={handleClose}>
            <Modal.Body className="controlsheet-teamleader-modalbody">
                <Modal.Title className="mb-4"><h5><b>Control sheet</b></h5></Modal.Title>

                {/* load project and user info */}
                {projectForControlSheet && (
                    <div key={projectForControlSheet.project_id} className="controlsheet-modal-info-box" >
                        <h6><span>Photographer:</span> {projectForControlSheet.photographername}</h6>
                        <h6><span>Project name:</span> {projectForControlSheet.projectname}</h6>
                        <h6><span>Created:</span> {projectForControlSheet.created}</h6>
                        <h6><span>Sent:</span> {projectForControlSheet.sent_date}</h6>
                    </div>
                )}

                {/* load all teams */}
                <table className="controlsheet-table mt-4 mb-4">
                    <thead>
                        <tr>
                            <th>{projectType === "school" ? "Class name" : "Team name"}</th>
                            <th>Amount</th>
                            <th>Portrait</th>
                            <th>Group photo</th>
                            {projectType === "sport" ? (
                                <th>Calendar</th>
                            ) : (
                                <></>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {teamsForControlSheet && teamsForControlSheet.length > 0 ? (
                            teamsForControlSheet.map(data => (
                                <tr key={data.team_id}>
                                    <td>{data.teamname.length > 22 ? data.teamname.substring(0, 22) + "..." : data.teamname}</td>
                                    <td>{data.amount}st</td>
                                    <td>{data.portrait === 1 ? <FontAwesomeIcon icon={faCheckCircle} /> : ""}</td>
                                    <td>{data.crowd === 1 ? <FontAwesomeIcon icon={faCheckCircle} /> : ""}</td>
                                    {projectType === "sport" ? (
                                        <td>{data.sold_calendar === 1 ? <FontAwesomeIcon icon={faCheckCircle} /> : ""}</td>
                                    ) : (
                                        <></>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">{projectType === "school" ? "No classes" : "No teams"}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="controlsheet-modal-info-box">
                    {projectForControlSheet && (
                        <div key={projectForControlSheet.project_id}>
                            <div className="">
                                <h6><span>Anomaly report:</span></h6>
                                {projectForControlSheet.anomaly && projectForControlSheet.anomaly !== "NULL"
                                    ? <h6>{projectForControlSheet.anomaly}</h6>
                                    : <h6><em>Empty anomaly report</em></h6>}
                            </div>
                            <div className="mt-4">
                                <h6><span>{projectType === "school" ? "Merged classes" : "Merged teams"}</span></h6>
                                {projectForControlSheet.anomaly && projectForControlSheet.merged_teams !== "NULL"
                                    ? <h6>{projectForControlSheet.merged_teams}</h6>
                                    : <em>{projectType === "school" ? "No merged classes" : " No merged teams"}</em>}
                            </div>
                            <div className="mt-4 d-flex">
                                {/* <h6><span>Alert sale</span></h6> */}
                                {projectForControlSheet.alert_sale && projectForControlSheet.alert_sale === 1
                                    ? <h6><FontAwesomeIcon icon={faCheck} color="green" className="mx-1" /> <em>Sales alerted</em></h6> : <h6><em>Sales not alerted</em></h6>}
                            </div>

                        </div>
                    )}
                </div>


                <div className="mt-4">
                    <Button className="button cancel mr-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>

            </Modal.Body>
        </Modal >
    );
};

export default ControlSheetModal;
