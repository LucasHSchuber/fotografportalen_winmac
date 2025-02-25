import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faCheck } from "@fortawesome/free-solid-svg-icons";

import Sidemenu from "../components/sidemenu";
import Sidemenu_small from "../components/sidemenu_small";
import FeedbackMessage from "../components/feedbackMessage";



function Settings() {
  //define states
  const [user, setUser] = useState({});

  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [city, setCity] = useState("");
  const [mobile, setMobile] = useState("");
  const [lang, setLang] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newFirstname, setNewFirstname] = useState("");
  const [newLastname, setNewLastname] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newLang, setNewLang] = useState("");

  const [isEmailModified, setIsEmailIsModified] = useState(false);
  const [isFirstnameIsModified, setIsFirstnameIsModified] = useState(false);
  const [isLastnameIsModified, setIsLastnameIsModified] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState({
    email: false,
    firstname: false,
    lastname: false,
  });

  // Function to update feedback message
  const updateFeedbackMessage = (message) => {
    setFeedbackMessage(message);
    setTimeout(() => {
      setFeedbackMessage("");
    }, 3000);
  };



  // Fetch user from local table "users"
  const fetchUser = async () => {
    let user_id = localStorage.getItem("user_id");
    try {
      const usersData = await window.api.getUser(user_id); 
      console.log("Users Data:", usersData); 
      setUser(usersData.user);
      setEmail(usersData.user.email);
      setFirstname(usersData.user.firstname);
      setLastname(usersData.user.lastname);
      setCity(usersData.user.city);
      setMobile(usersData.user.mobile);
      setLang(usersData.user.lang);
      console.log(usersData.user);

      localStorage.setItem("user_lang", usersData.user.lang);
      console.log(usersData.user.lang);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);



  const handleEmailChange = () => {
    setErrorMessage({ ...errorMessage, email: false });
  };
  const handleFirstnameChange = () => {
    setErrorMessage({ ...errorMessage, firstname: false });
  };
  const handleLastnameChange = () => {
    setErrorMessage({ ...errorMessage, lastname: false });
  };

  const handleChangeNewLang = (newValue) => {
    console.log(newValue);
    setLang(newValue);
    setNewLang(newValue);
  };



  // Function to handle update operation
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedFields = {};
    updatedFields.city = newCity !== "" ? newCity : user.city;
    updatedFields.mobile = newMobile !== "" ? newMobile : user.mobile;
    updatedFields.email = newEmail !== "" ? newEmail : user.email;
    updatedFields.firstname =
      newFirstname !== "" ? newFirstname : user.firstname;
    updatedFields.lastname = newLastname !== "" ? newLastname : user.lastname;
    updatedFields.lang = newLang !== "" ? newLang : user.lang;
    updatedFields.user_id = user.user_id;
    console.log(updatedFields);

    // Check if email field is empty
    if (!newEmail && isEmailModified) {
      setErrorMessage((prevState) => ({ ...prevState, email: true }));
      console.log(newEmail);
    }
    // Check if firstname field is empty
    if (!newFirstname && isFirstnameIsModified) {
      setErrorMessage((prevState) => ({ ...prevState, firstname: true }));
      console.log(newFirstname);
    }
    // Check if lastname field is empty
    if (!newLastname && isLastnameIsModified) {
      setErrorMessage((prevState) => ({ ...prevState, lastname: true }));
      console.log(newLastname);
    }

    if ( newEmail || newFirstname || newLastname || newCity || newMobile || newLang ) {
      try {
        const response = await window.api.editUser(updatedFields);
        console.log(response);
        updateFeedbackMessage("User updated succesfully");
        setNewCity("");
        setNewMobile("");
        setNewLang("");
        setNewFirstname("");
        setNewLastname("");
        setNewEmail("");
        fetchUser();
      } catch (error) {
        console.log("Error updating user data");
      }
    } else {
      console.log("Updated but no data changed");
    }
  };


  
  return (
    <div className="settings-wrapper">
      <div className="settings-content">
        <div className="header">
          <h5>
            <FontAwesomeIcon icon={faCog} className="icons mr-2" /> Settings
          </h5>
          <p>Here you can change your user setting</p>
        </div>
        <form>
          <div className="my-4">
            <div>
              <label>Email:</label>
              <div>
                <input
                  disabled
                  style={{ color: "gray", cursor: "not-allowed" }}
                  className={`form-input-field-fp ${errorMessage.email ? "error-border" : ""}`}
                  type="email"
                  defaultValue={email ? email : ""}
                  placeholder="Email"
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    handleEmailChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== email) setIsEmailIsModified(true);
                  }}
                />
              </div>
            </div>
            <div>
              <label>Firstname:</label>
              <div>
                <input
                  className={`form-input-field-fp ${errorMessage.firstname ? "error-border" : ""}`}
                  type="text"
                  defaultValue={firstname ? firstname : ""}
                  placeholder="First name"
                  onChange={(e) => {
                    setNewFirstname(e.target.value);
                    handleFirstnameChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== firstname)
                      setIsFirstnameIsModified(true);
                  }}
                />
              </div>
            </div>
            <div>
              <label>Lastname:</label>
              <div>
                <input
                  className={`form-input-field-fp ${errorMessage.lastname ? "error-border" : ""}`}
                  type="text"
                  defaultValue={lastname ? lastname : ""}
                  placeholder="Last name"
                  onChange={(e) => {
                    setNewLastname(e.target.value);
                    handleLastnameChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== lastname)
                      setIsLastnameIsModified(true);
                  }}
                />
              </div>
            </div>
            <div>
              <label>City:</label>
              <div>
                <input
                  className="form-input-field-fp"
                  type="text"
                  defaultValue={city ? city : ""}
                  placeholder="City"
                  onChange={(e) => setNewCity(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label>Mobile:</label>
              <div>
                <input
                  className="form-input-field-fp"
                  type="text"
                  defaultValue={mobile ? mobile : ""}
                  placeholder="Mobile"
                  onChange={(e) => setNewMobile(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label>Country:</label>
              <div style={{ width: "20em" }}>
                <select
                  id="lang"
                  name="lang"
                  className="form-input-field-fp"
                  value={lang} 
                  onChange={(e) => handleChangeNewLang(e.target.value)}
                >
                  <option value="DK">Denmark</option>
                  <option value="FI">Finland</option>
                  <option value="DE">Germany</option>
                  <option value="NO">Norway</option>
                  <option value="SE">Sweden</option>
                </select>
              </div>
            </div>

            <button
              className="button normal mt-3"
              type="submit"
              onClick={handleUpdate}
            >
              Update &nbsp; <FontAwesomeIcon icon={faCheck} />{" "}
            </button>
          </div>
        </form>
      </div>
      <Sidemenu />
      <Sidemenu_small />
      <FeedbackMessage feedbackMessage={feedbackMessage} />
    </div>
  );
}

export default Settings;
