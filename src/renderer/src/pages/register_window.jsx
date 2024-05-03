import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Register_window() {
  //define states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [errorLogginginMessage, setErrorLogginginMessage] = useState("");
  const [successRegisterMessage, setSuccessRegisterMessage] = useState("");



  const navigate = useNavigate();




  useEffect(() => {
    setUsername(localStorage.getItem("username") ? localStorage.getItem("username") : "");
    setPassword(localStorage.getItem("password") ? localStorage.getItem("password") : "");
  }, [])

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    console.log("e.target.value");
    setUsernameMessage("");
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    console.log("e.target.value");
    setPasswordMessage("");
  };




  const registerUser = async () => {
    if (password === "" && username === "") {
      console.log("Enter username and password");
      setPasswordMessage(true);
      setUsernameMessage(true);
      setErrorLogginginMessage("");
    }
    if (password === "") {
      console.log("Enter password");
      setPasswordMessage(true);
    } else {
      setPasswordMessage("");
    }
    if (username === "") {
      console.log("Enter username");
      setUsernameMessage(true);
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
              setSuccessRegisterMessage("Account registered successfully")
              setPassword("");
              setUsername("");
              setErrorLogginginMessage("");
            } else {
              console.log("Error creating user");
              setErrorLogginginMessage("User already exists");
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
            setErrorLogginginMessage("Network error connection");
          } else {
            console.error('Request failed with status code:', error.response.status);
            setErrorLogginginMessage("Username and password doesn't exists in company database. Contact the office if problem is not resolved.");
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

        <h5 className="mb-3 mr-3" ><b>Register</b></h5>
        <div style={{ textAlign: "left", width: "110%", marginLeft: "-1.5em" }}>
          {usernameMessage || passwordMessage || errorLogginginMessage ? (
            <ul className="error">
              {/* {usernameMessage ? <li>{usernameMessage}</li> : ""}
              {passwordMessage ? <li>{passwordMessage}</li> : ""} */}
              {errorLogginginMessage ? <li>{errorLogginginMessage}</li> : ""}
            </ul>
          ) : (
            <>
            </>
          )}
        </div>
        <div style={{ textAlign: "left", width: "110%", marginLeft: "-1.5em" }}>
          {successRegisterMessage ? (
            <ul className="success">
              {successRegisterMessage ? <li>{successRegisterMessage}</li> : ""}
            </ul>
          ) : (
            <>
            </>
          )}
        </div>
        <div>
          <div>
            <input
              className={`form-input-field-login ${usernameMessage ? "error-border" : ""}`}
              placeholder="Email"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            <input
              className={`form-input-field-login ${passwordMessage ? "error-border" : ""}`}
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