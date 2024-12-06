import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
import fp from "../assets/images/logo_white.png";



function UpdateApplication_window() {
  //define states
  const [message, setMessage] = useState("Checking for updates..");
  const [downloadProgress, setDownloadProgress] = useState("");
  console.log(window.api);



  useEffect(() => {
    const handleUpdateNotAvailable = (event, data) => {
        console.log("Message from main process (update-not-available):", data.message);
        setMessage(data.message);
        setTimeout(() => {
            window.api.createLoginWindow();
          }, 3000);
      };

    const handleUpdateAvailable = (event, data) => {
      console.log("Message from main process (update-available):", data.message);
      setMessage(data.message);
    };
  
    const handleDownloadProgress = (event, data) => {
      console.log("Message from main process (download-progress):", data.message);
      console.log(`Download Progress: ${data.progress}%`);
      setMessage(`${data.message}`);
      setDownloadProgress(`${data.progress.toFixed(2)}`);
    };
  
    const handleUpdateDownloaded = (event, data) => {
      console.log("Message from main process (update-downloaded):", data.message);
      setDownloadProgress("");
      setMessage(data.message);
    //   setTimeout(() => {
    //     window.api.createLoginWindow();
    //   }, 3000);
    };

    const handleUpdateError = (event, data) => {
        console.log("Error while checking for updates (update-error):", data.message);
        setMessage(data.message);
        setTimeout(() => {
          window.api.createLoginWindow();
        }, 3000);
      };
  
    // Add listeners for all events
    window.api.on("update-not-available", handleUpdateNotAvailable);
    window.api.on("update-available", handleUpdateAvailable);
    window.api.on("download-progress", handleDownloadProgress);
    window.api.on("update-downloaded", handleUpdateDownloaded);
    window.api.on("update-error", handleUpdateError);
  
    // Cleanup listeners on unmount
    return () => {
      window.api.removeAllListeners("update-not-available");
      window.api.removeAllListeners("update-available");
      window.api.removeAllListeners("download-progress");
      window.api.removeAllListeners("update-downloaded");
      window.api.removeAllListeners("update-error");

    };
  }, []);
  
  


  return (
    <div className="updateapplication_window-wrapper">
       <div className="updateapplicationspinning-logo-login">
          <img src={fp} alt="fotografportalen" />
          <p className="mt-3"><em>{message}</em></p>
          {downloadProgress && (
            <p className="mt-3"><em>{downloadProgress}%</em></p>
          )}
        </div>
    </div>
  );
}

export default UpdateApplication_window;
