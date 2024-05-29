import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import fp from "../../assets/images/diaphragm.png";
import house from "../../assets/images/house.png";
import flash from "../../assets/images/flash.png";
import more from "../../assets/images/more.png";
import plus from "../../assets/images/plus.png";
import suitcase from "../../assets/images/suitcase.png";


import '../../assets/css/filetransfer/components_filetransfer.css'


const Sidemenu_teamleader = () => {

    //define states
    const [showModal, setShowModal] = useState(false);
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
        <div className="sidemenu-filetransfer">
            <div className={`logo ${internetAccess ? "logo-spin": ""}`}>
                <NavLink to="/" exact="true">
                    <img src={fp} alt="Logo" />
                </NavLink>
            </div>
            <ul className="menu">
                <div className="link-box">
                    <NavLink exact="true" to="/home_filetransfer">
                        <img className="link-img" src={house} alt="house img" />
                        <p>Home</p>
                    </NavLink>
                </div>
            </ul>

        </div>
    );
}

export default Sidemenu_teamleader;
