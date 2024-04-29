import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';


const FeedbackMessage = ({ feedbackMessage }) => {

    //define states


    return (
        <div className={`feedback-message ${feedbackMessage ? 'show-feedback-message' : ''}`}>
            <p>{feedbackMessage}</p>
        </div>
    );
};

export default FeedbackMessage;
