import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import uploadedfile_black from "../../assets/images/uploadedfile_black.png";

import Sidemenu_backuptransfer from "../../components/backuptransfer/sidemenu_backuptransfer";

import "../../assets/css/backuptransfer/main_backuptransfer.css";
import "../../assets/css/backuptransfer/buttons_backuptransfer.css";

function History_backuptransfer() {
  // define states
    const [data, setData] = useState([]);
    const [searchString, setSearchString] = useState("");


    // get all filetransfer data from local database
    const fetchInitialData = async () => {
        const user_id = localStorage.getItem("user_id");
        console.log(user_id);
        try {
          const response = await window.api.getBackuptransferData(user_id);
          console.log("response:", response);
          const sortedData = response.data.sort((a, b) => new Date(b.created) - new Date(a.created));
          setData(sortedData);
          console.log("sorted data:", sortedData);
        } catch (error) {
          console.log("error getting BT projects and files:", error);
        }
    };
    useEffect(() => {
        fetchInitialData();
    }, []);
    

    // Clone data array if user input search
    useEffect(() => {
        if (searchString) {
            const clonedData = data.filter(item => item.projectname.toLowerCase().includes(searchString.toLowerCase()));
            console.log('clonedData', clonedData);
            setData(clonedData);
        } else {
            fetchInitialData()
        }
    }, [searchString]);


    //Update search string state
    const handleSearchString = (e) => {
        console.log(e);
        setSearchString(e);
    }

    
    return (
    <div className="backuptransfer-wrapper">
        <div className="header mb-5">
            <h4>
            <img
                className="title-img"
                src={uploadedfile_black}
                alt="uploadedfile_black"
            />{" "}
                Backup History
            </h4>
            <p>This is your history of uploaded files in each job</p>
        </div>
        
        <div className="mb-3">
                <div>
                    <h6>Search for jobs:</h6>
                </div>
                <div>
                    <input className="form-input-field-ft form-search-ft fixed" placeholder="Search.." value={searchString} onChange={(e) => handleSearchString(e.target.value)}></input>
                </div>
            </div>
        {data && data.length === 0 ? (
            <h6><em>No uploaded projects</em></h6>
        ) : (
        <div>
            {data && data.map(item => (
                <div key={item.bt_project_id} className="mb-1 backuptransfer-history-box">
                    <h6>{item.projectname} <em>(created: {item.created})</em></h6>
                    <ul>
                    {item.files.map(file => (
                        <li key={file.bt_file_id}>{file.filename} <em>(uploaded: {file && file.uploaded_at})</em></li>
                    ))}
                    </ul>
                </div>
            ))}
        </div>
        )}

        <Sidemenu_backuptransfer />
    </div>
    );
}
export default History_backuptransfer;
