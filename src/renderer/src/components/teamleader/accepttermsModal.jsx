import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';

import '../../assets/css/global.css';


const AcceptTermsModal = ({ showTermsAndConditionModal, message, handleConfirm }) => {

    
    return (
        <Modal className="mt-5" show={showTermsAndConditionModal} onHide={handleConfirm}>
            <Modal.Body className="mt-3 mb-3">
                <Modal.Title><h5 className="mb-2"><b>Ops!</b></h5></Modal.Title>
                        
                        <h6 className="mb-3">{message}</h6>

                        <Button className="button cancel fixed-width" type="submit" onClick={handleConfirm}>
                            Ok
                        </Button>

            </Modal.Body>
        </Modal>
    );
};

export default AcceptTermsModal;
