import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import flash_black from "../../assets/images/flash_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Currwork_teamleader() {
    // Define states
    const [projectsArray, setProjectsArray] = useState([]);
    const [loading, setLoading] = useState(true);



    const navigate = useNavigate();


    useEffect(() => {
        let user_id = sessionStorage.getItem("user_id");
        console.log(user_id);

        const getAllProjects = async () => {
            try {
                const projects = await window.api.getAllProjects(user_id);
                console.log('Projects:', projects.projects);
                setProjectsArray(projects.projects);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        getAllProjects();
    }, []);


    const enterProject = (project_id) => {
        console.log(project_id);
        localStorage.setItem("project_id", project_id);
        navigate(`/portal_teamleader/${project_id}`);
    }


    if (loading) {
        return <div className="page-loading">Loading...</div>;
    }
    // fetch projects WHERE user_id = ? AND WHERE is_sent = 0
    return (
        <div className="teamleader-wrapper">
            <div className="currwork-teamleader-content">
                <div className="header">
                    <h4><img className="title-img" src={flash_black} alt="flash" /> Current work</h4>
                    <p>This is your current work. If a job is finished and ready to be sent in, press the paper plane icon in order to send the job.</p>
                </div>

                <div className="my-5">
                    {projectsArray && projectsArray.length > 0 ? (
                        projectsArray.map(project => (
                            <div key={project.project_id} className="currwork-box d-flex mb-2">
                                <div className="currwork-box-left d-flex"
                                    value={project.project_id}
                                    onClick={() => enterProject(project.project_id)}
                                >
                                    <p className="mx-2 ">{project.type === "school" ? <img className="type-img-currwork" src={academic_black} alt="academic"></img> : <img className="type-img-currwork" src={running_black} alt="running"></img>}</p>
                                    <p className="mx-2">{project.projectname}</p>
                                    <p className="mx-2">{project.created.substring(0, 10)}</p>
                                </div>
                                <div className="currwork-box-right mx-2"
                                    value={project.project_id}
                                    // onClick={() => enterProject(project.project_id)}
                                >
                                    <i className="fa-regular fa-paper-plane"></i>
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
        </div>
    );
}
export default Currwork_teamleader;