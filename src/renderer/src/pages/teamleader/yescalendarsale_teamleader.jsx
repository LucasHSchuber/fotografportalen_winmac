import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import flash_black from "../../assets/images/flash_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Calendarsale_teamleader() {
    // Define states
    const [ssn, setSsn] = useState("");
    const [terms, setTerms] = useState(false);
    const [project_id, setProject_id] = useState(false);

    const navigate = useNavigate();



    const handleCancel = () => {
        let project_id = localStorage.getItem("project_id");
        setProject_id(project_id);
        navigate(`/calendarsale_teamleader`);
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setTerms({ terms, [name]: checked });
        setSsn(value);
        setTerms(value);

        console.log(ssn);
        console.log(terms);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        let project_id = localStorage.getItem("project_id");
        console.log(project_id);

        const ssn = parseInt(formData.ssn);
        console.log(ssn);

        const terms = terms ? 1 : 0;

        //method to add ssn

        setSsn("");

        navigate(`/calendarsale_teamleader`);

    };


    return (
        <div className="teamleader-wrapper">

            <div className="calendarsale-teamleader-content">

                <div className="header mb-4">
                    <h5>Cashing!</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio officiis saepe sunt rerum, consequatur quas distinctio minus quo veritatis at eveniet culpa, blanditiis repudiandae consequuntur libero porro perferendis eius aut.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio officiis saepe sunt rerum, consequatur quas distinctio minus quo veritatis at eveniet culpa, blanditiis repudiandae consequuntur libero porro perferendis eius aut.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <input className="form-input-field" type="number" name="SSN" value={ssn} onChange={handleChange} placeholder="Social security number" required />
                    </div>
                    <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="named_photolink"
                                checked={terms}
                                onChange={handleChange}
                            />
                            I agree to the terms and conditions
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
export default Calendarsale_teamleader;