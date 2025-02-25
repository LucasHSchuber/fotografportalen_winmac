import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';

import fp from "../../assets/images/diaphragm.png";
import house from "../../assets/images/house.png";
import uploadedfile from "../../assets/images/uploadedfile.png";

import '../../assets/css/backuptransfer/components_backuptransfer.css'


const Sidemenu_backuptransfer = () => {

    //define states
    const [showModal, setShowModal] = useState(false);
    const [internetAccess, setInternetAccess] = useState(true);


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
        checkInternetConnection(); checkInternetConnection();
        const intervalId = setInterval(checkInternetConnection, 15000); // run every 20 sec to make sure internet connection is still available
        return () => clearInterval(intervalId);
    }, [])



    return (
        <div className="sidemenu-backuptransfer">
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
                    <NavLink exact="true" to="/home_backuptransfer">
                        <img className="link-img" src={house} alt="house img" />
                        <p>Home</p>
                    </NavLink>
                </div>
                <div className="link-box">
                    <NavLink exact="true" to="/history_backuptransfer">
                        <img className="link-img" src={uploadedfile} alt="uploaded files img" style={{ marginLeft: "42px" }} />
                        <p>Backup History</p>
                    </NavLink>
                </div>
            </ul>

        </div>
    );
}

export default Sidemenu_backuptransfer;
