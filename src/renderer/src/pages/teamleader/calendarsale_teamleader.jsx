import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import calendarsale from "../../assets/images/calendarimg.jpg";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";
import CalendarConfirm from "../../components/teamleader/calendarconfirmModal";

import '../../assets/css/teamleader/main_teamleader.css';

// Import language texts for each supported language
import se from '../../assets/language/se.json'; // Swedish
import dk from '../../assets/language/dk.json'; // Daninsh
import fi from '../../assets/language/fi.json'; // Finnihs
import no from '../../assets/language/no.json'; // Norweigan
import de from '../../assets/language/de.json'; // German



function Calendarsale_teamleader() {
    // Define states
    const [project_id, setProject_id] = useState(false);
    const [teamData, setTeamData] = useState({});
    const [showCalendarConfirmModal, setShowCalendarConfirmModal] = useState(false);
    const [languageTexts, setLanguageTexts] = useState({});

    const handleClose = () => { setShowCalendarConfirmModal(false) };

    const navigate = useNavigate();



    useEffect(() => {
        // Determine the language from sessionStorage
        const user_lang = localStorage.getItem('user_lang');
        console.log(user_lang);
        let selectedLang;
        // Set language texts based on the selected language
        switch (user_lang) {
            case 'SE':
                selectedLang = se;
                break;
            case 'DK':
                selectedLang = dk;
                break;
            case 'FI':
                selectedLang = fi;
                break;
            case 'NO':
                selectedLang = no;
                break;
            case 'DE':
                selectedLang = de;
                break;
        }
        setLanguageTexts(selectedLang);
    }, []);



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
                    <div className="breadcrumbs-box ">{languageTexts?.breadcrumb1}</div>
                    <div className="breadcrumbs-box breadcrumbs-active">{languageTexts?.breadcrumb2}</div>
                    <div className="breadcrumbs-box">{languageTexts?.breadcrumb3}</div>
                </div>

                <div className="header mb-4">
                    <h5>{languageTexts?.header2}</h5>
                </div>

                <div style={{ width: "70%" }}>
                    <img className="calendarsale-hero-img" src={calendarsale} alt="calendar sale" />
                    <h5 className="my-3"><b>{languageTexts?.sportcalendar}</b></h5>

                    <p>{languageTexts?.salestextstart}</p>
                    <p style={{ marginBottom: "0" }}><b>{languageTexts?.salestextsheader}</b></p>
                    <p><b>{languageTexts?.salestextcosts}</b></p>
                    
                    <p>{languageTexts?.salestextsend}</p>

                </div>

                <div>
                    <button className="button cancel fixed-width mr-1" onClick={handleBack}>{languageTexts?.backButton}</button>
                    <button className="button standard fixed-width" onClick={yesCalendarSales}>{languageTexts?.yessalesButton}</button>
                    <br />
                    <br />
                    <a style={{ textDecoration: "underline", cursor: "pointer" }} onClick={noCalendarSales}>{languageTexts?.nosalesLink}</a>
                </div>

            </div>

            <Sidemenu_teamleader />
            <CalendarConfirm showCalendarConfirmModal={showCalendarConfirmModal} handleClose={handleClose} confirmCalendar={confirmCalendar} teamData={teamData} />
        </div>
    );
}
export default Calendarsale_teamleader;