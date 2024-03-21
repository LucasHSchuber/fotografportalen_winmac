import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/camera1.png";

function Sidemenu() {
    return (
        <div className="sidemenu">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <ul className="menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </div>
    );
}

export default Sidemenu;
