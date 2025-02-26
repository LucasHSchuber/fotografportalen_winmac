import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faRepeat, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
// import { TailSpin } from "react-loader-spinner";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);


import Sidemenu_filetransfer from "../../components/filetransfer/sidemenu_filetransfer";
import Loadingbar_filetransfer from "../../components/filetransfer/loadingbar_filetransfer";

import "../../assets/css/filetransfer/main_filetransfer.css";
import "../../assets/css/filetransfer/buttons_filetransfer.css";

function Home_filetransfer() {
  // Define states
  const [loading, setLoading] = useState(true);
  const [chooseNewProjectName, setChooseNewProjectName] = useState("");
  const [files, setFiles] = useState([]);
  // const [projectName, setProjectName] = useState("");
  const [chosenProjectName, setChosenProjectName] = useState("");
  const [chosenProjectUuid, setChosenProjectUuid] = useState("");
  const [chosenProjectLang, setChosenProjectLang] = useState("");
  const [chosenProject_id, setChosenProject_id] = useState("");
  const [projects, setProjects] = useState([]);
  const [FTProjectId, setFTProjectId] = useState("");
  const [unsentFTProjects, setUnsentFTProjects] = useState([]);

  // const [isDragging, setIsDragging] = useState(false);

  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ uploaded: 0, total: 0 });
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadFile, setUploadFile] = useState("");
  const [finishedUploading, setFinishedUploading] = useState([]);

  const inputRef = useRef(null);


  useEffect(() => {
    console.log('finishedUploading', finishedUploading);
  }, [finishedUploading]);



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
      }, 1950);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);



  //Fetching unsent filetransfer data
  const getUnsentFTProjects = async () => {
    let user_id = localStorage.getItem("user_id");
    try {
      const unsentFTProjects = await window.api.getUnsentFTProjects(user_id);
      console.log("Unsent FT Projects:", unsentFTProjects.data);
        if (unsentFTProjects.data.length > 0) {
          setUnsentFTProjects(unsentFTProjects.data)
        }
    } catch (error) {
      console.error("Error fetching unsent FT projects:", error);
    }
  };
  useEffect(() => {
    getUnsentFTProjects();
  }, []);
  useEffect(() => {
    console.log('useeffect unsentFTProjects: ', unsentFTProjects);
  }, [unsentFTProjects]);


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


  // handle file change
  const handleFileChange = (event) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
  };

  // deleting files
  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };


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




  // METHOD to sumbit
  const handleSubmit = async () => {
    let user_id = localStorage.getItem("user_id");
    console.log("Sending files from filetransfer to company database...");
    console.log(files);
    const data = {
      uuid: chosenProjectUuid,
      projectname: chosenProjectName,
      files: files,
    };
    console.log("data:", data);
    if (files.length > 0) {
      setIsUploading(true);
      setUploadProgress({ uploaded: 0, total: files.length });
      
      //Create new FT-project in database
      const projectData = {
          project_uuid: chosenProjectUuid,
          projectname: chosenProjectName,
          user_id: user_id,
          project_id: chosenProject_id
      }
      console.log("projectData: ", projectData);
      try{
          let FT_response = await window.api.createNewFTProject(projectData); // creating new row in ft_projects
          console.log("FT response:", FT_response);
          if (FT_response.status !== 200) {
            MySwal.fire({
              title: 'Error',
              text: `Failed when creating new filetransfer data to local database`,
              icon: 'error',
              confirmButtonText: 'Close',
              customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                content: 'custom-text',
                confirmButton: 'custom-confirm-button'
              }
            });
            setIsUploading(false);
            return;
          }
          const ft_project_id = FT_response.ft_project_id;
          setFTProjectId(ft_project_id);
          sessionStorage.setItem("ft_project_id", ft_project_id);
          console.log("ft_project_id:", ft_project_id);
      }catch (error){
          console.log("error creating FT project", error);
      }
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        //upload files to FTP-server
        setUploadFile(file.name);
        try {
            const response = await window.api.uploadFile(file.path, chosenProjectLang, file.size); // uploading tile to ftp server
            console.log("response uploadFile:", response);
            
            if (response.statusCode === 200) {
                setProgress(((i + 1) / files.length) * 100);
                console.log(`File uploaded successfully: ${file.name}`);
                setUploadProgress((prev) => ({ uploaded: prev.uploaded + 1, total: prev.total }));

                // send file data and project_uuid to rest api to verify upload
                const data = {
                  filename: file.name,
                  project_uuid: chosenProjectUuid
                }
                const token = localStorage.getItem("token");
                const response = await axios.post(`https://backend.expressbild.org/index.php/rest/filetransfer/uploaddata`, data, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                  }
                });
                console.log('response', response);  
        
                //Create new FT-file in database
                if (response.status === 200) {
                    console.log(FTProjectId);
                    let _ft_project_id = sessionStorage.getItem("ft_project_id");
                    console.log(_ft_project_id);
                    const fileData = {
                      filename: file.name,
                      filepath: file.path,
                      ft_project_id: _ft_project_id
                    }
                    console.log(fileData);
                    try{
                      let FTfile_response = await window.api.addFTFile(fileData); // creating new row in ft_files
                      console.log("FT file response:", FTfile_response);
                      if (FTfile_response.status === 201){
                        console.log('addFTFile completed', FTfile_response.filename);
                        setFinishedUploading(FTfile_response);
                      }
                    }catch (error){
                      console.log("error creating FT file", error);
                    }
                } else {
                    MySwal.fire({
                      title: 'Error',
                      text: `Failed when verifying upload to filetransfer`,
                      icon: 'error',
                      confirmButtonText: 'Close',
                      customClass: {
                        popup: 'custom-popup',
                        title: 'custom-title',
                        content: 'custom-text',
                        confirmButton: 'custom-confirm-button'
                      }
                    });
                }
          } else {
                MySwal.fire({
                  title: 'Upload Failed',
                  text: `Failed to upload file: ${file.name}. Error: ${response.message}`,
                  icon: 'error',
                  confirmButtonText: 'Close',
                  customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    content: 'custom-text',
                    confirmButton: 'custom-confirm-button'
                  }
                });
                setIsUploading(false);
                return;
          }
        } catch (error) {
            MySwal.fire({
              title: 'Upload Error',
              text: `Error during file upload: ${error.message}`,
              icon: 'error',
              confirmButtonText: 'Close',
              customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                content: 'custom-text',
                confirmButton: 'custom-confirm-button'
              }
            });
            setIsUploading(false);
            return;
        }
      }
      // Notify user
      MySwal.fire({
        title: 'Filetransfer!',
        text: 'All files have been uploaded',
        icon: 'success',
        confirmButtonText: 'Close',
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
      getUnsentFTProjects();
    }
  };



  // Method for when selecting project in list
  const handleProjectChange = (selectedOption) => {
    console.log('selectedOption', selectedOption);
    if (selectedOption) {
      setChosenProjectName(selectedOption.label);
      setChosenProjectUuid(selectedOption.value);
      setChosenProjectLang(selectedOption.lang);
      setChosenProject_id(selectedOption.project_id);
      // setProjectName(selectedOption);
    } else {
      setChosenProjectName("");
      // setProjectName("");
      setChosenProjectUuid("");
      console.log("No project selected");
    }
  };
  // Method to set project_uuid and projectname when create custom project name
  const handleProjectChangeNew = (value) => {
    console.log('value', value);
    const uuid = "b2df9ade-e080-4f09-b6c3-39a2ea622bed";
    setChosenProjectName(value);
    setChosenProjectUuid(uuid);
    let _project_id = generateRandomNumber("123");
    console.log('_project_id', _project_id);
    setChosenProject_id(_project_id);
    // setProjectName(e);
  };
    // Method to generate random uuid for when user creates an own projectname
    const generateRandomNumber = (prefix) => {
      const prefixNumber = parseInt(prefix, 10)
      const randomPart = Math.floor(Math.random() * 100000);  
      const randomNumber = prefixNumber * 100000 + randomPart;
      return randomNumber;
    };

  const newProjectName = () => {
    setChooseNewProjectName((prevState) => !prevState);
  };


  


  // Custom styles for the Select component
  const customStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      width: "35em",
      borderColor: isFocused ? "#ff6f6f" : "#ccc", 
      boxShadow: isFocused ? "0 0 0 0.2rem rgba(255, 111, 111, 0.1)" : "none",
      "&:hover": {
        borderColor: isFocused ? "#ff6f6f" : "#ccc", 
      },
    }),
    option: (provided) => ({
      ...provided,
      fontSize: '0.9em',
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
    <div className="filetransfer-wrapper">
      {loading ? (
        <div>
          <div className="loading-bar-text">
            <p>
              <b>FileTransfer</b>
            </p>
          </div>
          <div className="loading-bar-container">
            <div className="loading-bar-ft"></div>
          </div>
        </div>
      ) : (
        <div>
          <div className="home-filetransfer-content">
            <div className="header mb-5">
              <h4>Welcome to FileTransfer!</h4>
              <p>This is your program for uploading images and keeping track of already uploaded files</p>
            </div>

            {/* Alert */}
            {unsentFTProjects.length > 0 && (
                <div className="mb-4 home-message-box">
                    <div className="d-flex">
                      <h6> <FontAwesomeIcon icon={faExclamationCircle} color="red" /> &nbsp;<b> Alert: </b> &nbsp; </h6>
                      <h6> You have <b>{unsentFTProjects.length > 0 ? unsentFTProjects.length : "0"}</b> job{unsentFTProjects.length > 1 ? "s":""} that is three days due and it's missing images:</h6>
                    </div> 
                    <ul style={{ fontSize: "0.75em" }}>
                      {unsentFTProjects.map((job) => (
                        <li key={job.project_uuid}>
                          {job.projectname}
                        </li>
                      ))}
                    </ul>
                </div>
            )}

            <div className="d-flex mb-3">
              <div style={{  display: chooseNewProjectName ? "none" : "block" }}>
                <Select
                  // value={projectName}
                  onChange={handleProjectChange}
                  options={
                    projects &&
                    projects.map((project) => ({
                      value: project.project_uuid,
                      label: project.projectname,
                      lang: project.lang,
                      project_id: project.project_id,
                    }))
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
                  placeholder="sdfsdf"
                  accept=".zip, .rar, .pdf"
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
                    disabled={isUploading}
                    className="button upload-ft px-5"
                    onClick={handleSubmit}
                  >
                    Upload files
                  </button>
                </div>
              )}
            </div>
          </div>

          <Sidemenu_filetransfer />
          {isUploading && (
            <Loadingbar_filetransfer files={files} uploadProgress={uploadProgress} uploadPercentage={uploadPercentage} uploadFile={uploadFile} finishedUploading={finishedUploading} />
          )}

        </div>
        
      )}

    </div>
  );
}
export default Home_filetransfer;
