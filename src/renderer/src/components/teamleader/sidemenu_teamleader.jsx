import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import fp from "../../assets/images/diaphragm.png";
import house from "../../assets/images/house.png";
import flash from "../../assets/images/flash.png";
import more from "../../assets/images/more.png";
import plus from "../../assets/images/plus.png";
import suitcase from "../../assets/images/suitcase.png";

// import NewProjectModal from "../../components/teamleader/newprojectModal";


import '../../assets/css/teamleader/components_teamleader.css'


const Sidemenu_teamleader = () => {

    //define states
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    // const handleShow = () => setShowModal(true);


    return (
        <div className="sidemenu-teamleader">
            <div className="logo">
                <NavLink to="/" exact="true">
                    <img src={fp} alt="Logo" />
                </NavLink>
            </div>
            <ul className="menu">
                <div className="link-box">
                    <NavLink exact="true" to="/home_teamleader">
                        <img className="link-img" src={house} alt="house img" />
                        <p>Home</p>
                    </NavLink>
                </div>
                <div className="link-box">
                    <NavLink exact="true" to="/prevwork_teamleader">
                        <img className="link-img" src={suitcase} alt="suitcase img" />
                        <p>Previous work</p>
                    </NavLink>
                </div>
                <div className="link-box">
                    <NavLink exact="true" to="/currwork_teamleader">
                        <img className="link-img" src={flash} alt="flash img" />
                        <p>Current work</p>
                    </NavLink>
                </div>
                <div className="link-box">
                    {/* <NavLink exact to="/newproject_teamleader" onClick={handleShow}> */}
                    {/* <NavLink onClick={handleShow}> */}
                    <NavLink exact="true" to="/newproject_teamleader">
                        <img className="link-img" src={plus} alt="add img" />
                        <p>New project</p>
                    </NavLink>
                </div>
            </ul>

            {/* Render the modal */}
            {/* <NewProjectModal showModal={showModal} handleClose={handleClose} /> */}
        </div>
    );
}

export default Sidemenu_teamleader;
