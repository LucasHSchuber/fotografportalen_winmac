import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import logo from "../assets/images/camera1.png";
import fp from "../assets/images/diaphragm.png";
import teamleader from "../assets/images/teamwork.png";
import cloud from "../assets/images/cloud.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faHouse } from '@fortawesome/free-solid-svg-icons';


function Sidemenu_small() {

    //define states

    const navigate = useNavigate();

    return (
        <div className="sidemenu_small">
            <ul className="menu-small">
                <div className="link-box-small" onClick={() => navigate('/')}>
                    <FontAwesomeIcon icon={faHouse} className="icons" />
                </div>
                <div className="link-box-small" onClick={() => navigate('/settings')}>
                    <FontAwesomeIcon icon={faCog} className="icons" />
                </div>
                <div className="link-box-small">
                    <FontAwesomeIcon icon={faUser} className="icons" />
                </div>
            </ul>
        </div>
    );
}

export default Sidemenu_small;
