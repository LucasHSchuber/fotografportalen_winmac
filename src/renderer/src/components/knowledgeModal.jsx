import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faBook, faFolderOpen, faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; 

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

import "../assets/css/components.css"

const knowledgeModal = ({ showKnowledgeModal, handleKnowledgeModal, item }) => {
    //define states
  const [runningOnline, setRunningOnline] = useState(true);


  // Method to check internet connection every 2 seconds
  const checkInternetConnection = () => {
      if (navigator.onLine) {
        setRunningOnline(true);
        console.log('Running Online');
      } else{
        console.log('Running Offline');
        setRunningOnline(false);
      }
  }
  // Check internet connection every 2 seconds
  useEffect(() => {
      const intervalId = setInterval(checkInternetConnection, 2000);
      return () => clearInterval(intervalId);
  }, []);
    

   // Close modal
   const closeModal = () => {
        handleKnowledgeModal(false); 
   };


  // View file
  const viewFile = (file_id, fileName) => {
      console.log('Opening File:', fileName);
      window.api.openLocallyKnowledgeBaseFile(fileName);
  };

  // Download file
  const downloadFile = async (file_id, fileName) => {
      console.log("DownloadFile method triggered");    
      if (navigator.onLine) {
        const fileUrl = `https://fs.ebx.nu/download/${file_id}`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName || "downloaded_file"; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
      } else {
        console.log('No internet, cannot download file');
      }
  };


  return (
        <>
            <Modal className="mt-5" show={showKnowledgeModal} onHide={closeModal}>
                <Modal.Body className="mt-3 mb-3 px-5">
                <Modal.Title>
                    <h6 style={{ textDecoration: "underline" }} className="mt-3 mb-5"><b>{item && item.title}</b></h6>
                </Modal.Title>
                <div style={{ textAlign: "left", fontSize: "0.85em" }}>
                    {item && (
                    <div>
                        <h6 style={{ fontSize: "0.95em", fontWeight: "600" }}>Description:</h6>
                        <p>{item.description}</p>
                        <h6 style={{ fontSize: "0.95em", fontWeight: "600" }}>Files:</h6>
                        {item.files.map((file) => (
                          <div key={file.name} className="mb-1 d-flex">
                              <h6 style={{ fontSize: "0.85em" }}><FontAwesomeIcon icon={faFile} className="mr-2" style={{ color: "#0083ce" }} /> {file.name}</h6>
                              <div style={{ marginTop: "-0.4em" }}>
                                <button className="ml-3 mr-2 download-file-button" title={`View File ${file.name}`}  onClick={() => viewFile(file.file_id, file.name)}>
                                  View File 
                                  {/* <FontAwesomeIcon icon={faEye} /> */}
                                </button>   
                                {runningOnline ? (
                                  <button className="download-file-button" title={`Download File ${file.name}`} onClick={() => downloadFile(file.file_id, file.name)}>
                                  <FontAwesomeIcon icon={faDownload} />
                                </button>
                                ) : null }
                              </div>  
                          </div>
                        ))}
                    </div>
                    )}
                </div>

                <div className="mt-5">
                    <Button className="button cancel" onClick={closeModal}>
                    Close
                    </Button>
                </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default knowledgeModal;
