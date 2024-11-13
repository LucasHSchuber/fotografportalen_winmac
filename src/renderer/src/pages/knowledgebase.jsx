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
const [loading, setLoading] = useState(true);
const [data, setData] = useState([]);
const [tagsArray, setTagsArray] = useState({ uniqueTags: [], tagCounts: {} });
const [selectedTag, setSelectedTag] = useState("All");
const [selectedItem, setSelectedItem] = useState(null);
const [searchString, setSearchString] = useState("");
const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
const [errorFetchingDataFromTable, setErrorFetchingDataFromTable] = useState(false);


  // Check internet conenction
  useEffect(() => {
    setLoading(true);
    const checkInternetConnection = () => {
        if (navigator.onLine) {
            console.log("Internet access");
            fetchKnowledgebase();
        } else {
            console.log("No internet access");
            fetchKnowledgebaseFromTable();
        }
    };
    checkInternetConnection();
  }, [])


  useEffect(() => {
    console.log('data', data);
    data.forEach(element => {
      console.log('element.files', element.files);
      element.files.forEach(file => {
        console.log('file', file);

        // DOWNLOAD EACH file TO LOCAL COMPUTER. MAKE SURE IT DOESNT EXISTS FIRST

      });
    });
  }, [data]);


  // Fetching all knowledge base data from REST API 
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
        setLoading(false);
        console.log("response", response.data.result);
        setData(response.data.result)
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
  }
    // Fetching all knowledge base data from db table
    const fetchKnowledgebaseFromTable = async () => {
      let user_lang = localStorage.getItem("user_lang");
      console.log('user_lang', user_lang);
      try {
        const response = await window.api.getKnowledgebaseArticles(user_lang);
        console.log("Knowledge base response from db table: ", response);
        if (response.statusCode === 200) {
          console.log("Array ", response.articles);
          setData(response.articles)
          setLoading(false);
        } else{
          console.log("Error: Could not fetch articles from knowledgebase table in Database")
          setErrorFetchingDataFromTable(true);
          setLoading(false);
        }
       
      } catch (err) {
        console.error("Error fetching knowledge base:", err);
      }
  }

  // If online - download knowledge base article to sqlite table
  useEffect(() => {
    if (navigator.onLine){
        console.log("Online, postArticlesToKnowledgebase method triggered!")
        const postArticlesToKnowledgebase = async () => {
          try { 
            console.log('data', data);
            const response = await window.api.createKnowledgebaseArticles(data);
            console.log('response postArticlesToKnowledgebase: ', response);
          } catch (error) {
            console.log('error adding artciles to knowledge base table: ', error);
          }
      }
      postArticlesToKnowledgebase();
    } else{
      console.log("Offline, postArticlesToKnowledgebase method NOT triggered!")
    }
  }, [data]);


  // Create unique tags and tags count for left menu (tag menu in interface)
  useEffect(() => {
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



  

  const handleKnowledgeModal = (show, item) => {
    setShowKnowledgeModal(show);
    setSelectedItem(item);
    console.log('item selected', item);
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
                    style={{ position: "absolute", left: "22.5em",  top: "50%",transform: "translateY(-50%)",border: "none",background: "transparent",cursor: "pointer",fontSize: "1.2em",color: "#888",padding: "0 0 0.4em 0",  outline: "none"}}
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
                                  {item.updated_at ? (
                                  <h6><i>Updated:</i> {item.updated_at.substring(0,10)}</h6>
                                  ) : (
                                    <h6>{item.created_at.substring(0,10)}</h6>
                                  )}
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="mt-2 ml-5">
                         {loading ? (
                          <p style={{ fontSize: "0.8em", width: "30em" }}><span style={{ fontWeight: "600" }}></span>Please wait while loading articles in Knowledge Base...</p>
                         ) : errorFetchingDataFromTable ? (
                          <p style={{ fontSize: "0.8em", width: "30em" }}><span style={{ color: "red", fontWeight: "600" }}>Oh no! <br></br></span>Ops! Something went wrong when fetching articles from knowledge base in offline mode... <br></br><br></br> Please connect to internet or try again soon!</p>
                        ) : (
                          <p style={{ fontSize: "0.8em" }}>No items was found in the folder</p>
                        )}
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
