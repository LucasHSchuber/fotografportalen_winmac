import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import fp from "../assets/images/diaphragm_black.png";

function Login_window() {
  //define states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [errorLogginginMessage, setErrorLogginginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);



  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);




  useEffect(() => {
    setUsername(localStorage.getItem("username") ? localStorage.getItem("username") : "");
    // setPassword(localStorage.getItem("password") ? localStorage.getItem("password") : "");
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



  const loginUser = async () => {
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
      // localStorage.setItem("password", password);

      try {
        const data = { email: username, password: password };
        console.log(data);
        const responseData = await window.api.loginUser(data);
        console.log(responseData);

        if (responseData.success === true) {
          console.log("Log in successful");
          localStorage.setItem("user_id", responseData.user.user_id);
          localStorage.setItem("username", username);
          // close login window and open mainWindow
          setIsLoadingConfirm(true);
          const timeout = setTimeout(() => {
            window.api.createMainWindow();
            // setIsLoadingConfirm(false);
          }, 2400);

        } else {
          console.log("Invalid username or/and password");
          setErrorLogginginMessage("Invalid username and/or password");
        }

      } catch (error) {
        console.log("Error logging in");
        console.log("error:", error);
      }

    } else {
      console.error('Password or Username is missing');
      return null;
    }
  }


  if (isLoading) {
    // Render loading indicator while content is loading
    return (
      <div >
        <div className="spinning-logo-login">
          <img src={fp} alt="fotografportalen" />
          <p><em>Fotografportalen</em></p>
        </div>
        {/* <div className="loading-bar-text">
          <p><b>Loading..</b></p>
        </div> */}
        {/* <div className="loading-bar-container-login">
          <div className="loading-bar-login"></div>
        </div> */}
      </div>
    );
  }

  if (isLoadingConfirm) {
    // Render loading indicator while content is loading
    return (
      <div >
        <div className="spinning-logo-login" style={{ marginTop: "6em" }}>
          {/* <p><b>Successfull!</b> <br></br><em>Signing in...</em></p> */}
          <p><em>Signing in...</em></p>
        </div>
        <div className="loading-bar-container-login">
          <div className="loading-bar-login"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="login_window-wrapper">
      <div className="login_window-content">

        <h5 className="mb-3 mr-3" ><b>Log in</b></h5>
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
          <button className="button normal fixed-width mt-3 mb-2" onClick={loginUser}>
            Log in
          </button>
        </div>
        <a className="register-link-login" onClick={() => navigate('/register_window')}>Register</a>

      </div>
    </div >
  );

};

export default Login_window;