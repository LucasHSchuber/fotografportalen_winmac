import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';

import fp from "../assets/images/diaphragm.png";
import teamleader from "../assets/images/teamwork.png";
import cloud from "../assets/images/cloud.png";
import backuptransfer from "../assets/images/backuptransfer.png"
// import timereport from "../assets/images/report.png";
import timereport from "../assets/images/timereport.png";



function Sidemenu() {

    //define states
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
        checkInternetConnection();
        const intervalId = setInterval(checkInternetConnection, 15000); // run every 20 sec to make sure internet connection is still available
        return () => clearInterval(intervalId);
    }, [])

    return (
        <div className="sidemenu">
            {/* Alert user if no internet connection */}
            {!internetAccess && (
                <div className="nointernet-box d-flex justify-content-center">
                    <FontAwesomeIcon className="mr-1" icon={faWifi} size="xs"/>
                    <h6 style={{ fontSize: "0.7em" }}>No connection</h6>
                </div>
            )}
            
            {/* Links/buttons */}
            <div title="Home" className={`logo ${internetAccess ? "logo-spin" : ""}`}>
                <NavLink to="/" exact="true">
                    <img src={fp} alt="Home" />
                </NavLink>
            </div>
            <ul className="menu">
                <div title="Workspace" className="link-box">
                    <NavLink to="/home_teamleader" exact="true">
                        <img className="link-img" src={teamleader} alt="Workspace" />
                        <p>Workspace</p>
                    </NavLink>
                </div>
                <div title="Filetransfer" className="link-box">
                    <NavLink to="/home_filetransfer" exact="true" >
                        <img className="link-img" src={cloud} alt="Filestransfer" />
                        <p>Filetransfer</p>
                    </NavLink>
                </div>
                <div title="BackupTransfer" className="link-box">
                    <NavLink to="/home_backuptransfer" exact="true" >
                        <img className="link-img" src={backuptransfer} alt="BackupTransfer" />
                        <p>Backuptransfer</p>
                    </NavLink>
                </div>
                {/* <div title="Time Report" className="link-box">
                    <NavLink to="/home_timereport" exact="true" >
                        <img className="link-img" src={timereport} alt="Time Report" />
                        <p>Time Report</p>
                    </NavLink>
                </div> */}
            </ul>
        </div>
    );
}

export default Sidemenu;
