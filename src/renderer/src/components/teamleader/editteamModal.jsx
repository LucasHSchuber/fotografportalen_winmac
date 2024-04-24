import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';


const EditTeamModal = ({ showEditModal, handleCloseEditModal, projectType, teamData, teamId, refreshTeamData }) => {

    //define states
    const [formData, setFormData] = useState({
        teamname: "",
        amount: "",
        protected_id: teamData.protected_id,
        portrait: teamData.portrait,
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
        team_id: teamId
    });
    const [errorMessage, setErrorMessage] = useState({
        teamname: false,
        amount: false
    });
    const [errorMessageSport, setErrorMessageSport] = useState({
        leader_firstname: false,
        leader_lastname: false,
        leader_email: false,
        leader_mobile: false,
        leader_address: false,
        leader_county: false,
        leader_postalcode: false,
        leader_ssn: false,
        calendar_amount: false
    });

    console.log(teamData);

    const [isTeamnamemodified, setIsTeamnamemodified] = useState(false);
    const [isAmountmodified, setIsAmountmodified] = useState(false);
    const [isPortraitmodified, setIsPortraitmodified] = useState(false);
    const [isCrowdmodified, setIsCrowdmodified] = useState(false);
    const [isProtectedidmodified, setIsProtectedidmodified] = useState(false);
    const [isSoldCalendaridmodified, setIsSoldCalendarmodified] = useState(false);
    const [isLeaderFirstnamemodified, setIsLeaderFirstnamemodified] = useState(false);
    const [isLeaderLastnamemodified, setIsLeaderLastnamemodified] = useState(false);
    const [isLeaderEmailmodified, setIsLeaderEmailmodified] = useState(false);
    const [isLeaderMobilemodified, setIsLeaderMobilemodified] = useState(false);
    const [isLeaderSsnmodified, setIsLeaderSsnmodified] = useState(false);
    const [isLeaderAddressmodified, setIsLeaderAddressmodified] = useState(false);
    const [isLeaderPostalcodemodified, setIsLeaderPostalcodemodified] = useState(false);
    const [isLeaderCountymodified, setIsLeaderCountymodified] = useState(false);
    const [isCalendaramountmodified, setIsCalendaramountmodified] = useState(false);

    const [showInputFields, setShowInputFields] = useState(teamData.sold_calendar === 1);


    useEffect(() => {
        if (teamData.sold_calendar === 1) {
            setShowInputFields(true);
        } else {
            setShowInputFields(false);
        }
        console.log("showInputFields:", showInputFields);
    }, [showEditModal, teamData])

    //cancel/close modal
    const handleCancel = () => {
        resetModificationFlags(); // Reset modification flags
        setErrorMessage({
            teamname: false,
            amount: false,
        });
        setErrorMessageSport({
            teamname: false,
            amount: false,
            leader_firstname: false
        });
        setShowInputFields(false);
        handleCloseEditModal();
    };

    console.log(showInputFields);

    // Function to reset all modification flags to false
    const resetModificationFlags = () => {
        setIsTeamnamemodified(false);
        setIsAmountmodified(false);
        setIsPortraitmodified(false);
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

    console.log(isAmountmodified);
    console.log(isTeamnamemodified);
    console.log(isCalendaramountmodified);
    console.log(isCrowdmodified);
    console.log(isPortraitmodified);
    console.log(isProtectedidmodified);
    console.log(isLeaderSsnmodified);
    console.log(isLeaderAddressmodified);
    console.log(isLeaderCountymodified);
    console.log(isLeaderEmailmodified);
    console.log(isLeaderFirstnamemodified);
    console.log(isLeaderLastnamemodified);
    console.log(isLeaderMobilemodified);
    console.log(isLeaderPostalcodemodified);



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
    const handlePortraitChange = (e) => {
        const newValue = e.target.checked ? 1 : 0;
        setFormData({ ...formData, portrait: newValue });
        setIsPortraitmodified(true)
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
            leader_firstname: isLeaderFirstnamemodified ? formData.leader_firstname : teamData.leader_firstname,
            leader_lastname: isLeaderLastnamemodified ? formData.leader_lastname : teamData.leader_lastname,
            leader_email: isLeaderEmailmodified ? formData.leader_email : teamData.leader_email,
            leader_mobile: isLeaderMobilemodified ? formData.leader_mobile : teamData.leader_mobile,
            leader_ssn: isLeaderSsnmodified ? parseInt(formData.leader_ssn) : parseInt(teamData.leader_ssn),
            leader_address: isLeaderAddressmodified ? formData.leader_address : teamData.leader_address,
            leader_postalcode: isLeaderPostalcodemodified ? parseInt(formData.leader_postalcode) : parseInt(teamData.leader_postalcode),
            leader_county: isLeaderCountymodified ? formData.leader_county : teamData.leader_county,
            calendar_amount: isCalendaramountmodified ? parseInt(formData.calendar_amount) : parseInt(teamData.calendar_amount),
            amount: isAmountmodified ? parseInt(formData.amount) : parseInt(teamData.amount),
            portrait: isPortraitmodified ? formData.portrait : teamData.portrait,
            crowd: isCrowdmodified ? formData.crowd : teamData.crowd,
            protected_id: isProtectedidmodified ? formData.protected_id : teamData.protected_id,
            sold_calendar: isSoldCalendaridmodified ? formData.sold_calendar : teamData.sold_calendar,
            team_id: teamId
        };

        // Set error messages
        if (projectType === "sport") {
            let errorsSport = {};
            if (!updatedFields.teamname) errorsSport.teamname = true;
            if (!updatedFields.amount) errorsSport.amount = true;

            if (showInputFields) {
                if (!updatedFields.leader_firstname) errorsSport.leader_firstname = true;
                if (!updatedFields.leader_lastname) errorsSport.leader_lastname = true;
                if (!updatedFields.leader_email) errorsSport.leader_email = true;
                if (!updatedFields.leader_mobile) errorsSport.leader_mobile = true;
                if (!updatedFields.leader_address) errorsSport.leader_address = true;
                if (!updatedFields.leader_county) errorsSport.leader_county = true;
                if (!updatedFields.leader_postalcode) errorsSport.leader_postalcode = true;
                if (!updatedFields.leader_ssn) errorsSport.leader_ssn = true;
                if (!updatedFields.calendar_amount) errorsSport.calendar_amount = true;
            }
            setErrorMessageSport(errorsSport);
            // Check if any errors exist
            if (Object.keys(errorsSport).length > 0) {
                return;
            }
        } else if (projectType === "school") {
            let errors = {};
            if (!updatedFields.teamname) errors.teamname = true;
            if (!updatedFields.amount) errors.amount = true;
            setErrorMessage(errors);
            // Check if any errors exist
            if (Object.keys(errors).length > 0) {
                return;
            }
        }




        if (showInputFields === true) {
            if (teamData.leader_ssn === null && formData.leader_ssn === "") {
                console.log("missing required leader data");
                return;
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
                team_id: teamId
            });

            console.log(updatedFields);
            console.log(teamId);
            refreshTeamData(); //running twice
            resetModificationFlags(); // Reset modification flags
            setShowInputFields(false);
            handleCloseEditModal();
            refreshTeamData(); //running twice

        } catch (error) {
            console.error('Error editing team:', error);
            setShowInputFields(false);
        }



        // try {
        //     const teamData = await window.api.editTeam(updatedFields);

        //     if (teamData.success) {
        //         console.log('Team data edited successfully');
        //         setShowInputFields(false);
        //         setFormData({ ...formData, leader_ssn: "" });
        //         handleCloseEditModal();
        //         refreshTeamData();
        //     } else {
        //         console.error('Error editing team:', teamData.error);
        //         // Handle error as needed, e.g., show error message to the user
        //     }
        // } catch (error) {
        //     console.error('Error editing team:', error);
        //     // Handle error as needed, e.g., show error message to the user
        // }

    };





    return (
        <Modal className="mt-5" show={showEditModal} onHide={handleCancel}>
            <Modal.Body style={{ textAlign: "left" }} className="mt-3 mb-3 px-5">
                <Modal.Title><h5 className="mb-2"><b>{projectType === "school" ? "Edit class" : "Edit team"}: {teamData.teamname}</b></h5></Modal.Title>

                <form className="editteam-teamleader-form my-4" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <div className="mb-3">
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ textAlign: "left" }}>{projectType === "school" ? "Class name:" : "Team name:"}</label>
                                <input
                                    className={`form-input-field ${projectType === "school" ? (errorMessage.teamname ? "error-border" : "") : (errorMessageSport.teamname ? "error-border" : "")}`}
                                    type="text"
                                    id="teamname"
                                    name="teamname"
                                    style={{ width: "20em" }}
                                    placeholder={projectType === "school" ? "Class name" : "Team name"}
                                    defaultValue={teamData.teamname}
                                    onChange={handleTeamnameChange}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ textAlign: "left" }}>{projectType === "school" ? "Amount of photographed students:" : "Amount of photographed players:"}</label>
                                <input
                                    className={`form-input-field ${projectType === "school" ? (errorMessage.amount ? "error-border" : "") : (errorMessageSport.amount ? "error-border" : "")}`}
                                    type=""
                                    id="amount"
                                    name="amount"
                                    style={{ width: "20em" }}
                                    placeholder={projectType === "school" ? "Amount of photographed students" : "Amount of photographed players"}
                                    defaultValue={teamData.amount}
                                    onChange={handleAmountChange}
                                />
                            </div>
                        </div>
                        <div className="checkbox-container">
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
                                {projectType === "school" ? "There were students with protected ID" : "There were players with protected ID"}
                            </label>
                        </div>
                    </div>


                    {projectType === "sport" ? (
                        <div>

                            <hr></hr>

                            <h6><b>Calendar order</b></h6>
                            <div className="checkbox-container">
                                <label> {showInputFields ? "Yes" : "Status: no order made"}</label>
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
                                    {/* <hr className="my-4"></hr> */}
                                    <h6 style={{ fontSize: "0.9em" }}><em>* Required information for calendar sales</em></h6>
                                    <div>
                                        <label>Leader firstname: *</label>
                                        <input className={`form-input-field ${errorMessageSport.leader_firstname ? "error-border" : ""}`} type="text" name="leader_firstname" placeholder="Leader First Name"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_firstname}
                                            onChange={handleLeaderFirstnameChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Leader lastname: * </label>
                                        <input className={`form-input-field ${errorMessageSport.leader_lastname ? "error-border" : ""}`} type="text" name="leader_lastname" placeholder="Leader Last Name"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_lastname}
                                            onChange={handleLeaderLastnameChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Leader email: *</label>
                                        <input className={`form-input-field ${errorMessageSport.leader_email ? "error-border" : ""}`} type="email" name="leader_email" placeholder="Leader Email"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_email}
                                            onChange={handleLeaderEmailChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Leader mobile: *</label>
                                        <input className={`form-input-field ${errorMessageSport.leader_mobile ? "error-border" : ""}`} type="text" name="leader_mobile" placeholder="Leader Mobile"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_mobile}
                                            onChange={handleLeaderMobileChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Leader social security number: *</label>
                                        <input className={`form-input-field ${errorMessageSport.leader_ssn ? "error-border" : ""}`} type="number" name="leader_ssn" placeholder="Social security number"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_ssn}
                                            onChange={handleLeaderSsnChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Leader address: *</label>
                                        <input className={`form-input-field ${errorMessageSport.leader_address ? "error-border" : ""}`} type="text" name="leader_address" placeholder="Leader Address"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_address}
                                            onChange={handleLeaderAddressChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Leader postalcode: *</label>
                                        <input className={`form-input-field ${errorMessageSport.leader_postalcode ? "error-border" : ""}`} type="number" name="leader_postalcode" placeholder="Leader Postal Code"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_postalcode}
                                            onChange={handleLeaderPostalcodeChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Leader county: *</label>
                                        <input className={`form-input-field ${errorMessageSport.leader_county ? "error-border" : ""}`} type="text" name="leader_county" placeholder="Leader County"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_county}
                                            onChange={handleLeaderCountyChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Calendar amount: *</label>
                                        <input className={`form-input-field ${errorMessageSport.calendar_amount ? "error-border" : ""}`} type="" name="calendar_amount" placeholder="Total amount of players in team"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.calendar_amount}
                                            onChange={handleLeaderCalendarAmountChange}
                                        />
                                        <h6 style={{ fontSize: "0.9em" }}>* All players recieve three calendars each</h6>
                                    </div>
                                </div>

                            )}

                        </div>


                    ) : (
                        <>
                        </>
                    )}

                    <div className="mt-4">
                        <Button className="button cancel fixed-width mr-1" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" className="button standard fixed-width " >
                            Save
                        </Button>
                    </div>


                </form>

            </Modal.Body>
        </Modal >
    );
};

export default EditTeamModal;
