import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';

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
    const [internetAccess, setInternetAccess] = useState(true);

    const handleClose = () => setShowModal(false);
    // const handleShow = () => setShowModal(true);

    useEffect(() => {
        const checkInternetConnection = () => {
            if (navigator.onLine) {
                console.log("Internet access");
                setInternetAccess(true);
            } else {
                console.log("No internet access");
                setInternetAccess(false);
            }
        };
        checkInternetConnection();
        const intervalId = setInterval(checkInternetConnection, 15000); // run every 20 sec to make sure internet connection is still available
        return () => clearInterval(intervalId);
    }, [])



    return (
        <div className="sidemenu-teamleader">
            {/* Alert user if no internet connection */}
            {!internetAccess && (
                <div className="nointernet-box d-flex justify-content-center">
                    <FontAwesomeIcon className="mr-1" icon={faWifi} size="xs"/>
                    <h6 style={{ fontSize: "0.7em" }}>No connection</h6>
                </div>
            )}
            <div className={`logo ${internetAccess ? "logo-spin": ""}`}>
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
                        <p>Previous Jobs</p>
                    </NavLink>
                </div>
                <div className="link-box">
                    <NavLink exact="true" to="/currwork_teamleader">
                        <img className="link-img" src={flash} alt="flash img" />
                        <p>Current Jobs</p>
                    </NavLink>
                </div>
                <div className="link-box">
                    <NavLink exact="true" to="/newproject_teamleader">
                        <img className="link-img" src={plus} alt="add img" />
                        <p>New Job</p>
                    </NavLink>
                </div>
            </ul>

            {/* Render the modal */}
            {/* <NewProjectModal showModal={showModal} handleClose={handleClose} /> */}
        </div>
    );
}

export default Sidemenu_teamleader;
