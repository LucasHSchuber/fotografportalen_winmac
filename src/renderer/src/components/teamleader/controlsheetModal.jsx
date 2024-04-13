import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const ControlSheetModal = ({ showcControlSheetModal, projectForControlSheet, userForControlSheet, handleClose, project_id, projectType, teamsForControlSheet }) => {

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
                        <h6><span>Photographer:</span> {userForControlSheet}</h6>
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
                        </tr>
                    </thead>
                    <tbody>
                        {teamsForControlSheet && teamsForControlSheet.length > 0 ? (
                            teamsForControlSheet.map(data => (
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
                    {projectForControlSheet && (
                        <div key={projectForControlSheet.project_id}>
                            <div className="">
                                <h6><span>Anomaly report:</span></h6>
                                {projectForControlSheet.anomaly && projectForControlSheet.anomaly !== "NULL"
                                    ? projectForControlSheet.anomaly
                                    : <em>Empty anomaly report</em>}
                            </div>

                            <div className="mt-4">
                                <h6><span>Merged teams:</span></h6>
                                {projectForControlSheet.anomaly && projectForControlSheet.merged_teams !== "NULL"
                                    ? projectForControlSheet.merged_teams
                                    : <em>Empty anomaly report</em>}
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
