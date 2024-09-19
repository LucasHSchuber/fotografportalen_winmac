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
        showErrorModal(`Could not view file: ${filename}`);
    }
  };
  function base64ToBlob(base64, contentType = 'application/pdf') {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }


  const downloadFile = async (filePath, fileName) => {
    console.log("DownloadFile method triggered");
    console.log('filePath', filePath);
    console.log('fileName', fileName);
    try {
        console.log('Download initiated successfully.');
        const response = await window.api.downloadKnowledgebaseFile(filePath, fileName);
        console.log("Reponse: ", response);
        if (response.status === 200) {
            showSuccessModal(`File downloaded successfully to: ${response.message}`);
        } else if (response.status === 500){
            showErrorModal(`${response.error}`);
        } else {
            showErrorModal(`File failed to download`);
        }

      } catch (error) {
        console.error('Error downloading file:', error);
      }
  };



   // SweetAlert2 error modal
   const showErrorModal = (message) => {
    MySwal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Close',
      customClass: {
        title: 'my-custom-title',
        content: 'my-custom-content',
        confirmButton: 'my-custom-confirm-button'
      },
      didOpen: () => {
        const content = document.querySelector('.swal2-html-container');
        if (content) {
          content.style.fontSize = '0.9em';
        }
      }
    });
  };
    // SweetAlert2 success modal
    const showSuccessModal = (message) => {
        MySwal.fire({
          title: 'Success!',
          text: message,
          icon: 'success',
          confirmButtonText: 'Close',
          customClass: {
            title: 'my-custom-title',
            content: 'my-custom-content',
            confirmButton: 'my-custom-confirm-button'
          },
          didOpen: () => {
            const content = document.querySelector('.swal2-html-container');
            if (content) {
              content.style.fontSize = '0.9em';
            }
          }
        });
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
