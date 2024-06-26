import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import plus_black from "../../assets/images/plus_black.png";
import running from "../../assets/images/running.png";
import academic from "../../assets/images/academic.png";

import Select from 'react-select';

import NewProjectModal from "../../components/teamleader/newprojectModal";
import ChooseSportTypeModal from "../../components/teamleader/choosesporttypeModal";
import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import fetchProjectsByLang from '../../assets/js/fetchProjectsByLang';

import '../../assets/css/teamleader/main_teamleader.css';


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

    const [isSelectedType1, setIsSelectedType1] = useState(false);
    const [isSelectedType2, setIsSelectedType2] = useState(false);

    const [projectExistsMessage, setProjectExistsMessage] = useState(false);
    const [missingProjectname, setMissingProjectname] = useState(false);
    const [missingType, setMissingType] = useState(false);
    const [errorCreatingProject, setErrorCreatingProject] = useState(false);

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

            try {
                const projects = await Promise.race([
                    fetchProjectsByLang(user_lang),
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

    
    const handleProjectChange = (selectedOption) => {
        // setChosenProjectName(selectedOption.label);
        // setProjectName(selectedOption);
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

    const handleSubmit = (e) => {
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

        console.log('Selected project:', projectName ? projectName.label : null);
        // findUuid(projectName)
        const selectedProject = _projects.find(project => project.projectname === chosenProjectName);
        console.log(selectedProject);

        let _uuid = selectedProject.project_uuid;
        setProject_uuid(_uuid); //set uuid
        setProjectDate(selectedProject.start ? selectedProject.start : selectedProject.project_date); //set project date

        console.log('Selected project:', projectName);
        console.log('Selected type:', type);
        console.log('Selected project uuid:', _uuid);

        if (type === "School"){
            setShowNewProjectModal(true);
        }else if (type === "Sport"){
            setShowChooseSportTypeModal(true);
        }
    };

    const confirmChooseSportType = (sport_type) => {
        console.log("sport type:", sport_type);
        setSportType(sport_type);
        CreateNewProject(sport_type);
    }


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
            //   const latestProjectResponse = await window.api.getLatestProject(user_id, project_uuid);
            //   console.log('Check Latest Project Response:', latestProjectResponse);
      
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
    // const CreateNewProject = async (sport_type) => {
    //     console.log("creating a new project....");
    //     console.log("project_uuid:", project_uuid);
    //     let user_id = localStorage.getItem("user_id");

    //     try {
    //         if (!chosenProjectName || !type || !project_uuid) {
    //             throw new Error('Project name, type, and project_uuid are required.');
    //         }

    //         const response = await window.api.checkProjectExists(project_uuid, user_id);
    //         console.log('Project already exists - response:', response);


    //         if (response && response.statusCode === 1) {
    //             console.log('Project exists:', response.projectname);
    //             setProjectExistsMessage("The choosen project has already been created");
    //             return true; // Project exists
    //         } else {
    //             console.log('Project does not exist.');

    //             console.log('sport_type:', sport_type);
    //             console.log('TYPE:', type);
    //             console.log('SPORT TYPE:', sportType);
                
    //             let user_id = localStorage.getItem("user_id");
    //             let photographername = localStorage.getItem("user_name");
    //             console.log(user_id);
    //             console.log(photographername);
    //             const args = {
    //                 projectname: chosenProjectName,
    //                 type: sport_type ? sport_type : type,
    //                 project_uuid: project_uuid,
    //                 photographername: photographername,
    //                 project_date: projectDate,
    //                 user_id: user_id,
    //                 lang: projectLang
    //             };
    //             console.log(args);
    //             const response = await window.api.createNewProject(args);
    //             console.log('Create New Projects Response:', response);

    //             if (response.success) {
    //                 console.log('Project created successfully');
    //                 //get latest tuppel in projects-table
    //                 const latestProjectResponse = await window.api.getLatestProject(user_id, project_uuid);
    //                 console.log('Check Latest Project Response:', latestProjectResponse);

    //                 if (!latestProjectResponse.project_id) {
    //                     console.error('Error: Project ID is not set.');
    //                     setErrorCreatingProject(true);
    //                     return;
    //                 }

    //                 localStorage.setItem("project_id", latestProjectResponse.project_id)
    //                 console.log(localStorage.getItem("project_id"));

    //                 // Check if project ID is set in local storage
    //                 if (!localStorage.getItem("project_id")) {
    //                     console.error('Error: Project ID is not set in local storage.');
    //                     setErrorCreatingProject(true);
    //                     return;
    //                 }

    //                 navigate(`/portal_teamleader/${latestProjectResponse.project_id}`);

    //             } else {
    //                 console.error('Error creating project:', response?.error || 'Unknown error');
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error checking project existence:', error);
    //         return false;
    //     }
    // }


    // Custom styles for the Select component
    const customStyles = {
        control: styles => ({
            ...styles,
            width: '30em'
        }),
        menu: base => ({
            ...base,
            width: '30em' // Set the width of the dropdown menu
        }),
        noOptionsMessage: base => ({
            ...base,
            width: '30em', // Set the width of the no options message
            textAlign: 'center' // Optionally, center the message
        })
    };


    return (
        <div className="teamleader-wrapper">
            <div className="newproject-teamleader-content">

                <div className="header">
                    <h4><img className="title-img" src={plus_black} alt="more" /> New project</h4>
                    <p>Create a new school or sport photography</p>
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
                    <Select
                        value={projectName}
                        onChange={handleProjectChange}
                        options={_projects && _projects.map(project => ({ value: project.project_uuid, label: project.projectname, lang: project.lang, project_date: project.project_date }))}
                        isClearable
                        placeholder="Search projects..."
                        styles={customStyles}
                    />
                    <div className="my-2">
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

                    <button type="submit" className="button standard">Create new project</button>
                </form>

            </div>

            <Sidemenu_teamleader />
            <NewProjectModal projectName={chosenProjectName} projectType={type} showNewProjectModal={showNewProjectModal} handleClose={handleClose} CreateNewProject={CreateNewProject} />
            <ChooseSportTypeModal projectName={chosenProjectName} projectType={type} showChooseSportTypeModal={showChooseSportTypeModal} handleCloseChooseSportTypeModal={handleCloseChooseSportTypeModal} confirmChooseSportType={confirmChooseSportType} />
        </div>
    );
}

export default Newproject_teamleader;