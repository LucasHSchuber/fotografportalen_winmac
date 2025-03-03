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
    const [selectedQuestion, setSelectedQuestion] = useState({});
    const [searchString, setSearchString] = useState("");

    // FAQ data
    const faqData = {
      Workspace: {
          categoryName: "Workspace",
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
          { id: 6, image: "", question: "What's the difference between 'Portrait', 'Group' and 'Portrait + Group'?", answer: "The difference between 'Portrait', 'Group' and 'Portrait + Group' is that 'Group' and 'Portrait + Group' include calendar sale. If you know that your job you're about to start includes group photography, you would want to choose either 'Group' or 'Portrait + Group', to make sure to include calendar sale. If you know in advance that you are only going to take group images then choose 'Group', if both portrait and group then choose 'Portrait + Group'" },
          ],
      },
      filetransfer: {
          categoryName: "Filetransfer",
          questions: [
          { id: 1, image: "", question: "What is the purpose of Filetransfer?", answer: "The purpose of Filetransfer is a smooth and simple way for you to upload you images after your job is done. The application keeps track of which jobs have uploaded files and which jobs that are still missing files, and it shows which files that are uploaded to which jobs, which might help you keep track of your uploaded images." },
          { id: 2, image: "", question: "How to upload large files?", answer: "To upload files in Filetransfer, select a job from the list, choose a file to upload, and click the Upload button." },
          { id: 3, image: "", question: "What should I do if the Filetransfer upload fails?", answer: (
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
      backuptransfer: {
        categoryName: "Backuptransfer",
        questions: [
        { id: 1, image: "", question: "What is the purpose of Backuptransfer?", answer: "The purpose for Backuptransfer is to backup your image files" },
        { id: 2, image: "", question: "How to upload large files?", answer: "To upload files in Backuptransfer, select a project from the list, choose a file to upload, and click the Upload button." },
        { id: 3, image: "", question: "What should I do if the Filetransfer upload fails?", answer: (
            <div>
              If you’re having trouble uploading files in Backuptransfer, try the following steps:
              <ol>
                <li>Check your internet connection and ensure it's stable.</li>
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
        { id: 1, image: "", question: "Can I reset my password?", answer: "No, resetting your password is not possible right now. Please contact the IT team if you have forgotten your password or are unable to log in" },
        { id: 2, image: "", question: "Can I use the Photographer Portal on multiple devices?", answer: "Yes, you can access the Photographer Portal from multiple devices. Simply connect your account in Photographer Portal from another device and switch user by logging in with your registered account details." },
        { id: 3, image: connectuser, question: "How do I connect a new photographer to the Photographer Portal?", answer: (
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
        { id: 4, image: "", question: "How do I update the Photographer Portal software?", answer: "Photographer Portal includes an auto updater, which means that when a new version of Photographer Portal is released, the application will automatically install the latest version the next time you launch it. If a new version is released meanwhile you are using the application, you will see a Restart button on the Home page. Simply click the button if you want to restart and install the latest version of the application" },
        { id: 5, image: "", question: "Why is the blender icon in the left menu spinning?", answer: "Then blender icon spinning indicates that you have a stable internet connection. If the blender does not spin, it means you are running the software in an offline mode, and certain function as submitting a job or uploading files in Filetransfer will not work." },
        { id: 6, image: roger_that, question: "What does the 'Roger That' button under the News & Updates section do?", answer: "Clicking the 'Roger That' button lets Express-Bild know that you've read and understood the news article. This helps the admin track which photographers have acknowledged the news."},      
        { id: 7, image: "", question: "Can I use Photographer Portal without internet connection?", answer: "Yes, you can use the application without internet connection. Altohugh, some functionalities like submitting a job in Workspace will not be working in offline mode."},      
      ],
    },
    };

    const handleQuestionClick = (question, category) => {
      console.log('question', question);
      console.log('category', category);
      setSelectedQuestion({questionArray: question, categoryName: category});
      // Scroll to top when selectin a question
      window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      });
    };
    useEffect(() => {
      console.log('selectedQuestion', selectedQuestion);
    }, [selectedQuestion]);


    const handleSearch = (search) => {
      console.log('search', search);
      setSearchString(search);
    };

    const filteredFaqData = Object.keys(faqData).map((categoryKey) => {
        const category = faqData[categoryKey];
        const filteredQuestions = category.questions.filter((question) =>
          question.question.toLowerCase().includes(searchString.toLowerCase())
        );

        return filteredQuestions.length > 0
          ? { ...category, questions: filteredQuestions }
          : null;
     }).filter((category) => category !== null);
     useEffect(() => {
       console.log('filteredFaqData', filteredFaqData);
     }, [filteredFaqData]);





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
                <div>
                  <input className="mb-3 faq-searchbox" placeholder="Search for a question.." onChange={(e) => handleSearch(e.target.value)}></input>
                </div>    
                {/* <div className="questions-box"> */}
                  {filteredFaqData.length > 0 ?
                    filteredFaqData.map((category) => (
                    <div key={category.categoryName + category.id} className="category">
                      <h6 style={{ fontSize: "0.85em", fontWeight: "600" }}>
                        {category.categoryName}
                      </h6>
                      <ul>
                        {category.questions.map((question) => (
                          <li
                            key={question.id}
                            style={{
                              color:
                                selectedQuestion?.questionArray?.id === question.id && selectedQuestion?.categoryName === category.categoryName
                                  ? "blue"
                                  : "inherit",
                            }}
                            onClick={() => handleQuestionClick(question, category.categoryName)}
                          >
                            {question.id}. {question.question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )) : (
                    <h6 style={{ fontSize: "0.8em" }}><em>No search results</em></h6>
                  )}
                {/* </div> */}
              </div>

              {/* Right side area with answers */}
              <div className="mt-4 faq-box-right">
                  {selectedQuestion.questionArray ? (
                  <>
                      <h5>{selectedQuestion?.questionArray?.question}</h5>
                      <h6>{selectedQuestion?.questionArray?.answer}</h6>
                      {selectedQuestion?.questionArray?.image !== "" ? (
                        <img className="mt-4 ml-3" src={selectedQuestion?.questionArray?.image} alt={`faq-image-${selectedQuestion?.questionArray?.id}+${selectedQuestion?.questionArray?.image}`}></img>
                      ): null }
                  </>
                  ) : (
                  <p><em>Please select a question to view the answer.</em></p>
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
