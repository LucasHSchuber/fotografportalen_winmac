import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import logo from "../assets/images/camera1.png";
import fp from "../assets/images/diaphragm.png";
import teamleader from "../assets/images/teamwork.png";
import cloud from "../assets/images/cloud.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faHouse, faCircleQuestion, faBook, faBrain } from '@fortawesome/free-solid-svg-icons';


function Sidemenu_small() {

    //define states

    const navigate = useNavigate();

    return (
        <div className="sidemenu_small">
            <ul className="menu-small">
                <div className="link-box-small" onClick={() => navigate('/')}>
                    <FontAwesomeIcon icon={faHouse} title="Home" className="icons" />
                </div>
                <div className="link-box-small" onClick={() => navigate('/account')}>
                    <FontAwesomeIcon icon={faUser} title="Profile" className="icons" />
                </div>
                <div className="link-box-small" onClick={() => navigate('/settings')}>
                    <FontAwesomeIcon icon={faCog} title="Settings" className="icons" />
                </div>
                <div className="link-box-small" onClick={() => navigate("/knowledgebase")}>
                    <FontAwesomeIcon icon={faBrain} title="Knowledge Base" className="icons" />
                </div>
                <div className="link-box-small" onClick={() => navigate("/faq")}>
                    <FontAwesomeIcon icon={faCircleQuestion} title="FAQ & Support" className="icons" />
                </div>
            </ul>
        </div>
    );
}

export default Sidemenu_small;
