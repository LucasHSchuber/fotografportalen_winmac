import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import flash_black from "../../assets/images/flash_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";
import SendProjectModal from "../../components/teamleader/sendProjectModal";

import '../../assets/css/teamleader/main_teamleader.css';


function Currwork_teamleader() {
    // Define states
    const [projectsArray, setProjectsArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [projectId, setProjectId] = useState(null);
    const [showSendProjectModal, setShowSendProjectModal] = useState(false);

    const handleCloseProjectModal = () => setShowSendProjectModal(false);

    const navigate = useNavigate();

    //get all projects after page mount
    useEffect(() => {
        let user_id = localStorage.getItem("user_id");
        const getAllProjects = async (retryCount = 3) => {
            try {
                const projects = await window.api.getAllCurrentProjects(user_id);
                console.log('Projects:', projects.projects);
                if (projects && projects.projects) {
                    setProjectsArray(projects.projects);
                } else {
                    console.error('Invalid projects data:', projects);
                    getAllProjects();
                }

            } catch (error) {
                console.error('Error fetching projects:', error);
                if (retryCount > 0) {
                    console.log(`Retrying... Attempts left: ${retryCount}`);
                    // Retry fetching projects after a delay
                    setTimeout(() => {
                        getAllProjects(retryCount - 1);
                    }, 1000); // Adjust the delay as needed
                } else {
                    console.error('Max retry attempts reached. Failed to fetch projects.');
                    // Handle maximum retry attempts reached
                }
            }
        };
        getAllProjects();

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);


    //enter a project (portal_teamleader)
    const enterProject = (project_id) => {
        console.log(project_id);
        localStorage.setItem("project_id", project_id);
        navigate(`/portal_teamleader/${project_id}`);
    }

    //send project to DB
    const sendProject = async (project_id) => {
        console.log(project_id);
        setProjectId(project_id);
        setShowSendProjectModal(true);
    }


    //refresh projects after work been sent in
    const refreshProjects = async () => {
        let user_id = localStorage.getItem("user_id");
        try {
            const projects = await window.api.getAllCurrentProjects(user_id);
            console.log('Projects:', projects.projects);
            setProjectsArray(projects.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };



    if (loading) {
        return <div>
            <div className="loading-bar-text">
                <p><b>Loading current work...</b></p>
            </div>
            <div className="loading-bar-container">
                <div className="loading-bar"></div>
            </div>
        </div>;
    }
    return (
        <div className="teamleader-wrapper">
            <div className="currwork-teamleader-content">
                <div className="header">
                    <h4><img className="title-img" src={flash_black} alt="flash" /> Current work</h4>
                    <p>This is your current work. If a job is finished and ready to be sent in, press the paper plane icon in order to send the job.</p>
                </div>

                <div className="my-5">
                    {projectsArray && projectsArray.length > 0 ? (
                        projectsArray.sort((a, b) => new Date(b.created) - new Date(a.created)).map(project => (
                            <div key={project.project_id} className="currwork-box d-flex mb-2">
                                <div className="currwork-box-left d-flex"
                                    value={project.project_id}
                                    onClick={() => enterProject(project.project_id)}
                                    title={`Open job: ${project.projectname}`}
                                    >
                                    <p className="ml-2 mr-1 ">{project.type === "school" ? <img className="type-img-currwork" src={academic_black} alt="academic"></img> : <img className="type-img-currwork" src={running_black} alt="running"></img>}</p>
                                    <p className="mx-4">{project.projectname.length > 70 ? project.projectname.substring(0, 70) + "..." : project.projectname}</p>
                                    {/* <p className="mx-4">{project.project_date.substring(0, 10)}</p> */}
                                </div>
                                <div className="currwork-box-right mx-2"
                                    value={project.project_id}
                                    onClick={() => sendProject(project.project_id)}
                                    title={`Send job: ${project.projectname}`}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p>No projects found.</p>
                            <a style={{ textDecoration: "underline" }} href="#" onClick={() => window.location.reload()}>Reload page</a>
                        </div>
                    )}
                </div>

            </div>

            <Sidemenu_teamleader />
            <SendProjectModal showSendProjectModal={showSendProjectModal} project_id={projectId} handleCloseProjectModal={handleCloseProjectModal} refreshProjects={refreshProjects} />


        </div>
    );
}
export default Currwork_teamleader;