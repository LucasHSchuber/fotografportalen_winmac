import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faRepeat, faExclamationCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

import Sidemenu_backuptransfer from "../../components/backuptransfer/sidemenu_backuptransfer";
// import Loadingbar_backuptransfer from "../../components/backuptransfer/loadingbar_backuptransfer";

import "../../assets/css/backuptransfer/main_backuptransfer.css";
import "../../assets/css/backuptransfer/buttons_backuptransfer.css";

function Home_backuptransfer({ 
    showBTSuccess, 
    startUpload, 
    cancelTusUploadRef, 
    isUploading, 
    setIsUploading, 
    uploadPercentage, 
    setUploadPercentage, 
    setFinishedUploading, 
    finishedUploading, 
    chosenProjectName, 
    chosenProjectUuid, 
    setChosenProjectName, 
    setChosenProjectUuid, 
    files, 
    setFiles, 
    uploadFile, 
    setUploadFile 
}) {
  // Define states
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [chooseNewProjectName, setChooseNewProjectName] = useState("");

  console.log('isUploading', isUploading);

  //Listen for success from app.jsx
  // useEffect(() => {
  //     if (showBTSuccess) {
  //       console.log('Upload cancelled or completed');
  //     }
  // }, [showBTSuccess]);
  

  //load loading bar on load
  useEffect(() => {
    const hasHomeBackupTransferLoadingBarShown = sessionStorage.getItem(
      "hasHomeBackupTransferLoadingBarShown",
    );
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
      if (!navigator.onLine){
        setNetworkError(true);
        return;
      }
      const fetchAllProjects = async () => {
         // const user_id = localStorage.getItem("user_id");
        const token = localStorage.getItem("token");
        const user_lang = localStorage.getItem("user_lang");
        const lang = getLang(user_lang);
        console.log('lang', lang);
        setLoadingProjects(true);
        try {
          const projectResponse = await axios.get(`https://backend.expressbild.org/index.php/rest/backuptransfer/projects`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
              params: {
                  lang: lang
              }
          });
          console.log('projectResponse', projectResponse);
          if (projectResponse.status === 200){
              setProjects(projectResponse.data.result);
              setLoadingProjects(false);
          }
        } catch (error) {
          console.log("error getting pojects:", error);
          setLoadingProjects(false);
        } finally {
          setLoadingProjects(false);
        }
    };
    fetchAllProjects();
  }, []);

  const getLang = (user_lang) => {
    if (user_lang === "SE") {return "SE,STSE";}
    if (user_lang === "NO") {return "NO,STNO";}
    if (user_lang === "DK") {return "DK,STDK";}
    if (user_lang === "FI") {return "FI,STFI";}
    if (user_lang === "DE") {return "DE";}
  }



  const handleSubmit = () => {
    if (isUploading) {
      console.log('Upload already in porgress');
      return;
    }
    if (files.length === 0) return;
        if (!navigator.onLine){
          MySwal.fire({
            title: 'Internet Connection Error!',
            text: `Backuptransfer could not find a stable internet connection. The upload was cancelled.`,
            icon: 'error',
            confirmButtonText: 'Close',
            customClass: {
              popup: 'custom-popup',
              title: 'custom-title',
              content: 'custom-text',
              confirmButton: 'custom-confirm-button'
            }
          });
          return;
        }
    if (files.length > 0) {
      startUpload("backuptransfer") // trigger in app.jsx
    }
  };

  // // METHOD to sumbit
  // const handleSubmit = async () => {
  //       if (files.length === 0) return;
  //       if (!navigator.onLine){
  //         MySwal.fire({
  //           title: 'Internet Connection Error!',
  //           text: `Backuptransfer could not find a stable internet connection. The upload was cancelled.`,
  //           icon: 'error',
  //           confirmButtonText: 'Close',
  //           customClass: {
  //             popup: 'custom-popup',
  //             title: 'custom-title',
  //             content: 'custom-text',
  //             confirmButton: 'custom-confirm-button'
  //           }
  //         });
  //         return;
  //       }
  //       // startUpload()
  //       const token = localStorage.getItem("token");
  //       const user_id = localStorage.getItem("user_id");
  //       setIsUploading(true);
  //       setUploadProgress({ uploaded: 0, total: files.length });
  //       const data = {
  //           project_uuid: chosenProjectUuid,
  //           projectname: chosenProjectName,
  //           user_id: user_id
  //       }
  //       console.log('data', data);
  //       let bt_project_id;
  //       try {
  //           const responseProject = await window.api.createNewBTProject(data);
  //           console.log('responseProject (createNewBTProject)', responseProject);
  //           bt_project_id = responseProject.bt_project_id;
  //       } catch (error) {
  //           console.log('failed when uploading data to bt_projects', error);
  //           Swal.fire({
  //               title: "BackupTransfer - Error",
  //               text: `Error creating project data in local database: ${error}`,
  //               icon: "error",
  //               confirmButtonText: "Close",
  //           });
  //           setIsUploading(false);
  //           return;
  //       }
  //       //Upload files to tus.io-server
  //       let fileCount = 0;
  //       for (let i = 0; i < files.length; i++) {
  //               const file = files[i];
  //               setUploadFile(file.name);
  //               const fileData = {
  //                   bt_project_id: bt_project_id,
  //                   project_uuid: chosenProjectUuid,
  //                   filename: file.name,
  //                   file_size: file.size,
  //                   file_path: file.path
  //               }
  //               console.log('fileData', fileData);
  //               try {
  //                   const response = await window.api.uploadFileToTus(file.path, file.name, chosenProjectUuid, token);
  //                   console.log("Upload response TUS:", response);
  //                   if (response.status === "success") {
  //                       setUploadProgress((prev) => ({ uploaded: prev.uploaded + 1, total: prev.total }));
  //                       setFinishedUploading(response);
  //                       //Update bt_files table  (with is_sent = 1)
  //                       try {
  //                           const responseFile = await window.api.createNewBTFile(fileData)
  //                           console.log('responseFile (createNewBTFile)', responseFile);
  //                           fileCount++;
  //                       } catch (error) {
  //                           console.log('failed when creating file in bt_files', error); 
  //                           Swal.fire({
  //                               title: "BackupTransfer - Error",
  //                               text: `Error creating file data in local database: ${error}`,
  //                               icon: "error",
  //                               confirmButtonText: "Close",
  //                           });
  //                           setIsUploading(false);
  //                           return;
  //                       }
  //                   } else {
  //                       console.log('Failed to upload file to tus (uploadFileToTus)');
  //                   } 
  //               } catch (error) {
  //                       console.error("Error uploading file:", error);
  //                       if (canceledTusUploadRef) {
  //                           Swal.fire({
  //                               title: "Upload cancelled",
  //                               text: "The upload was cancelled.",
  //                               icon: "info",
  //                               confirmButtonText: "Close",
  //                           });
  //                           canceledTusUploadRef.current = false;
  //                           setIsUploading(false);
  //                           const user_id = localStorage.getItem("user_id");
  //                           if (fileCount === 0) {
  //                               try {
  //                                   const responseDelete = await window.api.deleteBTProject(bt_project_id, user_id);
  //                                   console.log('responseDelete:', responseDelete);
  //                               } catch (error) {
  //                                   console.error("Failed to set to deleted:", error);
  //                               }
  //                           }    
  //                           return;
  //                       } else {
  //                           //Update bt_files  (with is_sent = 0)
  //                           try {
  //                               const responseFile = await window.api.createNewFailedBTFile(fileData);
  //                               console.log('responseFile (createNewFailedBTFile):', responseFile);
  //                           } catch (error) {
  //                               console.error("Failed to mark file as failed in bt_files:", error);
  //                           }
  //                           Swal.fire({
  //                               title: "BackupTransfer - Upload Error",
  //                               text: `Error uploading ${file.name}: ${error.message}`,
  //                               icon: "error",
  //                               confirmButtonText: "Close",
  //                           });
  //                           setIsUploading(false);
  //                           return;
  //                       }
  //               }
  //       }
  //       // Notify user when all uploads are completed
  //       setTimeout(() => {
  //           showSuccessMessage() // show success message
  //           setIsUploading(false);
  //           setChooseNewProjectName("");
  //           setChosenProjectName("");
  //           setUploadFile("")
  //           setFiles([]);
  //       }, 500);
  // };
  // // Method to show success-message
  // const showSuccessMessage = () => {
  //   Swal.fire({
  //       title: "Backuptransfer!",
  //       text: "All files have been uploaded",
  //       icon: "success",
  //       confirmButtonText: "Close",
  //       customClass: {
  //           popup: 'custom-popup',
  //           title: 'custom-title',
  //           content: 'custom-text',
  //           confirmButton: 'custom-confirm-button'
  //       }
  //   });
  // }
  // const cancelTusUpload = () => {
  //   window.api.cancelTus()
  // }

  // // Listens for upload-canceled
  // useEffect(() => {
  //   const handleCancel = (event, { response }) => {
  //     console.log('response', response);
  //     if (response){
  //       canceledTusUploadRef.current = true;
  //     }
  //   };
  //   window.api.on("upload-canceled", handleCancel);
  //   return () => {
  //     window.api.removeAllListeners("upload-canceled", handleCancel);
  //   };
  // }, []);





  // // callback from main-proccess to track upload progress while uploading files
  // useEffect(() => {
  //   const handleUploadProgress = (event, { fileName, eventData }) => {
  //     const progress = parseInt(eventData, 10);  
  //     console.log(`Progress: ${progress}%`);
  //     setUploadPercentage(progress);
  //     if (progress === 100) {
  //       console.log(`DONE! - ${fileName}: upload complete.`);
  //     }
  //   };
  //   window.api.on("upload-tus-progress", handleUploadProgress);
  //   return () => {
  //     window.api.removeAllListeners("upload-tus-progress", handleUploadProgress);
  //   };
  // }, []);
    

  // // callback from main-proccess to track errors while uploading files
  // useEffect(() => {
  //   const handleUploadError = (event, errorData) => {
  //     console.log("Upload Error:", errorData); 
  //     alert(errorData.error);
  //   };
  //   window.api.on("upload-error", handleUploadError);
  //   return () => {
  //     window.api.removeAllListeners("upload-error");
  //   };
  // }, []);



  // method to change states corresponding to selected project in select list
  const handleProjectChange = (selectedOption) => {
    if (selectedOption) {
      setChosenProjectName(selectedOption.label);
      setChosenProjectUuid(selectedOption.value);
      // setChosenProjectLang(selectedOption.lang);
    } else {
      setChosenProjectName("");
      setChosenProjectUuid("");
      console.log("No project selected");
    }
  };

  // When typing in an own project name
  const handleProjectChangeNew = (value) => {
    const uuid = "47f1eddc-77f5-4242-a72b-88a17113c038";
    setChosenProjectName(value);
    setChosenProjectUuid(uuid);
  };

  // Toggle custo name or name from list
  const newProjectName = () => {
    setChooseNewProjectName((prevState) => !prevState);
    setChosenProjectName("");
    setChosenProjectUuid("");
    // setChosenProjectLang("");
  };


  // handle file change
  const handleFileChange = (event) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
  };
  // deleting files
  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  useEffect(() => {
    console.log('files (updated):', files);
  }, [files]);





  // Custom styles for the Select component
  const customStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      width: "35em",
      borderColor: isFocused ? "#858585" : "#ccc", 
      boxShadow: isFocused ? "0 0 0 0.2rem rgba(133, 133, 133, 0.1)" : "none",
      "&:hover": {
        borderColor: isFocused ? "#858585" : "#858585", 
      },
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

              {!isUploading ? (
                <div>
                    <div className="d-flex mb-3">
                      <div style={{  display: chooseNewProjectName ? "none" : "block" }}>
                        <Select
                        //   value={projectName}
                          disabled={isUploading}
                          onChange={handleProjectChange}
                          options={
                            loadingProjects
                              ? [{ value: "", label: "Loading projects...", isDisabled: true }]
                              : networkError
                              ? [{ value: "", label: "Internet connection error", isDisabled: true }]
                              : projects.map((project) => ({
                                  value: project.project_uuid,
                                  label: project.project_name,
                                  lang: project.lang,
                                }))
                          }
                          isClearable
                          placeholder="Select a job"
                          styles={customStyles}
                        />
                      </div>
                      <input
                        disabled={isUploading}
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
                      
                        <div>
                          <b>{chosenProjectName}</b>
                        </div>
                      
                      {files.length > 0 && (
                        <div style={{ fontSize: "0.85em" }}>
                          <ul>
                            {files.map((file, index) => (
                              <li key={index}>
                                {file.name}
                                <button
                                  disabled={isUploading}  
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
            ) : (
              <h6 style={{ color: "black" }}><em>Upload in progress... <FontAwesomeIcon className="fileuploadspinner" icon={faSpinner} /></em></h6>
            )}
          </div>

          <Sidemenu_backuptransfer />
          {/* {isUploading && (
            <Loadingbar_backuptransfer files={files} uploadProgress={uploadProgress} uploadPercentage={uploadPercentage} uploadFile={uploadFile} finishedUploading={finishedUploading} canceledUpload={canceledUpload} />
          )} */}

        </div>
        
      )}

    </div>
  );
}
export default Home_backuptransfer;
