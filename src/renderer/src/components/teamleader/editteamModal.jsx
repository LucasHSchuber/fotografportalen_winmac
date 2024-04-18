import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const EditTeamModal = ({ showEditModal, handleCloseEditModal, projectType, teamData, teamId, refreshTeamData }) => {

    //define states
    const [formData, setFormData] = useState({
        teamname: "",
        amount: "",
        protected_id: teamData.protected_id,
        portrait: teamData.portrait,
        crowd: teamData.crowd,
        sold_calendar: teamData.sold_calendar,
        team_id: teamId
    });

    const [isTeamnamemodified, setIsTeamnamemodified] = useState(false);
    const [isAmountmodified, setIsAmountmodified] = useState(false);
    const [isPortraitmodified, setIsPortraitmodified] = useState(false);
    const [isCrowdmodified, setIsCrowdmodified] = useState(false);
    const [isProtectedidmodified, setIsProtectedidmodified] = useState(false);
    const [isSoldCalendaridmodified, setIsSoldCalendarmodified] = useState(false);

    const [showInputFields, setShowInputFields] = useState(teamData.sold_calendar === 1);


    console.log(teamData);


    //cancel modal
    const handleCancel = () => {
        handleCloseEditModal();
        setShowInputFields(false);
    };


    // Handler for teamname change
    const handleTeamnameChange = (e) => {
        setFormData({ ...formData, teamname: e.target.value });
        setIsTeamnamemodified(true);
    };
    // Handler for amount change
    const handleAmountChange = (e) => {
        console.log(e.target.value);
        setFormData({ ...formData, amount: e.target.value });
        setIsAmountmodified(true);
    };
    // Handler for checjboxes change
    // const handleInputChange = (e) => {
    //     const { name, checked, type } = e.target;
    //     const newValue = type === 'checkbox' ? (checked ? 1 : 0) : e.target.value;
    //     setFormData({ ...formData, [name]: newValue });
    // };
    const handlePortraitChange = (e) => {
        const newValue = e.target.checked ? 1 : 0;
        setFormData({ ...formData, portrait: newValue });
        console.log(newValue);
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
        console.log(newValue);
        setIsProtectedidmodified(true);
    };
    const handleSoldCalendarChange = (e) => {
        const newValue = e.target.checked ? 1 : 0;
        setFormData({ ...formData, sold_calendar: newValue });
        console.log(newValue);
        setIsSoldCalendarmodified(true);

        setShowInputFields(e.target.checked);

    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        let updatedFields = {};
        if (isAmountmodified) {
            updatedFields.amount = formData.amount;
        } else {
            updatedFields.amount = teamData.amount;
        }

        if (isTeamnamemodified) {
            updatedFields.teamname = formData.teamname;
        } else {
            updatedFields.teamname = teamData.teamname;
        }

        if (isPortraitmodified) {
            updatedFields.portrait = formData.portrait;
        } else {
            updatedFields.portrait = teamData.portrait;
        }

        if (isCrowdmodified) {
            updatedFields.crowd = formData.crowd;
        } else {
            updatedFields.crowd = teamData.crowd;
        }

        if (isProtectedidmodified) {
            updatedFields.protected_id = formData.protected_id;
        } else {
            updatedFields.protected_id = teamData.protected_id;
        }

        if (isSoldCalendaridmodified) {
            updatedFields.sold_calendar = formData.sold_calendar;
        } else {
            updatedFields.sold_calendar = teamData.sold_calendar;
        }

        const portraitValue = updatedFields.portrait ? 1 : 0;
        const crowdValue = updatedFields.crowd ? 1 : 0;
        const protectedIdValue = updatedFields.protected_id ? 1 : 0;
        const calendarSalesValue = updatedFields.sold_calendar ? 1 : 0;


        try {
            const teamData = await window.api.editTeam({
                ...updatedFields,
                teamname: updatedFields.teamname,
                amount: updatedFields.amount,
                portrait: portraitValue,
                crowd: crowdValue,
                protected_id: protectedIdValue,
                sold_calendar: calendarSalesValue,
                team_id: teamId
            });

            console.log('Team response:', teamData);
            handleCloseEditModal();
            refreshTeamData();
        } catch (error) {
            console.error('Error editing team:', error);
        }
    };


    return (
        <Modal className="mt-5" show={showEditModal} onHide={handleCloseEditModal}>
            <Modal.Body style={{ textAlign: "left" }} className="mt-3 mb-3 px-5">
                <Modal.Title><h5 className="mb-2"><b>{projectType === "school" ? "Edit class" : "Edit team"}: {teamData.teamname}</b></h5></Modal.Title>

                <form className="my-4" onSubmit={handleSubmit}>
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


                    {projectType === "sport" ? (
                        <div>

                            <hr></hr>

                            <h6><b>Calendar sales?</b></h6>
                            <div className="checkbox-container">
                                <label>
                                    <input
                                        className="checkmark mr-2"
                                        type="checkbox"
                                        name="sold_calendar"
                                        defaultChecked={teamData.sold_calendar === 1}
                                        onChange={handleSoldCalendarChange}
                                    />
                                    Sold calendar?
                                </label>
                            </div>

                            {showInputFields || teamData.sold_calendar === 1 ? (
                                <div>
                                    <hr className="my-4"></hr>
                                    <h6><b>Team leader information:</b></h6>
                                    <div>
                                        <input className="form-input-field" type="text" name="leader_firstname" placeholder="Leader First Name"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_firstname}
                                        // onChange={handleTeamnameChange}
                                        />
                                    </div>
                                    <div>
                                        <input className="form-input-field" type="text" name="leader_lastname" placeholder="Leader Last Name"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_lastname}
                                        // onChange={handleTeamnameChange}
                                        />
                                    </div>
                                    <div>
                                        <input className="form-input-field" type="email" name="leader_email" placeholder="Leader Email"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_email}
                                        // onChange={handleTeamnameChange}
                                        />
                                    </div>
                                    <div>
                                        <input className="form-input-field" type="text" name="leader_mobile" placeholder="Leader Mobile"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_mobile}
                                        // onChange={handleTeamnameChange}
                                        />
                                    </div>
                                    <div>
                                        <input className="form-input-field" type="number" name="leader_ssn" placeholder="Social security number"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_ssn}
                                        // onChange={handleTeamnameChange}
                                        />
                                    </div>
                                    <div>
                                        <input className="form-input-field" type="text" name="leader_address" placeholder="Leader Address"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_address}
                                        // onChange={handleTeamnameChange}
                                        />
                                    </div>
                                    <div>
                                        <input className="form-input-field" type="number" name="leader_postalcode" placeholder="Leader Postal Code"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_postalcode}
                                        // onChange={handleTeamnameChange}
                                        />
                                    </div>
                                    <div>
                                        <input className="form-input-field" type="text" name="leader_county" placeholder="Leader County"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.leader_county}
                                        // onChange={handleTeamnameChange}
                                        />
                                    </div>
                                    <div>
                                        <input className="form-input-field" type="number" name="calendar_amount" placeholder="Total amount of players in team"
                                            style={{ width: "20em" }}
                                            defaultValue={teamData.calendar_amount}
                                        // onChange={handleTeamnameChange}
                                        />
                                        <h6 style={{ fontSize: "0.9em" }}>* All players recieve three calendars each</h6>
                                    </div>
                                </div>
                            ) : (
                                <>
                                </>
                            )}

                        </div>


                    ) : (
                        <>
                        </>
                    )}

                    <div className="mt-3">
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
