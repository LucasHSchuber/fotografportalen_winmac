import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

import Sidemenu_filetransfer from "../../components/filetransfer/sidemenu_filetransfer";

import "../../assets/css/filetransfer/main_filetransfer.css";
import "../../assets/css/filetransfer/buttons_filetransfer.css";

function Home_filetransfer() {
  // Define states
  const [loading, setLoading] = useState(true);
  const [chooseNewProjectName, setChooseNewProjectName] = useState("");
  const [files, setFiles] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [chosenProjectName, setChosenProjectName] = useState("");
  const [chosenProjectUuid, setChosenProjectUuid] = useState("");
  const [projects, setProjects] = useState([]);

  console.log("File:", files);

  //load loading bar on load
  useEffect(() => {
    // Check if the loading bar has been shown before
    const hasHomeFiletransferLoadingBarShown = sessionStorage.getItem(
      "hasHomeFiletransferLoadingBarShown",
    );
    // If it has not been shown before, show the loading bar
    if (!hasHomeFiletransferLoadingBarShown) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasHomeFiletransferLoadingBarShown", "true");
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  //get all projects
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    console.log(user_id);
    const fetchAllProjects = async () => {
      try {
        const allProjects = await window.api.getAllProjects(user_id);
        console.log(allProjects);
        setProjects(allProjects.projects);
      } catch (error) {
        console.log("error getting pojects:", error);
      }
    };
    fetchAllProjects();
  }, []);

  const handleFileChange = (event) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles((prevFiles) => [
      ...prevFiles,
      ...Array.from(event.dataTransfer.files),
    ]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    console.log("Sending files from filetransfer to company database...");
    console.log(files);
    const data = {
      uuid: chosenProjectUuid,
      projectname: chosenProjectName,
      files: files,
    };
    console.log("data:", data);
    // if (file) {
    //   const formData = new FormData();
    //   formData.append("file", file);

    //   try {
    //     const response = await axios.post(
    //       "http://your-php-backend/upload.php",
    //       formData,
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       },
    //     );

    //     if (response.status === 200) {
    //       alert("File uploaded successfully");
    //     } else {
    //       alert("File upload failed");
    //     }
    //   } catch (error) {
    //     console.error("Error uploading file:", error);
    //     alert("Error uploading file");
    //   }
    // }
  };

  const handleProjectChange = (selectedOption) => {
    if (selectedOption) {
      setChosenProjectName(selectedOption.label);
      setChosenProjectUuid(selectedOption.value);
      setProjectName(selectedOption);
      console.log(selectedOption);
      console.log(selectedOption.label);
    } else {
      setChosenProjectName("");
      setProjectName("");
      setChosenProjectUuid("");
      console.log("No project selected");
    }
  };
  const handleProjectChangeNew = (e) => {
    setChosenProjectName(e);
    setChosenProjectUuid("abc");
    setProjectName(e);
    console.log(e);
  };

  const newProjectName = () => {
    setChooseNewProjectName((prevState) => !prevState);
  };
  // Custom styles for the Select component
  const customStyles = {
    control: (styles) => ({
      ...styles,
      width: "30em",
    }),
    menu: (base) => ({
      ...base,
      width: "30em", // Set the width of the dropdown menu
    }),
    noOptionsMessage: (base) => ({
      ...base,
      width: "30em", // Set the width of the no options message
      textAlign: "center", // Optionally, center the message
    }),
  };

  return (
    <div className="filetransfer-wrapper">
      {loading ? (
        <div>
          <div className="loading-bar-text">
            <p>
              <b>Filetransfer</b>
            </p>
          </div>
          <div className="loading-bar-container">
            <div className="loading-bar"></div>
          </div>
        </div>
      ) : (
        <div>
          <div className="home-filetransfer-content">
            <div className="header mb-5">
              <h4>Welcome to Filetransfer!</h4>
              <p>This is your program for uploading and sending your images</p>
            </div>

            <div className="d-flex mb-3">
              <div style={{ display: chooseNewProjectName ? "none" : "block" }}>
                <Select
                  value={projectName}
                  onChange={handleProjectChange}
                  options={projects && projects.map((project) => ({
                    value: project.project_uuid,
                    label: project.projectname,
                  }))}
                  isClearable
                  placeholder="Choose project from list"
                  styles={customStyles}
                />
              </div>
              <input
                style={{
                  display: chooseNewProjectName ? "block" : "none",
                  width: "30em",
                  height: "2.38em",
                  borderRadius: "5px",
                  border: "1px solid #CACACA",
                  paddingLeft: "0.6em",
                }}
                placeholder="Create your own project name for upload"
                onChange={(e) => handleProjectChangeNew(e.target.value)}
              />
              <button style={{ border: "none", backgroundColor: "inherit", cursor: "pointer" }} className="ml-2" onClick={newProjectName}>
                <FontAwesomeIcon icon={faRepeat} />
              </button>
            </div>

            <div style={{}}>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                  border:
                    files.length === 0 ? "1px dashed #ccc" : "1.5px solid #ccc",
                  padding: "90px",
                  textAlign: "center",
                  width: "70%",
                }}
              >
                {files.length === 0 ? (
                  <h6 style={{ marginRight: "1em" }}>
                    <em>Drag and drop files here</em>
                  </h6>
                ) : (
                  <h6 style={{ marginRight: "2em" }}>Files ({files.length})</h6>
                  //   <ul style={{ listStyleType: "none", marginRight: "3em" }}>
                  //     <span style={{ fontWeight: "800" }}>
                  //       Files ({files.length}):
                  //     </span>
                  //     <span style={{ fontSize: "0.8em" }}>
                  //     {files.map((file, index) => (
                  //       <li key={index}>- {file.name}</li>
                  //     ))}
                  //     </span>
                  //   </ul>
                )}
              </div>
              <input
                className="mt-3"
                type="file"
                onChange={handleFileChange}
                multiple
                placeholder="sdfsdf"
                style={{ color: "white" }}
              />
              <div
                className="my-4"
                style={{ borderLeft: "1.5px solid #ccc", paddingLeft: "1em" }}
              >
                {chosenProjectName && (
                  <div>
                    <b>{chosenProjectName}</b>
                  </div>
                )}
                {files.length > 0 && (
                  <div>
                    {/* <h6>
                      <b>Selected files ({files.length}):</b>
                    </h6> */}
                    <ul>
                      {files.map((file, index) => (
                        <li key={index}>
                          {file.name}
                          <button
                            className="delete-ft"
                            onClick={() => handleDelete(index)}
                            style={{ marginLeft: "10px" }}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}{" "}
              </div>
              {files.length > 0 && chosenProjectName && (
                <div className="mt-4">
                  <button
                    className="button upload-ft px-5"
                    onClick={handleSubmit}
                  >
                    Upload files
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Sidemenu_filetransfer />
    </div>
  );
}
export default Home_filetransfer;
