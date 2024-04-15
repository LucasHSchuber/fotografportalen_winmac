import React, { useEffect, useState, } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import flash_black from "../../assets/images/flash_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";
import group from "../../assets/images/group.png";
import portrait from "../../assets/images/portrait.png";
import portrait2 from "../../assets/images/portrait2.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";
import Minimenu_teamleader from "../../components/teamleader/minimenu_teamleader";
import Anomalyreport from "../../components/teamleader/anomalyreport";
import DeleteTeam from "../../components/teamleader/deleteteamModal";
import EditTeam from "../../components/teamleader/editteamModal";

import '../../assets/css/teamleader/main_teamleader.css';


function Portal_teamleader() {
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

    // Accessing the projectId from URL parameters
    const { project_id } = useParams();

    const handleClose = () => setShowDeleteTeamModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);


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

        const fetchProject = async () => {
            try {
                const projectData = await window.api.getProjectById(project_id);
                console.log('Project:', projectData.project);
                setProject(projectData.project);
                setProjectType(projectData.project.type);
                setProjectName(projectData.project.projectname);
                setProjectAnomaly(projectData.project.anomaly);
                setProjectMergedTeams(projectData.project.merged_teams);
                localStorage.setItem("project_type", projectData.project.type);

                fetchTeamsByProjectId();
            } catch (error) {
                console.error('Error fetching project:', error);
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

        fetchProject();

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
        } catch (error) {
            console.error('Error refreshing project:', error);
        }
    };

    //triggered after deleting a team
    const refreshTeamData = async () => {
        try {
            const teamsData = await window.api.getTeamsByProjectId(project_id);
            console.log('Teams:', teamsData.teams);
            setTeams(teamsData.teams);
        } catch (error) {
            console.error('Error refreshing teams:', error);
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
                    <div className="portal-teamleader-content">
                        {project && ( // Check if projectname is available
                            <>
                                <div className="header mb-5">
                                    <h5>{project.type === "school" ? <img className="portal-title-img mr-3" src={academic_black} alt="academic" /> : <img className="portal-title-img mr-3" src={running_black} alt="running" />}{project.projectname}  <em>({project.created.length > 0 ? project.created.substring(0, 10) : ""})</em></h5>
                                    {/* <h6 className=""><em>{project.created.substring(0, 10)}</em></h6> */}
                                </div>

                                <h6 className="mb-3" style={{ textDecoration: "underline" }} ><b>{project.type === "school" ? "Classes" : "Teams"}</b></h6>

                                <div>
                                    {teams && teams.length > 0 ? (
                                        teams.sort((a, b) => new Date(b.created) - new Date(a.created)).map(data => (
                                            <div key={data.team_id} className="d-flex">
                                                <div className={`d-flex justify-content-between mb-2 ${projectType === "school" ? "portal-class-box" : "portal-team-box"}`}
                                                >
                                                    <p className="ml-2 mr-2">{data.teamname.length > 15 ? data.teamname.substring(0, 15) + "..." : data.teamname}</p>
                                                    {data.protected_id === 1 ? (
                                                        <div className="d-flex">
                                                            <p className="ml-4">{data.portrait === 1 ? <i class="fa-solid fa-user"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                                            <p className="ml-1 mr-3 ">{data.protected_id === 1 ? <i class="fa-solid fa-user-shield"></i> : ""}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="mx-4 ">{data.portrait === 1 ? <i class="fa-solid fa-user"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                                    )}


                                                    <p className="mx-4 ">{data.crowd === 1 ? <i class="fa-solid fa-people-group"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                                    <p className="ml-4 mr-2">{data.amount}st</p>
                                                    {projectType === "sport" ? (
                                                        <p className="mx-4">{projectType === "sport" ? data.sold_calendar && data.sold_calendar === 1 ? <i class="fa-regular fa-calendar-plus"></i> : <i class="fa-regular fa-calendar-minus"></i> : ""}</p>
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
                                            <h6>{project.type === "school" ? "No classes yet" : "No teams yet"}</h6>
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
                                                {teams.reduce((total, team) => total + team.amount, 0)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="portal-analytics mx-3">
                                        <p>
                                            {projectType === "school" ? "Photographed classes" : "Photographed teams"}
                                        </p>
                                        <div className="portal-analytics-number">
                                            {teams.length}
                                        </div>
                                    </div>
                                    {projectType === "sport" && (
                                        <div className="portal-analytics">
                                            <p>
                                                Sold calendars
                                            </p>
                                            <div className="portal-analytics-number">
                                                {teams.reduce((total, calendars) => total + calendars.sold_calendar, 0)}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </>
                        )}
                    </div>

                    <Minimenu_teamleader project_type={projectType} project_id={project_id} project_name={projectName} toggleAnomalyReport={toggleAnomalyReport} />
                    <Sidemenu_teamleader />
                    {showAnomalyReport && <Anomalyreport toggleAnomalyReport={toggleAnomalyReport} project_anomaly={projectAnomaly} merged_teams={projectMergedTeams} refreshAnomalyData={refreshAnomalyData} />}
                    <DeleteTeam showDeleteTeamModal={showDeleteTeamModal} handleClose={handleClose} projectType={projectType} teamName={teamName} teamId={teamId} refreshTeamData={refreshTeamData} />
                    <EditTeam showEditModal={showEditModal} handleCloseEditModal={handleCloseEditModal} projectType={projectType} teamData={editTeam} teamId={teamId} refreshTeamData={refreshTeamData}  />

                </>
            )}
        </div>
    );

}
export default Portal_teamleader;