import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
// import logo from "../assets/images/camera1.png";
import fp from "../assets/images/diaphragm.png";
import teamleader from "../assets/images/teamwork.png";
import cloud from "../assets/images/cloud.png";



function Sidemenu() {

    //define states
    const [internetAccess, setInternetAccess] = useState(false);

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
                        <img className="link-img" src={teamleader} alt="teamleader" />
                        <p>Teamleader</p>
                    </NavLink>
                </div>
                <div className="link-box">
                    <NavLink to="/" exact="true" >
                        <img className="link-img" src={cloud} alt="cloud" />
                        <p>Filetransfer</p>
                    </NavLink>
                </div>
            </ul>
        </div>
    );
}

export default Sidemenu;
