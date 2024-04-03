import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import suitcase_black from "../../assets/images/suitcase_black.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Prevwork_teamleader() {
    // Define states

    const Navigate = useNavigate();


    useEffect(() => {
        let user_id = localStorage.getItem("user_id");
        console.log(user_id);
    }, []);



    return (
        <div className="teamleader-wrapper">
            <div className="prevwork-teamleader-content">

                <div className="header">
                    <h4><img className="title-img" src={suitcase_black} alt="suitcase" /> Previous work</h4>
                    <p>This is your prevoius work. All the projects are locked since they have been sent in. In case important information have been missed out in one of your previous projects, please send a message to our office by clicking the email-icon to corresponding project.</p>
                </div>

                <div className="my-5">

                    <div className="prevwork-box d-flex mb-2">
                        <div className="prevwork-box-left d-flex">
                            <p className="ml-2">Ekhammarskolan</p>
                            <p className="mx-5 ">P</p>
                            <p className="">G</p>
                            <p className="mx-5 ">12/3/24</p>
                            <i class="fa-solid fa-lock"></i>
                        </div>
                        <div className="prevwork-box-mid mx-2">
                            <p className="ml-2"><i class="fa-regular fa-paper-plane"></i> 13/3/24</p>
                        </div>
                        <div className="prevwork-box-right">
                            <i class="fa-regular fa-envelope"></i>
                        </div>
                    </div>


                    <div className="prevwork-box d-flex mb-2">
                        <div className="prevwork-box-left d-flex">
                            <p className="ml-2">Ekhammarskolan</p>
                            <p className="mx-5 ">P</p>
                            <p className="">G</p>
                            <p className="mx-5 ">12/3/24</p>
                            <i class="fa-solid fa-lock"></i>
                        </div>
                        <div className="prevwork-box-mid mx-2">
                            <p className="ml-2"><i class="fa-regular fa-paper-plane"></i> 13/3/24</p>
                        </div>
                        <div className="prevwork-box-right">
                            <i class="fa-regular fa-envelope"></i>
                        </div>
                    </div>


                    <div className="prevwork-box d-flex mb-2">
                        <div className="prevwork-box-left d-flex">
                            <p className="ml-2">Ekhammarskolan</p>
                            <p className="mx-5 ">P</p>
                            <p className="">G</p>
                            <p className="mx-5 ">12/3/24</p>
                            <i class="fa-solid fa-lock"></i>
                        </div>
                        <div className="prevwork-box-mid mx-2">
                            <p className="ml-2"><i class="fa-regular fa-paper-plane"></i> 13/3/24</p>
                        </div>
                        <div className="prevwork-box-right">
                            <i class="fa-regular fa-envelope"></i>
                        </div>
                    </div>

                </div>
            </div>



            <Sidemenu_teamleader />

        </div>
    );
}
export default Prevwork_teamleader;