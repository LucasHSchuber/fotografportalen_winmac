import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";
import CalendarConfirm from "../../components/teamleader/calendarconfirmModal";

import '../../assets/css/teamleader/main_teamleader.css';


function Calendarsale_teamleader() {
    // Define states
    const [formData, setFormData] = useState({
        calendar_amount: "",
        leader_address: "",
        leader_postalcode: "",
        leader_county: "",
        leader_ssn: "",
        terms: false
    });
    const [project_id, setProject_id] = useState(false);
    const [showCalendarConfirmModal, setShowCalendarConfirmModal] = useState(false);

    const handleClose = () => { setShowCalendarConfirmModal(false) };



    const navigate = useNavigate();
    const handleBack = () => {
        navigate(`/calendarsale_teamleader`);
    };


    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'terms' ? checked : value // Update terms separately
        }));
    };




    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.terms) {
            const confirmResponse = window.confirm("You must accept the terms.");
            if (!confirmResponse) {
                return;
            } else {
                return;
            }
        }

        setShowCalendarConfirmModal(true);
    };

    const confirmCalendar = async () => {

        let team_id = localStorage.getItem("team_id");
        //method to add data to table
        try {
            const teamData = await window.api.addDataToTeam({
                ...formData,
                team_id: team_id
            });
            console.log('Teams:', teamData.teams);

            setFormData({
                calendar_amount: "",
                leader_address: "",
                leader_postalcode: "",
                leader_county: "",
                leader_ssn: "",
                terms: false
            });
            navigate("/newteam_teamleader");

        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    }



    return (
        <div className="teamleader-wrapper">

            <div className="calendarsale-teamleader-content">

                <div className="header mb-4">
                    <h5>Cashing!</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio officiis saepe sunt rerum, consequatur quas distinctio minus quo veritatis at eveniet culpa, blanditiis repudiandae consequuntur libero porro perferendis eius aut.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio officiis saepe sunt rerum, consequatur quas distinctio minus quo veritatis at eveniet culpa, blanditiis repudiandae consequuntur libero porro perferendis eius aut.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <input className="form-input-field" type="number" name="calendar_amount" value={formData.calendar_amount} onChange={handleChange} placeholder="Amount of players that requests calendar" required />
                        <h6 style={{ fontSize: "0.9em" }}>* All players recieve three calendars each</h6>
                    </div>
                    <div>
                        <input className="form-input-field" type="number" name="leader_ssn" value={formData.leader_ssn} onChange={handleChange} placeholder="Social security number" required />
                    </div>
                    <div>
                        <input className="form-input-field" type="text" name="leader_address" value={formData.leader_address} onChange={handleChange} placeholder="Leader Address" required />
                    </div>
                    <div>
                        <input className="form-input-field" type="number" name="leader_postalcode" value={formData.leader_postalcode} onChange={handleChange} placeholder="Leader Postal Code" required />
                    </div>
                    <div>
                        <input className="form-input-field" type="text" name="leader_county" value={formData.leader_county} onChange={handleChange} placeholder="Leader County" required />
                    </div>
                    <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                            />
                            I agree to the terms and conditions
                        </label>
                    </div>

                    <button className="button cancel fixed-width mr-1" onClick={handleBack}>Back</button>
                    <button className="button standard fixed-width " type="submit">Save</button>

                </form>

            </div>

            <Sidemenu_teamleader />
            <CalendarConfirm showCalendarConfirmModal={showCalendarConfirmModal} handleClose={handleClose} confirmCalendar={confirmCalendar} />

        </div>
    );
}
export default Calendarsale_teamleader;