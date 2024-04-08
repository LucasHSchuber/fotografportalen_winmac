import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import calendarsale from "../../assets/images/calendarimg.jpg";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Calendarsale_teamleader() {
    // Define states
    const [project_id, setProject_id] = useState(false);


    const navigate = useNavigate();



    const handleBack = () => {
        let project_id = localStorage.getItem("project_id");
        setProject_id(project_id);
        navigate(`/addleaderinfo_teamleader`);
    };

    const yesCalendarSales = () => {
        navigate("/yescalendarsale_teamleader");
    }
    const noCalendarSales = () => {
        navigate("/newteam_teamleader");
    }


    return (
        <div className="teamleader-wrapper">

            <div className="calendarsale-teamleader-content">

                <div className="header mb-4">
                    <h5>Calendar sales</h5>
                </div>

                <div>
                    <img className="calendarsale-hero-img" src={calendarsale} alt="calendar sale" />
                    <h5 className="my-3"><b>Sport calendar</b></h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio officiis saepe sunt rerum, consequatur quas distinctio minus quo veritatis at eveniet culpa, blanditiis repudiandae consequuntur libero porro perferendis eius aut.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio officiis saepe sunt rerum, consequatur quas distinctio minus quo veritatis at eveniet culpa, blanditiis repudiandae consequuntur libero porro perferendis eius aut.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio officiis saepe sunt rerum, consequatur quas distinctio minus quo veritatis at eveniet culpa, blanditiis repudiandae consequuntur libero porro perferendis eius aut.</p>
                </div>

                <div>
                    <button className="button cancel fixed-width fixed-height mr-1" onClick={handleBack}>Back</button>
                    <button className="button standard fixed-width fixed-height " onClick={yesCalendarSales}>Yes, of course</button>
                    <br />
                    <a style={{ textDecoration: "underline" }} onClick={noCalendarSales}>No, I'm not intersted in earning money by selling calendars</a>
                    <br />
                    <button className="button" onClick={noCalendarSales}>No</button>
                </div>

            </div>

            <Sidemenu_teamleader />
        </div>
    );
}
export default Calendarsale_teamleader;