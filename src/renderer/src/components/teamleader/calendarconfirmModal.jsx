import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// Import language texts for each supported language
import se from '../../assets/language/se.json'; // Swedish
import dk from '../../assets/language/dk.json'; // Daninsh
import fi from '../../assets/language/fi.json'; // Finnihs
import no from '../../assets/language/no.json'; // Norweigan
import de from '../../assets/language/de.json'; // German

const CalendarConfirmModal = ({ showCalendarConfirmModal, handleClose, confirmCalendar, teamData }) => {

    //define states
    const [languageTexts, setLanguageTexts] = useState({});


    useEffect(() => {
        // Determine the language from sessionStorage
        const user_lang = localStorage.getItem('user_lang');
        console.log(user_lang);
        let selectedLang;
        // Set language texts based on the selected language
        switch (user_lang) {
            case 'SE':
                selectedLang = se;
                break;
            case 'DK':
                selectedLang = dk;
                break;
            case 'FI':
                selectedLang = fi;
                break;
            case 'NO':
                selectedLang = no;
                break;
            case 'DE':
                selectedLang = de;
                break;
        }
        setLanguageTexts(selectedLang);
    }, []);
    
    const confirm = () => {
        console.log("Finish");
        handleClose();
        confirmCalendar();
    }

    console.log(teamData);

    return (
        <Modal className="mt-5" show={showCalendarConfirmModal} onHide={handleClose}>
            <Modal.Body className="mt-3 mb-4">
                <Modal.Title><h5><b>Done!</b></h5></Modal.Title>
                {/* <h6 className="mb-4">Thank you for your time.</h6> */}

                <div className="mt-4" style={{ textAlign: "left", width: "20em", margin: "0 auto" }}>
                    {teamData.calendar === "1" ? (
                        <>
                            <hr></hr>
                            <h6 ><b>{languageTexts?.confirm_teamname} </b> {teamData.teamname} </h6>
                            <h6><b>{languageTexts?.confirm_name} </b> {teamData.firstname} {teamData.lastname}</h6>
                            <h6><b>{languageTexts?.confirm_email} </b> {teamData.email}</h6>
                            <h6><b>{languageTexts?.confirm_mobile} </b> {teamData.mobile}</h6>
                            <h6><b>{languageTexts?.confirm_ssn} </b> {teamData.ssn}</h6>
                            <h6><b>{languageTexts?.confirm_address} </b> {teamData.address} </h6>
                            <h6><b>{languageTexts?.confirm_postalcode}</b> {teamData.postalcode} </h6>
                            <h6><b>{languageTexts?.confirm_county} </b> {teamData.county}</h6>
                        </>
                    ) : (
                        <>
                            <hr></hr>
                            <h6 ><b>{languageTexts?.confirm_teamname} </b> {teamData.teamname} </h6>
                            <h6><b>{languageTexts?.confirm_name} </b> {teamData.firstname} {teamData.lastname}</h6>
                            <h6><b>{languageTexts?.confirm_email} </b> {teamData.email}</h6>
                            <h6><b>{languageTexts?.confirm_mobile} </b> {teamData.mobile}</h6>
                        </>
                    )}
                </div>

                <div className="mt-5">
                    <Button className="button cancel mr-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className="button standard" onClick={confirm}>
                        Ok, finish!
                    </Button>
                </div>

            </Modal.Body>
        </Modal >
    );
};

export default CalendarConfirmModal;
