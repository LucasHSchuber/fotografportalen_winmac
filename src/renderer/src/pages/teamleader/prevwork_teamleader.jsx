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
import FeedbackMessage from "../../components/feedbackMessage";

import '../../assets/css/teamleader/main_teamleader.css';


function Prevwork_teamleader() {
    // Define states
    const [projectsArray, setProjectsArray] = useState([]);
    const [showControlSheetModal, setShowControlSheetModal] = useState(false);
    const [teamsForControlSheet, setTeamsForControlSheet] = useState([]);
    const [projectForControlSheet, setProjectForControlSheet] = useState([]);
    const [userForControlSheet, setUserForControlSheet] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [projectType, setProjectType] = useState("");

    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [searchString, setSearchString] = useState("");

    const [loading, setLoading] = useState(true);


    // Function to update feedback message
    useEffect(() => {
        const updateFeedbackMessage = () => {
            let feedbackMessage_sentproject = sessionStorage.getItem("feedbackMessage_sentproject");
            let feedbackMessage_deletedproject = sessionStorage.getItem("feedbackMessage_deletedproject");

            if (feedbackMessage_sentproject) {
                setTimeout(() => {
                    setFeedbackMessage(feedbackMessage_sentproject);
                    setTimeout(() => {
                        setFeedbackMessage('');
                        sessionStorage.removeItem("feedbackMessage_sentproject");
                    }, 3000);
                }, 1300); 
            }
            if (feedbackMessage_deletedproject) {
                setTimeout(() => {
                    setFeedbackMessage(feedbackMessage_deletedproject);
                    setTimeout(() => {
                        setFeedbackMessage('');
                        sessionStorage.removeItem("feedbackMessage_deletedproject");
                    }, 3000);
                }, 1300); 
            }
        };
        updateFeedbackMessage();
        return () => {
            sessionStorage.removeItem("feedbackMessage_sentproject"); 
            sessionStorage.removeItem("feedbackMessage_deletedproject");
        };
    }, []);



    //getting all projects while page loading
    useEffect(() => {
        let user_id = localStorage.getItem("user_id");
        console.log(user_id);
        const getAllProjects = async () => {
            try {
                const projects = await window.api.getAllPreviousProjects(user_id);
                console.log('Projects:', projects.projects);
                setProjectsArray(projects.projects);
            } catch (error) {
                console.error('Error fetching projects:', error);
                getAllProjects();
            }
        };
        getAllProjects();

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    //when search input is entered 
    const handleSearchString = (e) => {
        console.log(e);
        setSearchString(e);
    }

    useEffect(() => {
        let user_id = localStorage.getItem("user_id");
        console.log(user_id);
        //if search exists
        if (searchString !== "") {
            console.log("search entered...");
            try {
                window.api.getAllPreviousProjectsBySearch(user_id, searchString)
                    .then(projects => {
                        console.log('Projects:', projects.projects);
                        setProjectsArray(projects.projects);
                    })
                    .catch(error => {
                        console.error('Error fetching projects:', error);
                    });
            } catch (error) {
                console.error('Error fetching projects:', error);
            }

        } else { 
            console.log("...");

            try {
                window.api.getAllPreviousProjects(user_id)
                    .then(projects => {
                        console.log('Projects:', projects.projects);
                        setProjectsArray(projects.projects);
                    })
                    .catch(error => {
                        console.error('Error fetching projects:', error);
                    });
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }

    }, [searchString])



    //open contol sheet modal
    const handleClose = () => { setShowControlSheetModal(false); }
    const viewControlSheet = (project_id, project_type) => {
        setProjectId(project_id);
        setProjectType(project_type);
        fetchTeamsForControlSheet(project_id);
        setShowControlSheetModal(true);
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
            if (userData.user && userData.user.firstname && userData.user.lastname) {
                setUserForControlSheet(userData.user.firstname + " " + userData.user.lastname);
                console.log(userForControlSheet);
            } else {
                console.error('User data is not in the expected format:', userData);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };




    return (
        <div className="teamleader-wrapper">
            <div className="prevwork-teamleader-content">

                <div className="header">
                    <h4><img className="title-img" src={suitcase_black} alt="suitcase" /> Previous Jobs</h4>
                    <p>This are your prevoius jobs. All the jobs are locked since they have been submitted. In case important information have been missed out in one of your previous jobs, please contact the office.</p>
                </div>

                <div className="mt-4 mb-5">
                    <div className="mb-3">
                        <div>
                            <h6 style={{ fontSize: "0.9em" }}>Search for previous job:</h6>
                        </div>
                        <div>
                            <input className="form-input-field form-search-teamleader fixed" placeholder="Search.." value={searchString} onChange={(e) => handleSearchString(e.target.value)}></input>
                        </div>
                    </div>

                    {projectsArray && projectsArray.length > 0 ? (
                        projectsArray.sort((a, b) => new Date(b.sent_date) - new Date(a.sent_date)).map(project => (
                            <div key={project.project_id} className="prevwork-box d-flex mb-2">
                                <div className="prevwork-box-left d-flex justify-content-between" title={`Job name: ${project.projectname}`}>
                                    <div className="d-flex">
                                        <p className="ml-2">{project.type === "school" ? <img className="type-img-currwork" src={academic_gray} alt="academic"></img> : <img className="type-img-currwork" src={running_gray} alt="running"></img>}</p>
                                        <p className="ml-3">{project.projectname.length > 73 ? project.projectname.substring(0, 73) + "..." : project.projectname}</p>
                                    </div>
                                    <FontAwesomeIcon className="mt-1" icon={faLock} title={`Job locked`} />
                                </div>

                                <div className="prevwork-box-mid mx-2" title="Submitted date">
                                    <p className="ml-2"> <FontAwesomeIcon icon={faPaperPlane} /> {project.sent_date.substring(0, 10)}</p>
                                </div>
                                <div className="prevwork-box-right"
                                    title="View control sheet"
                                    onClick={() => viewControlSheet(project.project_id, project.type)}
                                >
                                    <FontAwesomeIcon icon={faNewspaper} />
                                </div>
                                {/* <div className="prevwork-box-right mx-2"
                                    title="Report to office"
                                >
                                    <FontAwesomeIcon icon={farEnvelope} />
                                </div> */}

                            </div>
                        ))
                    ) : (
                        <div>
                            <p>No jobs found.</p>
                            <a style={{ textDecoration: "underline" }} href="#" onClick={() => window.location.reload()}>Reload page</a>
                        </div>
                    )}
                </div>

            </div>

            <Sidemenu_teamleader />
            <Controlsheet showControlSheetModal={showControlSheetModal} handleClose={handleClose} project_id={projectId} projectType={projectType} teamsForControlSheet={teamsForControlSheet} projectForControlSheet={projectForControlSheet} userForControlSheet={userForControlSheet} />
            <FeedbackMessage feedbackMessage={feedbackMessage} />

        </div>
    );
}
export default Prevwork_teamleader;