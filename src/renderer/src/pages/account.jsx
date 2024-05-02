import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import profile from "../assets/images/photographer.png";

import Sidemenu from "../components/sidemenu";
import Sidemenu_small from "../components/sidemenu_small";
import FeedbackMessage from "../components/feedbackMessage";
import SwitchUserModal from "../components/switchUserModal";
import ConnectUserModal from "../components/connectUserModal";




function Account() {
  //define states
  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);

  const [chosenUser, setChosenUser] = useState({});
  const [chosenUserId, setChosenUserId] = useState(parseInt(localStorage.getItem("user_id")));

  const [feedbackMessage, setFeedbackMessage] = useState('');

  const [showSwitchUserModal, setShowSwitchUserModal] = useState(false);
  const [showConnectUserModal, setShowConnectUserModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState({
    email: false,
    firstname: false,
    lastname: false
  });

  const handleCloseSwitchUserModal = () => { setShowSwitchUserModal(false) };
  const handleCloseConnectUserModal = () => { setShowConnectUserModal(false) };




  // Function to update feedback message
  const updateFeedbackMessage = (message) => {
    setFeedbackMessage(message);
    setTimeout(() => {
      setFeedbackMessage('');
    }, 3000);
  };


  //fethch user data
  useEffect(() => {

    let user_id = parseInt(localStorage.getItem("user_id"));

    // fetch user data
    const fetchUser = async () => {
      try {
        const usersData = await window.api.getUser(user_id);
        console.log('Users Data:', usersData);
        setUser(usersData.user);
        console.log(usersData.user);

        localStorage.setItem("user_lang", usersData.user.lang);
        console.log(usersData.user.lang);

      } catch (error) {
        console.error('Error fetching users data:', error);
        fetchUser();
      }
    };

    const fetchAllUsers = async () => {
      try {
        const allUsersData = await window.api.getAllUsers();
        console.log('All users response:', allUsersData);
        let allUsersExceptLoggedIn = allUsersData.users.users.filter(u => u.user_id !== chosenUserId);
        setAllUsers(allUsersExceptLoggedIn);
        console.log(allUsersExceptLoggedIn);
      } catch (error) {
        console.error('Error fetching all users data:', error);
      }
    };

    fetchUser();
    fetchAllUsers();


  }, [])



  //triggered after changed photographer success
  const refreshUser = async () => {
    let user_id = localStorage.getItem("user_id");

    try {
      const usersData = await window.api.getUser(user_id);
      console.log('Users Data:', usersData);
      setUser(usersData.user);
      console.log(usersData.user);

      localStorage.setItem("user_lang", usersData.user.lang);
      console.log(usersData.user.lang);

    } catch (error) {
      console.error('Error fetching users data:', error);
    }

    try {
      const allUsersData = await window.api.getAllUsers();
      console.log('All users response:', allUsersData);
      const allUsersExceptLoggedIn = allUsersData.users.users.filter(u => u.user_id !== chosenUserId);
      setAllUsers("");
      setAllUsers(allUsersExceptLoggedIn);
      console.log(allUsersExceptLoggedIn);
    } catch (error) {
      console.error('Error fetching all users data:', error);
    }

  };



  const switchUser = () => {
    console.log(chosenUserId);
    setShowSwitchUserModal(true); // Open switchUserModal
  }

  const connectUser = () => {
    setShowConnectUserModal(true); // Open connectUserModal
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
            <h6><span>City:</span> {user && user.city !== null ? user.city : <em>None</em>} </h6>
          </div>

          <hr className="mt-5" style={{ width: "30em" }}></hr>


          <div className="mt-4 mb-3">
            <div>
              <button style={{ margin: "0", width: "16em" }} className="button normal" onClick={connectUser}> Connect new photographer </button>
            </div>
          </div>

          <div className="my-4 d-flex justify-content-between">
            {allUsers && allUsers.length > 0 ? (
              allUsers.map(user => (
                <div key={user.user_id}>
                  <div className={`mx-2 d-flex justify-content-between user-account-box ${chosenUserId === user.user_id ? "selected-user-account" : ""}`} 
                  onClick={() => { setChosenUserId(user.user_id), setChosenUser(user) }}
                  >
                    <div>
                      <div className="avatar-container-account my-2 ">
                        <img className="profile-picture-account" src={profile} alt="profile picture"></img>
                      </div>
                      <h6 style={{ textAlign: "center" }}>{user.firstname}</h6>
                    </div>
                  </div>

                  <div className="ml-5">
                    <button style={{ margin: "0", width: "3em", height: "2.5em", border: "1px solid #c9c9c9", borderRadius: "10px" }} className={`switchuser-button button  my-1 ${chosenUserId === user.user_id ? "show-switchuser-button" : ""}`} onClick={switchUser}> <FontAwesomeIcon icon={faArrowsRotate} />  </button>
                  </div>

                </div>
              ))
            ) : (
              <>
              </>
            )}
          </div>
          {/* 
          <div>
            <button style={{ margin: "0", width: "8em" }} className={`switchuser-button button normal mb-3 ${chosenUserId !== user.user_id ? "show-switchuser-button" : ""}`} onClick={chosenUserId !== user.user_id ? switchUser : handleCloseSwitchUserModal}>Switch <FontAwesomeIcon icon={faArrowsRotate} />  </button>
          </div> */}

        </div>

      </div>

      <Sidemenu />
      <Sidemenu_small />
      {chosenUserId !== user.user_id && (
        <SwitchUserModal showSwitchUserModal={showSwitchUserModal} handleCloseSwitchUserModal={handleCloseSwitchUserModal} chosenUser={chosenUser} refreshUser={refreshUser} updateFeedbackMessage={updateFeedbackMessage} />
      )}
      <ConnectUserModal showConnectUserModal={showConnectUserModal} handleCloseConnectUserModal={handleCloseConnectUserModal} refreshUser={refreshUser} updateFeedbackMessage={updateFeedbackMessage} />
      <FeedbackMessage feedbackMessage={feedbackMessage} />

    </div>
  );

};

export default Account;