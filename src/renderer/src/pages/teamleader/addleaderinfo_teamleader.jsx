import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Addleaderinfo_teamleader() {
    // Define states
    const [formData, setFormData] = useState({
        teamname: "",
        leader_firstname: "",
        leader_lastname: "",
        leader_mobile: "",
        leader_email: ""
    });

    const navigate = useNavigate();



    useEffect(() => {
        let newteam_teamname = localStorage.getItem("newteam_teamname");
        let newteam_leaderfirstname = localStorage.getItem("newteam_leaderfirstname");
        let newteam_leaderlastname = localStorage.getItem("newteam_leaderlastname");
        let newteam_leaderemail = localStorage.getItem("newteam_leaderemail");
        let newteam_leadermobile = localStorage.getItem("newteam_leadermobile");
        if (newteam_teamname != "" && newteam_leaderfirstname != "") {
            setFormData({
                teamname: newteam_teamname,
                leader_firstname: newteam_leaderfirstname,
                leader_lastname: newteam_leaderlastname,
                leader_email: newteam_leaderemail,
                leader_mobile: newteam_leadermobile
            });
        }

    }, [])



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

        // let project_id = localStorage.getItem("project_id");
        // console.log(project_id);
        // try {
        //     const teamData = await window.api.createNewTeam({
        //         ...formData,
        //         // calendar_amount: amountNumber,
        //         project_id: project_id
        //     });
        //     console.log('Team response:', teamData);

        //     if (teamData && teamData.statusCode === 1) {
        //         //get latest tuppel in teams-table
        //         try {
        //             console.log("OK OK OK");
        //             const teamsData = await window.api.getTeamsByProjectId(project_id);
        //             console.log('Teams:', teamsData.teams);
        //             setTimeout(() => {
        //                 const lastObject = teamsData.teams[teamsData.teams.length - 1];
        //                 console.log('Last Object:', lastObject);
        //                 localStorage.setItem("team_id", lastObject.team_id);
        //             }, 1000);
        //         } catch (error) {
        //             console.error('Error fetching teams:', error);
        //         }
        //     }

        // } catch (error) {
        //     console.error('Error adding team:', error);
        // }


        //store data in localstorage
        localStorage.setItem("newteam_teamname", formData.teamname);
        localStorage.setItem("newteam_leaderfirstname", formData.leader_firstname);
        localStorage.setItem("newteam_leaderlastname", formData.leader_lastname);
        localStorage.setItem("newteam_leaderemail", formData.leader_email);
        localStorage.setItem("newteam_leadermobile", formData.leader_mobile);

        console.log(localStorage.getItem("newteam_teamname"));
        console.log(localStorage.getItem("newteam_leaderfirstname"));
        console.log(localStorage.getItem("newteam_leaderlastname"));
        console.log(localStorage.getItem("newteam_leaderemail"));
        console.log(localStorage.getItem("newteam_leadermobile"));


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



    return (
        <div className="teamleader-wrapper">

            <div className="breadcrumbs d-flex mb-4">
                <div className="breadcrumbs-box breadcrumbs-active">1. New team</div>
                <div className="breadcrumbs-box">2. Calander</div>
                <div className="breadcrumbs-box">3. Calendar information</div>
            </div>

            <div className="header">
                <h5><FontAwesomeIcon icon={faPlus} /> New team</h5>
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
                    <button className="button standard fixed-width fixed-height" type="submit">Next</button>
                </div>
            </form>


            <Sidemenu_teamleader />
        </div>
    );
}
export default Addleaderinfo_teamleader;