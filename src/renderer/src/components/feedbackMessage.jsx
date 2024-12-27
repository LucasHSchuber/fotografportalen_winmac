import React, { useEffect, useState } from "react";


const FeedbackMessage = ({ feedbackMessage }) => {

    return (
        <div className={`feedback-message ${feedbackMessage ? 'show-feedback-message' : ''}`}>
            <p>{feedbackMessage}</p>
        </div>
    );
};

export default FeedbackMessage;
