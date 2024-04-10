import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import suitcase_black from "../../assets/images/suitcase_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Prevwork_teamleader() {
    // Define states
    const [projectsArray, setProjectsArray] = useState([]);

    const navigate = useNavigate();


    useEffect(() => {
        let user_id = localStorage.getItem("user_id");
        console.log(user_id);
    }, []);

    useEffect(() => {
        let user_id = localStorage.getItem("user_id");

        const getAllProjects = async () => {
            try {
                const projects = await window.api.getAllPreviousProjects(user_id);
                console.log('Projects:', projects.projects);
                setProjectsArray(projects.projects);

            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        getAllProjects();

    }, []);





    return (
        <div className="teamleader-wrapper">
            <div className="prevwork-teamleader-content">

                <div className="header">
                    <h4><img className="title-img" src={suitcase_black} alt="suitcase" /> Previous work</h4>
                    <p>This is your prevoius work. All the projects are locked since they have been sent in. In case important information have been missed out in one of your previous projects, please send a message to our office by clicking the email-icon to corresponding project.</p>
                </div>

                <div className="my-5">
                    {projectsArray && projectsArray.length > 0 ? (
                        projectsArray.map(project => (
                            <div key={project.project_id} className="prevwork-box d-flex mb-2">
                                <div className="prevwork-box-left d-flex justify-content-between"
                                    value={project.project_id}
                                    onClick={() => enterProject(project.project_id)}
                                    title="Open job"
                                >
                                    <div className="d-flex">
                                        <p className="ml-2">{project.type === "school" ? <img className="type-img-currwork" src={academic_black} alt="academic"></img> : <img className="type-img-currwork" src={running_black} alt="running"></img>}</p>
                                        <p className="ml-3">{project.projectname.length > 25 ? project.projectname.substring(0, 25) + "..." : project.projectname}</p>
                                    </div>
                                    <p className="ml-4 mr-5">{project.created.substring(0, 10)}</p>
                                    <p><i class="fa-solid fa-lock"></i></p>
                                </div>

                                <div className="prevwork-box-mid mx-2">
                                    <p className="ml-2"> <i class="fa-regular fa-paper-plane"></i> {project.sent_date.substring(0, 10)}</p>
                                </div>
                                <div className="prevwork-box-right"
                                    title="View control sheet"
                                >
                                    <i class="fa-solid fa-newspaper"></i>
                                </div>
                                <div className="prevwork-box-right mx-2"
                                    title="Report to office"
                                >
                                    <i class="fa-regular fa-envelope"></i>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div>
                            <p>No projects found.</p>
                            <a style={{ textDecoration: "underline" }} href="#" onClick={() => window.location.reload()}>Reload page</a>
                        </div>
                    )}
                </div>


                {/* <div className="my-5">

                    <div className="d-flex mb-2">
                        <div className="prevwork-box-left d-flex">
                            <p className="ml-2">Ekhammarskolan</p>
                            <p className="mx-5 ">P</p>
                            <p className="">G</p>
                            <p className="mx-5 ">12/3/24</p>
                            <i class="fa-solid fa-lock"></i>
                        </div>
                        <div className="prevwork-box-mid mx-2">
                            <p className="ml-2"><i class="fa-regular fa-paper-plane"></i> 13/3/24</p>
                        </div>
                        <div className="prevwork-box-right">
                            <i class="fa-regular fa-envelope"></i>
                        </div>
                    </div>


                    <div className="prevwork-box d-flex mb-2">
                        <div className="prevwork-box-left d-flex">
                            <p className="ml-2">Ekhammarskolan</p>
                            <p className="mx-5 ">P</p>
                            <p className="">G</p>
                            <p className="mx-5 ">12/3/24</p>
                            <i class="fa-solid fa-lock"></i>
                        </div>
                        <div className="prevwork-box-mid mx-2">
                            <p className="ml-2"><i class="fa-regular fa-paper-plane"></i> 13/3/24</p>
                        </div>
                        <div className="prevwork-box-right">
                            <i class="fa-regular fa-envelope"></i>
                        </div>
                    </div>


                    <div className="prevwork-box d-flex mb-2">
                        <div className="prevwork-box-left d-flex">
                            <p className="ml-2">Ekhammarskolan</p>
                            <p className="mx-5 ">P</p>
                            <p className="">G</p>
                            <p className="mx-5 ">12/3/24</p>
                            <i class="fa-solid fa-lock"></i>
                        </div>
                        <div className="prevwork-box-mid mx-2">
                            <p className="ml-2"><i class="fa-regular fa-paper-plane"></i> 13/3/24</p>
                        </div>
                        <div className="prevwork-box-right">
                            <i class="fa-regular fa-envelope"></i>
                        </div>
                    </div>

                </div> */}


            </div>

            <Sidemenu_teamleader />

        </div>
    );
}
export default Prevwork_teamleader;