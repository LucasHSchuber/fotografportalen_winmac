import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const CalendarConfirmModal = ({ showCalendarConfirmModal, handleClose, confirmCalendar, teamData }) => {

    //define states

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
                    <h6><b>Team name: </b> {teamData.teamname} </h6>
                    <h6><b>Name: </b> {teamData.firstname} {teamData.lastname}</h6>
                    <h6><b>Email: </b> {teamData.email}</h6>
                    <h6><b>Mobile: </b> {teamData.mobile}</h6>

                    {teamData.calendar === "1" ? (
                        <>
                            <hr></hr>
                            <h6><b>Social security number: </b> {teamData.ssn}</h6>
                            <h6><b>Address </b> {teamData.address} </h6>
                            <h6><b>Postalcode: </b> {teamData.postalcode} </h6>
                            <h6><b>County: </b> {teamData.county}</h6>
                        </>
                    ) : (
                        <></>
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
