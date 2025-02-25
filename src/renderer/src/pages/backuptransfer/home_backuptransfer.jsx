import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faRepeat, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { TailSpin } from "react-loader-spinner";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

import Sidemenu_backuptransfer from "../../components/backuptransfer/sidemenu_backuptransfer";
import Loadingbar_backuptransfer from "../../components/filetransfer/loadingbar_filetransfer";

import "../../assets/css/backuptransfer/main_backuptransfer.css";
import "../../assets/css/backuptransfer/buttons_backuptransfer.css";

function Home_backuptransfer() {
  // Define states
  const [loading, setLoading] = useState(true);
  const [chooseNewProjectName, setChooseNewProjectName] = useState("");
  const [files, setFiles] = useState([]);
//   const [projectName, setProjectName] = useState("");
  const [chosenProjectName, setChosenProjectName] = useState("");
  const [chosenProjectUuid, setChosenProjectUuid] = useState("");
  const [chosenProjectLang, setChosenProjectLang] = useState("");
//   const [chosenProject_id, setChosenProject_id] = useState("");
  const [projects, setProjects] = useState([]);
  const [FTProjectId, setFTProjectId] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ uploaded: 0, total: 0 });
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadFile, setUploadFile] = useState("");
  const [finishedUploading, setFinishedUploading] = useState([]);

  const inputRef = useRef(null);



  //load loading bar on load
  useEffect(() => {
    // Check if the loading bar has been shown before
    const hasHomeBackupTransferLoadingBarShown = sessionStorage.getItem(
      "hasHomeBackupTransferLoadingBarShown",
    );
    // If it has not been shown before, show the loading bar
    if (!hasHomeBackupTransferLoadingBarShown) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasHomeBackupTransferLoadingBarShown", "true");
      }, 1950);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);



  //get all projects to select from rest api
  useEffect(() => {
    const fetchAllProjects = async () => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    console.log(user_id);
      try {
        const projectResponse = await axios.get(`https://backend.expressbild.org/index.php/rest/backuptransfer/projects`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            }
        });
        console.log('projectResponse', projectResponse);
        if (projectResponse.status === 200){
            setProjects(projectResponse.data.result);
        }
      } catch (error) {
        console.log("error getting pojects:", error);
      }
    };
    fetchAllProjects();
  }, []);
  useEffect(() => {
    console.log('projects', projects);
  }, [projects]);


  // handle file change
  const handleFileChange = (event) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
  };

  // deleting files
  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };





  // METHOD to sumbit
  const handleSubmit = async () => {
    if (files.length === 0) return;
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        console.log('token', token);
        setIsUploading(true);
        setUploadProgress({ uploaded: 0, total: files.length });

        //update bt_projects table 
        const data = {
            project_uuid: chosenProjectUuid,
            projectname: chosenProjectName,
            user_id: user_id
        }
        console.log('data', data);
        let bt_project_id;
        try {
            const responseProject = await window.api.createNewBTProject(data);
            console.log('responseProject (createNewBTProject)', responseProject);
            bt_project_id = responseProject.bt_project_id;
        } catch (error) {
            console.log('failed when uploading data to bt_projects', error);
            return;
        }
        // upload files to tus.io-server
        for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setUploadFile(file.name);
                console.log('file.path', file.path);
                console.log('file.name', file.name);
                console.log('file.size', file.size);
                console.log('chosenProjectUuid', chosenProjectUuid);
                console.log('token', token);
                try {
                    const response = await window.api.uploadFileToTus(file.path, file.name, file.size, chosenProjectUuid, token);
                    console.log("Upload response TUS:", response);
                    if (response.status === "success") {
                        setUploadProgress((prev) => ({ uploaded: prev.uploaded + 1, total: prev.total }));
                        setFinishedUploading(response);
                        const fileData = {
                            bt_project_id: bt_project_id,
                            project_uuid: chosenProjectUuid,
                            filename: file.name,
                            file_size: file.size,
                            file_path: file.path
                        }
                        console.log('fileData', fileData);
                        try {
                            const responseFile = await window.api.createNewBTFile(fileData)
                            console.log('responseFile (createNewBTFile)', responseFile);
                        } catch (error) {
                            console.log('failed when creating file in bt_files', error);
                        }
                    } else {
                        console.log('Failed to upload file to tus (uploadFileToTus)');
                    } 
                } catch (error) {
                    console.error("Error uploading file:", error);
                    Swal.fire({
                        title: "BackupTransfer - Upload Error",
                        text: `Error uploading ${file.name}: ${error.message}`,
                        icon: "error",
                        confirmButtonText: "Close",
                    });
                    setIsUploading(false);
                    return;
                }
        }
        // Notify user when all uploads are completed
        Swal.fire({
            title: "Backuptransfer!",
            text: "All files have been uploaded",
            icon: "success",
            confirmButtonText: "Close",
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                content: 'custom-text',
                confirmButton: 'custom-confirm-button'
            }
        });
        setIsUploading(false);
        setChooseNewProjectName("");
        setChosenProjectName("");
        setFiles([]);
  };



  // callback from main-proccess to track upload progress while uploading files
  useEffect(() => {
    const handleUploadProgress = (event, { percentage }) => {
      console.log(`${percentage}%`);
      setUploadPercentage(percentage);
    };
    window.api.on("upload-progress", handleUploadProgress);
    return () => {
      window.api.removeAllListeners("upload-progress");
    };
  }, []);

  // callback from main-proccess to track errors while uploading files
  useEffect(() => {
    const handleUploadError = (event, errorData) => {
      console.log("Upload Error:", errorData); 
      alert(errorData.error);
    };
    window.api.on("upload-error", handleUploadError);
    return () => {
      window.api.removeAllListeners("upload-error");
    };
  }, []);




  // method to change states corresponding to selected project in select list
  const handleProjectChange = (selectedOption) => {
    if (selectedOption) {
      setChosenProjectName(selectedOption.label);
      setChosenProjectUuid(selectedOption.value);
      setChosenProjectLang(selectedOption.lang);
    //   setProjectName(selectedOption);
    } else {
      setChosenProjectName("");
    //   setProjectName("");
      setChosenProjectUuid("");
      console.log("No project selected");
    }
  };

  // When typing in an own project name
  const handleProjectChangeNew = (value) => {
    const uuid = "47f1eddc-77f5-4242-a72b-88a17113c038";
    setChosenProjectName(value);
    // const randomUuid = generateRandomUuid();
    // console.log('randomUuid', randomUuid);
    setChosenProjectUuid(uuid);
    console.log(value);
  };
//   // Method to generate random uuid for when user creates an own projectname
//   const generateRandomUuid = () => {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = Math.random() * 16 | 0;
//         var v = c === 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//       });
//   }

  const newProjectName = () => {
    setChooseNewProjectName((prevState) => !prevState);
  };

    useEffect(() => {
        console.log('choosenProjectName', chosenProjectName);
        console.log('chosenProjectUuid', chosenProjectUuid);
    }, [chosenProjectName, chosenProjectUuid]);
    


  // Custom styles for the Select component
  const customStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      width: "35em",
    //   borderColor: isFocused ? "#ff6f6f" : "#ccc", 
    //   boxShadow: isFocused ? "0 0 0 0.2rem rgba(255, 111, 111, 0.1)" : "none",
    //   "&:hover": {
    //     borderColor: isFocused ? "#ff6f6f" : "#ccc", 
    //   },
    }),
    option: (provided) => ({
        ...provided,
        fontSize: '0.8em', 
      }),
    menu: (base) => ({
      ...base,
      width: "35em",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      width: "35em", 
      textAlign: "center",
    }),
  };



  return (
    <div className="backuptransfer-wrapper">
      {loading ? (
        <div>
          <div className="loading-bar-text">
            <p>
              <b>BackupTransfer</b>
            </p>
          </div>
          <div className="loading-bar-container">
            <div className="loading-bar-bt"></div>
          </div>
        </div>
      ) : (
        <div>
          <div className="home-backuptransfer-content">
            <div className="header mb-5">
              <h4>BackupTransfer</h4>
              <p>This is your program for uploading your backup images</p>
            </div>

            <div className="d-flex mb-3">
              <div style={{  display: chooseNewProjectName ? "none" : "block" }}>
                <Select
                //   value={projectName}
                  onChange={handleProjectChange}
                  options={projects.length > 0 ? 
                    projects.map((project) => ({
                      value: project.project_uuid,
                      label: project.project_name,
                      lang: project.lang,
                    }))
                    : []
                  }
                  isClearable
                  placeholder="Select a job"
                  styles={customStyles}
                />
              </div>
              <input
                style={{
                  display: chooseNewProjectName ? "block" : "none",
                  width: "35em",
                  height: "2.38em",
                  borderRadius: "5px",
                  border: "1px solid #CACACA",
                  paddingLeft: "0.6em",
                }}
                placeholder="Create your own job name for upload"
                onChange={(e) => handleProjectChangeNew(e.target.value)}
              />
              <button
                style={{
                  border: "none",
                  backgroundColor: "inherit",
                  cursor: "pointer",
                }}
                className="ml-2"
                onClick={newProjectName}
                title="Create your own job name for upload"
              >
                <FontAwesomeIcon icon={faRepeat} />
              </button>
            </div>

            <div>

              <input
                  disabled={isUploading}
                  className="mt-3"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  placeholder=""
                //   accept=".zip, .rar, .pdf"
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
                  <div style={{ fontSize: "0.85em" }}>
                    <ul>
                      {files.map((file, index) => (
                        <li key={index}>
                          {file.name}
                          <button
                            title="Delete File"
                            className="delete-bt"
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
                    disabled={isUploading}
                    className="button upload-bt px-5"
                    onClick={handleSubmit}
                  >
                    Upload files
                  </button>
                </div>
              )}
            </div>
          </div>

          <Sidemenu_backuptransfer />
          {isUploading && (
            <Loadingbar_backuptransfer files={files} uploadProgress={uploadProgress} uploadPercentage={uploadPercentage} uploadFile={uploadFile} finishedUploading={finishedUploading} />
          )}

        </div>
        
      )}

    </div>
  );
}
export default Home_backuptransfer;
