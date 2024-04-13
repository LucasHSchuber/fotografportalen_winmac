import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Addleaderinfo_teamleader() {
    // Define states
    const [formData, setFormData] = useState({
        teamname: "",
        // calendar_amount: "",
        leader_firstname: "",
        leader_lastname: "",
        leader_mobile: "",
        leader_email: ""
    });

    const navigate = useNavigate();


    const handleCancel = () => {
        let project_id = localStorage.getItem("project_id");
        navigate(`/portal_teamleader/${project_id}`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let project_id = localStorage.getItem("project_id");
        console.log(project_id);

        // Convert amount to number
        // const amountNumber = parseInt(formData.calendar_amount);
        // console.log(amountNumber);
        // Convert leader_ssn to number if it represents a numerical value
        // const leaderSsnNumber = parseInt(formData.leader_ssn);
        // console.log(leaderSsnNumber);

        try {
            const teamData = await window.api.createNewTeam({
                ...formData,
                // calendar_amount: amountNumber,
                project_id: project_id
            });
            console.log('Team response:', teamData);

            //get latest tuppel in teams-table
            try {
                const teamsData = await window.api.getTeamsByProjectId(project_id);
                console.log('Teams:', teamsData.teams);
                setTimeout(() => {
                    const lastObject = teamsData.teams[teamsData.teams.length - 1];
                    console.log('Last Object:', lastObject);
                    localStorage.setItem("team_id", lastObject.team_id);
                }, 500);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }

        } catch (error) {
            console.error('Error adding team:', error);
        }

        setFormData({
            teamname: "",
            // calendar_amount: "",
            leader_firstname: "",
            leader_lastname: "",
            leader_mobile: "",
            leader_email: "",
        });

        navigate(`/calendarsale_teamleader`);

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
                <h5><i class="fa-solid fa-plus"></i> New team</h5>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mt-4 mb-2">
                    <h6><b>Team info:</b></h6>
                    <div>
                        <input className="form-input-field" type="text" name="teamname" value={formData.teamname} onChange={handleChange} placeholder="Team Name" required />
                    </div>
                    {/* <div>
                        <input className="form-input-field" type="number" name="calendar_amount" value={formData.calendar_amount} onChange={handleChange} placeholder="Amount of calendars" required />
                        <h6>All</h6>
                    </div> */}
                    <br></br>
                    <h6><b>Team leader info:</b></h6>
                    <div>
                        <input className="form-input-field" type="text" name="leader_firstname" value={formData.leader_firstname} onChange={handleChange} placeholder="Leader First Name" required />
                    </div>
                    <div>
                        <input className="form-input-field" type="text" name="leader_lastname" value={formData.leader_lastname} onChange={handleChange} placeholder="Leader Last Name" required />
                    </div>
                    {/* <div>
                        <input className="form-input-field" type="text" name="leader_address" value={formData.leader_address} onChange={handleChange} placeholder="Leader Address" required />
                    </div>
                    <div>
                        <input className="form-input-field" type="number" name="leader_postalcode" value={formData.leader_postalcode} onChange={handleChange} placeholder="Leader Postal Code" required />
                    </div>
                    <div>
                        <input className="form-input-field" type="text" name="leader_county" value={formData.leader_county} onChange={handleChange} placeholder="Leader County" required />
                    </div> */}
                    <div>
                        <input className="form-input-field" type="email" name="leader_email" value={formData.leader_email} onChange={handleChange} placeholder="Leader Email" required />
                    </div>
                    {/* <div>
                        <input className="form-input-field" type="number" name="leader_ssn" value={formData.leader_ssn} onChange={handleChange} placeholder="Leader SSN" required />
                    </div> */}
                    <div>
                        <input className="form-input-field" type="text" name="leader_mobile" value={formData.leader_mobile} onChange={handleChange} placeholder="Leader Mobile" required />
                    </div>
                </div>

                <div>
                    <button className="button cancel fixed-width fixed-height mr-1" onClick={handleCancel}>Cancel</button>
                    <button className="button standard fixed-width fixed-height" type="submit">Save</button>
                </div>
            </form>


            <Sidemenu_teamleader />
        </div>
    );
}
export default Addleaderinfo_teamleader;