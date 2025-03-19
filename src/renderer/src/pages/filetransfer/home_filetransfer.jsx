import React, { useEffect, useState, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faRepeat, faExclamationCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

import Sidemenu_filetransfer from "../../components/filetransfer/sidemenu_filetransfer";
// import Loadingbar_filetransfer from "../../components/filetransfer/loadingbar_filetransfer";

import "../../assets/css/filetransfer/main_filetransfer.css";
import "../../assets/css/filetransfer/buttons_filetransfer.css";

function Home_filetransfer({ 
    showFTSuccess, 
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
    setUploadFile,
    setChosenProject_id,
    chosenProject_id
}) {
  // Define states
  const [loading, setLoading] = useState(true);
  const [chooseNewProjectName, setChooseNewProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [unsentFTProjects, setUnsentFTProjects] = useState([]);
  
  console.log('isUploading', isUploading);

  //Listen for success from app.jsx
  // useEffect(() => {
  //     console.log('Upload cancelled or completed');
  // }, [showFTSuccess]);

  useEffect(() => {
    if (!isUploading){ // trigger when isUploading is false (sent from app.jsx when upload is completed)
      getUnsentFTProjects()
    }
  }, [isUploading])

  //load loading bar on load
  useEffect(() => {
    const hasHomeFiletransferLoadingBarShown = sessionStorage.getItem(
      "hasHomeFiletransferLoadingBarShown",
    );
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
        } else {
          setUnsentFTProjects([]);
        }
    } catch (error) {
      console.error("Error fetching unsent FT projects:", error);
    }
  };
  useEffect(() => {
    let user_lang = localStorage.getItem("user_lang");
    if (user_lang !== "FI"){
      getUnsentFTProjects();
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

  // deleting files
  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };


  const handleSubmit = () => {
    if (isUploading) {
      console.log('Upload already in porgress');
      return;
    }
    if (files.length === 0) return;
        if (!navigator.onLine){
          MySwal.fire({
            title: 'Internet Connection Error!',
            text: `Filetransfer could not find a stable internet connection. The upload was cancelled.`,
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
      startUpload("filetransfer") // trigger in app.jsx
    }
  };

  // // METHOD to sumbit
  // const handleSubmit = async () => {
  //     if (files.length === 0) return;
  //     if (!navigator.onLine){
  //       MySwal.fire({
  //         title: 'Internet Connection Error!',
  //         text: `Filetransfer could not find a stable internet connection. The upload was cancelled.`,
  //         icon: 'error',
  //         confirmButtonText: 'Close',
  //         customClass: {
  //           popup: 'custom-popup',
  //           title: 'custom-title',
  //           content: 'custom-text',
  //           confirmButton: 'custom-confirm-button'
  //         }
  //       });
  //       return;
  //     }

  //     const token = localStorage.getItem("token");
  //     let user_id = localStorage.getItem("user_id");
  //     setIsUploading(true);
  //     setUploadProgress({ uploaded: 0, total: files.length });
  //     const projectData = {
  //       project_uuid: chosenProjectUuid,
  //       projectname: chosenProjectName,
  //       user_id: user_id,
  //       project_id: chosenProject_id
  //     }
  //     console.log("projectData: ", projectData);
  //     let ft_project_id;
  //     try{
  //         let FT_response = await window.api.createNewFTProject(projectData); 
  //         console.log("FT response:", FT_response);
  //         if (FT_response.status !== 200) {
  //           MySwal.fire({
  //             title: 'FileTransfer - Error',
  //             text: `Failed when creating new filetransfer data to local database`,
  //             icon: 'error',
  //             confirmButtonText: 'Close',
  //             customClass: {
  //               popup: 'custom-popup',
  //               title: 'custom-title',
  //               content: 'custom-text',
  //               confirmButton: 'custom-confirm-button'
  //             }
  //           });
  //           setIsUploading(false);
  //           return;
  //         } else {
  //           ft_project_id = FT_response.ft_project_id;
  //         }
  //     } catch (error){
  //         console.log("error creating FT project", error);
  //         Swal.fire({
  //           title: "FileTransfer - Error",
  //           text: `Error creating project data in local database: ${error}`,
  //           icon: "error",
  //           confirmButtonText: "Close",
  //       });
  //       setIsUploading(false);
  //     }

  //     let fileCount = 0;
  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i];
  //       setUploadFile(file.name);
  //       const fileData = {
  //         filename: file.name,
  //         filepath: file.path,
  //         ft_project_id: ft_project_id
  //       }
  //       console.log('fileData', fileData);
  //       try {
  //         const response = await window.api.uploadFileToTus(file.path, file.name, chosenProjectUuid, token);
  //         console.log("Upload response TUS:", response);
  //           if (response.status === "success") {
  //               setProgress(((i + 1) / files.length) * 100);
  //               setUploadProgress((prev) => ({ uploaded: prev.uploaded + 1, total: prev.total }));
  //               console.log(fileData);
  //               try{
  //                 let FTfile_response = await window.api.addFTFile(fileData);
  //                 console.log("FT file response:", FTfile_response);
  //                 if (FTfile_response.status === 201){
  //                   console.log('addFTFile completed', FTfile_response.filename);
  //                   setFinishedUploading(FTfile_response);
  //                   fileCount++;
  //                 }
  //               } catch (error){
  //                   console.log('failed when creating file in ft_files', error); 
  //                   Swal.fire({
  //                       title: "FileTransfer - Error",
  //                       text: `Error creating file data in local database: ${error}`,
  //                       icon: "error",
  //                       confirmButtonText: "Close",
  //                   });
  //                   setIsUploading(false);
  //                   return;
  //               }
  //         } else {
  //           console.log('Failed to upload file to tus (uploadFileToTus)');
  //         } 
  //       } catch (error) {
  //           console.error("Error uploading file:", error);
  //           if (canceledTusUploadRef.current) {
  //               Swal.fire({
  //                   title: "Upload cancelled",
  //                   text: "The upload was cancelled.",
  //                   icon: "info",
  //                   confirmButtonText: "Close",
  //               });
  //               canceledTusUploadRef.current = false;
  //               setIsUploading(false);
  //               const user_id = localStorage.getItem("user_id");
  //               if (fileCount === 0) {
  //                   try {
  //                       const responseDelete = await window.api.deleteFTProject(ft_project_id, user_id); 
  //                       console.log('responseDelete:', responseDelete);
  //                   } catch (error) {
  //                       console.error("Failed to set to deleted:", error);
  //                   }
  //               }    
  //               return;
  //             } else {
  //               //Update ft_files  (with is_sent = 0)
  //               try {
  //                   const responseFile = await window.api.createNewFailedFTFile(fileData); 
  //                   console.log('responseFile (createNewFailedBTFile):', responseFile);
  //               } catch (error) {
  //                   console.error("Failed to mark file as failed in bt_files:", error);
  //               }
  //               Swal.fire({
  //                   title: "FileTransfer - Upload Error",
  //                   text: `Error uploading ${file.name}: ${error.message}`,
  //                   icon: "error",
  //                   confirmButtonText: "Close",
  //               });
  //               setIsUploading(false);
  //               return;
  //           }
  //       }
  //     }
      
  //     setTimeout(() => {
  //         showSuccessMessage() // show success message
  //         setIsUploading(false);
  //         setChooseNewProjectName("");
  //         setChosenProjectName("");
  //         setFiles([]);
  //     }, 500);
  // };

  // // Method to show success-message
  // const showSuccessMessage = () => {
  //   Swal.fire({
  //       title: "FileTransfer!",
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


  // const canceledUpload = () => {
  //   window.api.cancelTus()
  //   canceledTusUploadRef.current = true;
  // }


  // // Listens for upload-canceled
  // useEffect(() => {
  //     const handleCancel = (event, { response }) => {
  //       console.log('response', response);
  //       if (response){
  //         canceledTusUploadRef.current = true;
  //       }
  //     };
  //     window.api.on("upload-canceled", handleCancel);
  //     return () => {
  //       window.api.removeAllListeners("upload-canceled", handleCancel);
  //     };
  // }, []);


  // // Listens for upload-canceled
  // useEffect(() => {
  //   const handleCancel = (event, { response }) => {
  //     console.log('response', response);
  //     if (response){
  //       console.log('response', response);
  //     }
  //   };
  //   window.api.on("upload-canceled", handleCancel);
  //   return () => {
  //     window.api.removeAllListeners("upload-canceled", handleCancel);
  //   };
  // }, []);


  // Method for when selecting project in list
  const handleProjectChange = (selectedOption) => {
    console.log('selectedOption', selectedOption);
    if (selectedOption) {
      setChosenProjectName(selectedOption.label);
      setChosenProjectUuid(selectedOption.value);
      // setChosenProjectLang(selectedOption.lang);
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
      borderColor: isFocused ? "#858585" : "#ccc", 
      boxShadow: isFocused ? "0 0 0 0.2rem rgba(133, 133, 133, 0.1)" : "none",
      "&:hover": {
        borderColor: isFocused ? "#858585" : "#858585", 
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


            {!isUploading ? (
            <div>
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
                                  disabled={isUploading}
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
             ) : (
              <h6 style={{ color: "black" }}><em>Upload in progress... <FontAwesomeIcon className="fileuploadspinner" icon={faSpinner} /></em></h6>
            )}
          </div>
         

          <Sidemenu_filetransfer />
          {/* {isUploading && (
            <Loadingbar_filetransfer files={files} uploadProgress={uploadProgress} uploadPercentage={uploadPercentage} uploadFile={uploadFile} finishedUploading={finishedUploading} canceledUpload={canceledUpload} />
          )} */}

        </div>
        
      )}

    </div>
  );
}
export default Home_filetransfer;
