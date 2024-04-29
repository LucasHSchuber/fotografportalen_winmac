import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import profile from "../assets/images/photographer.png";

import Sidemenu from "../components/sidemenu";
import Sidemenu_small from "../components/sidemenu_small";
// import LoginModal from "../components/loginModal";

import gdprProtectionMethod from '../assets/js/gdprProtection';


function Index() {
  //define states
  const [user, setUser] = useState({});
  const [homeDir, setHomeDir] = useState('');
  const [projectsArray, setProjectsArray] = useState([]);
  // const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCloseLoginModal = () => { setShowLoginModal(false) };
  const navigate = useNavigate();




  useEffect(() => {
    let user_id = localStorage.getItem("user_id");

    const getAllProjects = async () => {
      try {
        const projects = await window.api.getAllCurrentProjects(user_id);
        console.log('Projects:', projects.projects);
        setProjectsArray(projects.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };


    // fetch user data
    const fetchUser = async () => {
      try {
        const usersData = await window.api.getUser(user_id); // Fetch users data from main process
        console.log('Users Data:', usersData); // Log the users data
        setUser(usersData.user);
        console.log(usersData.user);
        localStorage.setItem("user_name", usersData.user.firstname + " " + usersData.user.lastname);
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };


    //clear data - GDPR
    const runGdprProtection = async () => {
      try {
        const response = await gdprProtectionMethod();
        console.log('GDPR response:', response);

        if (response && response.statusCode === 1) {
          console.log('GDPR data cleared successfully');
        } else {
          console.error('Error clearing GDPR data:', response?.errorMessage || 'Unknown error');
        }
      } catch (error) {
        console.error('Error clearing GDPR data:', error);
      }
    };

    fetchUser();
    getAllProjects();
    runGdprProtection();

  }, []);




  return (
    <div className="d-flex index-wrapper">
      <div className="index-box-left">
        <div className="index-box d-flex">
          <div className="avatar-container">
            <img className="profile-picture" src={profile} alt="profile picture"></img>
          </div>
          <div className="mt-2 ml-2">
            <h5 style={{ fontWeight: "700", fontSize: "1.5em" }}>{user ? user.firstname : ""} {user ? user.lastname : ""}</h5>
            <h6 style={{ marginTop: "-0.25em" }}><em>{user ? user.city : ""}</em></h6>
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
          <h6><b>You have {projectsArray && projectsArray.length > 0 ? projectsArray.length : 0} unsent jobs</b></h6>
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
      {/* <LoginModal showLoginModal={showLoginModal} handleCloseLoginModal={handleCloseLoginModal} /> */}
    </div>
  );
}
export default Index;