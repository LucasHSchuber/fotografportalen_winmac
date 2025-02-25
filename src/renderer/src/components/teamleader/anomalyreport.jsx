import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// import "../../assets/css/teamleader/newprojectModal.css";


const Anomalyreport = ({ projectType, toggleAnomalyReport, project_anomaly, merged_teams, refreshAnomalyData, updateFeedbackMessage }) => {

    console.log('projectType', projectType);
    //define states
    const [anomaly, setAnomaly] = useState("");
    const [mergedTeams, setMergedTeams] = useState("");
    const [isAnomalyModified, setIsAnomalyModified] = useState(false);
    const [isMergedTeamsModified, setIsMergedTeamsModified] = useState(false);


    console.log(project_anomaly);
    const project_id = localStorage.getItem("project_id");
    console.log(project_id);

    const closeAnomalyReport = () => {
        setAnomaly("");
        setMergedTeams("");
        toggleAnomalyReport();
    };

    // Handler for anomaly textarea change
    const handleAnomalyChange = (e) => {
        setAnomaly(e.target.value);
        setIsAnomalyModified(true);
    };

    // Handler for merged teams textarea change
    const handleMergedTeamsChange = (e) => {
        setMergedTeams(e.target.value);
        setIsMergedTeamsModified(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Anomaly reported:", anomaly);
        console.log("Merged teams reported:", mergedTeams);
        const project_id = localStorage.getItem("project_id");

        if (isAnomalyModified || isMergedTeamsModified) {

            let updatedFields = {};
            if (isAnomalyModified) updatedFields.anomaly = anomaly;
            if (isMergedTeamsModified) updatedFields.merged_teams = mergedTeams;

            await window.api.addAnomalyToProject({
                ...updatedFields,
                project_id: project_id
            });
            console.log('Anomaly report updated');
            toggleAnomalyReport();
            updateFeedbackMessage(`Anomaly report updated successfully`);
            refreshAnomalyData();
        } else {
            console.log("Anomaly report saved but not updated");
            toggleAnomalyReport();
        }

    };



    return (
        <div className="anomalyreport-teamleader">
            <form onSubmit={handleSubmit} className="mt-auto">
                <div className="d-flex justify-content-between mb-2">
                    <h6> <b>Anomaly Report</b></h6>
                    <button
                        className="close"
                        onClick={closeAnomalyReport}
                    >
                        <FontAwesomeIcon icon={faTimes} className="fa-xs" />
                    </button>
                </div>
                <div className="form-group">
                    <textarea
                        className="form-control textarea"
                        rows="4"
                        defaultValue={project_anomaly}
                        onChange={handleAnomalyChange}
                        placeholder="Describe anomaly"
                    ></textarea>
                </div>
                <h6> <b>{projectType === "school" ? "Merged classes" : "Merged teams"}</b></h6>
                <div className="form-group">
                    <textarea
                        className="form-control textarea"
                        rows="1"
                        defaultValue={merged_teams}
                        onChange={handleMergedTeamsChange}
                        // placeholder="Merged teams"
                        placeholder={projectType === "school" ? "e.g. 'class 1 + class 2 = class 3'" : "e.g. 'team 1 + team 2 = team 3'"}
                    ></textarea>
                </div>
                <button className="button cancel mr-2" onClick={closeAnomalyReport}>Cancel</button>
                <button type="submit" className="button standard fixed-width">Save</button>

            </form>
        </div>
    );
};

export default Anomalyreport;
