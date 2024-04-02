import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Index() {
  //define states
  const [localstorage_name, setLocalstorage_name] = useState([]);

  const [users, setUsers] = useState([]);
  const [homeDir, setHomeDir] = useState('');



  // Function to fetch projects from EXPRESS-BILD API
  const fetchProjects = async () => {
    try {
      let response = await axios.get('https://backend.expressbild.org/index.php/rest/teamleader/projects');

      if (response && response.data) {
        console.log('Fetched projects:', response.data);

      } else {
        console.error('Empty response received');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          console.error('Network Error: Please check your internet connection');
        } else {
          console.error('Request failed with status code:', error.response.status);
        }
      } else {
        console.error('Error fetching projects:', error.message);
      }
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);



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
    <div className="index-wrapper">
      <h1>Index</h1>
      <p>Home Directory: {homeDir}</p>
      {/* <button onClick={toHome}>To Home</button> */}

      <div>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Work Name</th>
              <th>County</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.workname}</td>
                <td>{user.county}</td>
                <td>{user.date.substring(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
export default Index;