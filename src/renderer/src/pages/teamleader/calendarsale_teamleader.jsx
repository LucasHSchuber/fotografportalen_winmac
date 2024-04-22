import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import calendarsale from "../../assets/images/calendarimg.jpg";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";
import CalendarConfirm from "../../components/teamleader/calendarconfirmModal";

import '../../assets/css/teamleader/main_teamleader.css';


function Calendarsale_teamleader() {
    // Define states
    const [project_id, setProject_id] = useState(false);
    const [teamData, setTeamData] = useState({});
    const [showCalendarConfirmModal, setShowCalendarConfirmModal] = useState(false);

    const handleClose = () => { setShowCalendarConfirmModal(false) };

    const navigate = useNavigate();


    //if pressing back button
    const handleBack = () => {
        let project_id = localStorage.getItem("project_id");
        setProject_id(project_id);
        navigate(`/addleaderinfo_teamleader`);
    };

    //if pressing yes button
    const yesCalendarSales = () => {
        localStorage.setItem("calendar_sale", 1);
        navigate("/yescalendarsale_teamleader");
    }
    //if pressing no button
    const noCalendarSales = () => {
        localStorage.setItem("calendar_sale", 0);

        let calendar_sale = localStorage.getItem("calendar_sale");
        let newteam_teamname = localStorage.getItem("newteam_teamname");
        let newteam_leaderfirstname = localStorage.getItem("newteam_leaderfirstname");
        let newteam_leaderlastname = localStorage.getItem("newteam_leaderlastname");
        let newteam_leaderemail = localStorage.getItem("newteam_leaderemail");
        let newteam_leadermobile = localStorage.getItem("newteam_leadermobile");

        const leaderData = {
            calendar: calendar_sale,
            teamname: newteam_teamname,
            firstname: newteam_leaderfirstname,
            lastname: newteam_leaderlastname,
            email: newteam_leaderemail,
            mobile: newteam_leadermobile
        };
        setTeamData(leaderData);

        setShowCalendarConfirmModal(true);
    }

    const confirmCalendar = async () => {
        let project_id = localStorage.getItem("project_id");
        console.log(project_id);
        let newteam_teamname = localStorage.getItem("newteam_teamname");
        let newteam_leaderfirstname = localStorage.getItem("newteam_leaderfirstname");
        let newteam_leaderlastname = localStorage.getItem("newteam_leaderlastname");
        let newteam_leaderemail = localStorage.getItem("newteam_leaderemail");
        let newteam_leadermobile = localStorage.getItem("newteam_leadermobile");

        try {
            const teamData = await window.api.createNewTeam({
                teamname: newteam_teamname,
                leader_firstname: newteam_leaderfirstname,
                leader_lastname: newteam_leaderlastname,
                leader_email: newteam_leaderemail,
                leader_mobile: newteam_leadermobile,
                project_id: project_id
            });
            console.log('Class:', teamData.teams);

            navigate("/newteam_teamleader");

        } catch (error) {
            console.error('Error creating class:', error);
        }
    }


    return (
        <div className="teamleader-wrapper">

            <div className="calendarsale-teamleader-content">


                <div className="breadcrumbs d-flex mb-4">
                    <div className="breadcrumbs-box ">1. New team</div>
                    <div className="breadcrumbs-box breadcrumbs-active">2. Calander</div>
                    <div className="breadcrumbs-box">3. Calendar information</div>
                </div>

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
                    <button className="button cancel fixed-width mr-1" onClick={handleBack}>Back</button>
                    <button className="button standard fixed-width" onClick={yesCalendarSales}>Yes, of course</button>
                    <br />
                    <br />
                    <a style={{ textDecoration: "underline", cursor: "pointer" }} onClick={noCalendarSales}>No, I'm not intersted in earning money by selling calendars</a>
                </div>

            </div>

            <Sidemenu_teamleader />
            <CalendarConfirm showCalendarConfirmModal={showCalendarConfirmModal} handleClose={handleClose} confirmCalendar={confirmCalendar} teamData={teamData} />
        </div>
    );
}
export default Calendarsale_teamleader;