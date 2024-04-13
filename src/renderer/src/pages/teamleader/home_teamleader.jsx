import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';

import fetchProjects from '../../assets/js/fetchProjects';
// import fetchUser from '../../assets/js/fetchUser';


function Home_teamleader() {
    // Define states
    const [loading, setLoading] = useState(true); // Set initial loading state to true
    const [user, setUser] = useState(true); // State to manage loading
    const [data, setData] = useState([]); // State to manage loadin
    const [hasFetchedData, setHasFetchedData] = useState(false);



    //load loading bar on load
    useEffect(() => {
        // Check if the loading bar has been shown before
        const hasLoadingBarShownBefore = sessionStorage.getItem("hasLoadingBarShown");
        // If it has not been shown before, show the loading bar
        if (!hasLoadingBarShownBefore) {
            const timer = setTimeout(() => {
                setLoading(false);
                sessionStorage.setItem("hasLoadingBarShown", "true");
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            setLoading(false);
        }
    }, []);


    //fetch all projects from big(express-bild) database
    const fetchData = async () => {
        const projects = await fetchProjects(); // Call the fetchProjects function
        console.log('Projects:', projects);
        // Handle the fetched projects data here
        const project = projects.result;
        const response = await window.api.create_Projects(project);
        console.log('Create Projects Response:', response);

        if (response && response.success) {
            // Handle success case
            console.log('Projects added successfully');

        } else {
            // Handle error case
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
        const fetchUser = async () => {
            try {
                const userData = await window.api.getUser(2);
                console.log('Users Data:', userData);
                setUser(userData.user.firstname + " " + userData.user.lastname);

                localStorage.setItem("user_lang", userData.user.lang);
                localStorage.setItem("user_id", userData.user.user_id);

            } catch (error) {
                console.error('Error fetching users data:', error);
            }
        };

        const user_id = localStorage.getItem("user_id");

        const fetchProjectsAndTeams = async () => {
            try {
                const data = await window.api.getProjectsAndTeamsByUserId(user_id);
                console.log('Data:', data.data);
                setData(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUser();
        fetchProjectsAndTeams();
    }, []);





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

                    <div className="home-teamleader-content">
                        <div className="header">
                            <h4>Welcome to Teamleader, {user}!</h4>
                            <p>This is your plattform for keeping track of your jobs, working progress and control sheet</p>
                        </div>
                    </div>

                    <div className="home-analytics-box d-flex mt-5">
                        <div className="home-analytics mx-2">
                            <p>
                                Total jobs
                            </p>
                            <div className="home-analytics-number">
                                {new Set(data.map(project => project.project_id)).size}
                            </div>
                        </div>
                        <div className="home-analytics">
                            <p>
                                Total photographed subjects
                            </p>
                            <div className="test">
                                <div className="home-analytics-number">
                                    {data.reduce((total, project) => total + project.teams.amount, 0)}
                                </div>
                            </div>
                        </div>
                        <div className="home-analytics">
                            <p>
                                Total sold calendars
                            </p>
                            <div className="home-analytics-number">
                                {/* {teams.reduce((total, calendars) => total + calendars.sold_calendar, 0)} */}
                            </div>
                        </div>
                    </div>

                    {new Set(data.filter(project => project.is_sent === 0).map(project => project.project_id)).size > 0 ? (
                        <div className="home-message-box my-3 d-flex">
                            <h6> <i class="fa-solid fa-circle-exclamation"></i> &nbsp;<b> Message: </b> &nbsp; </h6>
                            <h6> You have {new Set(data.filter(project => project.is_sent === 0).map(project => project.project_id)).size} unsent job</h6>
                        </div>
                    ) : (
                        <></>
                    )}


                    <Sidemenu_teamleader />
                </>
            )}


        </div>
    );
}
export default Home_teamleader;