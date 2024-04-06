import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import flash_black from "../../assets/images/flash_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Newteam_teamleader() {
    // Define states
    const [projectType, setProjectType] = useState({});
    const [formData, setFormData] = useState({
        teamName: '',
        amount: 0,
        protectedId: false,
        allNamedInPhotolink: false,
        portrait: false,
        groupPhoto: false
    });


    const navigate = useNavigate();


    const handleCancel = () => {
        let project_id = localStorage.getItem("project_id");
        navigate(`/portal_teamleader/${project_id}`);
    };

    useEffect(() => {
        let project_type = localStorage.getItem("project_type");
        setProjectType(project_type);
        console.log(project_type);
    }, []);


    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(formData);
    };



    return (
        <div className="teamleader-wrapper">

            <div className="newteam-teamleader-content">

                <div className="header mb-4">
                    <h5>{projectType === "school" ? <img className="portal-title-img mr-3" src={academic_black} alt="academic" /> : <img className="portal-title-img mr-3" src={running_black} alt="running" />}{projectType === "school" ? "Create a new class" : "Create a new team"}</h5>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div>
                            {/* <label htmlFor="teamName">New Team:</label> */}
                            <input
                                className="form-input-field"
                                type="text"
                                id="teamName"
                                name="teamName"
                                placeholder={projectType === "school" ? "Class name" : "Team name"}
                                value={formData.teamName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="amount">Amount:</label> */}
                            <input
                                className="form-input-field"
                                type="number"
                                id="amount"
                                name="amount"
                                placeholder={projectType === "school" ? "Amount of students" : "Amount of players"}
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="protectedId"
                                checked={formData.protectedId}
                                onChange={handleChange}
                            />
                            Protected ID?
                        </label>
                    </div>
                    <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="allNamedInPhotolink"
                                checked={formData.allNamedInPhotolink}
                                onChange={handleChange}
                            />
                            All named in photolink?
                        </label>
                    </div>
                    <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="portrait"
                                checked={formData.portrait}
                                onChange={handleChange}
                            />
                            Portrait?
                        </label>
                    </div>
                    <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="groupPhoto"
                                checked={formData.groupPhoto}
                                onChange={handleChange}
                            />
                            Group Photo?
                        </label>
                    </div>
                    <button className="button cancel fixed-width fixed-height mr-1" onClick={handleCancel}>Cancel</button>
                    <button className="button standard fixed-width fixed-height" type="submit">Save</button>
                </form>

            </div>

            <Sidemenu_teamleader />
        </div>
    );
}
export default Newteam_teamleader;