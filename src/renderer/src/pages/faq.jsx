import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

import Sidemenu from "../components/sidemenu";
import Sidemenu_small from "../components/sidemenu_small";
import FeedbackMessage from "../components/feedbackMessage";

function Faq() {
//define states
// const [feedbackMessage, setFeedbackMessage] = useState("");
const [selectedQuestion, setSelectedQuestion] = useState(null);

// FAQ data
const faqData = {
teamleader: {
    categoryName: "Teamleader",
    questions: [
    { id: 1, question: "Can I recover a project I have deleted?", answer: "Unfortunately, once a project is deleted, it cannot be recovered. We recommend double-checking before deleting any projects to avoid accidental loss of important work." },
    { id: 2, question: "Can I edit a team after I have submitted the project?", answer: "Unfortunately, once a project is submitted, it cannot be edited or modified. Please contact the support if a project is submitted but has information that needs to be edited." },
    { id: 3, question: "When submitting a project, when should I check the 'Report anomalies to sales department' checkbox?", answer: "The 'Report anomalies to sales department' should be checked when submitting a project only if the information in the anomaly report might be valueable information for the sales department. This helps ensure that any issues related to the project could be promptly addressed untill next time." },
  ],
},
filetransfer: {
    categoryName: "Filetransfer",
    questions: [
    { id: 1, question: "How to upload large files?", answer: "To upload files in Filetransfer, select a project from the list, choose a file to upload, and click the Upload button." },
    { id: 2, question: "What should I do if the Filetransfer upload fails?", answer: (
        <div>
          If you’re having trouble uploading files in Filetransfer, try the following steps:
          <ol>
            <li>Check your internet connection and ensure it's stable.</li>
            <li>Ensure the file you are trying to upload is a .zip file.</li>
            <li>If the issue persists, try closing and reopening the software, or restarting your computer.</li>
          </ol>
        </div>
      ) 
    },
    ],
},
general: {
    categoryName: "General",
    questions: [
    { id: 1, question: "Can I reset my password?", answer: "No, resetting your password is not possible right now. Please contact the IT team if you have forgotten your password or are unable to log in" },
    { id: 2, question: "Can I use the Photographer Portal on multiple devices?", answer: "Yes, you can access the Photographer Portal from multiple devices. Simply activate your account and log in with your registered account details on each device." },
    { id: 3, question: "How do I connect a new photographer to the Photographer Portal?", answer: (
        <div>
          You can connect a new photographer by going to the Profile page:
          <ol>
            <li>Make sure your internet connection is stable..</li>
            <li>Click on the “Connect New Photographer” button.</li>
            <li>Enter your details and press “Connect”..</li>
            <li>A new profile icon should now have appeared. Click at the new profile icon. </li>
            <li>Log in: Log in the new photographer by entering his/hers Email and Password and press “Switch”. </li>
          </ol>
        </div>
      ) 
    },
    { id: 4, question: "How do I update the Photographer Portal software?", answer: "When a new version of the Photographer Portal is available, you will see a Download button on the Home page. Click the button and follow the instructions to download and install the latest version." },
    ],
},
};

const handleQuestionClick = (question) => {
setSelectedQuestion(question);
};

// // Function to update feedback message
// const updateFeedbackMessage = (message) => {
//     setFeedbackMessage(message);
//     setTimeout(() => {
//         setFeedbackMessage("");
//     }, 3000);
// };

  return (
    <div className="faq-wrapper">
      <div className="faq-content">
        <div className="header">
          <h5>
            <FontAwesomeIcon icon={faCircleQuestion} className="icons mr-2" /> FAQ & Support
          </h5>
          <p>If you stumple upon any problems during the use of the application, this page might be helpful</p>
        </div>

        <div className="faq-container d-flex mt-5">
            {/* Left-side menu with categories and questions */}
            <div className="faq-box-left">
                {Object.values(faqData).map((category) => (
                <div key={category.categoryName} className="category">
                    <h6 style={{ fontSize: "0.85em", fontWeight: "600" }}>{category.categoryName}</h6>
                    <ul>
                    {category.questions.map((question) => (
                        <li key={question.id} onClick={() => handleQuestionClick(question)}>
                        {question.id}. {question.question}
                        </li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>

            {/* Right side area with answers */}
            <div className="faq-box-right">
                {selectedQuestion ? (
                <>
                    <h5>{selectedQuestion.question}</h5>
                    <h6>{selectedQuestion.answer}</h6>
                </>
                ) : (
                <p>Please select a question to view the answer.</p>
                )}
            </div>
        </div>

      </div>
      <Sidemenu />
      <Sidemenu_small />
      {/* <FeedbackMessage feedbackMessage={feedbackMessage} /> */}
    </div>
  );
}

export default Faq;
