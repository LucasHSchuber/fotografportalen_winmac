import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import DeleteProjectModal from "../../components/teamleader/deleteprojectModal";

import '../../assets/css/teamleader/components_teamleader.css'

const Minimenu_teamleader = ({ project_type, project_id, project_name }) => {

    //define states
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);


    const navigate = useNavigate();


    console.log(project_type);
    console.log(project_id);
    console.log(project_name);


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

        // try {
        //     const deleted = await window.api.deleteProject(project_id);
        //     console.log('Delete:', deleted);

        // } catch (error) {
        //     console.error('Error deleting project:', error);
        // }

    }


    return (
        <div className="minimenu-teamleader">
            <div className="buttons-box">
                <button className="minimenu-delete-button"
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
                <button className="minimenu-button">
                    <i class="fa-regular fa-flag"></i>
                </button>
            </div>


            <DeleteProjectModal showModal={showModal} handleClose={handleClose} projectName={project_name}/>


        </div>
    );
}

export default Minimenu_teamleader;
