import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import { Modal, Button } from 'react-bootstrap'; 
import plus_black from "../../assets/images/plus_black.png";
import running from "../../assets/images/running.png";
import academic from "../../assets/images/academic.png";

import Select from 'react-select';

import NewProjectModal from "../../components/teamleader/newprojectModal";
import ChooseSportTypeModal from "../../components/teamleader/choosesporttypeModal";
import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import fetchProjectsByLang from '../../assets/js/fetchProjectsByLang';

import '../../assets/css/teamleader/main_teamleader.css';
// import { height } from "@fortawesome/free-regular-svg-icons/faAddressBook";


function Newproject_teamleader() {
    // Define states
    const [_projects, set_Projects] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [chosenProjectName, setChosenProjectName] = useState('');
    const [projectLang, setProjectLang] = useState('');
    const [type, setType] = useState('');
    const [sportType, setSportType] = useState('');
    const [projectDate, setProjectDate] = useState('');
    const [project_uuid, setProject_uuid] = useState('');

    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [showChooseSportTypeModal, setShowChooseSportTypeModal] = useState(false);
    // const [verifyProjectModal, setVerifyProjectModal] = useState(false);

    const [isSelectedType1, setIsSelectedType1] = useState(false);
    const [isSelectedType2, setIsSelectedType2] = useState(false);

    const [projectExistsMessage, setProjectExistsMessage] = useState(false);
    const [missingProjectname, setMissingProjectname] = useState(false);
    const [missingType, setMissingType] = useState(false);
    const [errorCreatingProject, setErrorCreatingProject] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [resolveModal, setResolveModal] = useState(null);

    const navigate = useNavigate();

    const handleClose = () => { setShowNewProjectModal(false) };
    const handleCloseChooseSportTypeModal = () => { setShowChooseSportTypeModal(false) };
    


    //fetch all projects from big(express-bild) database - if not working, fetch from  sqlite table 
    useEffect(() => {
        const fetchData = async () => {
            const user_lang = localStorage.getItem("user_lang");
            console.log(user_lang);

            const timeout = (ms) => new Promise((resolve, reject) => {
                const id = setTimeout(() => {
                    clearTimeout(id);
                    reject(new Error('Request timed out'));
                }, ms);
            });
            const token = localStorage.getItem("token");
            try {
                const projects = await Promise.race([fetchProjectsByLang(user_lang, token),
                    timeout(2000)
                ]);
                set_Projects(projects.result);
                console.log('Projects:', projects.result);
            } catch (error) {
                console.error('Error fetching projects by language from big database or timeout:', error);
                try {
                    const response = await window.api.get_Projects(user_lang);
                    console.log('Projects from SQLite:', response);
                    if (response.statusCode === 1) {
                        if (response.projects.length > 0) {
                            set_Projects(response.projects);
                            console.log('Projects fetched from SQLite successfully');
                        } else {
                            console.log('No projects found for the specified language.');
                        }
                    } else {
                        console.error('Error fetching projects:', response.errorMessage);
                    }
                } catch (innerError) {
                    console.error('Error fetching projects from SQLite:', innerError);
                }
            }
        };
        fetchData();
    }, []);


    // handle project typ SPORT or SCHOOL choosen by user
    const handleProjectType = (projectType) => {
        setType(projectType);
        if (projectType === "Sport") {
            setIsSelectedType1(true);
            setIsSelectedType2(false);
        } else {
            setIsSelectedType1(false);
            setIsSelectedType2(true);
        }
        console.log(projectType);
    };

    // Set choosen project when user chooses from select list
    const handleProjectChange = (selectedOption) => {
        if (selectedOption) {
            setChosenProjectName(selectedOption.label);
            setProjectName(selectedOption);
            setProjectLang(selectedOption.lang);
            console.log(selectedOption);
            console.log(selectedOption.label);
            console.log('Selected project language:', selectedOption.lang);
        } else {
            setChosenProjectName('');
            setProjectName('');
            console.log('No project selected');
        }
    };

    // handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!projectName && !type) {
            setMissingProjectname(true);
            setMissingType(true);
            return;
        } else if (!projectName) {
            setMissingProjectname(true);
            setMissingType("");
            return;
        } else if (!type) {
            setMissingType(true);
            setMissingProjectname(false);
            throw new Error('Project type is required.');
        } else {
            setMissingProjectname(false);
            setMissingType(false);
        }
        // Verify projectname and photo type based on country
        const verifyFlag = verifyProjectnameToType();
        if (verifyFlag) {
            const message = `Hang on! You are about to create a ${
                isSelectedType1 ? "school" : "sport"
            } photography job with a ${
                isSelectedType1 ? "sport" : "school"
            } type. Are you sure you want to continue?`;

            // Show modal and wait for the user's response
            const confirmed = await showVerifyModal(message);
            console.log('confirmed', confirmed);
            if (!confirmed) {
                console.log("Operation canceled by the user");
                return; // Exit the function if user cancels
            }
            // const confirm = window.confirm(`Hang on! You are about to create a ${isSelectedType1 ? "sport" : "school"} photography to a ${isSelectedType1 ? 'school' : 'sport'} job. Are you sure you want to continue?`);
            // if (!confirm) {
            //     console.log("Cancel");
            //     return;
            // }
        } 

        console.log('Selected project:', projectName ? projectName.label : null);
        // findUuid(projectName)
        const selectedProject = _projects.find(project => project.projectname === chosenProjectName);
        console.log(selectedProject);

        let _uuid = selectedProject.project_uuid;
        setProject_uuid(_uuid); //set uuid
        setProjectDate(selectedProject.start ? selectedProject.start : selectedProject.project_date); 

        console.log('Selected project:', projectName);
        console.log('Selected type:', type);
        console.log('Selected project uuid:', _uuid);

        if (type === "School"){
            setShowNewProjectModal(true);
        }else if (type === "Sport"){
            setShowChooseSportTypeModal(true);
        }
    };

    // METHOD - verify projectname and photo type based on country
    const verifyProjectnameToType = () => {
            if ((chosenProjectName.toLocaleLowerCase().includes("-idrott") || chosenProjectName.toLocaleLowerCase().includes("idrott-")) && type === "School") {
                console.log("OPS")
                return true;
            } else if ((chosenProjectName.toLocaleLowerCase().includes("-skol") || chosenProjectName.toLocaleLowerCase().includes("skol-") || chosenProjectName.toLocaleLowerCase().includes("-student") || chosenProjectName.toLocaleLowerCase().includes("-skole")  || chosenProjectName.toLocaleLowerCase().includes("skole-") || chosenProjectName.toLocaleLowerCase().includes("-school") || chosenProjectName.toLocaleLowerCase().includes("school-"))  && type === "Sport") {
                console.log("OPS")
                return true;
            }
    };

    // Show the modal and return a Promise
    const showVerifyModal = (message) => {
        return new Promise((resolve) => {
            setModalMessage(message);
            setIsModalVisible(true);
            setResolveModal(() => resolve);
        });
    };

      // Handle modal "Yes" click
    const handleModalConfirm = () => {
        setIsModalVisible(false);
        if (resolveModal) {
            resolveModal(true);
        }
    };

    // Handle modal "No" click
    const handleModalCancel = () => {
        setIsModalVisible(false);
        if (resolveModal) {
            resolveModal(false); 
        }
    };


    // Confirm from ChooseSportTypeModal
    const confirmChooseSportType = (sport_type) => {
        console.log("sport type:", sport_type);
        setSportType(sport_type);
        CreateNewProject(sport_type);
    }


    // Method - to create new project
    const CreateNewProject = async (sport_type) => {
        console.log("creating a new project....");
        console.log("project_uuid:", project_uuid);
        let user_id = localStorage.getItem("user_id");
      
        try {
          if (!chosenProjectName || !type || !project_uuid) {
            throw new Error('Project name, type, and project_uuid are required.');
          }
      
          const response = await window.api.checkProjectExists(project_uuid, user_id);
          console.log('Project already exists - response:', response);
      
          if (response && response.statusCode === 1) {
            console.log('Project exists:', response.projectname);
            setProjectExistsMessage("The chosen project has already been created");
            return true; // Project exists
          } else {
            console.log('Project does not exist.');
      
            console.log('sport_type:', sport_type);
            console.log('TYPE:', type);
            console.log('SPORT TYPE:', sportType);
      
            let user_id = localStorage.getItem("user_id");
            let photographername = localStorage.getItem("user_name");
            console.log(user_id);
            console.log(photographername);
            const args = {
              projectname: chosenProjectName,
              type: sport_type ? sport_type : type,
              project_uuid: project_uuid,
              photographername: photographername,
              project_date: projectDate,
              user_id: user_id,
              lang: projectLang,
            };
            console.log(args);
      
            const createResponse = await window.api.createNewProject(args);
            console.log('Create New Project Response:', createResponse);
      
            if (createResponse.success) {
              console.log('Project created successfully');
      
              if (!createResponse.project_id) {
                console.error('Error: Project ID is not set.');
                setErrorCreatingProject(true);
                return;
              }
      
              localStorage.setItem("project_id", createResponse.project_id);
              console.log("localstorage setitem project_id:", localStorage.getItem("project_id"));
      
              // Check if project ID is set in local storage
              if (!localStorage.getItem("project_id")) {
                console.error('Error: Project ID is not set in local storage.');
                setErrorCreatingProject(true);
                return;
              }
      
              navigate(`/portal_teamleader/${createResponse.project_id}`);
            } else {
              console.error('Error creating project:', createResponse?.error || 'Unknown error');
            }
          }
        } catch (error) {
          console.error('Error checking project existence:', error);
          return false;
        }
    };
    


    // Custom styles for the Select component
    const customStyles = {
        control: (styles, { isFocused }) => ({
            ...styles,
            width: '43em',
            height: '2.5em', 
            minHeight: '2.5em',
            padding: '0', 
            display: 'flex',
            alignItems: 'center', 
            fontSize: '0.9em',
            borderColor: isFocused ? "#00b3ff" : "#ccc", // Change border color on focus, default to light gray
            boxShadow: isFocused ? "0 0 0 0.2rem rgba(0, 179, 255, 0.1)" : "none",
            "&:hover": {
                borderColor: isFocused ? "#00b3ff" : "#ccc", // Ensure hover maintains border color when focused
            },
        }),
        menu: base => ({
            ...base,
            width: '36em',
            fontSize: '0.85em',
        }),
        noOptionsMessage: base => ({
            ...base,
            width: '30em',
        }),
        valueContainer: base => ({
            ...base,
            padding: '0 8px',
            height: '100%', 
            display: 'flex',
            alignItems: 'center', 
        }),
        placeholder: base => ({
            ...base,
            margin: '0', 
            padding: '0',
            lineHeight: '2.5em',
        }),
        input: base => ({
            ...base,
            margin: '0',
            padding: '0',
            lineHeight: '2.5em', 
        }),
    };

    return (
        <div className="teamleader-wrapper">
            <div className="newproject-teamleader-content">

                <div className="mb-5 header">
                    <h4><img className="title-img" src={plus_black} alt="more" /> New Job</h4>
                    <p>Start a new school or sport photography by choosing your photography activity in the list below.</p>
                </div>

                {projectExistsMessage || missingProjectname || missingType ? (
                    <ul className="error" style={{ marginLeft: "-1.5em" }}>
                        {projectExistsMessage && <li>Project already exists</li>}
                        {missingProjectname && <li>Select a project from the list</li>}
                        {missingType && <li>Select either sport or school photography</li>}
                    </ul>
                ) : null}
                {errorCreatingProject ? (
                    <ul style={{ marginLeft: "-1.5em" }}>
                        {errorCreatingProject && <li><span className="success" >Project successfully created!</span> Enter your new project from <em>current work</em> in the left menu</li>}
                    </ul>
                ) : null}


                <form className="newproject-form" onSubmit={handleSubmit}>
                    <label style={{ fontSize: "0.9em" }}><b>Project name:</b></label>
                    <Select
                        value={projectName}
                        onChange={handleProjectChange}
                        options={_projects && _projects.map(project => ({ value: project.project_uuid, label: project.projectname, lang: project.lang, project_date: project.project_date }))}
                        isClearable
                        placeholder="Search for activity..."
                        styles={customStyles}
                    />
                    <div className="my-4">
                        <label style={{ fontSize: "0.9em" }}><b>Photography Type:</b></label>
                        <div>
                            <button className={`work-type-button ${isSelectedType1 ? 'selected-type' : ''}`}
                                type="button" onClick={() => handleProjectType("Sport")}>
                                <img className="type-img" src={running} alt="running"></img>
                                <p className="mt-1">
                                    Sport Photography
                                </p>
                            </button>
                            <button className={`work-type-button ${isSelectedType2 ? 'selected-type' : ''}`}
                                type="button" onClick={() => handleProjectType("School")}>
                                <img className="type-img" src={academic} alt="academic"></img>
                                <p className="mt-1">
                                    School Photography
                                </p>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="button standard">Start new job</button>
                </form>

            </div>

            {isModalVisible && (
                <div  className="verifyprojectmodal">
                    <div className="verifyprojectmodal-content">
                        <p className="mb-4">{modalMessage}</p>
                        <button className="mr-1 button cancel" onClick={handleModalCancel}>Cancel</button>
                        <button className="ml-1 button standard" style={{ border: "1px solid red" }} onClick={handleModalConfirm}>Yes</button>
                    </div>
                </div>
            )}

            <Sidemenu_teamleader />
            <NewProjectModal projectName={chosenProjectName} projectType={type} showNewProjectModal={showNewProjectModal} handleClose={handleClose} CreateNewProject={CreateNewProject} />
            <ChooseSportTypeModal projectName={chosenProjectName} projectType={type} showChooseSportTypeModal={showChooseSportTypeModal} handleCloseChooseSportTypeModal={handleCloseChooseSportTypeModal} confirmChooseSportType={confirmChooseSportType} />
        </div>
    );
}

export default Newproject_teamleader;