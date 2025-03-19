import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCloudArrowUp, faCircle, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import "../../assets/css/backuptransfer/components_backuptransfer.css";


const Loadingbar_backuptransfer = ({ programName, files, uploadPercentage, uploadFile, finishedUploading, canceledUpload }) => {
  //define states
  const [uploadedFilesArray, setUploadedFilesArray] = useState([]);
  const [hasBeenMinimized, setHasBeenMinimized] = useState(false);

  console.log('files', files);
  console.log('uploadFile', uploadFile);
  console.log('uploadPercentage', uploadPercentage);
  console.log('finishedUploading', finishedUploading);
  

  useEffect(() => {
    files.forEach(file => {
      if (finishedUploading.filename === file.name) {
        console.log("Uploading:", file.name)
          if (!uploadedFilesArray.includes(file.name)) {
            setUploadedFilesArray((prevArray) => [...prevArray, file.name]);
        }
      }
    });
  }, [finishedUploading]);


  // Triggers cancelUpload in app.jsx when cancelling the upload
  const cancelUpload = () => {
    setUploadedFilesArray([])
    canceledUpload()
  }

  // minimizing/maximizing the loadingbar component
  const minimizeLoadingBar = () => {
    setHasBeenMinimized(!hasBeenMinimized)
  };


  return (
    <div className={`loadingbar-backuptransfer ${hasBeenMinimized ? "loadingbar-backuptransfer-minimized" : ""}`}>
        <div style={{ marginLeft: "5em" }}>
          <div className="d-flex">
            {/* <div> */}
              <h6 className="mb-3" style={{ fontWeight: "700", marginBottom: "-0.1em" }}>BackupTransfer:</h6>
              {/* <h6 className="mb-3" style={{ fontWeight: "500", fontSize: "0.9em" }}>Uploading files:</h6> */}
            {/* </div> */}
            <button title={`${hasBeenMinimized ? "Show" : "Hide"}`} className={`minimizeloadingbar-button ${hasBeenMinimized ? "minimizeloadingbar-minimized-button" : ""}`} onClick={minimizeLoadingBar}> <FontAwesomeIcon icon={hasBeenMinimized ? faChevronUp : faChevronDown}  /></button>
          </div>

          {files.map((file, index) => (
            <div key={index} className="d-flex ml-2">
                <FontAwesomeIcon icon={faCircle} style={{ fontSize: "0.3em", marginTop: "0.8em", marginRight: "1em" }} />
                <h6 style={{ fontSize: "0.85em" }}>{file.name}</h6>
                <div className="progress-container d-flex">
                    <progress
                      className="progress-bar"
                      value={uploadedFilesArray.includes(file.name) ? 100 : (file.name === uploadFile ? uploadPercentage : 0)}
                      max="100"
                      style={{ width: "100%", height: "20px",marginTop: "-1.2em", marginLeft: "1em", backgroundColor: uploadedFilesArray.includes(file.name) ? "#69ee2a" : "",
                      }}
                    ></progress>
                    
                    <div className="d-flex">
                        <h6 style={{ marginTop: "-1.9em", marginLeft: "1em", fontSize: "0.8em", color: uploadedFilesArray.includes(file.name) ? "#518b0c" : "" }}>          
                          {uploadedFilesArray.includes(file.name) ? "100%" : (file.name === uploadFile ? `${uploadPercentage}%` : "0%")}
                        </h6>
                        <h6 style={{ marginTop: "-1.9em", marginLeft: "0.5em", fontSize: "0.8em", color: uploadedFilesArray.includes(file.name) ? "#518b0c" : "" }}>
                          {uploadedFilesArray.includes(file.name) ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCloudArrowUp} />}
                        </h6>
                    </div>  

                </div>                
            </div>
          ))}
        <button className="mt-2 ml-2 cancel-upload-bt" title="Cancel upload" onClick={cancelUpload}>Cancel Upload</button>
      </div>
    </div>
  );
};

export default Loadingbar_backuptransfer;
