import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { TailSpin } from "react-loader-spinner";
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
  const [projectName, setProjectName] = useState("");
  const [chosenProjectName, setChosenProjectName] = useState("");
  const [chosenProjectUuid, setChosenProjectUuid] = useState("");
  const [chosenProjectLang, setChosenProjectLang] = useState("");
  const [chosenProject_id, setChosenProject_id] = useState("");
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

  // When dropping files in box
  // const handleDrop = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const droppedFiles = Array.from(event.dataTransfer.files);
  //   const zipFiles = droppedFiles.filter((file) => file.name.endsWith(".zip"));
  //   if (zipFiles.length > 0) {
  //     setFiles((prevFiles) => [
  //       ...prevFiles,
  //       ...Array.from(event.dataTransfer.files),
  //     ]);
  //   } else {
  //     alert("The only valid file format is .zip-files");
  //   }
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // };

  // const handleDrop = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   setIsDragging(false); 
  
  //   const droppedFiles = Array.from(event.dataTransfer.files); 
  //   console.log("Dropped files:", droppedFiles);
  
  //   setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  // };

  

  // const handleDragOver = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   event.dataTransfer.dropEffect = "copy";
  //   setIsDragging(true); 
  // };

  // deleting files
  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // const handleDragLeave = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   setIsDragging(false);
  // };


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
  // console.log(window.api);




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
      console.log(projectData);
      try{
          let FT_response = await window.api.createNewFTProject(projectData);
          console.log("FT response:", FT_response);
          // IF NOT 200 return
          if (FT_response.status !== 200) {
            MySwal.fire({
              title: 'Error',
              text: `Failed when adding data to local database`,
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
            const response = await window.api.uploadFile(
              file.path,
              chosenProjectLang,
              file.size
            );
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
                      let FTfile_response = await window.api.addFTFile(fileData);
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
      setProjectName("");
      setFiles([]);
    }
  };




  const handleProjectChange = (selectedOption) => {
    if (selectedOption) {
      setChosenProjectName(selectedOption.label);
      setChosenProjectUuid(selectedOption.value);
      setChosenProjectLang(selectedOption.lang);
      setChosenProject_id(selectedOption.project_id);
      setProjectName(selectedOption);
      console.log(selectedOption);
      console.log(selectedOption.label);
      console.log(selectedOption.lang);
      console.log(selectedOption.project_id);
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
    control: (styles, { isFocused }) => ({
      ...styles,
      width: "35em",
      borderColor: isFocused ? "#ff6f6f" : "#ccc", 
      boxShadow: isFocused ? "0 0 0 0.2rem rgba(255, 111, 111, 0.1)" : "none",
      "&:hover": {
        borderColor: isFocused ? "#ff6f6f" : "#ccc", 
      },
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
              <b>Filetransfer</b>
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
              <h4>Welcome to Filetransfer!</h4>
              <p>This is your program for uploading images and keeping track of already uploaded files</p>
            </div>

            <div className="d-flex mb-3">
              <div style={{  display: chooseNewProjectName ? "none" : "block" }}>
                <Select
                  value={projectName}
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
              {/* <div
                 onDrop={handleDrop}
                 onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 id="drop-zone"
                  style={{
                    border: isDragging ? "1x solid #98d3f1" : files.length === 0 ? "1px dashed #ccc" : "1px solid #80df70",
                    padding: "90px",
                    textAlign: "center",
                    width: "70%",
                    cursor: "copy",
                  }}
              >
                  {files.length === 0 ? (
                    <h6 style={{ marginRight: "1em" }}>
                      <em>Drag and drop files here</em>
                    </h6>
                  ) : (
                    <h6 style={{ marginRight: "2em" }}>Files ({files.length})</h6>
                  )}
              </div> */}
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
