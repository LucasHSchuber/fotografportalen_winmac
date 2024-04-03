import React from "react";
import { Link, NavLink } from "react-router-dom";
// import logo from "../assets/images/camera1.png";
import fp from "../assets/images/diaphragm.png";
import teamleader from "../assets/images/teamwork.png";
import cloud from "../assets/images/cloud.png";


function Sidemenu_small() {
    return (
        <div className="sidemenu_small">
            <ul className="menu-small">
                <div className="link-box-small">
                    <i class="icons fa-solid fa-gear"></i>
                </div>
                <div className="link-box-small">
                    <i class="icons fa-solid fa-user"></i>
                </div>
            </ul>
        </div>
    );
}

export default Sidemenu_small;
