
import { HashRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);


//importing pages and components
//Home
import Index from "./pages/index";
import Settings from "./pages/settings";
import Account from "./pages/account";
import Knowledgebase from "./pages/knowledgebase"
import Faq from "./pages/faq";
import Login_window from "./pages/login_window";
import UpdateApplication_window from "./pages/updateApplication_window";
import Register_window from "./pages/register_window";
//Workspace
import Home_teamleader from "./pages/teamleader/home_teamleader";
import Prevwork_teamleader from "./pages/teamleader/prevwork_teamleader";
import Currwork_teamleader from "./pages/teamleader/currwork_teamleader";
import Newproject_teamleader from "./pages/teamleader/newproject_teamleader";
import Portal_teamleader from "./pages/teamleader/portal_teamleader";
import Addleaderinfo_teamleader from "./pages/teamleader/addleaderinfo_teamleader";
import Newteam_teamleader from "./pages/teamleader/newteam_teamleader";
import Calendarsale_teamleader from "./pages/teamleader/calendarsale_teamleader";
import Yescalendarsale_teamleader from "./pages/teamleader/yescalendarsale_teamleader";
//Filetransfer
import Home_filetransfer from "./pages/filetransfer/home_filetransfer";
import History_filetransfer from "./pages/filetransfer/history_filetransfer";
//Backuptransfer
import Home_backuptransfer from "./pages/backuptransfer/home_backuptransfer";
import History_backuptransfer from "./pages/backuptransfer/history_backuptransfer";
//Timereport
import Home_timereport from "./pages/timereport/home_timereport";

import Loadingbar_backuptransfer from "./components/backuptransfer/loadingbar_backuptransfer";
import Loadingbar_filetransfer from "./components/filetransfer/loadingbar_filetransfer";

//importing css styles
import "./App.css";
import './assets/css/global.css';
import './assets/css/main.css';
import './assets/css/components.css';
import './assets/css/buttons.css';
import './assets/css/sidemenu.css';
import './assets/css/sidemenu_small.css';
import './assets/css/teamleader/buttons_teamleader.css';


function App() {
      const [files, setFiles] = useState([]);
      // const [uploadProgress, setUploadProgress] = useState({});
      const [uploadPercentage, setUploadPercentage] = useState(0);
      const [finishedUploading, setFinishedUploading] = useState(false);
      const [chosenProjectName, setChosenProjectName] = useState("");
      const [chosenProjectUuid, setChosenProjectUuid] = useState("");
      const [uploadFile, setUploadFile] = useState("");
      const [isUploading, setIsUploading] = useState(false);

      const [chosenProject_id, setChosenProject_id] = useState("");
      const [programName, setProgramName] = useState("");

      const [showBTSuccess, setShowBTSuccess] = useState(false);
      const [showFTSuccess, setShowFTSuccess] = useState(false);
      const canceledTusUploadRef = useRef(false);



      // Start upload triggered form child
      const startUpload = (type) => {
        console.log('type', type);
        if (type === "backuptransfer") {
          if (isUploading) {
            console.log('Uploading already in progress in filetransfer')
            return;
          } 
            setProgramName("BackupTransfer")
            handleSubmitBackupTransfer(type)
        } else if (type === "filetransfer"){
          if (isUploading) {
            console.log('Uploading already in progress in backuptransfer')
            return;
          }
          setProgramName("FileTransfer")
          handleSubmitFileTransfer(type)
        }
      };


      // ------------ BACKUPTRANSFER UPLOAD FILE METHOD ------------

      // METHOD to sumbit BACKUPTRANSFER
      const handleSubmitBackupTransfer = async (type) => {
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        setIsUploading(true);
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
            Swal.fire({
                title: "BackupTransfer - Error",
                text: `Error creating project data in local database: ${error}`,
                icon: "error",
                confirmButtonText: "Close",
            });
            setIsUploading(false);
            setShowBTSuccess(true)
            return;
        }
        //Upload files to tus.io-server
        let fileCount = 0;
        for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setUploadFile(file.name);
                const fileData = {
                    bt_project_id: bt_project_id,
                    project_uuid: chosenProjectUuid,
                    filename: file.name,
                    file_size: file.size,
                    file_path: file.path
                }
                console.log('fileData', fileData);
                try {
                    const response = await window.api.uploadFileToTus(file.path, file.name, chosenProjectUuid, token, type);
                    console.log("Upload response TUS:", response);
                    if (response.status === "success") {
                        setFinishedUploading(response);
                        //Update bt_files table  (with is_sent = 1)
                        try {
                            const responseFile = await window.api.createNewBTFile(fileData)
                            console.log('responseFile (createNewBTFile)', responseFile);
                            fileCount++;
                        } catch (error) {
                            console.log('failed when creating file in bt_files', error); 
                            Swal.fire({
                                title: "BackupTransfer - Error",
                                text: `Error creating file data in local database: ${error}`,
                                icon: "error",
                                confirmButtonText: "Close",
                            });
                            setIsUploading(false);
                            setShowBTSuccess(true)
                            return;
                        }
                    } else {
                        console.log('Failed to upload file to tus (uploadFileToTus)');
                    } 
                } catch (error) {
                    console.error("Error uploading file:", error);
                    if (canceledTusUploadRef.current) {
                        Swal.fire({
                            title: "Upload cancelled",
                            text: "The upload was cancelled.",
                            icon: "info",
                            confirmButtonText: "Close",
                        });
                        canceledTusUploadRef.current = false;
                        setIsUploading(false);
                        setShowBTSuccess(true)
                        const user_id = localStorage.getItem("user_id");
                        if (fileCount === 0) {
                            try {
                                const responseDelete = await window.api.deleteBTProject(bt_project_id, user_id);
                                console.log('responseDelete:', responseDelete);
                            } catch (error) {
                                console.error("Failed to set to deleted:", error);
                            }
                        }    
                        return;
                    } else {
                        //Update bt_files  (with is_sent = 0)
                        try {
                            const responseFile = await window.api.createNewFailedBTFile(fileData);
                            console.log('responseFile (createNewFailedBTFile):', responseFile);
                        } catch (error) {
                            console.error("Failed to mark file as failed in bt_files:", error);
                        }
                        Swal.fire({
                            title: "BackupTransfer - Upload Error",
                            text: `Error uploading ${file.name}: ${error.message}`,
                            icon: "error",
                            confirmButtonText: "Close",
                        });
                        setIsUploading(false);
                        setFiles([]);
                        setUploadFile("")
                        setChosenProjectName("")
                        setChosenProjectUuid("")
                        setShowBTSuccess(true)
                        return;
                    }
                }
        }

        setShowBTSuccess(true)
        setTimeout(() => {
            showSuccessMessage("Backuptransfer") // show success message
            setIsUploading(false);
            setFinishedUploading(false)
            setFiles([]);
            setChosenProjectName("")
            setChosenProjectUuid("")
            setUploadFile("")
        }, 500);
      };



      // ------------ FILETRANSFER UPLOAD FILE METHOD ------------


        
    // // METHOD to sumbit
    const handleSubmitFileTransfer = async (type) => {
        console.log('type', type);
        const token = localStorage.getItem("token");
        let user_id = localStorage.getItem("user_id");
        setIsUploading(true);
        const projectData = {
          project_uuid: chosenProjectUuid,
          projectname: chosenProjectName,
          user_id: user_id,
          project_id: chosenProject_id
        }
        console.log("projectData: ", projectData);
        let ft_project_id;
        try{
            let FT_response = await window.api.createNewFTProject(projectData); 
            console.log("FT response:", FT_response);
            if (FT_response.status !== 200) {
              MySwal.fire({
                title: 'FileTransfer - Error',
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
              setShowFTSuccess(true) // just message child
              return;
            } else {
              ft_project_id = FT_response.ft_project_id;
            }
        } catch (error){
            console.log("error creating FT project", error);
            Swal.fire({
              title: "FileTransfer - Error",
              text: `Error creating project data in local database: ${error}`,
              icon: "error",
              confirmButtonText: "Close",
          });
          setIsUploading(false);
          setShowFTSuccess(true) // just message child
          return;
        }

        let fileCount = 0;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setUploadFile(file.name);
          const fileData = {
            filename: file.name,
            filepath: file.path,
            ft_project_id: ft_project_id
          }
          console.log('fileData', fileData);
          try {
            const response = await window.api.uploadFileToTus(file.path, file.name, chosenProjectUuid, token, type);
            console.log("Upload response TUS:", response);
              if (response.status === "success") {
                  console.log(fileData);
                  try{
                    let FTfile_response = await window.api.addFTFile(fileData);
                    console.log("FT file response:", FTfile_response);
                    if (FTfile_response.status === 201){
                      console.log('addFTFile completed', FTfile_response.filename);
                      setFinishedUploading(FTfile_response);
                      fileCount++;
                    }
                  } catch (error){
                      console.log('failed when creating file in ft_files', error); 
                      Swal.fire({
                          title: "FileTransfer - Error",
                          text: `Error creating file data in local database: ${error}`,
                          icon: "error",
                          confirmButtonText: "Close",
                      });
                      setIsUploading(false);
                      setShowFTSuccess(true) // just message child
                      return;
                  }
            } else {
              console.log('Failed to upload file to tus (uploadFileToTus)');
            } 
          } catch (error) {
              console.error("Error uploading file:", error);
              if (canceledTusUploadRef.current) {
                  Swal.fire({
                      title: "Upload cancelled",
                      text: "The upload was cancelled.",
                      icon: "info",
                      confirmButtonText: "Close",
                  });
                  canceledTusUploadRef.current = false;
                  setIsUploading(false);
                  setShowFTSuccess(true) // just message child
                  const user_id = localStorage.getItem("user_id");
                  if (fileCount === 0) {
                      try {
                          const responseDelete = await window.api.deleteFTProject(ft_project_id, user_id); 
                          console.log('responseDelete:', responseDelete);
                      } catch (error) {
                          console.error("Failed to set to deleted:", error);
                      }
                  }    
                  return;
                } else {
                  //Update ft_files  (with is_sent = 0)
                  try {
                      const responseFile = await window.api.createNewFailedFTFile(fileData); 
                      console.log('responseFile (createNewFailedBTFile):', responseFile);
                  } catch (error) {
                      console.error("Failed to mark file as failed in bt_files:", error);
                  }
                  Swal.fire({
                      title: "FileTransfer - Upload Error",
                      text: `Error uploading ${file.name}: ${error.message}`,
                      icon: "error",
                      confirmButtonText: "Close",
                  });
                  setIsUploading(false);
                  setFiles([]);
                  setUploadFile("")
                  setChosenProjectName("")
                  setChosenProjectUuid("")
                  setShowFTSuccess(true) // just message child
                  return;
              }
          }
        }
        setShowFTSuccess(true)
        setTimeout(() => {
            showSuccessMessage("Filetransfer") // show success message
            setIsUploading(false);
            setFinishedUploading(false)
            setFiles([]);
            setChosenProjectName("")
            setChosenProjectUuid("")
            setUploadFile("")
            setChosenProject_id("")
        }, 500);
    };




      // ------------ OTHER METHODS ------------

      // Method to show success-message
      const showSuccessMessage = (title) => {
        Swal.fire({
            title: title,
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
      }

      // When clicking "cancel upload"-button
      const canceledUpload = () => {
          setFinishedUploading(false)
          setUploadFile("")
          window.api.cancelTus() 
      }

      // Listens for upload-canceled
      useEffect(() => {
        const handleCancel = (event, { response }) => {
          console.log('response', response);
          if (response){
            canceledTusUploadRef.current = true;
          }
        };
        window.api.on("upload-canceled", handleCancel);
        return () => {
          window.api.removeAllListeners("upload-canceled", handleCancel);
        };
      }, []);

      // callback from main-proccess to track upload progress while uploading files
      useEffect(() => {
        const handleUploadProgress = (event, { fileName, eventData }) => {
          const progress = parseInt(eventData, 10);  
          console.log(`Progress: ${progress}%`);
          setUploadPercentage(progress);
          if (progress === 100) {
            console.log(`DONE! - ${fileName}: upload complete.`);
          }
        };
        window.api.on("upload-tus-progress", handleUploadProgress);
        return () => {
          window.api.removeAllListeners("upload-tus-progress", handleUploadProgress);
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






    return (
      <HashRouter >

        {/* FOTOGRAFPORTALEN */}
        <div className="main-content">
          <div className="content">

            {isUploading && programName === "BackupTransfer" && (
              <Loadingbar_backuptransfer 
                files={files} 
                uploadPercentage={uploadPercentage}
                startUpload={startUpload} 
                finishedUploading={finishedUploading} 
                canceledUpload={canceledUpload}
                uploadFile={uploadFile}
                programName={programName}
              />
            )}
            {isUploading && programName === "FileTransfer" && (
              <Loadingbar_filetransfer 
                files={files} 
                uploadPercentage={uploadPercentage}
                startUpload={startUpload} 
                finishedUploading={finishedUploading} 
                canceledUpload={canceledUpload}
                uploadFile={uploadFile}
                programName={programName}
              />
            )}

            <div className="">
              <Routes><Route path="/" element={<Index />} /> </Routes>
            </div>
            <div className="">
              <Routes><Route path="/settings" element={<Settings />} /></Routes>
            </div>
            <div className="">
              <Routes><Route path="/account" element={<Account />} /></Routes>
            </div>
            <div className="">
              <Routes><Route path="/knowledgebase" element={<Knowledgebase />} /></Routes>
            </div>
            <div className="">
              <Routes><Route path="/faq" element={<Faq />} /></Routes>
            </div>
          </div>
        </div>

        <div className="">
          <Routes><Route path="/updateapplication_window" element={<UpdateApplication_window />} /></Routes>
        </div>
        <div className="">
          <Routes><Route path="/login_window" element={<Login_window />} /></Routes>
        </div>
        <div className="">
          <Routes><Route path="/register_window" element={<Register_window />} /></Routes>
        </div>


        {/* TEAMELADER */}
        {/* .main-content for margin/padding left to make room for sidebar */}
        <div className="main-content">
          <div className="content">
            <div className="route-layout">
              <Routes> <Route path="/home_teamleader" element={<Home_teamleader />} /></Routes>
            </div>
            <div className="route-layout">
              <Routes><Route path="/prevwork_teamleader" element={<Prevwork_teamleader />} /></Routes>
            </div>
            <div className="route-layout">
              <Routes><Route path="/currwork_teamleader" element={<Currwork_teamleader />} /> </Routes>
            </div>
            <div className="route-layout">
              <Routes><Route path="/newproject_teamleader" element={<Newproject_teamleader />} /></Routes>
            </div>
            <div className="route-layout">
              <Routes><Route path="/portal_teamleader/:project_id" element={<Portal_teamleader />} /></Routes>
            </div>
            <div className="route-layout">
              <Routes><Route path="/addleaderinfo_teamleader" element={<Addleaderinfo_teamleader />} /></Routes>
            </div>
            <div className="route-layout">
              <Routes><Route path="/newteam_teamleader" element={<Newteam_teamleader />} /></Routes>
            </div>
            <div className="route-layout">
              <Routes><Route path="/calendarsale_teamleader" element={<Calendarsale_teamleader />} /></Routes>
            </div>
            <div className="route-layout">
              <Routes><Route path="/yescalendarsale_teamleader" element={<Yescalendarsale_teamleader />} /></Routes>
            </div>
          </div>
        </div>

        {/* FILETRANSFER */}
          {/* .main-content for margin/padding left to make room for sidebar */}
          <div className="main-content">
            <div className="content">

              <div className="route-layout">
                <Routes> <Route path="/home_filetransfer" element={<Home_filetransfer
                   startUpload={startUpload} 
                   chosenProjectName={chosenProjectName}
                   chosenProjectUuid={chosenProjectUuid}
                   setChosenProjectName={setChosenProjectName}
                   setChosenProjectUuid={setChosenProjectUuid}
                   files={files} 
                   setFiles={setFiles}
                   setUploadFile={setUploadFile}
                   uploadFile={uploadFile}
                   showFTSuccess={showFTSuccess}
                   chosenProject_id={chosenProject_id}
                   setChosenProject_id={setChosenProject_id}
                   isUploading={isUploading}
                />} /></Routes>
              </div>

              <div className="route-layout">
                <Routes> <Route path="/history_filetransfer" element={<History_filetransfer />} /></Routes>
              </div>

            </div>
          </div>

          {/* BACKUPTRANSFER */}
          {/* .main-content for margin/padding left to make room for sidebar */}
          <div className="main-content">
            <div className="content">

              <div className="route-layout">
                <Routes> <Route path="/home_backuptransfer" element={<Home_backuptransfer 
                  startUpload={startUpload} 
                  chosenProjectName={chosenProjectName}
                  chosenProjectUuid={chosenProjectUuid}
                  setChosenProjectName={setChosenProjectName}
                  setChosenProjectUuid={setChosenProjectUuid}
                  files={files} 
                  setFiles={setFiles}
                  setUploadFile={setUploadFile}
                  uploadFile={uploadFile}
                  showBTSuccess={showBTSuccess}
                  isUploading={isUploading}
                />} /></Routes>
              </div>

              <div className="route-layout">
                <Routes> <Route path="/history_backuptransfer" element={<History_backuptransfer />} /></Routes>
              </div>

            </div>
          </div>


        {/* TIME REPORT */}
          {/* .main-content for margin/padding left to make room for sidebar */}
          <div className="main-content">
            <div className="content">

              <div className="route-layout">
                <Routes> <Route path="/home_timereport" element={<Home_timereport />} /></Routes>
              </div>

            </div>
          </div>

      </HashRouter >
    );
}

export default App;
