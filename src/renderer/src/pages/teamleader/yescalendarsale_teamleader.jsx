import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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
    const [formData, setFormData] = useState({
        calendar_amount: "",
        leader_address: "",
        leader_postalcode: "",
        leader_county: "",
        leader_ssn: "",
        terms: false
    });
    const [errorMessage, setErrorMessage] = useState({
        calendar_amount: false,
        leader_address: false,
        leader_postalcode: false,
        leader_county: false,
        leader_ssn: false
    });
    const [showCalendarConfirmModal, setShowCalendarConfirmModal] = useState(false);
    const [showTermsAndConditionBox, setShowTermsAndConditionBox] = useState(false);
    const [teamData, setTeamData] = useState({});
    const [languageTexts, setLanguageTexts] = useState({});
    const [user_lang, setUser_lang] = useState("");


    const handleClose = () => { setShowCalendarConfirmModal(false) };



    useEffect(() => {
        // Determine the language from sessionStorage
        const user_lang = localStorage.getItem('user_lang');
        setUser_lang(user_lang);
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



    const navigate = useNavigate();
    const handleBack = () => {
        navigate(`/calendarsale_teamleader`);
    };


    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'terms' ? checked : value // Update terms separately
        }));
        setErrorMessage({ ...errorMessage, [name]: false }); //clear error-border if typing
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set error messages
        let errors = {};
        if (!formData.calendar_amount) errors.calendar_amount = true;
        if (!formData.leader_address) errors.leader_address = true;
        if (!formData.leader_postalcode) errors.leader_postalcode = true;
        if (!formData.leader_county) errors.leader_county = true;
        if (user_lang === "SE" || user_lang === "DE") {
            if (!formData.leader_ssn) errors.leader_ssn = true;
        }

        // Update error message state
        setErrorMessage(errors);
        // Check if any errors exist
        if (Object.keys(errors).length > 0) {
            return;
        }

        if (!formData.terms) {
            const confirmResponse = window.confirm("You must accept the terms.");
            if (!confirmResponse) {
                return;
            } else {
                return;
            }
        }

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
            mobile: newteam_leadermobile,
            calendaramount: formData.calendar_amount,
            address: formData.leader_address,
            postalcode: formData.leader_postalcode,
            county: formData.leader_county,
            ssn: formData.leader_ssn
        };
        setTeamData(leaderData);

        setShowCalendarConfirmModal(true);
    };

    const confirmCalendar = async () => {

        // let team_id = localStorage.getItem("team_id");
        // console.log(team_id);
        //method to add data to table

        let project_id = localStorage.getItem("project_id");
        console.log(project_id);
        let newteam_teamname = localStorage.getItem("newteam_teamname");
        let newteam_leaderfirstname = localStorage.getItem("newteam_leaderfirstname");
        let newteam_leaderlastname = localStorage.getItem("newteam_leaderlastname");
        let newteam_leaderemail = localStorage.getItem("newteam_leaderemail");
        let newteam_leadermobile = localStorage.getItem("newteam_leadermobile");

        try {
            const teamData = await window.api.createNewTeam({
                ...formData,
                // team_id: team_id
                teamname: newteam_teamname,
                leader_firstname: newteam_leaderfirstname,
                leader_lastname: newteam_leaderlastname,
                leader_email: newteam_leaderemail,
                leader_mobile: newteam_leadermobile,
                project_id: project_id
            });
            console.log('Teams:', teamData.teams);

            setFormData({
                calendar_amount: "",
                leader_address: "",
                leader_postalcode: "",
                leader_county: "",
                leader_ssn: "",
                terms: false
            });
            navigate("/newteam_teamleader");

        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    }


    // const showTermsAndConditions = () => {
    //     console.log("terms and conditions");
    //     setShowTermsAndConditionBox(true);
    // }

    useEffect(() => {
        function handleResize() {
            console.log(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <div className="teamleader-wrapper">

            <div className="calendarsale-teamleader-content">


                <div className="breadcrumbs d-flex mb-4">
                    <div className="breadcrumbs-box ">{languageTexts?.breadcrumb1}</div>
                    <div className="breadcrumbs-box">{languageTexts?.breadcrumb2}</div>
                    <div className="breadcrumbs-box breadcrumbs-active">{languageTexts?.breadcrumb3}</div>
                </div>

                <div className="header mb-4" style={{ width: "37em" }}>
                    <h5>{languageTexts?.header3}</h5>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <input className={`form-input-field ${errorMessage.calendar_amount ? "error-border" : ""}`} type="number" name="calendar_amount" value={formData.calendar_amount} onChange={handleChange} placeholder={languageTexts?.calendaramount} />
                        <h6 style={{ fontSize: "0.9em" }}>{languageTexts?.calendaramounttext}</h6>
                    </div>
                    {/* only show SSN input if SWEDISH OR GERMAN */}
                    {user_lang && (user_lang === "SE" || user_lang === "DE") && (
                        <div style={{}}>
                            <input className={`form-input-field ${errorMessage.leader_ssn ? "error-border" : ""}`} type="number" name="leader_ssn" value={formData.leader_ssn} onChange={handleChange} placeholder={languageTexts?.ssn} />
                        </div>
                    )}
                    <div>
                        <input className={`form-input-field ${errorMessage.leader_address ? "error-border" : ""}`} type="text" name="leader_address" value={formData.leader_address} onChange={handleChange} placeholder={languageTexts?.address} />
                    </div>
                    <div>
                        <input className={`form-input-field ${errorMessage.leader_postalcode ? "error-border" : ""}`} type="number" name="leader_postalcode" value={formData.leader_postalcode} onChange={handleChange} placeholder={languageTexts?.postalcode} />
                    </div>
                    <div>
                        <input className={`form-input-field ${errorMessage.leader_county ? "error-border" : ""}`} type="text" name="leader_county" value={formData.leader_county} onChange={handleChange} placeholder={languageTexts?.county} />
                    </div>
                    <div className="checkbox-container my-3">
                        <label className="mr-2">
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                            />
                            {languageTexts?.acceptTermsAndConditions}
                        </label>
                        <a style={{ textDecoration: "underline" }} onClick={() => setShowTermsAndConditionBox(!showTermsAndConditionBox)}>{languageTexts?.termsAndConditions}</a>
                    </div>

                    <button className="button cancel fixed-width mr-1" onClick={handleBack}>{languageTexts?.backButton}</button>
                    <button className="button standard fixed-width " type="submit">{languageTexts?.finishButton}</button>

                </form>

            </div>


            {showTermsAndConditionBox && (
                <div className="termsandcondition-box">
                    <div className="d-flex justify-content-between mb-3">
                        <h6 style={{ textDecoration: "underline" }}><b>{languageTexts?.tacHeader1}</b></h6>
                        <h6 onClick={() => setShowTermsAndConditionBox(!showTermsAndConditionBox)}><FontAwesomeIcon icon={faTimes} className="fa-s" />
                        </h6>
                    </div>
                    <ul>
                        <li>{languageTexts?.tacLink1}</li>
                        <li>{languageTexts?.tacLink2}</li>
                        <li>{languageTexts?.tacLink3}</li>
                    </ul>

                    <p style={{ fontSize: "0.85em" }}><em>{languageTexts?.tacText}</em></p>

                    <p><b>{languageTexts?.tacHeader2}</b></p>
                    <p>{languageTexts?.tacP1}</p>
                    <p>{languageTexts?.tacP2}</p>
                    <p>{languageTexts?.tacP3}</p>

                    <button className="button cancel fixed-width mt-3" onClick={() => setShowTermsAndConditionBox(!showTermsAndConditionBox)}>Ok</button>

                </div>
            )}

            <Sidemenu_teamleader />
            <CalendarConfirm showCalendarConfirmModal={showCalendarConfirmModal} handleClose={handleClose} confirmCalendar={confirmCalendar} teamData={teamData} />

        </div>
    );
}
export default Calendarsale_teamleader;