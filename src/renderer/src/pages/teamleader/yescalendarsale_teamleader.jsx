import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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

    const [showTermsAndConditionBox, setShowTermsAndConditionBox] = useState(false);

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


    // const showTermsAndConditions = () => {
    //     console.log("terms and conditions");
    //     setShowTermsAndConditionBox(true);
    // }

    useEffect(() => {
        function handleResize() {
            console.log(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <div className="teamleader-wrapper">

            <div className="calendarsale-teamleader-content">


                <div className="breadcrumbs d-flex mb-4">
                    <div className="breadcrumbs-box ">1. New team</div>
                    <div className="breadcrumbs-box">2. Calander</div>
                    <div className="breadcrumbs-box breadcrumbs-active">3. Calendar information</div>
                </div>

                <div className="header mb-4" style={{ width: "37em" }}>
                    <h5>Cashing!</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio officiis saepe sunt rerum, consequatur quas distinctio minus quo veritatis at eveniet culpa, blanditiis repudiandae consequuntur libero porro perferendis eius aut.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio officiis saepe sunt rerum, consequatur quas distinctio minus quo veritatis at eveniet culpa, blanditiis repudiandae consequuntur libero porro perferendis eius aut.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <input className="form-input-field" type="number" name="calendar_amount" value={formData.calendar_amount} onChange={handleChange} placeholder="Total amount of players in team" required />
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
                    <div className="checkbox-container my-3">
                        <label className="mr-2">
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                            />
                            I agree to the terms and conditions -
                        </label>
                        <a style={{ textDecoration: "underline" }} onClick={() => setShowTermsAndConditionBox(!showTermsAndConditionBox)}>terms & conditions</a>
                    </div>

                    <button className="button cancel fixed-width mr-1" onClick={handleBack}>Back</button>
                    <button className="button standard fixed-width " type="submit">Save</button>

                </form>

            </div>


            {showTermsAndConditionBox && (
                <div className="termsandcondition-box">
                    <div className="d-flex justify-content-between mb-3">
                        <h6 style={{ textDecoration: "underline" }}><b>Terms & conditions</b></h6>
                        <h6 onClick={() => setShowTermsAndConditionBox(!showTermsAndConditionBox)}><FontAwesomeIcon icon={faTimes} className="fa-s" />
                        </h6>
                    </div>
                    <ul>
                        <li>All calendars will be sent to your home. You have the full possibility of returning all calendars up to and including 40 days after you received them.</li>
                        <li>Three calendars/players will be sent. </li>
                        <li>The calendars cost SEK 200/piece, of which SEK 100/sold calendar goes to the team.</li>
                    </ul>

                    <p style={{ fontSize: "0.85em" }}><em>You are responsible for unsold calendars being returned and for payment of the sold calendars to Express-Bild.
                        If we are forced to remind you, a reminder fee will be added according to current law.</em></p>

                    <p><b>Personal data processing (GDPR):</b></p>
                    <p>Express-Bild is responsible for the processing of your personal data.

                        Customer agrees that Express-Bild collects and stores personal data. Personal data that is collected is (first name, last name, social security number, address, postal code, city, telephone number, email, association & legal affiliation) and time of registration.
                        If the customer so chooses, we will also send home calendars to the customer for inspection in order to offer the purchase of calendars.</p>

                    <p>The purpose of Express Bild's processing of personal data is to be able to offer the customer the opportunity to sell calendars. The legal basis for Express Bild's processing is consent. If personal data is not provided to Express Bild or if consent is not provided, there is no possibility of selling team calendars. Customers who have given consent have the right to withdraw their consent at any time by emailing or calling our customer service.
                        If the customer wants calendars for viewing, the personal data will be processed to complete the delivery. If the customer chooses to order calendars, the personal data will be used for contractual obligations and to fulfill our legal obligations regarding accounting and bookkeeping and, where applicable, to be able to fulfill legal obligations towards the customer as a consumer.
                        If the customer chooses to order calendars, the legal basis for processing personal data becomes an agreement. The personal data is only stored for the period that is necessary to fulfill the purposes of the processing, i.e. during the period that the customer can be expected to buy calendars from photography, or as long as Express-Bild is obliged to store the data according to law.
                        The personal data may be forwarded to the system supplier for data storage and in the event of non-payment to debt collection companies. </p>

                    <p>You have the right to request an extract of the personal data stored about you, restriction, correction or deletion of your personal data, the right to object to the processing or request data portability.
                        For questions regarding the handling of personal data, contact kundcenter@expressbild.se or 021-418900. If you believe that Express-Bild is processing personal data about you in violation of the data protection regulation, you have the right to submit a complaint to the Data Protection Authority.</p>

                    <button className="button cancel fixed-width mt-3" onClick={() => setShowTermsAndConditionBox(!showTermsAndConditionBox)}>Ok</button>

                </div>
            )}

            <Sidemenu_teamleader />
            <CalendarConfirm showCalendarConfirmModal={showCalendarConfirmModal} handleClose={handleClose} confirmCalendar={confirmCalendar} />

        </div>
    );
}
export default Calendarsale_teamleader;