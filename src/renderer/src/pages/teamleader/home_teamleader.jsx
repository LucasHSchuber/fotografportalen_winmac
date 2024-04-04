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




    useEffect(() => {
        const fetchUser = async () => {
            try {
                //later fetch the user with correct user id stored in local storage since login
                const userData = await window.api.getUser(2); // Fetch users data from main process
                console.log('Users Data:', userData); // Log the users data
                setUser(userData.user.firstname + " " + userData.user.lastname);
                //store lang in local storage
                localStorage.setItem("user_lang", userData.user.lang);
                console.log(userData.user.lang);
                localStorage.setItem("user_id", userData.user.user_id);
                console.log(userData.user.user_id);

            } catch (error) {
                console.error('Error fetching users data:', error);
            }
        };

        fetchUser(); // Call fetchData when the component mounts
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
                <div>

                    <div className="home-teamleader-content">
                        <div className="header">
                            <h4>Welcome to Teamleader, {user}!</h4>
                            <p>This is your plattform for keeping track of your jobs, working progress and control sheet</p>
                        </div>
                    </div>


                    <Sidemenu_teamleader />
                </div>
            )}


        </div>
    );
}
export default Home_teamleader;