import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import flash_black from "../../assets/images/flash_black.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Currwork_teamleader() {
    // Define states

    const Navigate = useNavigate();


    useEffect(() => {
        let user_id = localStorage.getItem("user_id");
        console.log(user_id);
    }, []);


    return (
        <div className="teamleader-wrapper">
            <div className="currwork-teamleader-content">

                <div className="header">
                    <h4><img className="title-img" src={flash_black} alt="flash" /> Current work</h4>
                    <p>This is your current work. If a job is finished and ready to be sent in, press the paper plane icon in order to send the job.</p>
                </div>

            </div>

            <Sidemenu_teamleader />
        </div>
    );
}
export default Currwork_teamleader;