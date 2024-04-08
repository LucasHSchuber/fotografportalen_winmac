import React, { useEffect, useState, } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import flash_black from "../../assets/images/flash_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";
import group from "../../assets/images/group.png";
import portrait from "../../assets/images/portrait.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";
import Minimenu_teamleader from "../../components/teamleader/minimenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Portal_teamleader() {
    // Define states
    const [project, setProject] = useState({});
    const [projectType, setProjectType] = useState({});
    const [projectName, setProjectName] = useState("");
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);


    // Accessing the projectId from URL parameters
    const { project_id } = useParams();


    const navigate = useNavigate();


    useEffect(() => {

        let retryCount = 0;
        const maxRetries = 3; // Maximum number of retries

        const fetchProject = async () => {
            try {
                console.log(project_id);
                const projectData = await window.api.getProjectById(project_id);
                console.log('Projects:', projectData.project);
                setProject(projectData.project);
                setProjectType(projectData.project.type);
                setProjectName(projectData.project.projectname);
                localStorage.setItem("project_type", projectData.project.type);
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.error('Error fetching project:', error);
                if (retryCount < maxRetries) {
                    console.log(`Retrying... Retry count: ${retryCount}`);
                    retryCount++;
                    fetchProject(); // Retry fetching project data
                } else {
                    console.error('Max retries reached. Unable to fetch project data.');
                    window.location.reload();

                }
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
    }, [project_id]);


    if (loading) {
        return <div className="page-loading">Loading...</div>;
    }
    return (
        <div className="teamleader-wrapper">
            <div className="currwork-teamleader-content">
                {project && ( // Check if projectname is available
                    <>
                        <div className="header mb-5">
                            <h5>{project.type === "school" ? <img className="portal-title-img mr-3" src={academic_black} alt="academic" /> : <img className="portal-title-img mr-3" src={running_black} alt="running" />}{project.projectname.toUpperCase()}</h5>
                            <h6 className=""><em>{project.created.substring(0, 10)}</em></h6>
                        </div>

                        <h6 style={{ textDecoration: "underline" }} ><b>{project.type === "school" ? "Classes" : "Teams"}</b></h6>

                        <div>
                            {teams && teams.length > 0 ? (
                                teams.sort((a, b) => new Date(b.created) - new Date(a.created)).map(data => (
                                    <div key={data.team_id} className="portal-team-box d-flex mb-2"
                                    >
                                        <p className="ml-2 mr-2">{data.teamname}</p>
                                        <p className="mx-2 ">{data.portrait === 1 ? <img className="type-img-currwork" src={portrait} alt="portrait"></img> : <i class="fa-solid fa-minus"></i>}</p>
                                        <p className="mx-2 ">{data.crowd === 1 ? <img className="type-img-currwork" src={group} alt="group"></img> : <i class="fa-solid fa-minus"></i>}</p>
                                        <p className="mx-2">{data.amount}st</p>
                                    </div>
                                ))

                            ) : (
                                <>
                                    <h6>{project.type === "school" ? "No classes yet" : "No teams yet"}</h6>
                                </>
                            )}
                        </div>

                        <div className="d-flex mt-5">
                            <div className="mr-3 portal-analytics">
                                <p>
                                    Photographed subjects
                                </p>
                                <div className="test">
                                    <div className="portal-analytics-number">
                                        {teams.reduce((total, team) => total + team.amount, 0)}
                                    </div>
                                </div>
                            </div>
                            <div className="portal-analytics">
                                <p>
                                    {projectType === "school" ? "Photographed classes" : "Photographed teams"}
                                </p>
                                <div className="portal-analytics-number">
                                    {teams.length}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Minimenu_teamleader project_type={projectType} project_id={project_id} project_name={projectName} />
            <Sidemenu_teamleader />
        </div>
    );

}
export default Portal_teamleader;