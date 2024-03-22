import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/camera1.png";

function Sidemenu() {
    return (
        <div className="sidemenu">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <ul className="menu">
                <li><NavLink exact to="/" activeClassName="activeLink">Index</NavLink></li>
                <li><NavLink to="/home" activeClassName="activeLink">Home</NavLink></li>
            </ul>
        </div>
    );
}

export default Sidemenu;
