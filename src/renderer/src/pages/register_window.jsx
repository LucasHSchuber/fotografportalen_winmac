import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Register_window() {
  //define states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");


  const navigate = useNavigate();




  useEffect(() => {
    setUsername(localStorage.getItem("username") ? localStorage.getItem("username") : "");
    setPassword(localStorage.getItem("password") ? localStorage.getItem("password") : "");
  }, [])

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    console.log("e.target.value")
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    console.log("e.target.value")
  };




  const registerUser = async () => {
    if (password === "" && username === "") {
      console.log("Enter username and password");
      setPasswordMessage("Enter password");
      setUsernameMessage("Enter username");
    }
    if (password === "") {
      console.log("Enter password");
      setPasswordMessage("Enter password");
    } else {
      setPasswordMessage("");
    }
    if (username === "") {
      console.log("Enter username");
      setUsernameMessage("Enter username");
    } else {
      setUsernameMessage("");
    }

    if (password !== "" && username !== "") {
      console.log("password and username entered");
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);

      try {
        console.log("Registring user.... ");

        const response = await axios.post('https://backend.expressbild.org/index.php/rest/photographer_portal/login', {
          'email': username,
          'password': password
        });
        if (response && response.data) {
          console.log('User:', response.data);
          console.log('User result:', response.data.result);

          try {
            const updatedResult = { ...response.data.result, password };
            console.log(updatedResult);
            const responseData = await window.api.createUser(updatedResult);
            console.log(responseData);

            if (responseData.success === true) {
              console.log("User created successfully");
              setPassword("");
              setUsername("");
            } else {
              console.log("Error creating user");
            }
          } catch (error) {
            console.log("error:", error);
          }
        } else {
          console.error('Empty response received');
          return null;
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
        return null;
      }
    }
  }



  return (
    <div className="login_window-wrapper">
      <div className="login_window-content">

        <h5 className="mb-3" ><b>Register</b></h5>
          <div style={{ textAlign: "left" }}>
            {usernameMessage || passwordMessage ? (
              <ul className="error">
                {usernameMessage ? <li>{usernameMessage}</li> : ""}
                {passwordMessage ? <li>{passwordMessage}</li> : ""}
              </ul>
            ) : (
              <>
              </>
            )}
          </div>
        <div>
          <div>
            <input
              className="form-input-field-login"
              placeholder="Username/Email"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            <input
              className="form-input-field-login"
              placeholder="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
        </div>

        <div>
          <button className="button normal fixed-width mt-3 mb-2" onClick={registerUser}>
            Register
          </button>
        </div>
        <a className="register-link-login" onClick={() => navigate('/login_window')}>Log in</a>

      </div>
    </div >
  );
};

export default Register_window;