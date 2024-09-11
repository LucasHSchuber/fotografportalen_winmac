import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faBook, faFolderOpen, faFile } from "@fortawesome/free-solid-svg-icons";

import KnowledgeModal from "../components/knowledgeModal";

import Sidemenu from "../components/sidemenu";
import Sidemenu_small from "../components/sidemenu_small";

function Knowledgebase() {
//define states
const [data, setData] = useState([]);
const [tagsArray, setTagsArray] = useState({ uniqueTags: [], tagCounts: {} });
const [selectedTag, setSelectedTag] = useState("All");
const [selectedItem, setSelectedItem] = useState(null);


const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);

const handleKnowledgeModal = (show, item) => {
  setShowKnowledgeModal(show);
  setSelectedItem(item);
};


const sampleData = {
    result: [
      {
        id: 1,
        title: "Photographer Portal Manual",
        description: "A manual for Photographer Portal",
        tags: ["Photographer Portal"],
        lang: ["SE", "FI", "DK"],
        files: {
          "manual.pdf": "https://example.com/manual1.pdf"
        },
        created: "2024-09-02",
      },
      {
        id: 2,
        title: "Teamleader Setup Guide",
        description: "A guide to setting up Teamleader for new users",
        tags: ["Teamleader", "Setup"],
        lang: ["SE", "FI", "NO"],
        files: {
          "setup_guide.pdf": "https://example.com/setup_guide.pdf"
        },
        created: "2024-09-02",
      },
      {
        id: 3,
        title: "Filetransfer Usage Guide",
        description: "Learn how to use Filetransfer effectively",
        tags: ["Filetransfer", "Guide"],
        lang: ["SE", "DK"],
        files: {
          "usage_guide.pdf": "https://example.com/usage_guide.pdf"
        },
        created: "2024-09-02",
      },
      {
        id: 4,
        title: "Teamleader Task Management",
        description: "How to manage tasks in Teamleader",
        tags: ["Teamleader", "Tasks"],
        lang: ["FI", "NO"],
        files: {
          "task_management.pdf": "https://example.com/task_management.pdf"
        },
        created: "2024-09-02",
      },
      {
        id: 5,
        title: "Photographer Portal FAQ",
        description: "Frequently asked questions for Photographer Portal",
        tags: ["Photographer Portal"],
        lang: ["SE", "FI", "NO", "DK"],
        files: {
          "faq.pdf": "https://example.com/faq.pdf"
        },
        created: "2024-09-02",
      },
      {
        id: 6,
        title: "Photographer Portal Instructions",
        description: "A pdf file of instructions for Photographer Portal",
        tags: ["Photographer Portal"],
        lang: ["SE", "FI", "DK"],
        files: {
          "instructions.pdf": "https://example.com/instructions.pdf"
        },
        created: "2024-09-02",
      },
    ]
  };

  useEffect(() => {
    console.log('sampleData', sampleData);
    setData(sampleData.result);

    let tagsArray = []; 
    let tagsCount = {}; 

    sampleData.result.forEach(data => {
        data.tags.forEach(tag => {
            console.log(tag.tags);
            if (tagsCount[tag]) {
                tagsCount[tag] +=1
                console.log("has");
            }else{
                console.log("has not");
                tagsCount[tag] = 1
            }

            if (!tagsArray.includes(tag)) {
                tagsArray.push(tag);
            }
        })
    })

    console.log("Unique tags:", tagsArray);
    console.log("Tags count:", tagsCount);
  
    setTagsArray({ uniqueTags: tagsArray, tagCounts: tagsCount });
  }, []);


  useEffect(() => {
    console.log(tagsArray)
  }, [tagsArray]);
  

  const handleKnowledgeClick = (tag) => {
    console.log('tag', tag);
    setSelectedTag(tag);
  }


  return (
    <div className="knowledgebase-wrapper">
      <div className="knowledgebase-content">
        <div className="header">
          <h5>
            <FontAwesomeIcon icon={faBook} className="icons mr-2" /> Knowledge Base
          </h5>
          <p>Lorem ipsum some text here</p>
        </div>

        <div className="knowledgebase-container d-flex mt-5">  
          
            <div className="knowledgebase-box-left">
                <div>
                    <ul>
                      <li onClick={() => handleKnowledgeClick("All")}> <FontAwesomeIcon icon={faFolderOpen} className="mr-2" style={{ color: "gray" }} /> 
                        All
                        <span style={{ color: "#787878", marginLeft: "0.5em", fontSize: "0.8em" }}>{tagsArray.uniqueTags.length}</span>
                      </li>
                    {tagsArray && tagsArray.uniqueTags.map((tag) => (
                        <li key={tag} onClick={() => handleKnowledgeClick(tag)}>
                            <FontAwesomeIcon icon={faFolderOpen} className="mr-2" style={{ color: "gray" }} />
                            {tag} <span style={{ color: "#787878", marginLeft: "0.5em", fontSize: "0.8em" }}>{tagsArray.tagCounts[tag]}</span>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>

            <div className="knowledgebase-box-right">
                {data && data.map((item) =>
                    // If 'All' is selected or the item matches the selected tag
                    (selectedTag === "All" || item.tags.includes(selectedTag)) ? (
                        <div key={item.id} className="knowledgebase-article-box d-flex justify-content-between"
                          onClick={() => handleKnowledgeModal(true, item)}
                        >
                            <div>
                                <h5>{item.title}</h5>
                                {Object.keys(item.files).map((file) => (
                                    <div key={file}>
                                        <h6><FontAwesomeIcon icon={faFile} className="mr-2" /> {file}</h6>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h6>{item.created}</h6>
                            </div>
                        </div>
                    ) : null
                )}
                {(!selectedTag || !data.some(item => selectedTag === "All" || item.tags.includes(selectedTag))) && (
                    <div>
                        <h6>No selected tag</h6>
                    </div>
                )}
            </div>
        </div>

      </div>
      <KnowledgeModal  showKnowledgeModal={showKnowledgeModal} handleKnowledgeModal={handleKnowledgeModal} item={selectedItem}  />
      <Sidemenu />
      <Sidemenu_small />
    </div>
  );
}

export default Knowledgebase;
