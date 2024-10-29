import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretLeft, faCheck } from '@fortawesome/free-solid-svg-icons';


import Sidemenu_timereport from "../../components/timereport/sidemenu_timereport";

import '../../assets/css/timereport/main_timereport.css';
import '../../assets/css/timereport/buttons_timreport.css';
import axios from "axios";


function Home_timereport() {
    // Define states
    const [loading, setLoading] = useState(true);
    // const [user, setUser] = useState(true);
    const [data, setData] = useState([]);
    const [projectAndTimreportData, setProjectAndTimreportData] = useState([]);
    const [timereportData, setTimereportData] = useState([]);
    const [projectData, setProjectData] = useState([]);

    const [month, setMonth] = useState(new Date().getMonth()); 
    const [year, setYear] = useState(new Date().getFullYear());

    const [tableData, setTableData] = useState(data);
    const [newRowInputs, setNewRowInputs] = useState({
        project_date: '',
        projectname: '',
    });

    const navigate = useNavigate();



    //calculate amount of uncompleted projects in tableData array
    const completedAmount = tableData.filter(item => item.timereport_is_sent === 1);
    console.log('completedAmount', completedAmount);



    //load loading bar on load
    useEffect(() => {
        // Check if the loading bar has been shown before
        const hasHomeTimereportLoadingBarShown = sessionStorage.getItem("hasHomeTimereportLoadingBarShown");
        // If it has not been shown before, show the loading bar
        if (!hasHomeTimereportLoadingBarShown) {
            const timer = setTimeout(() => {
                setLoading(false);
                sessionStorage.setItem("hasHomeTimereportLoadingBarShown", "true");
            }, 2000);

            return () => clearTimeout(timer);
        } else {
            setLoading(false);
        }
    }, []);

    
    // fetch data for table        
    const getTableData = () => {
        const fetchAllFromTimereport = async () => {
            const user_id = localStorage.getItem("user_id");
            try {
                const response = await window.api.getAllTimereports(user_id);
                if (response.statusCode === 200) {
                    console.log('Timereports data:', response.data); 
                    setTimereportData(response.data);
                } else {
                    console.error('Error fetching timereport data from getAllTimereports:', response.errorMessage);
                }
            } catch (error) {
                console.error('Error fetching timereport data from getAllTimereports:', error);
            }
        };

        const fetchAllProjects = async () => {
            const user_id = localStorage.getItem("user_id");
            try {
                const response = await window.api.getAllProjects(user_id);
                console.log('Pojects data:', response.projects); 
                setProjectData(response.projects);
            } catch (error) {
                console.error('Error fetching projects from getAllProjects:', error);
            }
        };
    fetchAllFromTimereport();
    fetchAllProjects();
    }  

    useEffect(() => {
        getTableData()
    }, []);


    // FETCH USER - get user data and all project and teams by user_id
    useEffect(() => {
        const user_id = localStorage.getItem("user_id");

        const fetchUser = async () => {
            try {
                const userData = await window.api.getUser(user_id);
                // console.log('Users Data:', userData);

                if (userData && userData.user) {
                    // setUser(userData.user.firstname + " " + userData.user.lastname);
                    localStorage.setItem("user_lang", userData.user.lang);
                    localStorage.setItem("user_id", userData.user.user_id);
                } else {
                    console.error('Invalid user data:', userData);
                    fetchUser();
                }
            } catch (error) {
                console.error('Error fetching users data:', error);
            }
        };
        fetchUser();
    }, []);


    // // get user data and all project and teams by user_id
    // const fetchAllFromTimereport = async () => {
    //     const user_id = localStorage.getItem("user_id");
    //     try {
    //         const response = await window.api.getProjectsAndTimereport(user_id);
    //         if (response.statusCode === 200) {
    //             console.log('new data:', response.data); 
    //             setProjectAndTimreportData(response.data)
    //         } else {
    //             console.error('Error fetching data from getProjectsAndTimereport:', response.errorMessage);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data from getProjectsAndTimereport:', error);
    //     }
    // };
    // useEffect(() => {
    //     fetchAllFromTimereport();
    // }, []);


    useEffect(() => {
       // Combine timereport data with matching project data
        const combined = [
            // Include projects with their matching timereports
            ...projectData.map(project => {
                const matchingTimereport = timereportData.find(timereport => timereport.project_id === project.project_id);
                console.log('matchingTimereport', matchingTimereport);
                if (matchingTimereport) {
                    return {
                        ...project,  
                        ...matchingTimereport 
                    };
                } else {
                    return project;
                }
            }),
            ...timereportData.filter(timereport => 
                !projectData.some(project => project.project_id === timereport.project_id)
            )
        ];
        console.log('combined:', combined);
        const sortedData = combined.sort((a, b) => new Date(a.project_date) - new Date(b.project_date));
        console.log('sortedData', sortedData);
        const filteredData = sortedData.filter(project => {
            const projectDate = new Date(project.project_date);
            return projectDate.getMonth() === month && projectDate.getFullYear() === year;

        })
        console.log('filteredData', filteredData);
        setData(filteredData);
        setTableData(filteredData); 
    }, [projectData, timereportData, month, year]);


    // Function to go to the previous month
    const handlePreviousMonth = () => {
        setMonth(prev => {
            if (prev === 0) {
                setYear(year - 1);
                return 11; // December
            }
            return prev - 1;
        });
    };

    // Function to go to the next month
    const handleNextMonth = () => {
        setMonth(prev => {
            if (prev === 11) {
                setYear(year + 1);
                return 0; // January
            }
            return prev + 1;
        });
    };


    const handleInputChange = (e, index, field) => {
        console.log('e:', e.target.value, "index:", index, "field:", field);
        const updatedData = [...tableData];
        // Check if the project at the given index exists before updating
        if (updatedData[index]) {
            updatedData[index][field] = e.target.value;
        } else {
            console.error('Project at index does not exist:', index);
        }
        setTableData(updatedData);
    };

    const handleNewRowInputChange = (e) => {
        const { name, value } = e.target;
        setNewRowInputs(prevInputs => ({
            ...prevInputs,
            [name]: value,
        }));
    };
    
    // Function to generate a random int
    function generateRandomInt(min = 10000000, max = 10000000000) {
        return Math.floor(Math.random() * (max - min + 1)) + min; 
    }
    // completing an activity - set activity to is_sent = 1
    const completeProject = async (index) => {
        console.log("Completing project!")
        console.log('completed tabledata', tableData[index]);
        let user_id = localStorage.getItem("user_id");
        const data = {
            starttime: tableData[index].starttime = (tableData[index].starttime === undefined || tableData[index].starttime === "") ? "08:00" : tableData[index].starttime,
            endtime: tableData[index].endtime = (tableData[index].endtime === undefined || tableData[index].endtime === "") ? "17:00" : tableData[index].endtime,
            breaktime: tableData[index].breaktime = (tableData[index].breaktime === undefined || tableData[index].breaktime === "") ? "00:30" : tableData[index].breaktime,
            miles: tableData[index].miles = (tableData[index].miles === undefined) ? "0" : tableData[index].miles,
            tolls: tableData[index].tolls = (tableData[index].tolls === undefined) ? "0" : tableData[index].tolls,
            park: tableData[index].park = (tableData[index].park === undefined) ? "0" : tableData[index].park,
            other_fees: tableData[index].other = (tableData[index].other_fees === undefined) ? "0" : tableData[index].other_fees,
            project_id: tableData[index].project_id || generateRandomInt(),
            project_date: tableData[index].project_date || Now(),
            projectname: tableData[index].projectname,
            user_id: user_id,
        }
        console.log('data', data);
        try {
            const response = await window.api.markActivityAsCompleted(data);
            console.log('response', response);
            if (response.statusCode === 201){
                getTableData();
            }
        } catch (error) {
            console.log('error when sending in job with index:' + index, error);
        }
    }

    // add new row in table
    const addNewRow = () => {
        const newRow = {
            date: newRowInputs.project_date,
            projectname: newRowInputs.projectname,
            project_date: newRowInputs.project_date,
            starttime: '',
            endtime: '',
            breaktime: '',
            miles: 0,
            tolls: 0,
            park: 0,
            other_fees: 0,
        };
        if (newRowInputs.project_date === ""){return}
        if (newRowInputs.projectname === ""){return}
        setTableData(prevDataTable => [...prevDataTable, newRow]);
        // Reset after adding
        setNewRowInputs({
            project_date: '',
            projectname: '',
        });
    };




    useEffect(() => {
      console.log('tableData', tableData);
    }, [tableData]);



    return (
        <div className="timereport-wrapper">
            {loading ? (
                <div>
                    <div className="loading-bar-text">
                        <p><b>Time Report</b></p>
                    </div>
                    <div className="loading-bar-container">
                        <div className="loading-bar-tr"></div>
                    </div>
                </div>
            ) : (
                //html content
                <>
                    <div className="home-timereport-content mb-5">
                        <div className="header">
                            <h4>Welcome to Time Report!</h4>
                            <p>This is your plattform for reporting your worked time</p>
                        </div>
                    </div>

                    {/* Month toggling buttons */}
                    <div className="mb-5 month-toggle-tr d-flex justify-content-center">
                        <FontAwesomeIcon className="change-month-button" title="Previous Month" icon={faCaretLeft} onClick={handlePreviousMonth} />
                        <span className="mx-4 timeperiod-scope-tr">{`${new Date(year, month).toLocaleString('en-US', { month: 'long' })} ${year}`}</span>
                        <FontAwesomeIcon className="change-month-button" title="Next Month" icon={faCaretRight} onClick={handleNextMonth} />
                    </div>

                    <div className="mt-5 projects-table-tr">
                    <table className="table-tr">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Project Name</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Break</th>
                                    <th>Miles</th>
                                    <th>Tolls</th>
                                    <th>Park</th>
                                    <th>Other</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((project, index) => (
                                    <tr key={index} className={`projects-row-tr ${project.timereport_is_sent === 1 ? "is_sent_disable" : ""}`}>
                                        <td className="table-row-date-tr">{new Date(project.project_date).toLocaleDateString('en-GB', {
                                            day: "numeric",
                                            month: "numeric"
                                            })}
                                        </td>
                                        <td className="table-row-title-tr" title={project.projectname}>
                                            {project.projectname.length > 32 ? project.projectname.substring(5, 32) + "..." : project.projectname}
                                        </td>
                                        <td>
                                            <input
                                                className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""}`}
                                                type="text"
                                                value={project.starttime || "08:00"}
                                                disabled={project.timereport_is_sent === 1}
                                                onChange={(e) => handleInputChange(e, index, "starttime")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""}`}
                                                type="text"
                                                value={project.endtime || "17:00"}
                                                disabled={project.timereport_is_sent === 1}
                                                onChange={(e) => handleInputChange(e, index, "endtime")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""}`}
                                                type="text"
                                                value={project.breaktime || "00:30"}
                                                disabled={project.timereport_is_sent === 1}
                                                onChange={(e) => handleInputChange(e, index, "breaktime")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""}`}
                                                type="number"
                                                placeholder="0"
                                                value={project.miles || ""}
                                                disabled={project.timereport_is_sent === 1}
                                                onChange={(e) => handleInputChange(e, index, "miles")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""}`}
                                                type="number"
                                                placeholder="0"
                                                value={project.tolls || ""}
                                                disabled={project.timereport_is_sent === 1}
                                                onChange={(e) => handleInputChange(e, index, "tolls")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""}`}
                                                type="number"
                                                placeholder="0"
                                                value={project.park || ""}
                                                disabled={project.timereport_is_sent === 1}
                                                onChange={(e) => handleInputChange(e, index, "park")}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""}`}
                                                type="number"
                                                placeholder="0"
                                                value={project.other_fees || ""}
                                                disabled={project.timereport_is_sent === 1}
                                                onChange={(e) => handleInputChange(e, index, "other_fees")}
                                            />
                                        </td>
                                        <td>
                                            <button className={`complete-project-button ${project.timereport_is_sent === 1 ? "disable-button" : ""}`} title={`${project.timereport_is_sent === 1 ? "Completed" : "Complete Project"}`}
                                                    onClick={() => completeProject(index)}
                                                >
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* new row */}
                        <div className="mt-1 d-flex justify-content-between">
                            <tr className="new-project-row-tr">
                                <td>
                                    <input
                                        style={{ width: "8em" }}
                                        className="new-input-field-tr"
                                        type="date"
                                        name="project_date"
                                        value={newRowInputs.project_date}
                                        onChange={handleNewRowInputChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        style={{ width: "12em" }}
                                        className="new-input-field-tr"
                                        type="text"
                                        name="projectname"
                                        placeholder="New row title"
                                        value={newRowInputs.projectname}
                                        onChange={handleNewRowInputChange}
                                    />
                                </td>
                                <td>
                                    <button className="add-new-tr-button" onClick={addNewRow}>
                                       Add Row +
                                    </button>
                                </td> 
                            </tr>
                            {tableData.length > 0 && (
                            <div className="mr-2 completedamount-box">
                                <h1>{completedAmount.length}/{tableData.length}</h1>
                            </div>
                            )}
                        </div>


                        {/* Complete month button  */}
                        <div className="mt-4">
                            <button className="button complete-month-button" title="Complete Month"><FontAwesomeIcon icon={faCheck} /> Complete Month</button>
                        </div> 
                    </div>


                    <Sidemenu_timereport />
                </>
            )}


        </div>
    );
}
export default Home_timereport;