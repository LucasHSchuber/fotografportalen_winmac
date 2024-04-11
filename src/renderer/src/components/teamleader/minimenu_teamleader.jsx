import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import DeleteProjectModal from "../../components/teamleader/deleteprojectModal";
import SendProjectModal from "../../components/teamleader/sendProjectModal";

import '../../assets/css/teamleader/components_teamleader.css'

const Minimenu_teamleader = ({ project_type, project_id, project_name, toggleAnomalyReport }) => {

    //define states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSendProjectModal, setShowSendProjectModal] = useState(false);
    const [projectId, setProjectId] = useState(null); 
    

    const handleClose = () => setShowDeleteModal(false);
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
    const sendJob = async () => {
        setProjectId(project_id);
        setShowSendProjectModal(true);
    }


    return (
        <div className="minimenu-teamleader">
            <div className="buttons-box">
                <button className="minimenu-delete-button"
                    style={{ marginBottom: "18em", marginTop: "1em" }}
                    onClick={() => deleteProject()}
                >
                    <i class="fa-regular fa-trash-can"></i>
                </button>

                <button className="minimenu-button"
                    onClick={() => createNewTeam()}
                >
                    <i class="fa-solid fa-plus"></i>
                </button>
                <button className="minimenu-button"
                    onClick={() => sendJob()}
                >
                    <i className="fa-regular fa-paper-plane"></i>
                </button>
                <button className="minimenu-button"
                    onClick={toggleAnomalyReport}
                >
                    <i class="fa-regular fa-flag"></i>
                </button>
            </div>


            <DeleteProjectModal showDeleteModal={showDeleteModal} handleClose={handleClose} projectName={project_name} />
            <SendProjectModal showSendProjectModal={showSendProjectModal} handleCloseProjectModal={handleCloseProjectModal} project_id={projectId} />

        </div>
    );
}

export default Minimenu_teamleader;
