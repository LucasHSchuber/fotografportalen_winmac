import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

//import images
// import logo from "../assets/images/camera1.png"


function Header() {
    //define states


    return (
        <div className="header">
            <div className="header-wrapper d-flex">
                <h5 className="mt-1">EXPRESS-BILD</h5>
                {/* <div>
                    <img className="logo mx-3" src={logo} akt="test"></img>
                </div> */}
            </div>
        </div>
    );
}
export default Header;
