import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


import '../../assets/css/teamleader/components_teamleader.css'

const Minimenu_teamleader = ({ project_type }) => {

    //define states


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

    console.log(project_type);

    return (
        <div className="minimenu-teamleader">
            <div className="buttons-box">
                <button className="minimenu-delete-button">
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
        </div>
    );
}

export default Minimenu_teamleader;
