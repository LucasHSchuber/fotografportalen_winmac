import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretLeft, faCheck, faLockOpen, faLock, faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import Sidemenu_timereport from "../../components/timereport/sidemenu_timereport";
import ConfirmActivityModal from "../../components/timereport/confirmActivityModal";
import ConfirmSubmitModal from "../../components/timereport/confirmSubmitModal";
import FeesChart from "../../components/timereport/feesChart";

import '../../assets/css/timereport/main_timereport.css';
import '../../assets/css/timereport/buttons_timreport.css';



function Home_timereport() {
    // Define states
    const [loading, setLoading] = useState(true);
    const [userLang, setUserLang] = useState("");
    const [data, setData] = useState([]);
    const [timereportData, setTimereportData] = useState([]);
    const [projectData, setProjectData] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [dataForFeesChart, setDataForFeesChart] = useState([]);
    const [completedAmount, setCompletedAmount] = useState("");
    const [entireMonthSubmitted, setEntireMonthSubmitted] = useState(false);

    const [validateInputError, setValidateInputError] = useState({});

    const [month, setMonth] = useState(new Date().getMonth()); 
    const [year, setYear] = useState(new Date().getFullYear());

    const [tableData, setTableData] = useState(data);
    const [newRowInputs, setNewRowInputs] = useState({
        project_date: '',
        projectname: '',
    });

    const [sumMiles, setSumMiles] = useState(0);
    const [sumExpenses, setSumExpenses] = useState(0);
    const [sumWorkedHours, setSumWorkedHours] = useState(0);

    const [showConfirmActivityModal, setShowConfirmActivityModal] = useState(false);
    const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);


    // Modal props
    const handleClose = () => {setShowConfirmActivityModal(false), setShowConfirmSubmitModal(false)};

    const setAsCompleted = (index) => {
        console.log('index', index);
        console.log("tableData[index]: ",tableData[index]);
        // MAKE SURE DIGITS ARE ENTERED CORRECLTY 
        const validateCheck = validateInputError[index];
        console.log('validateCheck', validateCheck);
        const hasWarnings = validateCheck && typeof validateCheck === 'object' 
        ? Object.values(validateCheck).some(value => value === 'WARNING') 
        : false;
            if (hasWarnings) {
            console.log("There are warnings!");
            if (validateCheck.starttime === "WARNING"){
                console.log('warning starttime');
                // setInputStatus((prevStatus) => ({...prevStatus, starttime: true,}));
            }
            if (validateCheck.endtime === "WARNING"){
                console.log('warning endtime');
                // setInputStatus((prevStatus) => ({...prevStatus, endtime: true,}));
            }
            if (validateCheck.breaktime === "WARNING"){
                console.log('warning breaktime');
                // setInputStatus((prevStatus) => ({...prevStatus, breaktime: true,}));
            }
            return;
        } else {
            console.log("No warnings found.");
        }
        setSelectedIndex(index);
        setShowConfirmActivityModal(true);
    };
    
    

    // Retrieve user_lang from localstorage to set currency
    useEffect(() => {
        let user_lang = localStorage.getItem("user_lang");
        setUserLang(user_lang)
        console.log('user_lang', user_lang);
    }, []);


    // Calculate amount of uncompleted projects in tableData array
    useEffect(() => {
        const completedAmount = tableData.filter(item => item.timereport_is_sent === 1);
        console.log('completedAmount', completedAmount);
        setCompletedAmount(completedAmount);
        setDataForFeesChart(completedAmount);
    }, [tableData]);

 

    //load loading bar on load
    useEffect(() => {
        // Check if the loading bar has been shown before
        const hasHomeTimereportLoadingBarShown = sessionStorage.getItem("hasHomeTimereportLoadingBarShown");
        if (!hasHomeTimereportLoadingBarShown) {
            const timer = setTimeout(() => {
                setLoading(false);
                sessionStorage.setItem("hasHomeTimereportLoadingBarShown", "true");
            }, 1950);

            return () => clearTimeout(timer);
        } else {
            setLoading(false);
        }
    }, []);


    
    // FETCH USER - get user data and all project and teams by user_id
    useEffect(() => {
        const user_id = localStorage.getItem("user_id");
        const fetchUser = async () => {
            try {
                const userData = await window.api.getUser(user_id);
                if (userData && userData.user) {
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


    useEffect(() => {
       // Combine timereport data with matching project data
        const combined = [
            // Include projects with their matching timereports
            ...projectData.map(project => {
                const matchingTimereport = timereportData.find(timereport => timereport.project_id === project.project_id);
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
        // clear validationinputerror and tabledata
        setValidateInputError({})
        getTableData()
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
         // clear validationinputerror and tabledata
         setValidateInputError({})
         getTableData()
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

        // Validate starttime, endtime and breaktime input
        if (field === "starttime" || field === "endtime" || field === "breaktime"){
            const validateInput = validateTimeFormat(e.target.value);
            console.log('validateInput: ', validateInput);
            if (validateInput !== true){
                // setValidateInputError(index, field);
                setValidateInputError(prev => ({
                    ...prev,
                    [index]: {
                        ...prev[index],
                        [field]: "WARNING"
                    }
                }));
                console.warn("Invalid format " + e.target.value + " for " + field )
            }else {
                // Clear error when input becomes valid
                setValidateInputError(prev => ({
                    ...prev,
                    [index]: {
                        ...prev[index],
                        [field]: "OK"
                    }
                }));
        
            }
        }
        // Check if the project at the given index exists before updating
        if (updatedData[index]) {
            updatedData[index][field] = e.target.value;
        } else {
            console.error('Project at index does not exist:', index);
        }
        setTableData(updatedData);
    };

    // const handleNewRowInputChange = (e) => {
    //     console.log('value', e);
    //     const { name, value } = e.target;
    //     setNewRowInputs(prevInputs => ({
    //         ...prevInputs,
    //         [name]: value,
    //     }));
    // };
    const handleNewRowInputChange = (e) => {
        const { name, value } = e.target;
    
        // If the input is the datetime-local, convert it to the format "YYYY-MM-DD HH:MM:SS"
        if (name === "project_date") {
            // Replace 'T' with a space and add ":00" for the seconds part
            setNewRowInputs(prevInputs => ({
                ...prevInputs,
                [name]: value.replace("T", " ") + ":00", // Add ":00" for seconds
            }));
        } else {
            // For the other inputs, just update the value
            setNewRowInputs(prevInputs => ({
                ...prevInputs,
                [name]: value,
            }));
        }
    };
    

    const validateTimeFormat = (timeString) => {
        const timeFormatRegex = /^([0-9]{2}):([0-9]{2})$/;
        if (!timeFormatRegex.test(timeString)) {
            console.warn("Invalid time format. Use HH:MM format")
            // throw new Error('Invalid time format. Use HH:MM format (e.g., "14:30")');
            return false;
        }
        const [hours, minutes] = timeString.split(":").map(Number);
        // validate hours
        if (hours < 0 || hours > 23) {
            console.warn("Hours must be between 00 and 23")
            // throw new Error('Hours must be between 00 and 23');
            return false;
        }
        // validate minutes
        if (minutes < 0 || minutes > 59) {
            console.warn("Minutes must be between 00 and 59")
            // throw new Error('Minutes must be between 00 and 59');
            return false;
        }

        return true;
    }
    useEffect(() => {
      console.log('validateInputError: ', validateInputError);
    }, [validateInputError]);
    

    // method to unlock job - Set is_sent to 0 in table
    const setAsUncomplete = async (project) => {
      console.log('project', project);
      let user_id = localStorage.getItem("user_id");
      const data = {
        project_id: project.project_id,
        user_id: user_id,
        is_sent: project.timereport_is_sent
      }
      console.log('data', data);
      try {
        const response = await window.api.changeCompleted(data);
        console.log('response', response);
            if (response.statusCode === 200){
                getTableData();
            }  else {
                console.error("Failed to update is_sent. Backend response:", response);
            }
      } catch (error) {
        console.log('error when updating is_sent = 0', error);
      }
    };

    // completing an activity - set activity to is_sent = 1
    const completeProject = async (index) => {
        console.log("Completing project!")
        console.log('completed tabledata', tableData[index]);
        let user_id = localStorage.getItem("user_id");
        const data = {
            starttime: tableData[index].starttime = (tableData[index].starttime === undefined || tableData[index].starttime === "") ? "08:00" : tableData[index].starttime,
            endtime: tableData[index].endtime = (tableData[index].endtime === undefined || tableData[index].endtime === "") ? "17:00" : tableData[index].endtime,
            breaktime: tableData[index].breaktime = (tableData[index].breaktime === undefined || tableData[index].breaktime === "") ? "00:00" : tableData[index].breaktime,
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
                setTimeout(() => {
                    checkIfMonthFininshed(data.miles);
                }, 500);
            }
        } catch (error) {
            console.log('error when sending in job with index:' + index, error);
        }
    }
    // Function to generate a random int
    function generateRandomInt(min = 10000000, max = 10000000000) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; 
        return `temp_${randomNumber}`;
    }
    // IF COMPLETED === TOTAL then display a fininshedMonthModal
    const checkIfMonthFininshed = (miles) => {
        if (completedAmount.length + 1  === tableData.length) {
            let totalMiles = (Number(sumMiles) + Number(miles));
            Swal.fire({
                title: "Great!",
                // text: `You have completed all activities for the month!<br>You have driven ${sumMiles} miles this month.<br>Which is equal to ${getDrivenMilesMessage()}`,
                html: `You have completed all activities for the month!<br><br> You have driven <b>${totalMiles}</b> miles this month${totalMiles > 0 ? ` which is almost equal to ${getDrivenMilesMessage(totalMiles)}` : ` ${getDrivenMilesMessage(totalMiles)}` } <br><br> Don't forget to submit & lock the month!`, 
                imageUrl: "https://media.giphy.com/media/3q7VFETRrjXRTaaWOo/giphy.gif", 
                // imageUrl: "https://media.giphy.com/media/bJHEzxb2uKtzmSYJgU/giphy.gif", 
                // imageUrl: "https://media.giphy.com/media/PMV7yRpwGO5y9p3DBx/giphy.gif", 
                imageWidth: 250,
                imageHeight: 130,
                imageAlt: "Congratulations GIF",
                confirmButtonText: "Awesome!",
                background: '#fff', 
                padding: '20px', 
                customClass: {
                    confirmButton: 'custom-confirm-button',
                    title: 'custom-title',                 
                    content: 'custom-text'                 
                }
            });
        } 
    };

    const getDrivenMilesMessage = (totalMiles) => {
        if (totalMiles < 1) {
            return "<b>which is great for the planet! :)</b";
        } else if (totalMiles > 0 && totalMiles < 2) {
            return "<b>the length of a city street!</b>";
        } else if (totalMiles > 1 && totalMiles < 4) {
            return "<b>a long distance run!</b>";
        } else if (totalMiles > 3 && totalMiles < 5) {
            return "<b>the length of a marathon!</b>";
        } else if (totalMiles > 7 && totalMiles < 10) {
            return "<b>the height of Mount Everest!</b>";
        } else if (totalMiles > 9 && totalMiles < 15) {
            return "<b>the length of California's Golden Gate Bridge 7 times!</b>";
        } else if (totalMiles > 14 && totalMiles < 20) {
            return "<b>the distance between London and London Heathrow Airport!</b>";
        } else if (totalMiles > 19 && totalMiles < 25) {
            return "<b>the length of four marathons!</b>";
        } else if (totalMiles > 24 && totalMiles < 35) {
            return "<b>the distance of a scenic national park road trip!</b>";
        } else if (totalMiles > 34 && totalMiles < 45) {
            return "<b>the length of a small European country!</b>";
        } else if (totalMiles > 44 && totalMiles < 55) {
            return "<b>the distance up and down Mount Everest 3 times!</b>";
        } else if (totalMiles > 54 && totalMiles < 70) {
            return "<b>the length of the Alps!</b>";
        } else if (totalMiles > 69 && totalMiles < 85) {
            return "<b>the length of Germany!</b>";
        } else if (totalMiles > 84 && totalMiles < 100) {
            return "<b>the length of the entire Autobahn in Germany!</b>";
        } else if (totalMiles > 99 && totalMiles < 130) {
            return "<b>going from Stockholm to Copenhagen and back!</b>";
        } else if (totalMiles > 129 && totalMiles < 160) {
            return "<b>the length of Sweden!</b>";
        } else if (totalMiles > 159 && totalMiles < 200) {
            return "<b>the length of Norway!</b>";
        } else if (totalMiles > 199 && totalMiles < 230) {
            return "<b>5.5% of the distance around the Earth!</b>";
        } else if (totalMiles > 229 && totalMiles < 275) {
            return "<b>0.65% of the distance to the moon!</b>";
        } else if (totalMiles > 274 && totalMiles < 350) {
            return "<b>0.1% of the distance from Earth to Mars!</b>";
        } else if (totalMiles > 349) {
          return "<b>soon having pain in your butt, but keep driving! ;)</b>";
        }
      };
      


      // Complete the month permanent
      const completeMonthPermanent = async () => {
        console.log('tableData', tableData);
        let flag;
        tableData.forEach(element => {
            if (element.timereport_is_sent === undefined || element.timereport_is_sent === 0) {
                console.log("Complete all jobs first!")
                flag = true;
            } else {
                console.log("Ok. All jobs completed!")
            }
        })

        if (flag) {console.log("STOP"); return;}

        const user_id = localStorage.getItem("user_id");
        const projectIdArray = tableData.map(item => item.project_id);
        console.log('projectIdArray', projectIdArray);
        try {
            for (const project_id of projectIdArray){
                const response = await window.api.markAsCompletedPermanent({project_id, user_id});
                console.log('response', response);
                getTableData();
            } 
        } catch (error) {
            console.log('Error when setting is_sent_permanent in table', error);
        }
      };



      // Check if all jobs are submitted 
      useEffect(() => {
        console.log('tableData', tableData);
        let flag;
        tableData.forEach(element => {
            if (element.timereport_is_sent_permanent === undefined || element.timereport_is_sent_permanent === 0) {
                console.log('Not all jobs have been submitted');
                flag = 1;
            } 
            if (flag !== 1){
                setEntireMonthSubmitted(true)
            } else{
                setEntireMonthSubmitted(false)
            }
        });
      }, [tableData]);




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
        console.log('newRow', newRow);
        if (newRowInputs.project_date === ""){return}
        if (newRowInputs.projectname === ""){return}
        setTableData(prevDataTable => [...prevDataTable, newRow]);
        // Reset after adding
        setNewRowInputs({
            project_date: '',
            projectname: '',
        });
    };




    // Calculate statistics 
    useEffect(() => {
      // Calculate expenses  
      let expensesArray = [];
      tableData.forEach(element => {
        const expensesElement = element.other_fees + element.park + element.tolls;
        expensesArray.push(expensesElement);
      });
      const expensesArrayFiltered = expensesArray.filter(
        item => typeof item === "number" && !Number.isNaN(item)
      );      
      console.log('expensesArrayFiltered', expensesArrayFiltered);
      const sumExpenses = expensesArrayFiltered.reduce((acc, value) => acc + value, 0)
      console.log('sumExpenses', sumExpenses);
      setSumExpenses(sumExpenses);

      // Calculate miles
      let milesArray = [];
      tableData.forEach(element => {
        const milesElement = element.miles;
        milesArray.push(milesElement);
      });
      console.log('milesArray', milesArray);
      const milesArrayFiltered = milesArray.filter(
        item => typeof item === "number" && !Number.isNaN(item)
      );     
      const sumMiles = milesArrayFiltered.reduce((acc, value) => acc + value, 0)
      console.log('sumMiles', sumMiles);
      setSumMiles(sumMiles);

    }, [tableData]);

    // Calculate worked time
    useEffect(() => {
        const timeToMinutes = (timeStr) => {
          if (!timeStr || typeof timeStr !== "string" || !timeStr.includes(":")) {
            return 0;
          }
          const [hours, minutes] = timeStr.split(":").map(Number);
          return hours * 60 + minutes;
        };
      
        let workedTimeArray = [];

        tableData.forEach((element, index) => {
            // console.log(`Processing entry ${index}:`, element);
            const startMinutes = timeToMinutes(element.starttime);
            const endMinutes = timeToMinutes(element.endtime);
            const breakMinutes = element.breaktime ? timeToMinutes(element.breaktime) : 0;
            // Validate times and calculate worked minutes
            if (endMinutes > startMinutes) {
                const workedMinutes = endMinutes - startMinutes - breakMinutes;
                workedTimeArray.push(Math.max(workedMinutes, 0)); 
            } else {
                console.warn(`Invalid times for entry ${index}: starttime=${element.starttime}, endtime=${element.endtime}`);
                workedTimeArray.push(0); 
            }
        });
        
        const workedTimeArrayFiltered = workedTimeArray.filter(
          item => typeof item === "number" && !Number.isNaN(item)
        );
        const sumWorkedMinutes = workedTimeArrayFiltered.reduce((acc, value) => acc + value, 0);
      
        console.log('workedTimeArray', workedTimeArray);
        console.log('sumWorkedMinutes', sumWorkedMinutes);
        const totalHours = Math.floor(sumWorkedMinutes / 60); 
        const totalMinutes = sumWorkedMinutes % 60; 

        console.log(`Total Worked Time: ${totalHours} hours and ${totalMinutes} minutes`);
        setSumWorkedHours(`${totalHours} h ${totalMinutes} min`);

    }, [tableData]);
      


    const deleteAddedRow = async (project_id) => {
        console.log('project_id', project_id);
        const user_id = localStorage.getItem("user_id");
        console.log('user_id', user_id);
        try {
            const response = await window.api.deleteTimereportRow(project_id, user_id);
            console.log('response', response);
            if (response.status === 200) {
                console.log('Row deleted successfully');
                getTableData()
            } else {
                console.warn('Error deleting row');
            }
        } catch (error) {
            console.log('error deleting added row', error);
        }
    }



    // useEffect(() => {
    //   console.log('tableData', tableData);
    // }, [tableData]);

    // useEffect(() => {
    //     console.log('entireMonthSubmitted', entireMonthSubmitted);
    //   }, [entireMonthSubmitted]);
  

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
                            <p>This is your plattform for reporting your worked time, driven miles and expenses correlated to your jobs</p>
                        </div>
                    </div>

                    {/* Month toggling buttons */}
                    <div className="mb-4 month-toggle-tr d-flex justify-content-center">
                        <FontAwesomeIcon className="change-month-button" title="Previous Month" icon={faCaretLeft} onClick={handlePreviousMonth} />
                        <span className="mx-4 timeperiod-scope-tr">{`${new Date(year, month).toLocaleString('en-US', { month: 'long' })} ${year}`}</span>
                        <FontAwesomeIcon className="change-month-button" title="Next Month" icon={faCaretRight} onClick={handleNextMonth} />
                    </div>

                    <div className="projects-table-tr">

                        {tableData && (
                            <div className="mb-5 tr-statistics-box d-flex">
                                <div>
                                    <FeesChart dataForFeesChart={dataForFeesChart} userLang={userLang} />
                                </div>
                                <div style={{ marginTop: "1.5em" }}>
                                    <div className="mb-1">
                                            <div className={`tr-statistics ${entireMonthSubmitted && completedAmount.length === tableData.length && tableData.length !== 0 ? "submitted-work-box" : !entireMonthSubmitted && completedAmount.length === tableData.length && tableData.length !== 0 ? "completed-work-box" : "work-box"}`}>
                                                <h1>Completed:</h1>
                                                <h2>{completedAmount && completedAmount.length}/{tableData.length} {entireMonthSubmitted && (completedAmount.length === tableData.length && tableData.length !== 0) ? <FontAwesomeIcon icon={faLock} size="sm" className="ml-2" /> : !entireMonthSubmitted && (completedAmount.length === tableData.length && tableData.length !== 0) ? <FontAwesomeIcon icon={faCheck} size="lg" className="ml-2" title="Month Is Submitted" /> : "" }</h2>
                                            </div>
                                    </div>
                                    <div className="d-flex justify-content-start">
                                            <div className="tr-statistics">
                                                <h1>Worked Time:</h1>
                                                <h2>{sumWorkedHours}</h2>
                                            </div>  
                                            <div className="tr-statistics">
                                                <h1>Total Miles:</h1>
                                                <h2>{sumMiles} miles</h2>
                                            </div>
                                            <div className="tr-statistics">
                                                <h1>Total Expenses:</h1>
                                                <h2>{sumExpenses} {userLang === "SE" || userLang === "DK" || userLang === "NO" ? "kr" : "€"}</h2>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mb-3">
                            <h6><b>{`${new Date(year, month).toLocaleString('en-US', { month: 'long' })} ${year}`}</b></h6>
                        </div>

                        <table className="table-tr">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Job Name</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Break</th>
                                        <th>Miles</th>
                                        <th>Tolls</th>
                                        <th>Park</th>
                                        <th>Other</th>
                                        <th style={{ color: entireMonthSubmitted && (completedAmount.length === tableData.length && tableData.length !== 0) ? "#262626" : "#A74FFF", fontSize: "0.85em" }}>{completedAmount && completedAmount.length}/{tableData.length}</th>
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
                                                {project.projectname.length > 40 ? project.projectname.substring(5, 40) + "..." : project.projectname}
                                            </td>
                                            <td>
                                                <input
                                                    className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""} ${validateInputError[index]?.starttime === "WARNING" ? "error-border" : ""}`}
                                                    type="text"
                                                    value={project.starttime || "00:00"}
                                                    disabled={project.timereport_is_sent === 1}
                                                    onChange={(e) => handleInputChange(e, index, "starttime")}
                                                />
                                            </td>
                                            <td >
                                                <input
                                                    className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""} ${validateInputError[index]?.endtime === "WARNING" ? "error-border" : ""}`}
                                                    type="text"
                                                    value={project.endtime || "00:00"}
                                                    disabled={project.timereport_is_sent === 1}
                                                    onChange={(e) => handleInputChange(e, index, "endtime")}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""} ${validateInputError[index]?.breaktime === "WARNING" ? "error-border" : ""}`}
                                                    type="text"
                                                    value={project.breaktime || "00:00"}
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
                                                    // onChange={(e) => handleInputChange(e, index, "miles")}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === "" || Number(value) >= 0) {
                                                            handleInputChange(e, index, "miles");
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""}`}
                                                    type="number"
                                                    placeholder="0"
                                                    value={project.tolls || ""}
                                                    disabled={project.timereport_is_sent === 1}
                                                    // onChange={(e) => handleInputChange(e, index, "tolls")}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === "" || Number(value) >= 0) {
                                                            handleInputChange(e, index, "tolls");
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""}`}
                                                    type="number"
                                                    placeholder="0"
                                                    value={project.park || ""}
                                                    disabled={project.timereport_is_sent === 1}
                                                    // onChange={(e) => handleInputChange(e, index, "park")}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === "" || Number(value) >= 0) {
                                                            handleInputChange(e, index, "park");
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className={`input-field-tr ${project.timereport_is_sent === 1 ? "input-field-tr-disable" : ""}`}
                                                    type="number"
                                                    placeholder="0"
                                                    value={project.other_fees || ""}
                                                    disabled={project.timereport_is_sent === 1}
                                                    // onChange={(e) => handleInputChange(e, index, "other_fees")}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === "" || Number(value) >= 0) {
                                                            handleInputChange(e, index, "other_fees");
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="d-flex">
                                                <button
                                                    style={{marginTop: "0.2em"}}
                                                    className={`complete-project-button 
                                                                ${project.timereport_is_sent_permanent === 1 ? "locked-project-button" : project.timereport_is_sent === 1 ? "open-project-button" : ""}`}
                                                    title={`${
                                                        validateInputError[index]?.starttime === "WARNING" ||
                                                        validateInputError[index]?.endtime === "WARNING" ||
                                                        validateInputError[index]?.breaktime === "WARNING"
                                                            ? "Fix Warnings"
                                                            : project.timereport_is_sent_permanent === 1
                                                            ? "Job Submitted And Locked"
                                                            : project.timereport_is_sent === 1
                                                            ? "Open Job"
                                                            : "Complete Job"
                                                    }`}
                                                    onClick={() =>
                                                        project.timereport_is_sent === 1
                                                            ? setAsUncomplete(project)
                                                            : setAsCompleted(index)
                                                    }
                                                    disabled={
                                                        project.timereport_is_sent_permanent === 1 ||
                                                        validateInputError[index]?.starttime === "WARNING" ||
                                                        validateInputError[index]?.endtime === "WARNING" ||
                                                        validateInputError[index]?.breaktime === "WARNING"
                                                    }
                                                >
                                                    {validateInputError[index]?.starttime === "WARNING" ||
                                                    validateInputError[index]?.endtime === "WARNING" ||
                                                    validateInputError[index]?.breaktime === "WARNING" ? (
                                                        <FontAwesomeIcon icon={faXmark} size="sm" />
                                                    ) : project.timereport_is_sent_permanent === 1 ? (
                                                        <FontAwesomeIcon icon={faLock} size="sm" />
                                                    ) : project.timereport_is_sent === 1 ? (
                                                        <FontAwesomeIcon icon={faLockOpen} size="sm" />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    )}
                                                </button>
                                                {/* delete row button */}
                                                {typeof project.project_id === "string" && project.project_id.substring(0, 4) === "temp" ? (
                                                    <button
                                                        style={{marginTop: "0.2em"}}
                                                        className={`ml-1 delete-project-button ${project.timereport_is_sent_permanent === 1 ? "locked-project-button" : ""}`}
                                                        title={`${project.timereport_is_sent_permanent === 1 ? "Button Locked" : "Delete Row"}`}
                                                        onClick={() => deleteAddedRow(project.project_id)}
                                                        disabled={
                                                            project.timereport_is_sent_permanent === 1
                                                        }
                                                    >
                                                       {project.timereport_is_sent_permanent === 1 ? <FontAwesomeIcon icon={faLock} size="sm" /> :  <FontAwesomeIcon icon={faTrashCan} size="sm" />}
                                                    </button>
                                                ) : null}

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
                                            style={{ width: "11em" }}
                                            className="new-input-field-tr"
                                            type="datetime-local"
                                            name="project_date"
                                            value={newRowInputs.project_date ? newRowInputs.project_date.replace(" ", "T").slice(0, 16) : ""}  // Format the value correctly
                                            onChange={handleNewRowInputChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            style={{ width: "12em" }}
                                            className="new-input-field-tr"
                                            type="text"
                                            name="projectname"
                                            placeholder="New Job Name"
                                            value={newRowInputs.projectname}
                                            onChange={handleNewRowInputChange}
                                        />
                                    </td>
                                    <td>
                                        <button className="add-new-tr-button" title="Add Row" onClick={addNewRow}>
                                            Add Row +
                                        </button>
                                    </td> 
                                </tr>
                                {/* {tableData.length > 0 && (
                                    <div style={{ marginRight: "1.3em" }} className="completedamount-box">
                                        <h1>{completedAmount && completedAmount.length}/{tableData.length}</h1>
                                    </div>
                                )} */}
                            </div>

                            {/* Complete month button  */}
                            <div className="mt-4">
                                <button 
                                    className={`button complete-month-button ${entireMonthSubmitted || completedAmount.length !== tableData.length || tableData.length === 0 ? "complete-month-button-disable" : ""}`} 
                                    title={entireMonthSubmitted && completedAmount.length === tableData.length && tableData.length !== 0 ? "All Jobs This Month Is Already Submitted & Locked" : !entireMonthSubmitted && completedAmount.length !== tableData.length && tableData.length !== 0 ? "Complete All Jobs Before Being Able To Submit & Lock Month" : tableData.length === 0 ? "No Data To Submit" : "Submit & Lock Month" } 
                                    // onClick={() => completeMonthPermanent()}
                                    onClick={() => setShowConfirmSubmitModal(true)}
                                    disabled={entireMonthSubmitted || completedAmount.length !== tableData.length && tableData.length === 0}
                                >
                                 Submit & Lock Month <FontAwesomeIcon icon={faLock} /></button>
                            </div> 

                    </div>


                    <Sidemenu_timereport />
                    <ConfirmActivityModal   
                        showConfirmActivityModal={showConfirmActivityModal}
                        handleClose={handleClose}
                        completeProject={completeProject}
                        index={selectedIndex} 
                    />
                     <ConfirmSubmitModal   
                        showConfirmSubmitModal={showConfirmSubmitModal}
                        handleClose={handleClose}
                        completeMonthPermanent={completeMonthPermanent}
                    />
                </>
            )}


        </div>
    );
}
export default Home_timereport;