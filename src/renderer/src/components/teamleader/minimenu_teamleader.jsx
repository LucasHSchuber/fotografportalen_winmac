import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import DeleteProjectModal from "../../components/teamleader/deleteprojectModal";

import '../../assets/css/teamleader/components_teamleader.css'

const Minimenu_teamleader = ({ project_type, project_id, project_name, toggleAnomalyReport}) => {

    //define states
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

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

    
    const deleteProject = async () => {
        console.log("delete project " + project_id)
        setShowModal(true);
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
                <button className="minimenu-button">
                    <i className="fa-regular fa-paper-plane"></i>
                </button>
                <button className="minimenu-button"
                     onClick={toggleAnomalyReport}
                >
                    <i class="fa-regular fa-flag"></i>
                </button>
            </div>


            <DeleteProjectModal showModal={showModal} handleClose={handleClose} projectName={project_name} />

        </div>
    );
}

export default Minimenu_teamleader;
