import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const EditTeamModal = ({
  showEditModal,
  handleCloseEditModal,
  projectType,
  teamData,
  teamId,
  refreshTeamData,
  updateFeedbackMessage,
}) => {
  //define states
  const [formData, setFormData] = useState({
    teamname: "",
    amount: "",
    protected_id: teamData.protected_id,
    portrait: teamData.portrait,
    reason_not_portrait: "",
    crowd: teamData.crowd,
    sold_calendar: teamData.sold_calendar,
    leader_firstname: "",
    leader_lastname: "",
    leader_email: "",
    leader_mobile: "",
    leader_ssn: "",
    leader_address: "",
    leader_postalcode: "",
    leader_county: "",
    calendar_amount: "",
    team_id: teamId,
  });
  const [errorMessage, setErrorMessage] = useState({
    teamname: false,
    amount: false,
    reason_not_portrait: false
  });
  const [errorMessageSport, setErrorMessageSport] = useState({
    teamname: false,
    amount: false,
    reason_not_portrait: false,
    leader_firstname: false,
    leader_lastname: false,
    leader_email: false,
    leader_mobile: false,
    leader_address: false,
    leader_county: false,
    leader_postalcode: false,
    leader_ssn: false,
    calendar_amount: false,
  });
  const [isTeamnamemodified, setIsTeamnamemodified] = useState(false);
  const [isAmountmodified, setIsAmountmodified] = useState(false);
  const [isPortraitmodified, setIsPortraitmodified] = useState(false);
  const [isReasonNotPortraitmodified, setIsReasonNotPortraitmodified] = useState(false);
  const [isCrowdmodified, setIsCrowdmodified] = useState(false);
  const [isProtectedidmodified, setIsProtectedidmodified] = useState(false);
  const [isSoldCalendaridmodified, setIsSoldCalendarmodified] = useState(false);
  const [isLeaderFirstnamemodified, setIsLeaderFirstnamemodified] =
    useState(false);
  const [isLeaderLastnamemodified, setIsLeaderLastnamemodified] =
    useState(false);
  const [isLeaderEmailmodified, setIsLeaderEmailmodified] = useState(false);
  const [isLeaderMobilemodified, setIsLeaderMobilemodified] = useState(false);
  const [isLeaderSsnmodified, setIsLeaderSsnmodified] = useState(false);
  const [isLeaderAddressmodified, setIsLeaderAddressmodified] = useState(false);
  const [isLeaderPostalcodemodified, setIsLeaderPostalcodemodified] =
    useState(false);
  const [isLeaderCountymodified, setIsLeaderCountymodified] = useState(false);
  const [isCalendaramountmodified, setIsCalendaramountmodified] =
    useState(false);
  const [showInputFields, setShowInputFields] = useState(
    teamData.sold_calendar === 1,
  );
  const [user_lang, setUser_lang] = useState("");

  console.log("teamData", teamData);
  console.log("formData", formData);

  //get user_lang
  useEffect(() => {
    let user_lang = localStorage.getItem("user_lang");
    console.log(user_lang);
    setUser_lang(user_lang);
  }, []);

  //showing/hiding soldcalendarform
  // useEffect(() => {
  //   if (teamData.sold_calendar === 1) {
  //     setShowInputFields(true);
  //   } else {
  //     setShowInputFields(false);
  //   }
  //   console.log("showInputFields:", showInputFields);
  // }, [showEditModal, teamData]);
  useEffect(() => {
    setFormData({
      teamname: teamData.teamname,
      amount: teamData.amount,
      protected_id: teamData.protected_id,
      portrait: teamData.portrait,
      reason_not_portrait: teamData.reason_not_portrait,
      crowd: teamData.crowd,
      sold_calendar: teamData.sold_calendar,
      leader_firstname: teamData.leader_firstname,
      leader_lastname: teamData.leader_lastname,
      leader_email: teamData.leader_email,
      leader_mobile: teamData.leader_mobile,
      leader_ssn: teamData.leader_ssn,
      leader_address: teamData.leader_address,
      leader_postalcode: teamData.leader_postalcode,
      leader_county: teamData.leader_county,
      calendar_amount: teamData.calendar_amount,
      team_id: teamId,
    });
    setShowInputFields(teamData.sold_calendar === 1);
  }, [teamData, showEditModal]);

  //cancel/close modal
  const handleCancel = () => {
    resetModificationFlags(); // Reset modification flags
    setFormData({
      teamname: teamData.teamname,
      amount: teamData.amount,
      protected_id: teamData.protected_id,
      portrait: teamData.portrait,
      reason_not_portrait: teamData.reason_not_portrait,
      crowd: teamData.crowd,
      sold_calendar: teamData.sold_calendar,
      leader_firstname: teamData.leader_firstname,
      leader_lastname: teamData.leader_lastname,
      leader_email: teamData.leader_email,
      leader_mobile: teamData.leader_mobile,
      leader_ssn: teamData.leader_ssn,
      leader_address: teamData.leader_address,
      leader_postalcode: teamData.leader_postalcode,
      leader_county: teamData.leader_county,
      calendar_amount: teamData.calendar_amount,
      team_id: teamId,
    });
    setErrorMessage({
      teamname: false,
      amount: false,
      reason_not_portrait: false,
    });
    setErrorMessageSport({
      teamname: false,
      amount: false,
      leader_firstname: false
    });
    setShowInputFields(teamData.sold_calendar === 1);
    handleCloseEditModal();
  };

  console.log(showInputFields);

  // Function to reset all modification flags to false
  const resetModificationFlags = () => {
    setIsTeamnamemodified(false);
    setIsAmountmodified(false);
    setIsPortraitmodified(false);
    setIsReasonNotPortraitmodified(false);
    setIsCrowdmodified(false);
    setIsProtectedidmodified(false);
    setIsSoldCalendarmodified(false);
    setIsLeaderFirstnamemodified(false);
    setIsLeaderLastnamemodified(false);
    setIsLeaderEmailmodified(false);
    setIsLeaderMobilemodified(false);
    setIsLeaderSsnmodified(false);
    setIsLeaderAddressmodified(false);
    setIsLeaderPostalcodemodified(false);
    setIsLeaderCountymodified(false);
    setIsCalendaramountmodified(false);
  };

  // console.log("amount", isAmountmodified);
  // console.log("teamname", isTeamnamemodified);
  // console.log("calendar amount", isCalendaramountmodified);
  // console.log("crowd", isCrowdmodified);
  // console.log("portrait", isPortraitmodified);
  // console.log("reason not portrait", isReasonNotPortraitmodified);
  // console.log("protected if", isProtectedidmodified);
  // console.log("leader SSN", isLeaderSsnmodified);
  // console.log("Leader address", isLeaderAddressmodified);
  // console.log("Leader county", isLeaderCountymodified);
  // console.log("Leader email", isLeaderEmailmodified);
  // console.log("Leader firstname", isLeaderFirstnamemodified);
  // console.log("Leader lastname", isLeaderLastnamemodified);
  // console.log("Leader mobile", isLeaderMobilemodified);
  // console.log("Leader postalcode", isLeaderPostalcodemodified);

  // Handler for teamname change
  const handleTeamnameChange = (e) => {
    setFormData({ ...formData, teamname: e.target.value });
    setIsTeamnamemodified(true);
    if (projectType === "school") {
      setErrorMessage({ ...errorMessage, teamname: false });
    } else {
      setErrorMessageSport({ ...errorMessageSport, teamname: false });
    }
  };
  // Handler for amount change
  const handleAmountChange = (e) => {
    setFormData({ ...formData, amount: e.target.value });
    setIsAmountmodified(true);
    if (projectType === "school") {
      setErrorMessage({ ...errorMessage, amount: false });
    } else {
      setErrorMessageSport({ ...errorMessageSport, amount: false });
    }
  };
  // Handler for portrait change
  const handlePortraitChange = (e) => {
    const newValue = e.target.checked ? 1 : 0;
    setFormData({ ...formData, portrait: newValue });
    console.log(newValue);
    setIsPortraitmodified(true);
  };
  // Handler for reason not portrait change
  const handleReasonNotPortraitChange = (e) => {
    setFormData({ ...formData, reason_not_portrait: e.target.value });
    setIsReasonNotPortraitmodified(true);
    if (projectType === "school" || projectType === "sport_portrait") {
      setErrorMessage({ ...errorMessage, reason_not_portrait: false });
    } else {
      setErrorMessageSport({ ...errorMessageSport, reason_not_portrait: false });
    }
  };
  const handleCrowdChange = (e) => {
    const newValue = e.target.checked ? 1 : 0;
    setFormData({ ...formData, crowd: newValue });
    console.log(newValue);
    setIsCrowdmodified(true);
  };
  const handleProtectedidChange = (e) => {
    const newValue = e.target.checked ? 1 : 0;
    setFormData({ ...formData, protected_id: newValue });
    setIsProtectedidmodified(true);
  };
  const handleSoldCalendarChange = (e) => {
    const newValue = e.target.checked ? 1 : 0;
    setFormData({ ...formData, sold_calendar: newValue });
    setIsSoldCalendarmodified(true);
    setShowInputFields(e.target.checked);
  };
  const handleLeaderFirstnameChange = (e) => {
    setFormData({ ...formData, leader_firstname: e.target.value });
    setIsLeaderFirstnamemodified(true);
    setErrorMessageSport({ ...errorMessageSport, leader_firstname: false });
  };
  const handleLeaderLastnameChange = (e) => {
    setFormData({ ...formData, leader_lastname: e.target.value });
    setIsLeaderLastnamemodified(true);
    setErrorMessageSport({ ...errorMessageSport, leader_lastname: false });
  };
  const handleLeaderEmailChange = (e) => {
    setFormData({ ...formData, leader_email: e.target.value });
    setIsLeaderEmailmodified(true);
    setErrorMessageSport({ ...errorMessageSport, leader_email: false });
  };
  const handleLeaderMobileChange = (e) => {
    setFormData({ ...formData, leader_mobile: e.target.value });
    setIsLeaderMobilemodified(true);
    setErrorMessageSport({ ...errorMessageSport, leader_mobile: false });
  };
  const handleLeaderSsnChange = (e) => {
    setFormData({ ...formData, leader_ssn: e.target.value });
    setIsLeaderSsnmodified(true);
    setErrorMessageSport({ ...errorMessageSport, leader_ssn: false });
  };
  const handleLeaderAddressChange = (e) => {
    setFormData({ ...formData, leader_address: e.target.value });
    setIsLeaderAddressmodified(true);
    setErrorMessageSport({ ...errorMessageSport, leader_address: false });
  };
  const handleLeaderPostalcodeChange = (e) => {
    setFormData({ ...formData, leader_postalcode: e.target.value });
    setIsLeaderPostalcodemodified(true);
    setErrorMessageSport({ ...errorMessageSport, leader_postalcode: false });
  };
  const handleLeaderCountyChange = (e) => {
    setFormData({ ...formData, leader_county: e.target.value });
    setIsLeaderCountymodified(true);
    setErrorMessageSport({ ...errorMessageSport, leader_county: false });
  };
  const handleLeaderCalendarAmountChange = (e) => {
    setFormData({ ...formData, calendar_amount: e.target.value });
    setIsCalendaramountmodified(true);
    setErrorMessageSport({ ...errorMessageSport, calendar_amount: false });
  };

  //submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedFields = {
      teamname: isTeamnamemodified ? formData.teamname : teamData.teamname,
      leader_firstname: isLeaderFirstnamemodified
        ? formData.leader_firstname
        : teamData.leader_firstname,
      leader_lastname: isLeaderLastnamemodified
        ? formData.leader_lastname
        : teamData.leader_lastname,
      leader_email: isLeaderEmailmodified
        ? formData.leader_email
        : teamData.leader_email,
      leader_mobile: isLeaderMobilemodified
        ? formData.leader_mobile
        : teamData.leader_mobile,
      leader_ssn: isLeaderSsnmodified
        ? parseInt(formData.leader_ssn)
        : parseInt(teamData.leader_ssn),
      leader_address: isLeaderAddressmodified
        ? formData.leader_address
        : teamData.leader_address,
      leader_postalcode: isLeaderPostalcodemodified
        ? parseInt(formData.leader_postalcode)
        : parseInt(teamData.leader_postalcode),
      leader_county: isLeaderCountymodified
        ? formData.leader_county
        : teamData.leader_county,
      calendar_amount: isCalendaramountmodified
        ? parseInt(formData.calendar_amount)
        : parseInt(teamData.calendar_amount),
      amount: isAmountmodified
        ? parseInt(formData.amount)
        : parseInt(teamData.amount),
      portrait: isPortraitmodified ? formData.portrait : teamData.portrait,
      reason_not_portrait: isReasonNotPortraitmodified ? formData.reason_not_portrait : teamData.reason_not_portrait,
      crowd: isCrowdmodified ? formData.crowd : teamData.crowd,
      protected_id: isProtectedidmodified
        ? formData.protected_id
        : teamData.protected_id,
      sold_calendar: isSoldCalendaridmodified
        ? formData.sold_calendar
        : teamData.sold_calendar,
      team_id: teamId,
    };

    // Set error messages
    if (projectType === "sport") {
      let errorsSport = {};
      if (!updatedFields.teamname) errorsSport.teamname = true;
      if (!updatedFields.amount) errorsSport.amount = true;
      if (formData.portrait === 0 && (formData.reason_not_portrait === null || formData.reason_not_portrait === "")) errorsSport.reason_not_portrait = true;

      if (showInputFields) {
        if (!updatedFields.leader_firstname)
          errorsSport.leader_firstname = true;
        if (!updatedFields.leader_lastname) errorsSport.leader_lastname = true;
        if (!updatedFields.leader_email) errorsSport.leader_email = true;
        if (!updatedFields.leader_mobile) errorsSport.leader_mobile = true;
        if (!updatedFields.leader_address) errorsSport.leader_address = true;
        if (!updatedFields.leader_county) errorsSport.leader_county = true;
        if (!updatedFields.leader_postalcode)
          errorsSport.leader_postalcode = true;
        if (user_lang === "SE") {
          if (!updatedFields.leader_ssn) errorsSport.leader_ssn = true;
        }
        if (!updatedFields.calendar_amount) errorsSport.calendar_amount = true;
      }
      console.log("errorSport", errorsSport);
      setErrorMessageSport(errorsSport);
      // Check if any errors exist
      if (Object.keys(errorsSport).length > 0) {
        return;
      }
    } else if (projectType === "school" || projectType === "sport_portrait") {
      let errors = {};
      if (!updatedFields.teamname) errors.teamname = true;
      if (!updatedFields.amount) errors.amount = true;
      if (formData.portrait === 0 && (formData.reason_not_portrait === null || formData.reason_not_portrait === "")) errors.reason_not_portrait = true;
      console.log("errors", errors);
      setErrorMessage(errors);
      // Check if any errors exist
      if (Object.keys(errors).length > 0) {
        return;
      }
    }

    if (user_lang === "SE") {
      if (showInputFields === true) {
        if (teamData.leader_ssn === null && formData.leader_ssn === "") {
          console.log("missing required leader data");
          return;
        }
      }
    }

    const portraitValue = updatedFields.portrait ? 1 : 0;
    const crowdValue = updatedFields.crowd ? 1 : 0;
    const protectedIdValue = updatedFields.protected_id ? 1 : 0;
    const calendarSalesValue = updatedFields.sold_calendar ? 1 : 0;

    try {
      const Data = await window.api.editTeam({
        ...updatedFields,
        teamname: updatedFields.teamname,
        amount: updatedFields.amount,
        portrait: portraitValue,
        reason_not_portrait: portraitValue === 1 ? null: formData.reason_not_portrait,
        crowd: crowdValue,
        protected_id: protectedIdValue,
        sold_calendar: calendarSalesValue,
        leader_firstname: updatedFields.leader_firstname,
        leader_lastname: updatedFields.leader_lastname,
        leader_address: updatedFields.leader_address,
        leader_county: updatedFields.leader_county,
        leader_email: updatedFields.leader_email,
        leader_mobile: updatedFields.leader_mobile,
        leader_postalcode: updatedFields.leader_postalcode,
        leader_ssn: updatedFields.leader_ssn,
        calendar_amount: updatedFields.calendar_amount,
        team_id: teamId,
      });

      console.log(updatedFields);
      console.log(teamId);
      resetModificationFlags(); // Reset modification flags
      setShowInputFields(false);
      handleCloseEditModal();
      refreshTeamData(); //running twice
      updateFeedbackMessage(
        `${projectType === "school" ? "Class updated successfully" : "Team updated successfully"}`,
      );
      setTimeout(() => {
        refreshTeamData(); //running twice
      }, 300);
    } catch (error) {
      console.error("Error editing team:", error);
      setShowInputFields(false);
    }
  };


  return (
    <Modal className="mt-5" show={showEditModal} onHide={handleCancel}>
      <Modal.Body style={{ textAlign: "left" }} className="mt-3 mb-3 px-5">
        <Modal.Title>
          <h5 className="mb-2">
            <b>
              {projectType === "school" ? "Edit class" : "Edit team"}:{" "}
              {teamData.teamname}
            </b>
          </h5>
        </Modal.Title>

        <form className="editteam-teamleader-form my-4" onSubmit={handleSubmit}>
          <div className="mb-5">
            <div className="mb-3">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ textAlign: "left" }}>
                  {projectType === "school" ? "Class name:" : "Team name:"}
                </label>
                <input
                  // className={`form-input-field ${projectType === "school" ? (errorMessage.teamname ? "error-border" : "") : errorMessageSport.teamname ? "error-border" : ""}`}
                  className={`form-input-field ${
                    ((projectType === "school" || projectType === "sport_portrait") && errorMessage.teamname) || 
                    (projectType === "sport" && errorMessageSport.teamname) 
                      ? "error-border" 
                      : ""
                  }`}
                  type="text"
                  id="teamname"
                  name="teamname"
                  style={{ width: "20em" }}
                  placeholder={
                    projectType === "school" ? "Class name" : "Team name"
                  }
                  defaultValue={teamData.teamname}
                  onChange={handleTeamnameChange}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ textAlign: "left" }}>
                  {projectType === "school"
                    ? "Amount of photographed students:"
                    : "Amount of photographed players:"}
                </label>
                <input
                  // className={`form-input-field ${projectType === "school" ? (errorMessage.amount ? "error-border" : "") : errorMessageSport.amount ? "error-border" : ""}`}
                  className={`form-input-field ${
                    ((projectType === "school" || projectType === "sport_portrait") && errorMessage.amount) || 
                    (projectType === "sport" && errorMessageSport.amount) 
                      ? "error-border" 
                      : ""
                  }`}
                  type=""
                  id="amount"
                  name="amount"
                  style={{ width: "20em" }}
                  placeholder={
                    projectType === "school"
                      ? "Amount of photographed students"
                      : "Amount of photographed players"
                  }
                  defaultValue={teamData.amount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>
            <div className="checkbox-container d-flex">
              <label>
                <input
                  className="checkmark mr-2"
                  type="checkbox"
                  name="portrait"
                  defaultChecked={teamData.portrait === 1}
                  onChange={handlePortraitChange}
                />
                I took portraits
              </label>
              {(formData.portrait === "undefined" && teamData.portrait === 0) || (formData.portrait === 0) ? (
                <div className="select-container ml-3">
                  {/* <label htmlFor="reason">Reason:</label> */}
                  <select
                    id="reason"
                    name="reason_not_portrait"
                    className={`form-select ${
                      ((projectType === "school" ||
                        projectType === "sport_portrait") &&
                        errorMessage.reason_not_portrait) ||
                      (projectType === "sport" &&
                        errorMessageSport.reason_not_portrait)
                        ? "error-border"
                        : ""
                    }`}
                    onChange={handleReasonNotPortraitChange}
                    defaultValue={teamData.reason_not_portrait}
                    >
                    <option value="">If not, select reason</option>
                    <option value="Didn't show up">Didn't show up</option>
                    <option value="Another Photographer">
                      Another Photographer
                    </option>
                    <option value="According to agreement">
                      According to agreement
                    </option>
                    <option value="Other">
                      Other reason (see anomaly report)
                    </option>
                  </select>
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="checkbox-container">
              <label>
                <input
                  className="checkmark mr-2"
                  type="checkbox"
                  name="crowd"
                  defaultChecked={teamData.crowd === 1}
                  onChange={handleCrowdChange}
                />
                I took group photo
              </label>
            </div>
            <div className="checkbox-container">
              <label>
                <input
                  className="checkmark mr-2"
                  type="checkbox"
                  name="protected_id"
                  defaultChecked={teamData.protected_id === 1}
                  onChange={handleProtectedidChange}
                />
                {projectType === "school"
                  ? "There were students with protected ID"
                  : "There were players with protected ID"}
              </label>
            </div>
          </div>

          {projectType === "sport" ? (
            <div>
              <hr></hr>

              <h6>
                <b>Calendar order</b>
              </h6>
              <div className="checkbox-container">
                <label>
                  {" "}
                  {showInputFields ? "Yes" : "Status: no order made"}
                </label>
                <input
                  className="checkmark mr-2"
                  type="checkbox"
                  name="sold_calendar"
                  defaultChecked={teamData.sold_calendar === 1}
                  onChange={handleSoldCalendarChange}
                />
              </div>
              {/* <div>
                                <label>Status: <em>{showInputFields ? "Yes" : "no order"}</em></label>
                            </div>
                            <div className="checkbox-container mb-5">
                                <input
                                    className="checkmark mr-2"
                                    type="checkbox"
                                    name="sold_calendar"
                                    defaultChecked={teamData.sold_calendar === 1}
                                    onChange={handleSoldCalendarChange}
                                />
                            </div> */}

              {/* <div className="checkbox-button-container mb-5">
                            <label>Status: <em>{showInputFields ? "Yes" : "no order"}</em></label>
                                <button
                                    className={`checkmark-button${teamData.sold_calendar === 1 ? ' checked' : ''}`}
                                    onClick={handleSoldCalendarChange}
                                > Change status
                                    {teamData.sold_calendar === 1 ? '✔' : ''}
                                </button>
                            </div> */}

              {showInputFields && (
                <div className="mt-4">
                  {user_lang && (user_lang === "SE") && (
                    <div>
                      <label>Leader social security number:</label>
                      <input
                        className={`form-input-field ${errorMessageSport.leader_ssn ? "error-border" : ""}`}
                        type="number"
                        name="leader_ssn"
                        placeholder="Social security number (YYYYMMDDXXXX)"
                        style={{ width: "20em" }}
                        defaultValue={teamData.leader_ssn}
                        onChange={handleLeaderSsnChange}
                        onWheel={(event) => event.target.blur()}
                        onKeyDown={(event) => {
                          // Prevents changing value by arrow keys
                          if (
                            event.key === "ArrowUp" ||
                            event.key === "ArrowDown"
                          ) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </div>
                  )}
                  <h6 className="mt-3" style={{ fontSize: "0.9em" }}>
                    <h6 style={{ fontSize: "1.1em" }}><b>Calendar delivery information:</b></h6>
                    <h6 style={{ fontSize: "0.9em" }}><em>* Required information for calendar sales</em></h6>
                  </h6>
                  <div>
                    <label>Firstname: *</label>
                    <div>
                      <input
                        className={`form-input-field ${errorMessageSport.leader_firstname ? "error-border" : ""}`}
                        type="text"
                        name="leader_firstname"
                        placeholder="Leader First Name"
                        style={{ width: "20em" }}
                        defaultValue={teamData.leader_firstname}
                        onChange={handleLeaderFirstnameChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label>Lastname: * </label>
                    <div>
                      <input
                        className={`form-input-field ${errorMessageSport.leader_lastname ? "error-border" : ""}`}
                        type="text"
                        name="leader_lastname"
                        placeholder="Leader Last Name"
                        style={{ width: "20em" }}
                        defaultValue={teamData.leader_lastname}
                        onChange={handleLeaderLastnameChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label>Email: *</label>
                    <div>
                      <input
                        className={`form-input-field ${errorMessageSport.leader_email ? "error-border" : ""}`}
                        type="email"
                        name="leader_email"
                        placeholder="Leader Email"
                        style={{ width: "20em" }}
                        defaultValue={teamData.leader_email}
                        onChange={handleLeaderEmailChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label>Mobile: *</label>
                    <div>
                      <input
                        className={`form-input-field ${errorMessageSport.leader_mobile ? "error-border" : ""}`}
                        type="text"
                        name="leader_mobile"
                        placeholder="Leader Mobile"
                        style={{ width: "20em" }}
                        defaultValue={teamData.leader_mobile}
                        onChange={handleLeaderMobileChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label>Address: *</label>
                    <div>
                      <input
                        className={`form-input-field ${errorMessageSport.leader_address ? "error-border" : ""}`}
                        type="text"
                        name="leader_address"
                        placeholder="Leader Address"
                        style={{ width: "20em" }}
                        defaultValue={teamData.leader_address}
                        onChange={handleLeaderAddressChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label>Postalcode: *</label>
                    <div>
                        <input
                          className={`form-input-field ${errorMessageSport.leader_postalcode ? "error-border" : ""}`}
                          type="number"
                          name="leader_postalcode"
                          placeholder="Leader Postal Code"
                          style={{ width: "20em" }}
                          defaultValue={teamData.leader_postalcode}
                          onChange={handleLeaderPostalcodeChange}
                          onWheel={(event) => event.target.blur()}
                          onKeyDown={(event) => {
                            // Prevents changing value by arrow keys
                            if (
                              event.key === "ArrowUp" ||
                              event.key === "ArrowDown"
                            ) {
                              event.preventDefault();
                            }
                          }}
                        />
                    </div>    
                  </div>
                  <div>
                    <label>City: *</label>
                    <div>
                      <input
                        className={`form-input-field ${errorMessageSport.leader_county ? "error-border" : ""}`}
                        type="text"
                        name="leader_county"
                        placeholder="Leader City"
                        style={{ width: "20em" }}
                        defaultValue={teamData.leader_county}
                        onChange={handleLeaderCountyChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label>Amount of players that require calendars *</label>
                    <input
                      className={`form-input-field ${errorMessageSport.calendar_amount ? "error-border" : ""}`}
                      type=""
                      name="calendar_amount"
                      placeholder="Total amount of players in team"
                      style={{ width: "20em" }}
                      defaultValue={teamData.calendar_amount}
                      onChange={handleLeaderCalendarAmountChange}
                    />
                    <h6 style={{ fontSize: "0.9em" }}>
                      * All players recieve three calendars each
                    </h6>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}

          <div className="mt-4">
            <Button
              className="button cancel fixed-width mr-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="button standard fixed-width ">
              Save
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditTeamModal;
