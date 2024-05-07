import React, { useEffect, useState, } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faUser, faMinus, faPeopleGroup, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faCalendarPlus, faCalendarMinus } from '@fortawesome/free-regular-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
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

    const [showAnomalyReport, setShowAnomalyReport] = useState(false); // State for toggling Anomalyreport visibility
    const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [feedbackMessage, setFeedbackMessage] = useState('');

    // Accessing the projectId from URL parameters
    const { project_id } = useParams();
    // Accessing feedbackMessage from query parameters 
    // const searchParams = new URLSearchParams(location.search);

    //methods passed from components
    const handleClose = () => setShowDeleteTeamModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);


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

    const toggleAnomalyReport = () => {
        setShowAnomalyReport(!showAnomalyReport);
    };

    const openDeleteTeamModal = (team_id, team_name) => {
        setTeamName(team_name);
        setTeamId(team_id);
        setShowDeleteTeamModal(true);
    }

    const openEditModal = async (team_id, data) => {
        // setTeamName(data.team_name);
        setTeamId(team_id);
        setEditTeam(data);
        setShowEditModal(true);
    };

    //load loading bar on load
    useEffect(() => {
        let project_id = localStorage.getItem("project_id");
        console.log(project_id);

        const fetchProject = async () => {
            try {
                const projectData = await window.api.getProjectById(project_id);
                if (projectData && projectData.project) {
                    console.log('Project:', projectData.project);
                    setProject(projectData.project);
                    setProjectType(projectData.project.type);
                    setProjectName(projectData.project.projectname);
                    setProjectAnomaly(projectData.project.anomaly);
                    setProjectMergedTeams(projectData.project.merged_teams);
                    localStorage.setItem("project_type", projectData.project.type);
                    fetchTeamsByProjectId();
                } else {
                    console.error('Error: Project data is null or undefined');
                    fetchProject();
                }
            } catch (error) {
                console.error('Error fetching project:', error);
                fetchProject();
            }
        };

        const fetchTeamsByProjectId = async () => {
            try {
                const teamsData = await window.api.getTeamsByProjectId(project_id);
                console.log('Teams:', teamsData.teams);
                setTeams(teamsData.teams);
                // setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        // const fetchUser = async () => {
        //     let user_id = localStorage.getItem("user_id");
        //     try {
        //         const userData = await window.api.getUser(user_id);
        //         if (userData && userData.user) {
        //             console.log('User:', userData.user);
        //             setUserForControlSheet(userData.user.firstname + " " + userData.user.lastname);
        //         } else {
        //             console.error('Error: User data is null or undefined');
        //         }
        //     } catch (error) {
        //         console.error('Error fetching user:', error);
        //     }
        // };

        // fetchUser();
        fetchProject()

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




    return (
        <div className="teamleader-wrapper">

            {loading ? (
                <div>
                    <div className="loading-bar-text">
                        <p><b>Loading project...</b></p>
                    </div>
                    <div className="loading-bar-container">
                        <div className="loading-bar"></div>
                    </div>
                </div>
            ) : (

                <>
                    {project && ( // Check if project is available
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
                                                <div className={`d-flex justify-content-between mb-2 ${projectType === "school" ? "portal-class-box" : "portal-team-box"}`}
                                                >
                                                    <p style={{ cursor: "default" }} className="ml-2 mr-2">{data.teamname.length > 15 ? data.teamname.substring(0, 15) + "..." : data.teamname}</p>
                                                    {data.protected_id === 1 ? (
                                                        <div className="d-flex">
                                                            <p className="ml-4" title="portrait">{data.portrait === 1 ? <FontAwesomeIcon icon={faUser} /> : <FontAwesomeIcon icon={faMinus} />}</p>
                                                            <p className="ml-1 mr-3" title="protected id">{data.protected_id === 1 ? <FontAwesomeIcon icon={faUserShield} /> : ""}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="mx-4" title="portrait">{data.portrait === 1 ? <FontAwesomeIcon icon={faUser} /> : <FontAwesomeIcon icon={faMinus} />}</p>
                                                    )}

                                                    <p className="mx-4 " title="group">{data.crowd === 1 ? <FontAwesomeIcon icon={faPeopleGroup} /> : <FontAwesomeIcon icon={faMinus} />}</p>
                                                    <p style={{ cursor: "default" }} className="ml-4 mr-2">{data.amount}st</p>
                                                    {projectType === "sport" ? (
                                                        <p className="mx-4" title="sold calendar">{projectType === "sport" ? data.sold_calendar && data.sold_calendar === 1 ? <FontAwesomeIcon icon={faCalendarPlus} /> : <FontAwesomeIcon icon={faCalendarMinus} /> : ""}</p>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )}

                                                </div>
                                                <div className="portal-edit-box ml-2"
                                                    onClick={() => openEditModal(data.team_id, data)}
                                                >
                                                    <p><FontAwesomeIcon icon={faPencilAlt} /></p>
                                                </div>
                                                <div className="portal-delete-box ml-2"
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

                                <div className="d-flex mt-5">
                                    <div className="portal-analytics">
                                        <p>
                                            Photographed subjects
                                        </p>
                                        <div className="test">
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
                    {showAnomalyReport && <Anomalyreport toggleAnomalyReport={toggleAnomalyReport} project_anomaly={projectAnomaly} merged_teams={projectMergedTeams} refreshAnomalyData={refreshAnomalyData} updateFeedbackMessage={updateFeedbackMessage} />}
                    <DeleteTeam showDeleteTeamModal={showDeleteTeamModal} handleClose={handleClose} projectType={projectType} teamName={teamName} teamId={teamId} refreshTeamData={refreshTeamData} updateFeedbackMessage={updateFeedbackMessage} />
                    <EditTeam showEditModal={showEditModal} handleCloseEditModal={handleCloseEditModal} projectType={projectType} teamData={editTeam} teamId={teamId} refreshTeamData={refreshTeamData} updateFeedbackMessage={updateFeedbackMessage} />
                    <FeedbackMessage feedbackMessage={feedbackMessage} />
                </>
            )}
        </div>
    );

}
export default Portal_teamleader;