import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";

const ConfirmControlSheetModal = ({ showConfirmControlSheetModal, handleCloseControlSheetModal, projectType, project, teams, userForControlSheet, sendJob }) => {

    //define states
    const [alertSale, setAlertSale] = useState(false);
    // const [namedPhotolink, setNamedPhotolink] = useState(false);

    const confirmJob = () => {
        handleCloseControlSheetModal();
        sendJob(alertSale);
        setAlertSale(false);
    }



    return (
        <Modal className="controlsheet-teamleader mt-1" show={showConfirmControlSheetModal} onHide={handleCloseControlSheetModal}>
            <Modal.Body className="controlsheet-teamleader-modalbody">
                <Modal.Title className="mb-4"><h5><b>Control sheet</b></h5></Modal.Title>

                {/* load project and user info */}
                {project && (
                    <div key={project.project_id} className="controlsheet-modal-info-box" >
                        <h6><span>Photographer:</span> {userForControlSheet}</h6>
                        <h6><span>Project name:</span> {project.projectname}</h6>
                        <h6><span>Created:</span> {project.created}</h6>
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
                        </tr>
                    </thead>
                    <tbody>
                        {teams && teams.length > 0 ? (
                            teams.map(data => (
                                <tr key={data.team_id}>
                                    <td>{data.teamname.length > 22 ? data.teamname.substring(0, 22) + "..." : data.teamname}</td>
                                    <td>{data.amount}st</td>
                                    <td>{data.portrait === 1 ? <i class="fa-regular fa-circle-check"></i> : ""}</td>
                                    <td>{data.crowd === 1 ? <i class="fa-regular fa-circle-check"></i> : ""}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No teams</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="controlsheet-modal-info-box">
                    {project && (
                        <div key={project.project_id}>
                            <div className="">
                                <h6><span>Anomaly report:</span></h6>
                                {project.anomaly && project.anomaly !== "NULL"
                                    ? project.anomaly
                                    : <em>Empty anomaly report</em>}
                            </div>

                            <div className="mt-4">
                                <h6><span>{projectType === "school" ? "Merged classes" : "Merged teams"}</span></h6>
                                {project.anomaly && project.merged_teams !== "NULL"
                                    ? project.merged_teams
                                    : <em>{projectType === "school" ? "No merged classes" : "No merged teams"}</em>}
                            </div>

                        </div>
                    )}
                </div>

                {/* <div className="checkbox-container mt-4">
                    <label style={{ marginRight: "8em" }}>
                        <input
                            className="checkmark mr-2"
                            type="checkbox"
                            name="name_photolink"

                        />
                        {projectType === "school" ? "All classes have been named in photolink" : "All teams have been named in photolink"}
                    </label>
                </div> */}
                <div className="checkbox-container mt-4">
                    <label style={{ marginRight: "9em" }}>
                        <input
                            className="checkmark mr-2"
                            type="checkbox"
                            name="alert_sale"
                            defaultChecked={false}
                            onChange={() => setAlertSale(!alertSale)}
                        />
                        Report anomalies to sales department
                    </label>
                </div>

                <div className="mt-4">
                    <Button className="button cancel mr-1" onClick={handleCloseControlSheetModal}>
                        Close
                    </Button>
                    <Button className="button standard fixed-width" onClick={confirmJob}>
                        Send work
                    </Button>
                </div>

            </Modal.Body>
        </Modal >
    );
};

export default ConfirmControlSheetModal;
