import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faUser, faMinus, faPeopleGroup, faUserShield } from "@fortawesome/free-solid-svg-icons";

import Sidemenu from "../components/sidemenu";
import Sidemenu_small from "../components/sidemenu_small";
import FeedbackMessage from "../components/feedbackMessage";

//images import
import team_faq from "../assets/images/teams_faq.png";
import roger_that from "../assets/images/roger_that.png";
import connectuser from "../assets/images/connectuser.png";
import controlsheet_button from "../assets/images/controlsheet-button.png";
import sporttype from "../assets/images/sporttype.png";

function Faq() {
//define states
// const [feedbackMessage, setFeedbackMessage] = useState("");
const [selectedQuestion, setSelectedQuestion] = useState(null);
const [searchString, setSearchString] = useState("");

// FAQ data
const faqData = {
teamleader: {
    categoryName: "Teamleader",
    questions: [
    { id: 1, image: "", question: "Can I recover a job I have deleted?", answer: "Unfortunately, once a job is deleted, it cannot be recovered. We recommend double-checking before deleting any jobs to avoid accidental loss of important work." },
    { id: 2, image: "", question: "Can I edit a team after I have submitted the job?", answer: "Unfortunately, once a job is submitted, it cannot be edited or modified. Please contact the support if a job is submitted but has information that needs to be edited." },
    { id: 3, image: "", question: "When submitting a job, when should I check the 'Report anomalies to sales department' checkbox?", answer: "The 'Report anomalies to sales department' should be checked when submitting a job only if the information in the anomaly report might be valueable information for the sales department. This helps ensure that any issues related to the job could be promptly addressed untill next time." },
    { id: 4, image: controlsheet_button, question: "Can I view Control Sheet after a job is submitted?", answer: "Yes, once a job is submitted you can view all Control Sheets under the 'Previous job' section by pressing the hihglighted 'Sheet' icon to the right in the image below." },
    { id: 5, image: team_faq, question: "What does the different icons in the teams/classes box means?", answer: (
      <div>
        The different icons and text has different meaning:
        <ul>
          <li><b className="mr-2">P17</b>This is the class/team name you have set for the class/team</li>
          <li><FontAwesomeIcon icon={faUser} className="mr-2" /> This icon is indicating that you have photographed portraits in this class/team</li>
          <li><FontAwesomeIcon icon={faUserShield} className="mr-2" /> This icon is indicating that you have photographed at least one student/team memeber with protoected id in this class/team</li>
          <li><FontAwesomeIcon icon={faPeopleGroup} className="mr-2" /> This icon is indicating that you have photographed group pictures in this class/team</li>
          <li><b className="mr-2">28st</b>This is the amount of students/team members you have set for the class/team</li>
        </ul>
      </div>
      ) 
    },
    { id: 6, image: sporttype, question: "What's the difference between 'Portrait' and 'Portrait + Group'?", answer: "The difference between 'Portrait' and 'Portrait + Group' is that 'Portrait + Group' include calendar sale. If you know that your job you're about to start includes group photogrprahy, you would want to choose 'Portrait + Group' to make sure to include calendar sale." },
    ],
},
filetransfer: {
    categoryName: "Filetransfer",
    questions: [
    { id: 7, image: "", question: "How to upload large files?", answer: "To upload files in Filetransfer, select a job from the list, choose a file to upload, and click the Upload button." },
    { id: 8, image: "", question: "What should I do if the Filetransfer upload fails?", answer: (
        <div>
          If you’re having trouble uploading files in Filetransfer, try the following steps:
          <ol>
            <li>Check your internet connection and ensure it's stable.</li>
            <li>Ensure the file you are trying to upload is a .zip, .rar or .pdf file.</li>
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
    { id: 9, image: "", question: "Can I reset my password?", answer: "No, resetting your password is not possible right now. Please contact the IT team if you have forgotten your password or are unable to log in" },
    { id: 10, image: "", question: "Can I use the Photographer Portal on multiple devices?", answer: "Yes, you can access the Photographer Portal from multiple devices. Simply connect your account in Photographer Portal from another device and switch user by logging in with your registered account details." },
    { id: 11, image: connectuser, question: "How do I connect a new photographer to the Photographer Portal?", answer: (
        <div>
          You can connect a new photographer by going to the Profile page (profile icon) in the right menu:
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
    { id: 12, image: "", question: "How do I update the Photographer Portal software?", answer: "When a new version of the Photographer Portal is available, you will see a Download button on the Home page. Click the button and follow the instructions to download and install the latest version." },
    { id: 13, image: "", question: "Why is the blender icon in the left menu spinning?", answer: "Then blender icon spinning indicates that you have a stable internet connection. If the blender does not spin, it means you are running the software in an offline mode, and certain function as submitting a job or uploading files in Filetransfer will not work." },
    { id: 14, image: roger_that, question: "What does the 'Roger That' button under the News & Updates section do?", answer: "Clicking the 'Roger That' button lets Express-Bild know that you've read and understood the news article. This helps the admin track which photographers have acknowledged the news."},      
  ],
},
};

const handleQuestionClick = (question) => {
setSelectedQuestion(question);
};


const handleSearch = (search) => {
  console.log('search', search);
  setSearchString(search);
};

const filteredFaqData = Object.keys(faqData)
.map((categoryKey) => {
  const category = faqData[categoryKey];
  const filteredQuestions = category.questions.filter((question) =>
    question.question.toLowerCase().includes(searchString.toLowerCase())
  );

  return filteredQuestions.length > 0
    ? { ...category, questions: filteredQuestions }
    : null;
})
.filter((category) => category !== null);

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
              <input className="mb-3 faq-searchbox" placeholder="Search.." onChange={(e) => handleSearch(e.target.value)}>
              </input>
                
            {filteredFaqData.map((category) => (
              <div key={category.categoryName} className="category">
                <h6 style={{ fontSize: "0.85em", fontWeight: "600" }}>
                  {category.categoryName}
                </h6>
                <ul>
                  {category.questions.map((question) => (
                    <li
                      key={question.id}
                      onClick={() => handleQuestionClick(question)}
                    >
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
                    {selectedQuestion.image !== "" ? (
                      <img className="mt-4 ml-3" src={selectedQuestion.image} alt={`faq-image-${selectedQuestion.id}+${selectedQuestion.image}`}></img>
                     ): null }
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
