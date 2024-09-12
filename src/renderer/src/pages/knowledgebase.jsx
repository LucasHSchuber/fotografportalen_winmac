import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faBook, faMagnifyingGlass, faBrain } from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen, faFile } from "@fortawesome/free-regular-svg-icons";

import KnowledgeModal from "../components/knowledgeModal";

import Sidemenu from "../components/sidemenu";
import Sidemenu_small from "../components/sidemenu_small";

function Knowledgebase() {
//define states
const [data, setData] = useState([]);
const [tagsArray, setTagsArray] = useState({ uniqueTags: [], tagCounts: {} });
const [selectedTag, setSelectedTag] = useState("All");
const [selectedItem, setSelectedItem] = useState(null);

const [searchString, setSearchString] = useState("");

const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);


// const sampleData = {
//     result: [
//       {
//         id: 1,
//         title: "Photographer Portal Manual",
//         description: "A manual for Photographer Portal. Before your first photography work, please read through the manual for the software in order get to know your workspace. Good luck!",
//         tags: ["Photographer Portal"],
//         lang: ["SE", "FI", "DK"],
//         files: {
//           "manual.pdf": "https://example.com/manual1.pdf"
//         },
//         created_at: "2024-09-02",
//       },
//       {
//         id: 2,
//         title: "Teamleader Setup Guide",
//         description: "A guide to setting up Teamleader for new users",
//         tags: ["Teamleader", "Setup"],
//         lang: ["SE", "FI", "NO"],
//         files: {
//           "setup_guide.pdf": "https://example.com/setup_guide.pdf"
//         },
//         created_at: "2024-09-02",
//       },
//       {
//         id: 3,
//         title: "Filetransfer Usage Guide",
//         description: "Learn how to use Filetransfer effectively",
//         tags: ["Filetransfer", "Guide"],
//         lang: ["SE", "DK"],
//         files: {
//           "usage_guide.pdf": "https://example.com/usage_guide.pdf"
//         },
//         created_at: "2024-09-02",
//       },
//       {
//         id: 4,
//         title: "Teamleader Task Management",
//         description: "How to manage tasks in Teamleader",
//         tags: ["Teamleader", "Tasks"],
//         lang: ["FI", "NO"],
//         files: {
//           "task_management.pdf": "https://example.com/task_management.pdf"
//         },
//         created_at: "2024-09-02",
//       },
//       {
//         id: 5,
//         title: "Photographer Portal FAQ",
//         description: "Frequently asked questions for Photographer Portal",
//         tags: ["Photographer Portal"],
//         lang: ["SE", "FI", "NO", "DK"],
//         files: {
//           "faq.pdf": "https://example.com/faq.pdf"
//         },
//         created_at: "2024-09-02",
//       },
//       {
//         id: 6,
//         title: "Photographer Portal Instructions",
//         description: "A pdf file of instructions for Photographer Portal",
//         tags: ["Photographer Portal"],
//         lang: ["SE", "FI", "DK"],
//         files: {
//           "instructions.pdf": "https://example.com/instructions.pdf"
//         },
//         created_at: "2024-09-02",
//       },
//     ]
//   };


  // Fetching all knowledge base data from REST API 
  useEffect(() => {
    const fetchKnowledgebase = async () => {
      let user_lang = localStorage.getItem("user_lang");
      let token = localStorage.getItem("token");
      console.log('user_lang', user_lang);
      try {
        const response = await axios.get(
          "https://backend.expressbild.org/index.php/rest/knowledgebase/articles", {
            params: { lang: user_lang },
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        console.log("response", response.data.result);
        setData(response.data.result)
      } catch (err) {
        console.error("Error fetching data:", err);
      }
  }
  fetchKnowledgebase();
  }, []);

  useEffect(() => {
    // console.log('sampleData', sampleData);
    // setData(sampleData.result);

    let tagsArray = []; 
    let tagsCount = {}; 

    data.forEach(data => {
        data.tags.forEach(tag => {
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
  }, [data]);

  // useEffect(() => {
  //   console.log('sampleData', sampleData);
  //   setData(sampleData.result);

  //   let tagsArray = []; 
  //   let tagsCount = {}; 

  //   sampleData.result.forEach(data => {
  //       data.tags.forEach(tag => {
  //           if (tagsCount[tag]) {
  //               tagsCount[tag] +=1
  //               console.log("has");
  //           }else{
  //               console.log("has not");
  //               tagsCount[tag] = 1
  //           }

  //           if (!tagsArray.includes(tag)) {
  //               tagsArray.push(tag);
  //           }
  //       })
  //   })
  //   console.log("Unique tags:", tagsArray);
  //   console.log("Tags count:", tagsCount);
  //   setTagsArray({ uniqueTags: tagsArray, tagCounts: tagsCount });
  // }, []);

  useEffect(() => {
    console.log(tagsArray)
  }, [tagsArray]);
  

  const handleKnowledgeModal = (show, item) => {
    setShowKnowledgeModal(show);
    setSelectedItem(item);
  };

  const handleKnowledgeClick = (tag) => {
    console.log('tag', tag);
    setSelectedTag(tag);
  }

  const handleSearchString = (e) => {
    console.log(e);
    setSearchString(e);
  }



  return (
    <div className="knowledgebase-wrapper">
      <div className="knowledgebase-content">
        <div className="header">
          <h5>
            <FontAwesomeIcon icon={faBrain} className="icons mr-2" /> Knowledge Base
          </h5>
          <p>This is your central resource for all the files, guides, and updates you need to stay informed and efficient in your work. Explore articles, download documents, and access the latest information to help you stay on top of your tasks</p>
        </div>

        <div className=" mt-5">
              <div>
                  <h6 style={{ fontSize: "0.9em" }}>Search in knowledge base:</h6>
              </div>
              <div style={{ position: "relative" }}>
                  <input className="form-input-field-fp" placeholder="Search..." value={searchString} onChange={(e) => handleSearchString(e.target.value)} style={{ fontSize: "0.95em", width: "30em" }} ></input>
                  {searchString && (
                  <button 
                  title="Remove Search String"
                  style={{
                    position: "absolute",
                    left: "22.5em",  
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "1.2em",
                    color: "#888",
                    padding: "0 0 0.4em 0",  
                    outline: "none"
                  }}
                  onClick={() => handleSearchString("")}
                >
                  &times;
              </button>
              )}
              </div>
        </div>

        <div className="knowledgebase-container d-flex mt-3">  

            <div className="knowledgebase-box-left">
                <div>
                    <ul>
                      <li style={{ textDecoration: selectedTag === "All" ? "underline" : "none" }} onClick={() => handleKnowledgeClick("All")}> <FontAwesomeIcon icon={faFolderOpen} className="mr-2" style={{ color: "#e34c00" }} /> 
                        All
                        <span style={{ color: "#787878", marginLeft: "0.5em", fontSize: "0.8em" }}>{data.length}</span>
                      </li>
                    {tagsArray && tagsArray.uniqueTags.map((tag) => (
                        <li key={tag} onClick={() => handleKnowledgeClick(tag)} style={{ textDecoration: selectedTag === tag ? "underline" : "none" }}>
                            <FontAwesomeIcon icon={faFolderOpen} className="mr-2" style={{ color: "#e34c00" }} />
                            {tag} <span style={{ color: "#787878", marginLeft: "0.5em", fontSize: "0.8em" }}>{tagsArray.tagCounts[tag]}</span>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>

            <div className="knowledgebase-box-right">
              {searchString ? (
                  data.filter(item => 
                      item.title.toLowerCase().includes(searchString.toLowerCase()) || 
                      item.tags.some(tag => tag.toLowerCase().includes(searchString.toLowerCase()))
                  ).length > 0 ? (
                      // Show matching search results
                      data.filter(item => 
                          item.title.toLowerCase().includes(searchString.toLowerCase()) || 
                          item.tags.some(tag => tag.toLowerCase().includes(searchString.toLowerCase()))
                      ).map((item) => (
                          <div key={item.id} className="knowledgebase-article-box d-flex justify-content-between"
                              onClick={() => handleKnowledgeModal(true, item)}
                          >
                              <div>
                                  <h5>{item.title}</h5>
                                  {item.files.map((file) => (
                                      <div key={file.name}>
                                          <h6><FontAwesomeIcon icon={faFile} className="mr-2" style={{ color: "#0083ce" }} /> {file.name}</h6>
                                      </div>
                                  ))}
                              </div>
                              <div>
                                  <h6>{item.created_at.substring(0,10)}</h6>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="mt-2 ml-5">
                          <p style={{ fontSize: "0.8em" }}>Ops! No items match your search.</p>
                      </div>
                  )
              ) : (
                  // Show items based on selected tag if no search is active
                  data.filter(item => selectedTag === "All" || item.tags.includes(selectedTag)).length > 0 ? (
                      data.filter(item => selectedTag === "All" || item.tags.includes(selectedTag)).map((item) => (
                          <div key={item.id} className="knowledgebase-article-box d-flex justify-content-between"
                              onClick={() => handleKnowledgeModal(true, item)}
                          >
                              <div>
                                  <h5>{item.title}</h5>
                                  {item.files.map((file) => (
                                      <div key={file.name}>
                                          <h6><FontAwesomeIcon icon={faFile} className="mr-2" style={{ color: "#0083ce" }} /> {file.name}</h6>
                                      </div>
                                  ))}
                              </div>
                              <div>
                                  <h6>{item.created_at.substring(0,10)}</h6>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="mt-2 ml-5">
                          <p style={{ fontSize: "0.8em" }}>No items was found in the folder</p>
                      </div>
                  )
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
