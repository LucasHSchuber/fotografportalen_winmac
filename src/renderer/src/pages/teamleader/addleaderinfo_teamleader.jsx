import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import flash_black from "../../assets/images/flash_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Newteam_teamleader() {
    // Define states

    const [formData, setFormData] = useState({
        teamname: "",
        amount: 0,
        leader_firstname: "",
        leader_lastname: "",
        leader_address: "",
        leader_postalcode: "",
        leader_county: "",
        leader_mobile: "",
        leader_email: "",
        leader_ssn: "",
        portrait: false,
        crowd: false,
        sold_calendar: false
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let project_id = localStorage.getItem("project_id");
        console.log(project_id);

        // Convert amount to number
        const amountNumber = parseInt(formData.amount);
        console.log(amountNumber);
        // Convert leader_ssn to number if it represents a numerical value
        const leaderSsnNumber = parseInt(formData.leader_ssn);
        console.log(leaderSsnNumber);
        // console.log(leader_ssn);

        try {
            const teamData = await window.api.createNewTeam({
                ...formData,
                amount: amountNumber,
                leader_ssn: leaderSsnNumber,
                project_id: project_id 
            });
            console.log('Team response:', teamData);
        } catch (error) {
            console.error('Error adding team:', error);
        }

        console.log(formData);
        // Reset form data 
        setFormData({
            teamname: "",
            amount: 0,
            leader_firstname: "",
            leader_lastname: "",
            leader_address: "",
            leader_postalcode: "",
            leader_county: "",
            leader_mobile: "",
            leader_email: "",
            leader_ssn: "",
            portrait: false,
            crowd: false,
            sold_calendar: false
        });
    };




    // const enterProject = (project_id) => {
    //     console.log(project_id);
    //     navigate(`/portal_teamleader/${project_id}`);
    // }


    // if (loading) {
    //     return <div>Loading...</div>;
    // }
    // fetch projects WHERE user_id = ? AND WHERE is_sent = 0
    return (
        <div className="teamleader-wrapper">

            <div className="header">
                <h4><i class="fa-solid fa-plus"></i> New team</h4>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" name="teamname" value={formData.teamname} onChange={handleChange} placeholder="Team Name" required />
                </div>
                <div>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
                </div>
                <div>
                    <input type="text" name="leader_firstname" value={formData.leader_firstname} onChange={handleChange} placeholder="Leader First Name" required />
                </div>
                <div>
                    <input type="text" name="leader_lastname" value={formData.leader_lastname} onChange={handleChange} placeholder="Leader Last Name" required />
                </div>
                <div>
                    <input type="text" name="leader_address" value={formData.leader_address} onChange={handleChange} placeholder="Leader Address" required />
                </div>
                <div>
                    <input type="text" name="leader_postalcode" value={formData.leader_postalcode} onChange={handleChange} placeholder="Leader Postal Code" required />
                </div>
                <div>
                    <input type="text" name="leader_county" value={formData.leader_county} onChange={handleChange} placeholder="Leader County" required />
                </div>
                <div>
                    <input type="email" name="leader_email" value={formData.leader_email} onChange={handleChange} placeholder="Leader Email" required />
                </div>
                <div>
                    <input type="text" name="leader_ssn" value={formData.leader_ssn} onChange={handleChange} placeholder="Leader SSN" required />
                </div>
                <div>
                    <input type="text" name="leader_mobile" value={formData.leader_mobile} onChange={handleChange} placeholder="Leader Mobile" required />
                </div>

                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>


            <Sidemenu_teamleader />
        </div>
    );
}
export default Newteam_teamleader;