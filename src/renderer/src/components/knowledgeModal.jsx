import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faBook, faFolderOpen, faFile } from "@fortawesome/free-solid-svg-icons";


const knowledgeModal = ({ showKnowledgeModal, handleKnowledgeModal, item }) => {

   
    const closeModal = () => {
        handleKnowledgeModal(false); 
      };


    return (
        <>
            <Modal className="mt-5" show={showKnowledgeModal} onHide={closeModal}>
                <Modal.Body className="mt-3 mb-3">
                <Modal.Title>
                    <h5 className="mb-3"><b>{item && item.title}</b></h5>
                </Modal.Title>
                <div style={{ textAlign: "left", marginLeft: "3em" }}>
                    {item && (
                    <div>
                        <p>{item.description}</p>
                        {Object.keys(item.files).map((file) => (
                        <div key={file}>
                            <h6><FontAwesomeIcon icon={faFile} className="mr-2" /> {file}</h6>
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                <div className="mt-3">
                    <Button className="button cancel fixed-width mr-1" onClick={closeModal}>
                    Cancel
                    </Button>
                </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default knowledgeModal;
