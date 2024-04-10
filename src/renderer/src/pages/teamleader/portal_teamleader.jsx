import React, { useEffect, useState, } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import flash_black from "../../assets/images/flash_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";
import group from "../../assets/images/group.png";
import portrait from "../../assets/images/portrait.png";
import portrait2 from "../../assets/images/portrait2.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";
import Minimenu_teamleader from "../../components/teamleader/minimenu_teamleader";
import Anomalyreport from "../../components/teamleader/anomalyreport";

import '../../assets/css/teamleader/main_teamleader.css';


function Portal_teamleader() {
    // Define states
    const [project, setProject] = useState({});
    const [projectType, setProjectType] = useState({});
    const [projectName, setProjectName] = useState("");
    const [projectAnomaly, setProjectAnomaly] = useState("");
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAnomalyReport, setShowAnomalyReport] = useState(false); // State for toggling Anomalyreport visibility


    // Accessing the projectId from URL parameters
    const { project_id } = useParams();


    const toggleAnomalyReport = () => {
        setShowAnomalyReport(!showAnomalyReport);
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
                localStorage.setItem("project_type", projectData.project.type);
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
        } catch (error) {
            console.error('Error refreshing project:', error);
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
                                    <h5>{project.type === "school" ? <img className="portal-title-img mr-3" src={academic_black} alt="academic" /> : <img className="portal-title-img mr-3" src={running_black} alt="running" />}{project.projectname}  <em>({project.created.substring(0, 10)})</em></h5>
                                    {/* <h6 className=""><em>{project.created.substring(0, 10)}</em></h6> */}
                                </div>

                                <h6 className="mb-3" style={{ textDecoration: "underline" }} ><b>{project.type === "school" ? "Classes" : "Teams"}</b></h6>

                                <div>
                                    {teams && teams.length > 0 ? (
                                        teams.sort((a, b) => new Date(b.created) - new Date(a.created)).map(data => (
                                            <div className="d-flex">
                                                <div key={data.team_id} className={`d-flex mb-2 ${projectType === "school" ? "portal-class-box" : "portal-team-box"}`}
                                                >
                                                    <p className="ml-2 mr-4">{data.teamname}</p>
                                                    <p className="mx-4 ">{data.portrait === 1 ? <i class="fa-solid fa-user"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                                    <p className="mx-4 ">{data.crowd === 1 ? <i class="fa-solid fa-people-group"></i> : <i class="fa-solid fa-minus"></i>}</p>
                                                    {/* <p className="mx-2 ">{data.portrait === 1 ? <img className="type-img-currwork" src={portrait2} alt="portrait"></img> : <i class="fa-solid fa-minus"></i>}</p>
                                                <p className="mx-2 ">{data.crowd === 1 ? <img className="type-img-currwork" src={group} alt="group"></img> : <i class="fa-solid fa-minus"></i>}</p> */}
                                                    <p className="mx-4">{data.amount}st</p>
                                                    <p className="mx-4">{projectType === "sport" ? data.sold_calendar && data.sold_calendar === 1 ? <i class="fa-regular fa-calendar-plus"></i> : <i class="fa-regular fa-calendar-minus"></i> : ""}</p>
                                                </div>
                                                <div className="portal-edit-box ml-2">
                                                    <p><i class="fa-solid fa-pencil"></i></p>
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
                    {showAnomalyReport && <Anomalyreport toggleAnomalyReport={toggleAnomalyReport} project_anomaly={projectAnomaly} refreshAnomalyData={refreshAnomalyData} />}

                </>
            )}
        </div>
    );

}
export default Portal_teamleader;