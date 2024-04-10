import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const Anomalyreport = ({ toggleAnomalyReport, project_anomaly, refreshAnomalyData }) => {

    //define states
    const [anomaly, setAnomaly] = useState("");
    const [isModified, setIsModified] = useState(false);


    console.log(project_anomaly);

    const closeAnomalyReport = () => {
        setAnomaly("");
        toggleAnomalyReport();
    };

    const handleChange = (e) => {
        setAnomaly(e.target.value);
        setIsModified(true); // Set isModified to true when the textarea content is changed
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Anomaly reported:", anomaly);
        const project_id = localStorage.getItem("project_id");

        if (isModified) {

            //trigger api-window to add anomaly 
            const projectData = await window.api.addAnomalyToProject({
                anomaly: anomaly,
                project_id: project_id
            });
            console.log('Anomaly:', projectData);
        }

        //close anomaly report
        toggleAnomalyReport();
        //referesh anomaly report in parent data
        refreshAnomalyData();
    };



    return (
        <div className="anomalyreport-teamleader">
            <form onSubmit={handleSubmit} className="mt-auto">
                <div className="form-group">
                    <label> <b>Anomaly Report</b></label>
                    <textarea
                        className="form-control"
                        rows="4"
                        defaultValue={project_anomaly}
                        onChange={handleChange}
                        placeholder="Describe the anomaly here..."
                    ></textarea>
                </div>
                <button className="button cancel mr-2" onClick={closeAnomalyReport}>Cancel</button>
                <button type="submit" className="button standard">Save</button>

            </form>
        </div>
    );
};

export default Anomalyreport;
