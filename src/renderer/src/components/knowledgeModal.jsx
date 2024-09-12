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

   
    const closeModal = () => {
        setPdfUrl(null);
        handleKnowledgeModal(false); 
    };

    const downloadFile = (filePath) => {
        console.log("Downloading file...", filePath)
        window.open(filePath, '_blank');

    }

    const viewFile = (filePath) => {
        console.log("Viewing file", filePath)
        setPdfUrl(filePath);

    }



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
                            <FontAwesomeIcon icon={faEye} className="mx-3 download-file-button" title="View File" onClick={() => viewFile(file.path)}/>
                            <FontAwesomeIcon icon={faDownload} className="download-file-button" title="Download File" onClick={() => downloadFile(file.path)}/>
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
