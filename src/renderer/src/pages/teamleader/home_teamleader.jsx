import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import flash_black from "../../assets/images/flash_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";
import SubjectsChart from "../../components/teamleader/subjectsChart";
import TeamsChart from "../../components/teamleader/teamsChart";

import '../../assets/css/teamleader/main_teamleader.css';

import fetchProjects from '../../assets/js/fetchProjects';

// import fetchUser from '../../assets/js/fetchUser';


function Home_teamleader() {
    // Define states
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(true);
    const [data, setData] = useState([]);
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [currProjectsArray, setCurrProjectsArray] = useState([]);
    const [prevProjectsArray, setPrevProjectsArray] = useState([]);

    const [latestProject, setLatestProject] = useState({});

    const navigate = useNavigate();


    //load loading bar on load
    useEffect(() => {
        // Check if the loading bar has been shown before
        const hasHomeTeamleaderLoadingBarShown = sessionStorage.getItem("hasHomeTeamleaderLoadingBarShown");
        // If it has not been shown before, show the loading bar
        if (!hasHomeTeamleaderLoadingBarShown) {
            const timer = setTimeout(() => {
                setLoading(false);
                sessionStorage.setItem("hasHomeTeamleaderLoadingBarShown", "true");
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            setLoading(false);
        }
    }, []);


    //fetch all projects from big(express-bild) database
    const fetchData = async () => {
        console.log("fetchdata")
        const projects = await fetchProjects();
        console.log('Projects:', projects);

        const project = projects.result;
        const response = await window.api.create_Projects(project);
        console.log('create_Projects DONE:');
        console.log('Create Projects Response:', response);

        if (response && response.success) {
            console.log('Projects added successfully');

        } else {
            console.error('Error adding projects:', response?.error || 'Unknown error');
        }
    };

    useEffect(() => {
        // Only fetch data if it hasn't been fetched yet
        if (!hasFetchedData) {
            fetchData();
            setHasFetchedData(true);
        }
    }, [hasFetchedData]);

    //get user data &
    //get all project and teams by user_id
    useEffect(() => {
        const user_id = localStorage.getItem("user_id");

        const fetchUser = async () => {
            try {
                const userData = await window.api.getUser(user_id);
                console.log('Users Data:', userData);

                if (userData && userData.user) {
                    setUser(userData.user.firstname + " " + userData.user.lastname);

                    localStorage.setItem("user_lang", userData.user.lang);
                    localStorage.setItem("user_id", userData.user.user_id);
                } else {
                    console.error('Invalid user data:', userData);
                    fetchUser();
                }
            } catch (error) {
                console.error('Error fetching users data:', error);
            }
        };

        const fetchProjectsAndTeams = async () => {
            try {
                const data = await window.api.getProjectsAndTeamsByUserId(user_id);
                console.log('Data:', data.data);
                setData(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchAllCurrentProjects = async () => {
            try {
                const projects = await window.api.getAllCurrentProjects(user_id);
                console.log('Projects:', projects.projects);

                if (projects && projects.projects) {
                    setCurrProjectsArray(projects.projects);
                } else {
                    console.error('Invalid projects data:', projects);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        const fetchAllPreviousProjects = async () => {
            try {
                const projects = await window.api.getAllPreviousProjects(user_id);
                console.log('Projects:', projects.projects);

                if (projects && projects.projects) {
                    setPrevProjectsArray(projects.projects);
                } else {
                    console.error('Invalid previous projects data:', projects);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchUser();
        fetchProjectsAndTeams();
        fetchAllCurrentProjects();
        fetchAllPreviousProjects();
        
    }, []);


    //get all projects 
    useEffect(() => {
        let user_id = localStorage.getItem("user_id");
        console.log(user_id);
        const getAllProjects = async (retryCount = 3) => {
            try {
                const projects = await window.api.getAllCurrentProjects(user_id);
                console.log('Projects:', projects.projects);
                if (projects && projects.projects) {
                    const latestProject = projects.projects[projects.projects.length - 1];
                    console.log('latestProject', latestProject);
                    setLatestProject(latestProject);
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
    }, []);

    
    //enter a project (portal_teamleader)
    const enterProject = (project_id) => {
        console.log(project_id);
        localStorage.setItem("project_id", project_id);
        navigate(`/portal_teamleader/${project_id}`);
    }


    return (
        <div className="teamleader-wrapper">
            {loading ? (
                <div>
                    <div className="loading-bar-text">
                        <p><b>Teamleader</b></p>
                    </div>
                    <div className="loading-bar-container">
                        <div className="loading-bar"></div>
                    </div>
                </div>
            ) : (
                //html content
                <>
                    <div className="home-teamleader-content mb-5">
                        <div className="header">
                            <h4>Welcome to Teamleader, {user}!</h4>
                            <p>This is your plattform for keeping track of your jobs, working progress and control sheet</p>
                        </div>
                    </div>

                    {currProjectsArray && currProjectsArray.length > 0 ? (
                        <div className="home-message-box mb-3 d-flex">
                            <h6> <FontAwesomeIcon icon={faExclamationCircle} color="red" /> &nbsp;<b> Alert: </b> &nbsp; </h6>
                            <h6> You have <b>{currProjectsArray.length > 0 ? currProjectsArray.length : "0"}</b> unsent job{currProjectsArray.length > 1 ? "s":""}</h6>
                        </div>
                    ) : (
                        <>
                        </>
                    )}

                    {latestProject ? (
                        <div 
                         className="my-4"
                        >
                            <h6 style={{ fontSize: "0.8em", fontWeight: "600" }}>
                                {/* <img className="title-img" src={flash_black} alt="flash" /> */}
                                 Shortcut To Latest Job:
                            </h6>
                            <div key={latestProject.project_id} className="mb-3">
                                <div className="home-latestproject-box d-flex justify-content-left"
                                    onClick={() => enterProject(latestProject.project_id)}
                                    value={latestProject.project_id}
                                    title={`Open job: ${latestProject.projectname}`}
                                >
                                    <p>{latestProject.type === "school" ? <img className="type-img-currwork" src={academic_black} alt="academic"></img> : <img className="type-img-latestwork" src={running_black} alt="running"></img>}</p>
                                    <p className="ml-4 ">{latestProject?.projectname?.length > 70 ? latestProject.projectname.substring(0, 70) + "..." : latestProject.projectname}</p>
                                    <FontAwesomeIcon icon={faArrowRight} className="ml-5 mt-1" />
                                </div>
                            </div>
                        </div>    
                    ) : (
                        <>
                        </>
                    )}


                    <h6 className="" style={{ fontSize: "0.8em", fontWeight: "600" }}>Statistics:</h6>
                    <div className="home-analytics-box d-flex">
                        <div className="home-analytics">
                            <p>
                                Total completed jobs
                            </p>
                            <div className="home-analytics-number">
                                {prevProjectsArray && prevProjectsArray.length > 0 ? prevProjectsArray.length : "0"}
                            </div>
                        </div>
                        <div className="home-analytics">
                            <p >
                                Total photographed subjects
                            </p>
                            <div className="test">
                                <div className="home-analytics-number">
                                    {data && data.reduce((total, project) => total + project.teams.amount, 0)}
                                </div>
                            </div>
                        </div>
                        <div className="home-analytics">
                            <p>
                                Total sold calendars
                            </p>
                            <div className="home-analytics-number">
                                {data && data.reduce((total, calendar) => total + calendar.teams.sold_calendar, 0)}
                            </div>
                        </div>
                    </div>

                    <SubjectsChart data={data} prevProjectsLength={prevProjectsArray.length} />
                    <TeamsChart data={data} prevProjectsLength={prevProjectsArray.length} />
                    <Sidemenu_teamleader />
                </>
            )}


        </div>
    );
}
export default Home_teamleader;