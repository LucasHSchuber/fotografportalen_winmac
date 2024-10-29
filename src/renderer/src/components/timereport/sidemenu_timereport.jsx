import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import house from "../../assets/images/house.png";
import fp from "../../assets/images/diaphragm.png";
import timereport from "../../assets/images/report.png";

import '../../assets/css/timereport/components_timereport.css'


const Sidemenu_timereport = () => {

    //define states
    const [showModal, setShowModal] = useState(false);
    const [internetAccess, setInternetAccess] = useState(false);

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
    }, [])



    return (
        <div className="sidemenu-timereport">
            <div className={`logo ${internetAccess ? "logo-spin": ""}`}>
                <NavLink to="/" exact="true">
                    <img src={fp} alt="Logo" />
                </NavLink>
            </div>
            <ul className="menu">
                <div className="link-box">
                    <NavLink exact="true" to="/home_timereport">
                        <img className="link-img" src={house} alt="house img" />
                        <p>Home</p>
                    </NavLink>
                </div>
            </ul>
        </div>
    );
}

export default Sidemenu_timereport;
