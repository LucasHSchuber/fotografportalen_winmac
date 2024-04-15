import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

// import "../../assets/css/teamleader/newprojectModal.css";


const CalendarConfirmModal = ({ showCalendarConfirmModal, handleClose, confirmCalendar }) => {

    //define states
    const navigate = useNavigate();

    const confirm = () => {
        console.log("Finish");
        handleClose();
        confirmCalendar();
    }

    return (
        <Modal className="mt-5" show={showCalendarConfirmModal} onHide={handleClose}>
            <Modal.Body className="mt-3 mb-4">
                <Modal.Title><h5><b>Done!</b></h5></Modal.Title>
                <h6 className="mb-3">Thank you for your time.</h6>

                <div className="mt-4">
                    <Button className="button cancel mr-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className="button standard" onClick={confirm}>
                        Finish!
                    </Button>
                </div>

            </Modal.Body>
        </Modal>
    );
};

export default CalendarConfirmModal;
