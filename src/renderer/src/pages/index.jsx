import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import profile from "../assets/images/photographer.png";

import Sidemenu from "../components/sidemenu";
import Sidemenu_small from "../components/sidemenu_small";


function Index() {
  //define states
  const [localstorage_name, setLocalstorage_name] = useState([]);
  const [users, setUsers] = useState([]);
  const [homeDir, setHomeDir] = useState('');
  const [projectsArray, setProjectsArray] = useState([]);


  const Navigate = useNavigate();


  //assign the user_id sessionstorage (later login)
  useEffect(() => {
    sessionStorage.setItem("user_id", 2);
    console.log(sessionStorage.getItem("user_id"));
  }, []);



  useEffect(() => {
    let user_id = sessionStorage.getItem("user_id");
    console.log(user_id);

    const getAllProjects = async () => {
      try {
        const projects = await window.api.getAllProjects(user_id);
        console.log('Projects:', projects.projects);
        setProjectsArray(projects.projects);
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    getAllProjects();
  }, []);




  // // Function to fetch home directory and update state
  // const fetchHomeDir = async () => {
  //   try {
  //     const result = await window.api.homeDir(); // Fetch home directory from main process
  //     setHomeDir(result); // Update state with the home directory value
  //   } catch (error) {
  //     console.error('Error fetching home directory:', error);
  //   }
  // };
  // // Call fetchHomeDir when component mounts
  // useEffect(() => {
  //   fetchHomeDir();
  // }, []);



  //fetch user
  useEffect(() => {
    const fetchUser = async () => {
      let user_id = sessionStorage.getItem("user_id");
      try {
        const usersData = await window.api.getUser(user_id); // Fetch users data from main process
        console.log('Users Data:', usersData); // Log the users data
        setUsers(usersData.users);
        console.log(usersData.users);
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchUser();

    let user_name = localStorage.getItem("user_name");
    setLocalstorage_name(user_name);
    console.log(user_name);
  }, []); // Empty dependency array to run the effect only once





  return (
    <div className="d-flex index-wrapper">
      <div className="index-box-left">

        <div className="index-box d-flex">
          <div className="avatar-container">
            <img className="profile-picture" src={profile} alt="profile picture"></img>
          </div>
          <div className="mt-2 ml-2">
            <h5 style={{ fontWeight: "700" }}>John Doe</h5>
            <h6><em>Stockholm</em></h6>
          </div>
        </div>

        <div className="index-box">
          <h1 className="index-title one">Messages</h1>
          <h6><b>You have 1 new message</b></h6>
          <p>Hello John, can you work 12/4 between
            8:00-13:00 in Bromma? <br></br> <em>Recieved: 7/3/2024</em></p>
        </div>

        <hr style={{ width: "75%" }} className="hr"></hr>

        <div className="index-box">
          <h1 className="index-title two">Alerts</h1>
          <h6><b>You have {projectsArray.length > 0 ? projectsArray.length : 0} unsent jobs ready to be sent</b></h6>
          <ul>
            {projectsArray && projectsArray.length > 0 ? (
              projectsArray.map(project => (
                <div key={project.project_id}>
                  <li>{project.projectname}</li>
                </div>
              ))
            ) : (
              <h6> </h6>
            )}
          </ul>
        </div>
      </div>

      <div className="index-box-right">

        <div className="index-box">
          <h1 className="index-title three">News & updates</h1>
          <h6><b>New updates for Fotografportalen</b></h6>
          <p>Get the latest updates from the button below</p>
        </div>

        <hr style={{ width: "80%" }} className="hr"></hr>

        <div className="index-box">
          <h6><b>We welcome three new Swedish photographers</b></h6>
          <p>We welcome three new Swedish photographers to our company.
            Marcus, Sofia & Jakob, it's great to have you on board! </p>
        </div>

      </div>


      <Sidemenu />
      <Sidemenu_small />
    </div>
  );
}
export default Index;