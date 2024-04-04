import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import more_black from "../../assets/images/more_black.png";
import running from "../../assets/images/running.png";
import academic from "../../assets/images/academic.png";

import NewProjectModal from "../../components/teamleader/newprojectModal";
import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";


import fetchProjectsByLang from '../../assets/js/fetchProjectsByLang';

import '../../assets/css/teamleader/main_teamleader.css';


function Newproject_teamleader() {
    // Define states
    const [projectName, setProjectName] = useState('');
    const [type, setType] = useState('');
    const [isSelectedType1, setIsSelectedType1] = useState(false);
    const [isSelectedType2, setIsSelectedType2] = useState(false);

    const [_projects, set_Projects] = useState([]);


    const Navigate = useNavigate();



    //fetch all projects from big(express-bild) database - if not working, fetch from  sqlite table 
    useEffect(() => {
        const fetchData = async () => {
            const user_lang = localStorage.getItem("user_lang");
            console.log(user_lang);

            try {

                const projects = await fetchProjectsByLang(user_lang); // Call the fetchProjects function
                console.log('Projects:', projects);
                set_Projects(projects.result);



            } catch (error) {
                console.error('Error fetching projects by language from big database:', error);

                //fetch from sqlite database
                const response = await window.api.get_Projects(user_lang);
                console.log('Create Projects Response:', response);

                if (response.statusCode === 1) {
                    if (response.projects.length > 0) {
                        set_Projects(response.projects);
                        console.log('Projects fetched successfully');
                    } else {
                        console.log('No projects found for the specified language.');
                        // Handle no projects found scenario (e.g., display a message to the user)
                    }
                } else {
                    console.error('Error fetching projects:', response.errorMessage);
                    // Handle API error (e.g., display an error message to the user)
                }

            }
        };

        fetchData();
    }, []);





    const handleProjectChange = (e) => {
        setProjectName(e.target.value);
        console.log(projectName);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Selected project:', projectName);
        console.log('Selected type:', type);
    };

    const handleProjectType = (projectType) => {
        setType(projectType);
        if (projectType === 1) {
            setIsSelectedType1(true);
            setIsSelectedType2(false);
        } else {
            setIsSelectedType1(false);
            setIsSelectedType2(true);
        }
        console.log(projectType);

    };


    return (
        <div className="teamleader-wrapper">
            <div className="newproject-teamleader-content">

                <div className="header">
                    <h4><img className="title-img" src={more_black} alt="more" /> New project</h4>
                    <p>Create a new school or sport photography</p>
                </div>


                <form className="newproject-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        list="projects"
                        value={projectName}
                        onChange={handleProjectChange}
                        placeholder="Search projects..."
                        style={{ maxWidth: '100%', overflowX: 'auto' }}
                    />
                    <datalist
                        id="projects"
                        style={{ maxHeight: '200px', overflowY: 'auto', position: 'absolute', zIndex: '1000' }} // Set a maximum height and enable vertical scrolling
                    >
                        {_projects.map(project => (
                            <option key={project.project_id} value={project.projectname} /> // Add a key prop to each option for React's rendering
                        ))}
                    </datalist>
                    <div className="my-2">
                        <button className={`work-type-button ${isSelectedType1 ? 'selected-type' : ''}`}
                            type="button" onClick={() => handleProjectType(1)}>
                            <img className="type-img" src={running} alt="running"></img>
                            <p>
                                Sport Photography
                            </p>
                        </button>
                        <button value={2} className={`work-type-button ${isSelectedType2 ? 'selected-type' : ''}`}
                            type="button" onClick={() => handleProjectType(2)}>
                            <img className="type-img" src={academic} alt="academic"></img>
                            <p>
                                School Photography
                            </p>
                        </button>
                    </div>

                    <button type="submit" className="button standard">Create new project</button>
                </form>

            </div>

            <Sidemenu_teamleader />
        </div>
    );
}
export default Newproject_teamleader;