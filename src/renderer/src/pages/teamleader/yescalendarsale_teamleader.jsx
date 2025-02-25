import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";
import CalendarConfirm from "../../components/teamleader/calendarconfirmModal";
import AcceptTermsModal from "../../components/teamleader/accepttermsModal";

import "../../assets/css/teamleader/main_teamleader.css";

import se from "../../assets/language/se.json"; 
import dk from "../../assets/language/dk.json"; 
import fi from "../../assets/language/fi.json"; 
import no from "../../assets/language/no.json"; 
import de from "../../assets/language/de.json"; 

function Calendarsale_teamleader() {
  // Define states
  const [deliveryFirstName, setDeliveryFirstName] = useState("");
  const [deliveryLastName, setDeliveryLastName] = useState("");
  const [formData, setFormData] = useState({
    // delivery_first_name: "",
    // delivery_last_name: "",
    calendar_amount: "",
    leader_address: "",
    leader_postalcode: "",
    leader_county: "",
    leader_ssn: "",
    terms: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    // delivery_first_name: false,
    // delivery_last_name: false,
    calendar_amount: false,
    leader_address: false,
    leader_postalcode: false,
    leader_county: false,
    leader_ssn: false,
  });
  const [showCalendarConfirmModal, setShowCalendarConfirmModal] =useState(false);
  const [showTermsAndConditionBox, setShowTermsAndConditionBox] = useState(false);
  const [showTermsAndConditionModal, setShowTermsAndConditionModal] = useState(false);

  const [teamData, setTeamData] = useState({});
  const [languageTexts, setLanguageTexts] = useState({});
  const [user_lang, setUser_lang] = useState("");

  const navigate = useNavigate();

  const handleClose = () => {
    setShowCalendarConfirmModal(false);
  };
  const handleConfirm = () => {
    setShowTermsAndConditionModal(false);
  };

  // // Get full name from local storage on mount
  // useEffect(() => {
  //   let newteam_leaderfirstname = localStorage.getItem("newteam_leaderfirstname",);
  //   let newteam_leaderlastname = localStorage.getItem("newteam_leaderlastname");
  //   // setSavedName(newteam_leaderfirstname + " " + newteam_leaderlastname);
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     delivery_first_name: newteam_leaderfirstname, 
  //     delivery_last_name: newteam_leaderlastname, 
  //   }));
  // }, []);

  useEffect(() => {
    // Determine the language from sessionStorage
    const user_lang = localStorage.getItem("user_lang");
    setUser_lang(user_lang);
    console.log(user_lang);
    let selectedLang;
    // Set language texts based on the selected language
    switch (user_lang) {
      case "SE":
        selectedLang = se;
        break;
      case "DK":
        selectedLang = dk;
        break;
      case "FI":
        selectedLang = fi;
        break;
      case "NO":
        selectedLang = no;
        break;
      case "DE":
        selectedLang = de;
        break;
    }
    setLanguageTexts(selectedLang);
  }, []);


  // Method to go back 
  const handleBack = () => {
    navigate(`/calendarsale_teamleader`);
  };

  // handle change
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "terms" ? checked : value, 
    }));
    setErrorMessage({ ...errorMessage, [name]: false }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    // if (!formData.delivery_first_name) errors.delivery_first_name = true;
    // if (!formData.delivery_last_name) errors.delivery_last_name = true;
    if (!formData.calendar_amount) errors.calendar_amount = true;
    if (!formData.leader_address) errors.leader_address = true;
    if (!formData.leader_postalcode) errors.leader_postalcode = true;
    if (!formData.leader_county) errors.leader_county = true;
    if (user_lang === "SE" || user_lang === "DE") {
      if (!formData.leader_ssn) errors.leader_ssn = true;
    }

    // Update error message state
    setErrorMessage(errors);
    // Check if any errors exist
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (!formData.terms || errorMessage.terms === true) {
      setShowTermsAndConditionModal(true);
      console.log('Terms And Conditions are not checked');
      return;
    }

    // let delivery_first_name = formData.delivery_first_name;
    // let delivery_last_name = formData.delivery_last_name;
    let calendar_sale = localStorage.getItem("calendar_sale");
    let newteam_teamname = localStorage.getItem("newteam_teamname");
    let newteam_leaderfirstname = localStorage.getItem("newteam_leaderfirstname",);
    let newteam_leaderlastname = localStorage.getItem("newteam_leaderlastname");
    let newteam_leaderemail = localStorage.getItem("newteam_leaderemail");
    let newteam_leadermobile = localStorage.getItem("newteam_leadermobile");
    // setDeliveryFirstName(delivery_first_name)
    // setDeliveryLastName(delivery_last_name) 

    const leaderData = {
      // delivery_first_name: delivery_first_name,
      // delivery_last_name: delivery_last_name,
      calendar: calendar_sale,
      teamname: newteam_teamname,
      firstname: newteam_leaderfirstname,
      lastname: newteam_leaderlastname,
      email: newteam_leaderemail,
      mobile: newteam_leadermobile,
      calendaramount: formData.calendar_amount,
      address: formData.leader_address,
      postalcode: formData.leader_postalcode,
      county: formData.leader_county,
      ssn: formData.leader_ssn,
    };
    setTeamData(leaderData);
    setShowCalendarConfirmModal(true);
  };


  // method to confirm calendar and add data to db 
  const confirmCalendar = async () => {
    let project_id = localStorage.getItem("project_id");
    console.log(project_id);
    let newteam_teamname = localStorage.getItem("newteam_teamname");
    let newteam_leaderfirstname = localStorage.getItem("newteam_leaderfirstname");
    let newteam_leaderlastname = localStorage.getItem("newteam_leaderlastname");
    let newteam_leaderemail = localStorage.getItem("newteam_leaderemail");
    let newteam_leadermobile = localStorage.getItem("newteam_leadermobile");

    try {
      const teamData = await window.api.createNewTeam({
        ...formData,
        teamname: newteam_teamname,
        // leader_firstname: deliveryFirstName,
        // leader_lastname: deliveryLastName,
        leader_firstname: newteam_leaderfirstname,
        leader_lastname: newteam_leaderlastname,
        leader_email: newteam_leaderemail,
        leader_mobile: newteam_leadermobile,
        project_id: project_id,
      });
      console.log("Teams:", teamData.teams);

      setFormData({
        // delivery_first_name: "",
        // delivery_last_name: "",
        calendar_amount: "",
        leader_address: "",
        leader_postalcode: "",
        leader_county: "",
        leader_ssn: "",
        terms: false,
      });
      navigate("/newteam_teamleader");
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };



  useEffect(() => {
    function handleResize() {
      console.log(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);



  return (
    <div className="teamleader-wrapper">
      <div className="calendarsale-teamleader-content">
        {/* breadcrumbs */}
        <div className="breadcrumbs d-flex mb-4">
          <div className="breadcrumbs-box ">{languageTexts?.breadcrumb1}</div>
          <div className="breadcrumbs-box">{languageTexts?.breadcrumb2}</div>
          <div className="breadcrumbs-box breadcrumbs-active">
            {languageTexts?.breadcrumb3}
          </div>
        </div>

        <div className="header mb-4" style={{ width: "37em" }}>
          <h5>{languageTexts?.header3}</h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="">
            <div>
              <input
                className={`form-input-field ${errorMessage.calendar_amount ? "error-border" : ""}`}
                type="number"
                name="calendar_amount"
                value={formData.calendar_amount}
                onChange={handleChange}
                placeholder={languageTexts?.calendaramount}
                onWheel={(event) => event.target.blur()}
                onKeyDown={(event) => {
                  // Prevents changing value by arrow keys
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <div>
              {/* calendar calculator */}
              {formData.calendar_amount && (
                <h6 style={{ fontSize: "0.9em" }}>
                  <b>* {languageTexts.calendarText} {(formData.calendar_amount * 3) * languageTexts.calendarPrice} {languageTexts.currency}</b>     
                </h6>
              )}
              <h6 style={{ fontSize: "0.9em" }}>
                {languageTexts?.calendaramounttext}
              </h6>
            </div>
             {/* only show SSN input if SWEDISH OR GERMAN */}
            {user_lang && (user_lang === "SE" || user_lang === "DE") && (
              <div style={{}}>
                <input
                  className={`form-input-field ${errorMessage.leader_ssn ? "error-border" : ""}`}
                  type="number"
                  name="leader_ssn"
                  value={formData.leader_ssn}
                  onChange={handleChange}
                  placeholder={languageTexts?.ssn}
                  onWheel={(event) => event.target.blur()}
                  onKeyDown={(event) => {
                    // Prevents changing value by arrow keys
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* <div className="mt-3 header">
                <h6><b>{languageTexts?.deliveryheader}:</b></h6>
          </div> */}

          {/* <div>
            <input
              className={`form-input-field ${errorMessage.delivery_first_name ? "error-border" : ""}`}
              type="text"
              name="delivery_first_name"
              defaultValue={formData.delivery_first_name}
              onChange={handleChange}
              placeholder={languageTexts?.deliveryfirstname}
            />
          </div>
          <div>
            <input
              className={`form-input-field ${errorMessage.delivery_last_name ? "error-border" : ""}`}
              type="text"
              name="delivery_last_name"
              defaultValue={formData.delivery_last_name}
              onChange={handleChange}
              placeholder={languageTexts?.deliverylastname}
            />
          </div> */}
          <div>
            <input
              className={`form-input-field ${errorMessage.leader_address ? "error-border" : ""}`}
              type="text"
              name="leader_address"
              value={formData.leader_address}
              onChange={handleChange}
              placeholder={languageTexts?.address}
            />
          </div>
          <div>
            <input
              className={`form-input-field ${errorMessage.leader_postalcode ? "error-border" : ""}`}
              type="number"
              name="leader_postalcode"
              value={formData.leader_postalcode}
              onChange={handleChange}
              placeholder={languageTexts?.postalcode}
              onWheel={(event) => event.target.blur()}
              onKeyDown={(event) => {
                // Prevents changing value by arrow keys
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();
                }
              }}
            />
          </div>
          <div>
            <input
              className={`form-input-field ${errorMessage.leader_county ? "error-border" : ""}`}
              type="text"
              name="leader_county"
              value={formData.leader_county}
              onChange={handleChange}
              placeholder={languageTexts?.county}
            />
          </div>
          <div className="checkbox-container my-3">
            <label className="mr-2">
              <input
                className={`checkmark mr-2`}
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
              {languageTexts?.acceptTermsAndConditions}
            </label>
            <a
              style={{ textDecoration: "underline" }}
              onClick={() =>
                setShowTermsAndConditionBox(!showTermsAndConditionBox)
              }
            >
              {languageTexts?.termsAndConditions}
            </a>
          </div>

          <button
            className="button cancel fixed-width mr-1"
            type="button"
            onClick={handleBack}
          >
            {languageTexts?.backButton}
          </button>
          <button className="button standard fixed-width" type="submit">
            {languageTexts?.finishButton}
          </button>
        </form>
      </div>

      {/* Terms and conditions box        */}
      {showTermsAndConditionBox && (
        <div className="termsandcondition-box">
          <div className="d-flex justify-content-between mb-3">
            <h6 style={{ textDecoration: "underline" }}>
              <b>{languageTexts?.tacHeader1}</b>
            </h6>
            <h6
              className="close-circle"
              title="Close"
              onClick={() =>
                setShowTermsAndConditionBox(!showTermsAndConditionBox)
              }
            >
              <FontAwesomeIcon icon={faTimes} className="fa-s" />
            </h6>
          </div>
          <ul>
            <li>{languageTexts?.tacLink1}</li>
            <li>{languageTexts?.tacLink2}</li>
            <li>{languageTexts?.tacLink3}</li>
          </ul>

          <p style={{ fontSize: "0.85em" }}>
            <em>{languageTexts?.tacText}</em>
          </p>

          <p>
            <b>{languageTexts?.tacHeader2}</b>
          </p>
          <p>{languageTexts?.tacP1}</p>
          <p>{languageTexts?.tacP2}</p>
          <p>{languageTexts?.tacP3}</p>

          <button
            className="button cancel fixed-width mt-3"
            onClick={() =>
              setShowTermsAndConditionBox(!showTermsAndConditionBox)
            }
          >
            Ok
          </button>
        </div>
      )}

      
      <AcceptTermsModal 
        showTermsAndConditionModal={showTermsAndConditionModal}
         message="You must accept the terms & conditions."
         handleConfirm={handleConfirm}
        //  handleCancel={handleCancel}  
      />
      
      <Sidemenu_teamleader />
      <CalendarConfirm
        showCalendarConfirmModal={showCalendarConfirmModal}
        handleClose={handleClose}
        confirmCalendar={confirmCalendar}
        teamData={teamData}
      />
    </div>
  );
}
export default Calendarsale_teamleader;
