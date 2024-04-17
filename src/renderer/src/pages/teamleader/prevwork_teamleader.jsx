import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import suitcase_black from "../../assets/images/suitcase_black.png";
import running_gray from "../../assets/images/running_gray.png";
import academic_gray from "../../assets/images/academic_gray.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faNewspaper, faLock } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope as farEnvelope, faPaperPlane } from '@fortawesome/free-regular-svg-icons';


import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";
import Controlsheet from "../../components/teamleader/controlsheetModal";

import '../../assets/css/teamleader/main_teamleader.css';


function Prevwork_teamleader() {
    // Define states
    const [projectsArray, setProjectsArray] = useState([]);
    const [showcControlSheetModal, setShowcControlSheetModal] = useState(false);
    const [teamsForControlSheet, setTeamsForControlSheet] = useState([]);
    const [projectForControlSheet, setProjectForControlSheet] = useState([]);
    const [userForControlSheet, setUserForControlSheet] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [projectType, setProjectType] = useState("");

    const [loading, setLoading] = useState(true);





    useEffect(() => {
        let user_id = localStorage.getItem("user_id");
    }, []);

    useEffect(() => {
        let user_id = localStorage.getItem("user_id");

        const getAllProjects = async () => {
            try {
                const projects = await window.api.getAllPreviousProjects(user_id);
                console.log('Projects:', projects.projects);
                setProjectsArray(projects.projects);

            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        getAllProjects();


        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);

    }, []);


    //open contol sheet modal
    const handleClose = () => { setShowcControlSheetModal(false); }
    const viewControlSheet = (project_id, project_type) => {

        setProjectId(project_id);
        setProjectType(project_type);

        fetchTeamsForControlSheet(project_id);
        setShowcControlSheetModal(true);
    }


    const fetchTeamsForControlSheet = async (project_id) => {
        let user_id = localStorage.getItem("user_id");
        try {
            const teamsData = await window.api.getTeamsByProjectId(project_id);
            console.log('Teams:', teamsData.teams);
            setTeamsForControlSheet(teamsData.teams);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
        try {
            const projectData = await window.api.getProjectById(project_id);
            console.log('Project:', projectData.project);
            setProjectForControlSheet(projectData.project);
        } catch (error) {
            console.error('Error fetching project:', error);
        }
        try {
            const userData = await window.api.getUser(user_id);
            console.log('User:', userData.user);
            setUserForControlSheet(userData.user.firstname + " " + userData.user.lastname);
            console.log(userForControlSheet);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };


    if (loading) {
        return <div>
            <div className="loading-bar-text">
                <p><b>Loading previous work...</b></p>
            </div>
            <div className="loading-bar-container">
                <div className="loading-bar"></div>
            </div>
        </div>;
    }
    return (
        <div className="teamleader-wrapper">
            <div className="prevwork-teamleader-content">

                <div className="header">
                    <h4><img className="title-img" src={suitcase_black} alt="suitcase" /> Previous work</h4>
                    <p>This is your prevoius work. All the projects are locked since they have been sent in. In case important information have been missed out in one of your previous projects, please send a message to our office by clicking the email-icon to corresponding project.</p>
                </div>

                <div className="my-5">
                    {projectsArray && projectsArray.length > 0 ? (
                        projectsArray.sort((a, b) => new Date(b.sent_date) - new Date(a.sent_date)).map(project => (
                            <div key={project.project_id} className="prevwork-box d-flex mb-2">
                                <div className="prevwork-box-left d-flex justify-content-between" title="Job">
                                    <div className="d-flex">
                                        <p className="ml-2">{project.type === "school" ? <img className="type-img-currwork" src={academic_gray} alt="academic"></img> : <img className="type-img-currwork" src={running_gray} alt="running"></img>}</p>
                                        <p className="ml-3">{project.projectname.length > 25 ? project.projectname.substring(0, 25) + "..." : project.projectname}</p>
                                    </div>
                                    <p className="ml-4 mr-5">{project.created.substring(0, 10)}</p>
                                    <FontAwesomeIcon className="mt-1" icon={faLock} />
                                </div>

                                <div className="prevwork-box-mid mx-2">
                                    <p className="ml-2"> <FontAwesomeIcon icon={faPaperPlane} /> {project.sent_date.substring(0, 10)}</p>
                                </div>
                                <div className="prevwork-box-right"
                                    title="View control sheet"
                                    onClick={() => viewControlSheet(project.project_id, project.type)}
                                >
                                    <FontAwesomeIcon icon={faNewspaper} />
                                </div>
                                <div className="prevwork-box-right mx-2"
                                    title="Report to office"
                                >
                                    <FontAwesomeIcon icon={farEnvelope} />
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
            <Controlsheet showcControlSheetModal={showcControlSheetModal} handleClose={handleClose} project_id={projectId} projectType={projectType} teamsForControlSheet={teamsForControlSheet} projectForControlSheet={projectForControlSheet} userForControlSheet={userForControlSheet} />

        </div>
    );
}
export default Prevwork_teamleader;