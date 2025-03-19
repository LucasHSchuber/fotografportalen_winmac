import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import convertToLocalTime from "../../assets/js/convertToLocalTime";
import uploadedfile_black from "../../assets/images/uploadedfile_black.png";

import Sidemenu_filetransfer from "../../components/filetransfer/sidemenu_filetransfer";

import "../../assets/css/filetransfer/main_filetransfer.css";
import "../../assets/css/filetransfer/buttons_filetransfer.css";

function History_filetransfer() {
  // define states
    const [allFTData, setAllFTData] = useState([]);
    const [searchString, setSearchString] = useState("");

    const fetchInitialData = async () => {
        const user_id = localStorage.getItem("user_id");
        console.log(user_id);
        try {
          const allFTdata = await window.api.getAllFTData(user_id);
          console.log("FT data:", allFTdata);
          const sortedData = allFTdata.sort((a, b) => new Date(b.created) - new Date(a.created));
          setAllFTData(sortedData);
          console.log("Project data:", sortedData);
        } catch (error) {
          console.log("error getting FT projects and files:", error);
        }
      };
      useEffect(() => {
        fetchInitialData();
      }, []);


      // Clone data array if user input search
      useEffect(() => {
        if (searchString) {
            const clonedData = allFTData.filter(item => item.projectname.toLowerCase().includes(searchString.toLowerCase()));
            console.log('clonedData', clonedData);
            setAllFTData(clonedData);
        } else {
            fetchInitialData()
        }
    }, [searchString]);

    
    const handleSearchString = (e) => {
      console.log(e);
      setSearchString(e);
  }


 

  return (
    <div className="filetransfer-wrapper">
      <div className="header mb-5">
        <h4>
          <img
            className="title-img"
            src={uploadedfile_black}
            alt="uploadedfile_black"
          />{" "}
          History
        </h4>
        <p>This is your history of uploaded files in each job</p>
      </div>
    
      <div className="mb-3">
            <div>
                <h6>Search for uploaded jobs:</h6>
            </div>
            <div>
                <input className="form-input-field-ft form-search-ft fixed" placeholder="Search.." value={searchString} onChange={(e) => handleSearchString(e.target.value)}></input>
            </div>
        </div>
    {allFTData && allFTData.length === 0 ? (
        <h6><em>No uploaded projects</em></h6>
    ) : (
    <div>
        {/* <h6 className="mb-4" style={{ textDecoration: "underline" }}><b>Uploaded projects:</b></h6> */}
        {allFTData && allFTData.map(data => (
            <div key={data.ft_project_id} className="mb-1 filetransfer-history-box">
              <div className="d-flex justify-content-between">
                <h6><b>{data.projectname}</b></h6> 
                <h6><em>created: {convertToLocalTime(data.created)}</em></h6>
              </div>
              <ul>
                {data.files.map(file => (
                    <li style={{ color: file.is_sent === 0 ? "red" : "" }} key={file.ft_file_id}>{file.filename}<em className="ml-2">{file.is_sent === 0 ? `(upload failed)` : `(uploaded: ${file && convertToLocalTime(file.uploaded_at)})`} </em></li>
                ))}
              </ul>
            </div>
        ))}
      </div>
    )}

      <Sidemenu_filetransfer />
    </div>
  );
}
export default History_filetransfer;
