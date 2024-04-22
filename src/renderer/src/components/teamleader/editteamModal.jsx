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


    console.log(showInputFields);

    useEffect(() => {
        if (teamData.sold_calendar === 1) {
            setShowInputFields(true);
        } else {
            setShowInputFields(false);
        }
        console.log("showInputFields:", showInputFields);
    }, [showEditModal, teamData])

    console.log(teamData);




    //cancel/close modal
    const handleCancel = () => {
        setShowInputFields(false);
        handleCloseEditModal();
    };



    // Handler for teamname change
    const handleTeamnameChange = (e) => {
        setFormData({ ...formData, teamname: e.target.value });
        setIsTeamnamemodified(true);
    };
    // Handler for amount change
    const handleAmountChange = (e) => {
        setFormData({ ...formData, amount: e.target.value });
        setIsAmountmodified(true);
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
    };

    const handleLeaderLastnameChange = (e) => {
        setFormData({ ...formData, leader_lastname: e.target.value });
        setIsLeaderLastnamemodified(true);
    };

    const handleLeaderEmailChange = (e) => {
        setFormData({ ...formData, leader_email: e.target.value });
        setIsLeaderEmailmodified(true);
    };

    const handleLeaderMobileChange = (e) => {
        setFormData({ ...formData, leader_mobile: e.target.value });
        setIsLeaderMobilemodified(true);
    };

    const handleLeaderSsnChange = (e) => {
        setFormData({ ...formData, leader_ssn: e.target.value });
        setIsLeaderSsnmodified(true);
    };

    const handleLeaderAddressChange = (e) => {
        setFormData({ ...formData, leader_address: e.target.value });
        setIsLeaderAddressmodified(true);
    };

    const handleLeaderPostalcodeChange = (e) => {
        setFormData({ ...formData, leader_postalcode: e.target.value });
        setIsLeaderPostalcodemodified(true);
    };

    const handleLeaderCountyChange = (e) => {
        setFormData({ ...formData, leader_county: e.target.value });
        setIsLeaderCountymodified(true);
    };

    const handleLeaderCalendarAmountChange = (e) => {
        setFormData({ ...formData, calendar_amount: e.target.value });
        setIsCalendaramountmodified(true);
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
            amount: isAmountmodified ? formData.amount : teamData.amount,
            portrait: isPortraitmodified ? formData.portrait : teamData.portrait,
            crowd: isCrowdmodified ? formData.crowd : teamData.crowd,
            protected_id: isProtectedidmodified ? formData.protected_id : teamData.protected_id,
            sold_calendar: isSoldCalendaridmodified ? formData.sold_calendar : teamData.sold_calendar,
            team_id: teamId
        };


        console.log(showInputFields);
        console.log("teamData.leader_ssn:", teamData.leader_ssn);
        console.log("formData.leader_ssn:", formData.leader_ssn);
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

        console.log(updatedFields);

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

            console.log('Editing team response:', Data);
            setShowInputFields(false);
            handleCloseEditModal();
            refreshTeamData();
            console.log(Data);
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
                                    className="form-input-field"
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
                                    className="form-input-field"
                                    type="number"
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
                                        <label>* Leader firstname</label>
                                        <input className="form-input-field" type="text" name="leader_firstname" placeholder="Leader First Name"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_firstname}
                                            onChange={handleLeaderFirstnameChange}
                                        />
                                    </div>
                                    <div>
                                        <label>* Leader lastname:</label>
                                        <input className="form-input-field" type="text" name="leader_lastname" placeholder="Leader Last Name"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_lastname}
                                            onChange={handleLeaderLastnameChange}
                                        />
                                    </div>
                                    <div>
                                        <label>* Leader email:</label>
                                        <input className="form-input-field" type="email" name="leader_email" placeholder="Leader Email"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_email}
                                            onChange={handleLeaderEmailChange}
                                        />
                                    </div>
                                    <div>
                                        <label>* Leader mobile:</label>
                                        <input className="form-input-field" type="text" name="leader_mobile" placeholder="Leader Mobile"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_mobile}
                                            onChange={handleLeaderMobileChange}
                                        />
                                    </div>
                                    <div>
                                        <label>* Leader social security number:</label>
                                        <input className="form-input-field" type="number" name="leader_ssn" placeholder="Social security number"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_ssn}
                                            onChange={handleLeaderSsnChange}
                                        />
                                    </div>
                                    <div>
                                        <label>* Leader address:</label>
                                        <input className="form-input-field" type="text" name="leader_address" placeholder="Leader Address"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_address}
                                            onChange={handleLeaderAddressChange}
                                        />
                                    </div>
                                    <div>
                                        <label>* Leader postalcode:</label>
                                        <input className="form-input-field" type="number" name="leader_postalcode" placeholder="Leader Postal Code"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_postalcode}
                                            onChange={handleLeaderPostalcodeChange}
                                        />
                                    </div>
                                    <div>
                                        <label>* Leader county:</label>
                                        <input className="form-input-field" type="text" name="leader_county" placeholder="Leader County"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_county}
                                            onChange={handleLeaderCountyChange}
                                        />
                                    </div>
                                    <div>
                                        <label>* Calendar amount:</label>
                                        <input className="form-input-field" type="number" name="calendar_amount" placeholder="Total amount of players in team"
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
