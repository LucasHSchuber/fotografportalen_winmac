import React, { useEffect, useState, } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faUser, faMinus, faPeopleGroup, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faCalendarPlus, faCalendarMinus } from '@fortawesome/free-regular-svg-icons';
import { faPencilAlt, faPlus, faCopy } from '@fortawesome/free-solid-svg-icons';
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";
import Minimenu_teamleader from "../../components/teamleader/minimenu_teamleader";
import Anomalyreport from "../../components/teamleader/anomalyreport";
import DeleteTeam from "../../components/teamleader/deleteteamModal";
import EditTeam from "../../components/teamleader/editteamModal";
import FeedbackMessage from "../../components/feedbackMessage";

import '../../assets/css/teamleader/main_teamleader.css';


function Portal_teamleader() {
    const location = useLocation();
    // Define states
    const [userLang, setUserLang] = useState("");
    const [project, setProject] = useState({});
    const [projectType, setProjectType] = useState({});
    const [projectName, setProjectName] = useState("");
    const [projectAnomaly, setProjectAnomaly] = useState("");
    const [projectMergedTeams, setProjectMergedTeams] = useState("");
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [teamId, setTeamId] = useState("");
    const [editTeam, setEditTeam] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAnomalyReport, setShowAnomalyReport] = useState(false); 
    const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const { project_id } = useParams();

    //methods passed from components
    const handleClose = () => setShowDeleteTeamModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);

    const navigate = useNavigate();
    //navigate user to newteam_teamleader page
    const createNewTeam = () => {
        console.log("new team");
        if (projectType === "sport") {
            navigate("/addleaderinfo_teamleader");
        } else {
            navigate("/newteam_teamleader");
        }
    }

    // Get user_lang from local storage
    useEffect(() => {
      const user_lang = localStorage.getItem("user_lang");
      setUserLang(user_lang);
    }, []);


    // Function to update feedback message from new team
    useEffect(() => {
        const updateFeedbackMessage = () => {
            let feedbackMessage_newteam = sessionStorage.getItem("feedbackMessage_newteam");
            if (feedbackMessage_newteam) {
                setTimeout(() => {
                    setFeedbackMessage(feedbackMessage_newteam);
                    setTimeout(() => {
                        setFeedbackMessage('');
                        sessionStorage.removeItem("feedbackMessage_newteam");
                    }, 3000);
                }, 1300);
            }
        };
        updateFeedbackMessage();
        return () => {
            sessionStorage.removeItem("feedbackMessage_newteam");
        };
    }, []);

    // Function to update feedback message 
    const updateFeedbackMessage = (message) => {
        setFeedbackMessage(message);
        setTimeout(() => {
            setFeedbackMessage('');
        }, 3000);
    };


    // Method to toggle anomaly report
    const toggleAnomalyReport = () => {
        setShowAnomalyReport(!showAnomalyReport);
    };

    // Method to open delete team modal
    const openDeleteTeamModal = (team_id, team_name) => {
        setTeamName(team_name);
        setTeamId(team_id);
        setShowDeleteTeamModal(true);
    }

    
    const openEditModal = async (team_id, data) => {
        setTeamId(team_id);
        setEditTeam(data);
        setShowEditModal(true);
    };


    // Method to copy photolink name
    const copyPhotolinkName = (teamname) => {
        console.log('teamname', teamname);
        console.log('projectName', projectName);
        //Split string and copies to clipboard
        const projectnameSplit = projectName.split(" - ");
        const firstSplit = projectnameSplit[0].split("-")
        const photolinkName = firstSplit[firstSplit.length-1] + " - " + teamname;
        console.log('photolinkName', photolinkName);
        //copy to clipboard
        navigator.clipboard.writeText(photolinkName).then(() => {
            console.log('copied to clipbord: ', photolinkName);
            updateFeedbackMessage("Photolink name copied!");   
        }).catch(error => {
            console.log('failed to copy to clipbord: ', photolinkName);
            console.log('Error: ', error);
        })
    }


    //fetch projects and teams data
    useEffect(() => {
        let project_id = localStorage.getItem("project_id");
        console.log(project_id);

        const fetchProject = async () => {
            try {
                const projectData = await window.api.getProjectById(project_id);
                if (projectData.status === 200) {
                    console.log('Project:', projectData.project);
                    setProject(projectData.project);
                    setProjectType(projectData.project.type);
                    setProjectName(projectData.project.projectname);
                    setProjectAnomaly(projectData.project.anomaly);
                    setProjectMergedTeams(projectData.project.merged_teams);
                    localStorage.setItem("project_type", projectData.project.type);
                } else {
                    console.error('Error: Project data is null or undefined');
                    setTimeout(() => {
                        updateFeedbackMessage("Error loading project data");       
                    }, 3000);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
                setTimeout(() => {
                    updateFeedbackMessage("Error loading project data");       
                }, 3000);
            }
        };
        const fetchTeamsByProjectId = async () => {
            try {
                const teamsData = await window.api.getTeamsByProjectId(project_id);
                console.log('Teams:', teamsData.teams);
                setTeams(teamsData.teams);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };
        fetchProject();
        fetchTeamsByProjectId();
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);


    //triggered after updating anomaly report
    const refreshAnomalyData = async () => {
        try {
            const projectData = await window.api.getProjectById(project_id);
            console.log('Project Anomaly Refresh:', projectData.project);
            setProjectAnomaly(projectData.project.anomaly);
            setProjectMergedTeams(projectData.project.merged_teams);
            setProject(projectData.project);
        } catch (error) {
            console.error('Error refreshing project:', error);
        }
    };

    //triggered after deleting or updating a team
    const refreshTeamData = async () => {
        try {
            const teamsData = await window.api.getTeamsByProjectId(project_id);
            console.log('Teams:', teamsData.teams);
            console.log("Refreshing team data after edit");
            setTeams(teamsData.teams);
        } catch (error) {
            console.error('Error refreshing teams:', error);
            refreshTeamData();
        }
    };

    // Method to get short for amount
    const getShortForAmount = (user_lang) => {
        switch (user_lang) {
            case "SE":
                return "st";
            case "FI":
                return "kpl";
            case "DE":
                return "Stk";
            case "DK":
            case "NO":
                return "stk";
            default:
                return ""; 
        }
    };
    

    return (
        <div className="teamleader-wrapper">

            {loading ? (
                <div>
                    <div className="loading-bar-text">
                        <p><b>Loading job...</b></p>
                    </div>
                    <div className="loading-bar-container">
                        <div className="loading-bar"></div>
                    </div>
                </div>
            ) : (

                <>
                    {project && ( 
                        <div className="portal-teamleader-content">

                            <>
                                <div className="header mb-5">
                                    {/* <h5>{project.type === "school" ? <img className="portal-title-img mr-3" src={academic_black} alt="academic" /> : <img className="portal-title-img mr-3" src={running_black} alt="running" />}{project.projectname}  <em>({project.created && project.created.length > 0 ? project.created.substring(0, 10) : ""})</em></h5> */}
                                    <h5>
                                        {project.type === "school" ? (
                                            <img className="portal-title-img mr-3" src={academic_black} alt="academic" />
                                        ) : (
                                            <img className="portal-title-img mr-3" src={running_black} alt="running" />
                                        )}
                                        {project.projectname || "Loading project name..."}{" "}
                                        {/* <em>({project.created && project.created.length > 0 ? project.created.substring(0, 10) : ""})</em> */}
                                    </h5>
                                    {/* <h6 className=""><em>{project.created.substring(0, 10)}</em></h6> */}
                                </div>

                                <h6 className="mb-3" style={{ textDecoration: "underline" }} ><b>{project.type === "school" ? "Classes" : "Teams"}</b></h6>

                                <div>
                                    {teams && teams.length > 0 ? (
                                        teams.sort((a, b) => new Date(b.created) - new Date(a.created)).map(data => (
                                            <div key={data.team_id} className="d-flex">
                                                <div className={`d-flex justify-content-between mb-2 ${projectType === "school" ? "portal-class-box" : "portal-team-box"}`}>
                                                    <p style={{ cursor: "default" }} className="ml-2 mr-2">{data.teamname.length > 15 ? data.teamname.substring(0, 15) + "..." : data.teamname}</p>
                                                    {/* {data.protected_id === 1 ? ( */}
                                                        <div className="d-flex">
                                                            <p className="ml-4" title="Portrait">{data.portrait === 1 ? <FontAwesomeIcon icon={faUser} /> : <FontAwesomeIcon icon={faMinus} />}</p>
                                                            <p className="ml-1 mr-3" title="Protected id">{data.protected_id === 1 ? <FontAwesomeIcon icon={faUserShield} /> : <FontAwesomeIcon icon={faMinus} />}</p>
                                                        </div>
                                                    {/* ) : (
                                                        <p className="mx-4" title="Portrait">{data.portrait === 1 ? <FontAwesomeIcon icon={faUser} /> : <FontAwesomeIcon icon={faMinus} />}</p>
                                                    )} */}
                                                    <p className="mx-4 " title="Group photo">{data.crowd === 1 ? <FontAwesomeIcon icon={faPeopleGroup} /> : <FontAwesomeIcon icon={faMinus} />}</p>
                                                    <p style={{ cursor: "default" }} className="ml-4 mr-2">{data.amount}{getShortForAmount(userLang ?? userLang)}</p>
                                                    {projectType === "sport" ? (
                                                        <p className="mx-4" title="Sold calendar">{projectType === "sport" ? data.sold_calendar && data.sold_calendar === 1 ? <FontAwesomeIcon style={{ color: "#30c427" }} icon={faCalendarPlus} /> : <FontAwesomeIcon style={{ color: "#ff5050" }} icon={faCalendarMinus} /> : ""}</p>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="portal-edit-box ml-2" title={`${projectType === "sport" ? "Edit team" : "Edit class"}`}
                                                    onClick={() => openEditModal(data.team_id, data)}
                                                >
                                                    <p><FontAwesomeIcon icon={faPencilAlt} /></p>
                                                </div>
                                                <div className="portal-copy-box ml-2" title={`${projectType === "sport" ? "Copy photolink team name" : "Copy photolink class name"}`}
                                                    onClick={() => copyPhotolinkName(data.teamname)}
                                                >
                                                    <p><FontAwesomeIcon icon={faCopy} /></p>
                                                </div>
                                                <div className="portal-delete-box ml-2" title={`${projectType === "sport" ? "Delete team" : "Delete class"}`}
                                                    onClick={() => openDeleteTeamModal(data.team_id, data.teamname)}
                                                >
                                                    <p><FontAwesomeIcon icon={faTrashAlt} /></p>
                                                </div>
                                            </div>
                                        ))

                                    ) : (
                                        <>
                                            <h6>{project.type === "school" ? "No added classes" : "No added teams"}</h6>
                                        </>
                                    )}
                                </div>

                                <button className="button standard mt-2" title={project.type === "school" ? "Create new class" : "Create new team"}
                                    onClick={() => createNewTeam()}>
                                    <FontAwesomeIcon icon={faPlus} 
                                />
                                </button>

                                <div className="d-flex mt-5 portal-analytics-box">
                                    <div className="portal-analytics">
                                        <p>
                                            Photographed subjects
                                        </p>
                                        <div>
                                            <div className="portal-analytics-number">
                                                {teams && teams.length > 0 ? teams.reduce((total, team) => total + team.amount, 0) : 0}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="portal-analytics mx-3">
                                        <p>
                                            {projectType === "school" ? "Photographed classes" : "Photographed teams"}
                                        </p>
                                        <div className="portal-analytics-number">
                                            {teams && teams.length > 0 ? teams.length : 0}
                                        </div>
                                    </div>
                                    {projectType === "sport" && (
                                        <div className="portal-analytics">
                                            <p>
                                                Sold calendars
                                            </p>
                                            <div className="portal-analytics-number">
                                                {teams && teams.length > 0 ? teams.reduce((total, calendars) => total + calendars.sold_calendar, 0) : 0}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </>

                        </div>
                    )}

                    <Minimenu_teamleader project_type={projectType} project_id={project_id} project_name={projectName} toggleAnomalyReport={toggleAnomalyReport} project={project} teams={teams} />
                    <Sidemenu_teamleader />
                    {showAnomalyReport && <Anomalyreport projectType={projectType} toggleAnomalyReport={toggleAnomalyReport} project_anomaly={projectAnomaly} merged_teams={projectMergedTeams} refreshAnomalyData={refreshAnomalyData} updateFeedbackMessage={updateFeedbackMessage} />}
                    <DeleteTeam showDeleteTeamModal={showDeleteTeamModal} handleClose={handleClose} projectType={projectType} teamName={teamName} teamId={teamId} refreshTeamData={refreshTeamData} updateFeedbackMessage={updateFeedbackMessage} />
                    <EditTeam showEditModal={showEditModal} handleCloseEditModal={handleCloseEditModal} projectType={projectType} teamData={editTeam} teamId={teamId} refreshTeamData={refreshTeamData} updateFeedbackMessage={updateFeedbackMessage} />
                    <FeedbackMessage feedbackMessage={feedbackMessage} />
                </>
            )}
        </div>
    );

}
export default Portal_teamleader;