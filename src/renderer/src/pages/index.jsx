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



  // // Function to fetch projects from EXPRESS-BILD API
  // const fetchProjects = async () => {
  //   try {
  //     let response = await axios.get('https://backend.expressbild.org/index.php/rest/teamleader/projects');

  //     if (response && response.data) {
  //       console.log('Fetched projects:', response.data);

  //     } else {
  //       console.error('Empty response received');
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       if (!error.response) {
  //         console.error('Network Error: Please check your internet connection');
  //       } else {
  //         console.error('Request failed with status code:', error.response.status);
  //       }
  //     } else {
  //       console.error('Error fetching projects:', error.message);
  //     }
  //   }
  // };
  // useEffect(() => {
  //   fetchProjects();
  // }, []);



  // Function to fetch home directory and update state
  const fetchHomeDir = async () => {
    try {
      const result = await window.api.homeDir(); // Fetch home directory from main process
      setHomeDir(result); // Update state with the home directory value
    } catch (error) {
      console.error('Error fetching home directory:', error);
    }
  };


  // Call fetchHomeDir when component mounts
  useEffect(() => {
    fetchHomeDir();
  }, []);




  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await window.api.getUsers(); // Fetch users data from main process
        console.log('Users Data:', usersData); // Log the users data
        setUsers(usersData.users);
        console.log(usersData.users);
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchUsers();

    let user_name = localStorage.getItem("user_name");
    setLocalstorage_name(user_name);
    console.log(user_name);
  }, []); // Empty dependency array to run the effect only once



  const Navigate = useNavigate();

  //navigate user to index
  const toHome = () => {
    Navigate('/home');
  }

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
          <h6><b>You have 2 unsent jobs</b></h6>
          <ul>
            <li>Ekhammarskolan</li>
            <li>Tyresö FF</li>
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