import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faBook, faFolderOpen, faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import { faFile } from "@fortawesome/free-regular-svg-icons";

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; 


const knowledgeModal = ({ showKnowledgeModal, handleKnowledgeModal, item }) => {

    //define states
    const [pdfUrl, setPdfUrl] = useState(null);

   useEffect(() => {
     console.log('item', item);
   }, [item]);
    
    const closeModal = () => {
        setPdfUrl(null);
        handleKnowledgeModal(false); 
    };



// Decode base64 string and create Blob URL
  const viewFile = (base64String, filename) => {
    try {
        console.log('filename:', filename);
        console.log('Base64 String (first 100 characters):', base64String.substring(0, 100)); 

        const blob = base64ToBlob(base64String);
        console.log('Blob:', blob);

        const url = URL.createObjectURL(blob);
        // window.open(url, '_blank');
        window.api.createKnowledgebaseWindow(url);


        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error viewing file:', error);
    }
  };
  
  function base64ToBlob(base64, contentType = 'application/pdf') {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }


  const downloadFile = (filePath, fileName) => {
    console.log("DownloadFile method triggered");
    console.log('filePath', filePath);
    console.log('fileName', fileName);
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
                        <div key={file.name} className="d-flex">
                            <h6 style={{ fontSize: "0.85em" }}><FontAwesomeIcon icon={faFile} className="mr-2" style={{ color: "#0083ce" }} /> {file.name}</h6>
                            <FontAwesomeIcon icon={faEye} className="mx-3 download-file-button" title={`View File ${file.name}`}  onClick={() => viewFile(file.path, file.name)}/>
                            <FontAwesomeIcon icon={faDownload} className="download-file-button" title={`Download File ${file.name}`} onClick={() => downloadFile(file.path, file.name)} />
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                {pdfUrl && (
                    <div style={{ height: 'fit-content', width: '100%', marginTop: '20px' }}>
                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
                        <Viewer fileUrl={pdfUrl} />
                        </Worker>
                    </div>
                )}

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
