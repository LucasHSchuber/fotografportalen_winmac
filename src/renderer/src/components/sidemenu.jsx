import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
// import logo from "../assets/images/camera1.png";
import fp from "../assets/images/diaphragm.png";
import teamleader from "../assets/images/teamwork.png";
import cloud from "../assets/images/cloud.png";
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
    }, [])

    return (
        <div className="sidemenu">
            <div className={`logo ${internetAccess ? "logo-spin" : ""}`}>
                <NavLink to="/" exact="true">
                    <img src={fp} alt="Logo" />
                </NavLink>
            </div>
            <ul className="menu">
                <div className="link-box">
                    <NavLink to="/home_teamleader" exact="true">
                        <img className="link-img" src={teamleader} alt="Workspace" />
                        <p>Workspace</p>
                    </NavLink>
                </div>
                <div className="link-box">
                    <NavLink to="/home_filetransfer" exact="true" >
                        <img className="link-img" src={cloud} alt="Filestransfer" />
                        <p>Filetransfer</p>
                    </NavLink>
                </div>
                {/* <div className="link-box">
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
