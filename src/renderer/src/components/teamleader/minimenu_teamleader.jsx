import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import DeleteProjectModal from "../../components/teamleader/deleteprojectModal";
import SendProjectModal from "../../components/teamleader/sendProjectModal";
import ConfirmControlSheetModal from "../../components/teamleader/confirmcontrolsheetModal";

import '../../assets/css/teamleader/components_teamleader.css'

const Minimenu_teamleader = ({ project_type, project_id, project_name, toggleAnomalyReport, project, teams, userForControlSheet }) => {

    //define states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSendProjectModal, setShowSendProjectModal] = useState(false);
    const [showConfirmControlSheetModal, setShowConfirmControlSheetModal] = useState(false);
    const [projectId, setProjectId] = useState(null);
    const [alertSale, setAlertSale] = useState(null);


    const handleClose = () => setShowDeleteModal(false);
    const handleCloseControlSheetModal = () => setShowConfirmControlSheetModal(false);

    const handleCloseProjectModal = () => setShowSendProjectModal(false);
    // const handleShow = () => setShowdeleteModal(true);

    const navigate = useNavigate();



    //create new team
    const createNewTeam = () => {
        console.log("new team");
        if (project_type === "sport") {
            navigate("/addleaderinfo_teamleader");
        } else {
            navigate("/newteam_teamleader");
        }
    }

    // open modal for delete project
    const deleteProject = async () => {
        setShowDeleteModal(true);
    }

    // open modal for send in project
    const openConfirmControlSheetModal = async () => {
        setProjectId(project_id);
        setShowConfirmControlSheetModal(true);
    }

    //send job
    const sendJob = async (alert_sale) => {
        console.log(alert_sale);
        setAlertSale(alert_sale);
        setShowSendProjectModal(true);
    }


    console.log(project);
    console.log(teams);

    return (
        <div className="minimenu-teamleader">
            <div className="buttons-box">
                <button className="minimenu-delete-button"
                    style={{ marginBottom: "18em", marginTop: "1em" }}
                    onClick={() => deleteProject()}
                >
                    <span className="button-title button-title-delete">Delete project</span>
                    <i class="fa-regular fa-trash-can"></i>
                </button>

                <button className="minimenu-button"
                    onClick={() => createNewTeam()}
                >
                    <span className="button-title button-title-createnew">{project_type === "school" ? "Create new class" : "Create new team"}</span>
                    <i class="fa-solid fa-plus"></i>
                </button>
                <button className="minimenu-button"
                    onClick={() => openConfirmControlSheetModal()}
                >
                    <span className="button-title button-title-sendjob">Send job</span>
                    <i className="fa-regular fa-paper-plane"></i>
                </button>
                <button className="minimenu-button"
                    onClick={toggleAnomalyReport}
                >
                    <span className="button-title button-title-toggleanomalyreport">Open anomaly report</span>
                    <i class="fa-regular fa-flag"></i>
                </button>
            </div>


            <DeleteProjectModal showDeleteModal={showDeleteModal} handleClose={handleClose} projectName={project_name} />
            <SendProjectModal showSendProjectModal={showSendProjectModal} handleCloseProjectModal={handleCloseProjectModal} project_id={projectId} alertSale={alertSale} />
            <ConfirmControlSheetModal showConfirmControlSheetModal={showConfirmControlSheetModal} handleCloseControlSheetModal={handleCloseControlSheetModal} projectType={project_type} project={project} teams={teams} userForControlSheet={userForControlSheet} sendJob={sendJob} />

        </div>
    );
}

export default Minimenu_teamleader;
