import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import flash_black from "../../assets/images/flash_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";
import alert_black from "../../assets/images/alert_black.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Newteam_teamleader() {
    // Define states
    const [projectType, setProjectType] = useState({});
    const [formData, setFormData] = useState({
        teamname: '',
        amount: '',
        protected_id: false,
        portrait: false,
        reason_not_portrait: '',
        crowd: false
    });
    const [errorMessage, setErrorMessage] = useState({
        teamname: false,
        amount: false,
        reason_not_portrait: false
    });
    const [errorMessageSport, setErrorMessageSport] = useState({
        amount: false,
        reason_not_portrait: false
    });
    const [project_id, setProject_id] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const navigate = useNavigate();



    const handleCancel = () => {
        let project_id = localStorage.getItem("project_id");
        setProject_id(project_id);
        navigate(`/portal_teamleader/${project_id}`);
    };

    useEffect(() => {
        let project_type = localStorage.getItem("project_type");
        setProjectType(project_type);
        let project_id = localStorage.getItem("project_id");
        setProject_id(project_id);
    }, []);


    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: newValue });

        console.log(formData.portrait);
        if (projectType === "school" || projectType === "sport_portrait") {
            setErrorMessage({ ...errorMessage, [name]: false });
        } else {
            setErrorMessageSport({ ...errorMessageSport, [name]: false });
        }
    };


    useEffect(() => {
        const fetchLatestTeam = async () => {
            let project_id = localStorage.getItem("project_id");
            console.log(project_id);

            //get latest tuppel in teams-table
            try {
                console.log("getTeamsByProjectId method triggered");
                const teamsData = await window.api.getTeamsByProjectId(project_id);
                console.log('Teams:', teamsData.teams);
                setTimeout(() => {
                    const lastObject = teamsData.teams[teamsData.teams.length - 1];
                    console.log('Last Object:', lastObject);
                    localStorage.setItem("team_id", lastObject.team_id);
                }, 1000);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        }
        fetchLatestTeam();
    }, [])


let isDbLocked = false;

const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDbLocked) {
        console.log("Database is currently locked, please wait.");
        return;
    }

    isDbLocked = true;  
    setIsSubmitting(true);

    try {
        // Set error messages
        if (projectType === "sport") {
            let errorsSport = {};
            if (!formData.amount) errorsSport.amount = true;
            if (!formData.reason_not_portrait && formData.portrait === false) errorsSport.reason_not_portrait = true;
            setErrorMessageSport(errorsSport);
            console.log("errors",errorsSport);
            // Check if any errors exist
            if (Object.keys(errorsSport).length > 0) {
                setIsSubmitting(false);
                return;
            }
        } else if (projectType === "school" || projectType === "sport_portrait") {
            let errors = {};
            if (!formData.teamname) errors.teamname = true;
            if (!formData.amount) errors.amount = true;
            if (!formData.reason_not_portrait && formData.portrait === false) errors.reason_not_portrait = true;
            console.log("errors",errors);
            setErrorMessage(errors);
            // Check if any errors exist
            if (Object.keys(errors).length > 0) {
                setIsSubmitting(false);
                return;
            }
        }

        let project_id = localStorage.getItem("project_id");
        console.log(formData);

        const amountNumber = parseInt(formData.amount);
        console.log(amountNumber);

        // Set boolean values to 0 if not checked
        const portraitValue = formData.portrait ? 1 : 0;
        const crowdValue = formData.crowd ? 1 : 0;
        const protectedIdValue = formData.protected_id ? 1 : 0;

        // If class (school)
        if (projectType === "school" || projectType === "sport_portrait") {
            try {
                const classData = await window.api.createNewClass({
                    ...formData,
                    amount: amountNumber,
                    project_id: project_id,
                    portrait: portraitValue,
                    reason_not_portrait: portraitValue === 0 ? formData.reason_not_portrait : null,
                    crowd: crowdValue,
                    protected_id: protectedIdValue
                });
                console.log('Class response:', classData);
                if (projectType === "school"){
                    sessionStorage.setItem("feedbackMessage_newteam", "New class successfully created");
                } else if (projectType === "sport_portrait"){
                    sessionStorage.setItem("feedbackMessage_newteam", "New team successfully created");
                }
                navigate(`/portal_teamleader/${project_id}`);
            } catch (error) {
                console.error('Error adding class:', error);
            }
            // If team (sport)
        } else if (projectType === "sport") {
            let team_id = localStorage.getItem("team_id");
            let calendar_sale = localStorage.getItem("calendar_sale");
            console.log(team_id);
            console.log(calendar_sale);
            // const calendarSaleValue = calendar_sale ? 1 : 0;
            try {
                const teamData = await window.api.addTeamDataToTeam({
                    ...formData,
                    amount: amountNumber,
                    team_id: team_id,
                    portrait: portraitValue,
                    reason_not_portrait: portraitValue === 0 ? formData.reason_not_portrait : null,
                    crowd: crowdValue,
                    protected_id: protectedIdValue,
                    sold_calendar: calendar_sale
                });
                console.log('Team response:', teamData);

                sessionStorage.setItem("feedbackMessage_newteam", "New team successfully created");
                navigate(`/portal_teamleader/${project_id}`);
                // navigate(`/portal_teamleader/${project_id}?message=Team created successfully!`);

            } catch (error) {
                console.error('Error adding class:', error);
            }

            // Clear data in localstorage
            localStorage.removeItem("newteam_teamname");
            localStorage.removeItem("newteam_leaderfirstname");
            localStorage.removeItem("newteam_leaderlastname");
            localStorage.removeItem("newteam_leaderemail");
            localStorage.removeItem("newteam_leadermobile");

            console.log(localStorage.getItem("newteam_teamname"));
            console.log(localStorage.getItem("newteam_leaderfirstname"));
            console.log(localStorage.getItem("newteam_leaderlastname"));
            console.log(localStorage.getItem("newteam_leaderemail"));
            console.log(localStorage.getItem("newteam_leadermobile"));

            navigate(`/portal_teamleader/${project_id}`);

        } else {
            console.log("Project type is not defined");
        }
    } finally {
        isDbLocked = false;  
        setIsSubmitting(false);
    }
};




    return (
        <div className="teamleader-wrapper">
            <div className="newteam-teamleader-content">

                <div className="header mb-4">
                    {/* <h5>{projectType === "school" ? <img className="portal-title-img mr-3" src={academic_black} alt="academic" /> : <img className="portal-title-img mr-3" src={running_black} alt="running" />}{projectType === "school" ? "Create a new class" : "Create a new team"}</h5> */}
                    <h5>{projectType === "school" ? <img className="portal-title-img mr-3" src={academic_black} alt="academic" /> : projectType === "sport_portrait" ? <img className="portal-title-img mr-3" src={running_black} alt="running" /> : <img className="portal-title-img mr-3" src={alert_black} alt="alert" />}{projectType === "school" ? "Create a new class" : projectType === "sport_portrait" ? "Create a new team" : "Filled out by photographer"}</h5>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        {projectType && projectType === "school" || projectType === "sport_portrait" ? (
                            <div>
                                <input
                                    // className={`form-input-field ${projectType === "school" ? (errorMessage.teamname ? "error-border" : "") : (errorMessageSport.teamname ? "error-border" : "")}`}
                                    className={`form-input-field ${
                                        ((projectType === "school" || projectType === "sport_portrait") && errorMessage.teamname) || 
                                        (projectType === "sport" && errorMessageSport.teamname) 
                                          ? "error-border" 
                                          : ""
                                      }`}
                                    type="text"
                                    id="teamname"
                                    name="teamname"
                                    placeholder={projectType === "school" ? "Class name" : "Team name"}
                                    value={formData.teamname}
                                    onChange={handleChange}
                                />
                            </div>
                        ) : (
                            ""
                        )}
                        <div>
                            {/* <label htmlFor="amount">Amount:</label> */}
                            <input
                                // className={`form-input-field ${projectType === "school" ? (errorMessage.amount ? "error-border" : "") : (errorMessageSport.amount ? "error-border" : "")}`}
                                className={`form-input-field ${
                                    ((projectType === "school" || projectType === "sport_portrait") && errorMessage.amount) || 
                                    (projectType === "sport" && errorMessageSport.amount) 
                                      ? "error-border" 
                                      : ""
                                  }`}
                                type="number"
                                id="amount"
                                name="amount"
                                placeholder={projectType === "school" ? "Amount of photographed students" : "Amount of photographed players"}
                                value={formData.amount}
                                onChange={handleChange}
                                onWheel={(event) => event.target.blur()}
                                onKeyDown={(event) => {
                                    // Prevents changing value by arrow keys
                                    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="checkbox-container d-flex">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="portrait"
                                checked={formData.portrait}
                                onChange={handleChange}
                            />
                            I took portraits
                        </label>
                        {!formData.portrait && (
                            <div className="select-container ml-3">
                            {/* <label htmlFor="reason">Reason:</label> */}
                            <select
                                id="reason"
                                name="reason_not_portrait"
                                // className={`form-select ${projectType === "school" ? (errorMessage.reason_not_portrait ? "error-border" : "") : (errorMessageSport.reason_not_portrait ? "error-border" : "")}`}
                                className={`form-select ${
                                    ((projectType === "school" || projectType === "sport_portrait") && errorMessage.reason_not_portrait) || 
                                    (projectType === "sport" && errorMessageSport.reason_not_portrait) 
                                      ? "error-border" 
                                      : ""
                                  }`}                                
                                value={formData.reason_not_portrait}
                                onChange={handleChange}
                            >
                                <option value="">If not, select reason</option>
                                <option value="Didn't show up">Didn't show up</option>
                                <option value="Another Photographer">Another Photographer</option>
                                <option value="According to agreement">According to agreement</option>
                                <option value="Other">Other reason (see anomaly report)</option>
                            </select>
                            </div>
                        )}
                    </div>
                    <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="crowd"
                                checked={formData.crowd}
                                onChange={handleChange}
                            />
                            I took group photo
                        </label>
                    </div>
                    <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="protected_id"
                                checked={formData.protected_id}
                                onChange={handleChange}
                            />
                            {projectType === "school" ? "There were students with protected ID" : "There were players with protected ID"}
                        </label>
                    </div>
                    <div className="mt-4">
                        <button className="button cancel fixed-width mr-1" type="button" onClick={handleCancel} >Cancel</button>
                        <button className="button standard fixed-width " type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create'}</button>
                    </div>
                    {isSubmitting && <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>}
                </form>

            </div>
            <Sidemenu_teamleader />
        </div>
    );
}
export default Newteam_teamleader;