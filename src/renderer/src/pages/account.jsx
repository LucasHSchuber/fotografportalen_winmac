import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import profile from "../assets/images/photographer.png";

import Sidemenu from "../components/sidemenu";
import Sidemenu_small from "../components/sidemenu_small";
import FeedbackMessage from "../components/feedbackMessage";


function Account() {
  //define states
  const [user, setUser] = useState({});

  const [isEmailModified, setIsEmailIsModified] = useState(false);
  const [isFirstnameIsModified, setIsFirstnameIsModified] = useState(false);
  const [isLastnameIsModified, setIsLastnameIsModified] = useState(false);

  // const [feedbackMessage, setFeedbackMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState({
    email: false,
    firstname: false,
    lastname: false
  });


  // // Function to update feedback message
  // const updateFeedbackMessage = (message) => {
  //   setFeedbackMessage(message);
  //   setTimeout(() => {
  //     setFeedbackMessage('');
  //   }, 3000);
  // };


  //fethch user data
  useEffect(() => {

    let user_id = localStorage.getItem("user_id");
    // fetch user data
    const fetchUser = async () => {
      try {
        const usersData = await window.api.getUser(user_id); // Fetch users data from main process
        console.log('Users Data:', usersData); // Log the users data
        setUser(usersData.user);

        console.log(usersData.user);

        localStorage.setItem("user_lang", usersData.user.lang);
        console.log(usersData.user.lang);

      } catch (error) {
        console.error('Error fetching users data:', error);
        fetchUser();
      }
    };
    fetchUser();

  }, [])


const openNewUserWindow = async () => {
    console.log("open");
    // try {
    //     const response = await window.api.createNewuserWindow(); // Change to match the IPC handler name
    //     console.log(response);
    // } catch (error) {
    //     console.error('Error opening new user window:', error);
    // }
};


  // const refreshUser = async () => {
  //   let user_id = localStorage.getItem("user_id");

  //   try {
  //     const usersData = await window.api.getUser(user_id); // Fetch users data from main process
  //     console.log('Users Data:', usersData); // Log the users data
  //     setUser(usersData.user);
  //     setEmail(usersData.user.email);
  //     setFirstname(usersData.user.firstname);
  //     setLastname(usersData.user.lastname);
  //     setCity(usersData.user.city);
  //     setLang(usersData.user.lang);
  //     console.log(usersData.user);

  //     localStorage.setItem("user_lang", usersData.user.lang);
  //     console.log(usersData.user.lang);

  //   } catch (error) {
  //     console.error('Error fetching users data:', error);
  //   }
  // };


  const handleEmailChange = () => {
    setErrorMessage({ ...errorMessage, email: false });
  }
  const handleFirstnameChange = () => {
    setErrorMessage({ ...errorMessage, firstname: false });
  }
  const handleLastnameChange = () => {
    setErrorMessage({ ...errorMessage, lastname: false });
  }



  return (
    <div className="account-wrapper">
      <div className="account-content">
        <div className="header">
          <h5><FontAwesomeIcon icon={faUser} className="icons mr-2" /> Account</h5>
        </div>

        <div className="account-user-box my-4">

          <div className="avatar-container-account my-4 ">
            <img className="profile-picture-account" src={profile} alt="profile picture"></img>
          </div>

          <div>
            <h6><span>Email:</span> {user ? user.email : ""}</h6>
          </div>

          <div>
            <h6><span>Name:</span> {user ? user.firstname : ""} {user ? user.lastname : ""}</h6>
          </div>

          <div>
            <h6><span>City:</span> {user ? user.city : ""} </h6>
          </div>

          <div className="mt-4">
            <button style={{ margin: "0", width: "15em" }} className="button normal mx-1 ">Switch photographer <FontAwesomeIcon icon={faArrowsRotate} />  </button>
            <button style={{ margin: "0", width: "16em" }} className="button normal " onClick={openNewUserWindow}>Connect new photographer <FontAwesomeIcon icon={faUserPlus} /> </button>
          </div>

        </div>

      </div>

      <Sidemenu />
      <Sidemenu_small />
      {/* <FeedbackMessage feedbackMessage={feedbackMessage} /> */}

    </div>
  );

};

export default Account;