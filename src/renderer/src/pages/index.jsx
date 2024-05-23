import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profile from "../assets/images/photographer.png";
import semver from 'semver';

import Sidemenu from "../components/sidemenu";
import Sidemenu_small from "../components/sidemenu_small";
// import LoginModal from "../components/loginModal";

import gdprProtectionMethod from "../assets/js/gdprProtection";

import env from "../assets/js/env";

// import { response } from "express";

function Index() {
  //define states
  const [user, setUser] = useState({});
  const [homeDir, setHomeDir] = useState("");
  const [projectsArray, setProjectsArray] = useState([]);
  // const [showLoginModal, setShowLoginModal] = useState(false);
  const [githubURL, setGithubURL] = useState("");
  const [currentVersion, setCurrentVersion] = useState("");
  const [latestVersion, setLatestVersion] = useState("");
  const [normalizedLatestVersion, setNormalizedLatestVersion] = useState("");

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };
  const navigate = useNavigate();

  // check if there is a new APP-release
  useEffect(() => {
    let env_file = env;
    let github_url = env_file.githubUrl;
    const githubToken = env_file.githubToken;
    console.log("api object:", window.api);
    console.log("env file:", env_file);
    console.log("github token:", githubToken);
    console.log("github url:", github_url);
    setGithubURL(github_url + "/latest");

    const checkForUpdates = async () => {
      // getting latest app-verson
      try {
        const response = await axios.get(github_url, {
          headers: {
            Authorization: `token ${githubToken}`,
          },
        });
        // Extract the latest release version
        const latestReleaseVersion = response.data[0].tag_name;
        console.log("Latest release version:", latestReleaseVersion);
        setLatestVersion(latestReleaseVersion);
        const normalizedLatestReleaseVersion = latestVersion.startsWith('v') ? latestVersion.slice(1) : latestVersion;
        setNormalizedLatestVersion(normalizedLatestReleaseVersion);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }

      // getting latest current app-version
      try {
        const currentVersion = await window.api.getCurrentAppVersion();
        console.log("Current app version", currentVersion);
        setCurrentVersion(currentVersion);
      } catch (error) {
        console.log("error fetching app:", error);
      }

      // gtting home dir
      try {
        const homedir = window.api.homeDir();
        console.log("homedir", homedir);
      } catch (error) {
        console.log("error fetching homedir:", error);
      }
    };
    checkForUpdates();
  }, []);

  //donwload latest version method
  const downloadLatestVersion = async () => {
    console.log("downloading latest version");
    try {
      const githubResponse = await axios.get(githubURL);
      const latestRelease = githubResponse.data;
      const downloadUrl = latestRelease.assets.find((asset) =>
        asset.name.endsWith(".dmg"),
      )?.browser_download_url;

      if (!downloadUrl) {
        throw new Error("No .dmg file found in the latest release");
      }
      console.log(downloadUrl);
      console.log("Update available, preparing to download...");
      const userConfirmed = await promptUserToCloseApp();
      if (userConfirmed) {
        console.log("User confirmed, proceeding with update...");
        localStorage.setItem("pendingUpdateUrl", downloadUrl);
        await window.api.applyUpdates(downloadUrl);
      } else {
        console.log("User canceled the update.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const promptUserToCloseApp = () => {
    return window.confirm(
      "The application will close to update. Make sure to save all your work. Do you want to continue?",
    );
  };

  //get all current projects with user_id
  useEffect(() => {
    let user_id = localStorage.getItem("user_id");
    const getAllProjects = async () => {
      try {
        const projects = await window.api.getAllCurrentProjects(user_id);
        console.log("Projects:", projects.projects);
        setProjectsArray(projects.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    // fetch user data
    const fetchUser = async () => {
      try {
        const usersData = await window.api.getUser(user_id); // Fetch users data from main process
        console.log("Users Data:", usersData); // Log the users data
        setUser(usersData.user);
        console.log(usersData.user);
        localStorage.setItem(
          "user_name",
          usersData.user.firstname + " " + usersData.user.lastname,
        );
        localStorage.setItem("user_lang", usersData.user.lang);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    //clear data - GDPR
    const runGdprProtection = async () => {
      try {
        const response = await gdprProtectionMethod();
        console.log("GDPR response:", response);

        if (response && response.statusCode === 1) {
          console.log("GDPR data cleared successfully");
        } else {
          console.error(
            "Error clearing GDPR data:",
            response?.errorMessage || "Unknown error",
          );
        }
      } catch (error) {
        console.error("Error clearing GDPR data:", error);
      }
    };

    fetchUser();
    getAllProjects();
    runGdprProtection();
  }, []);
  console.log(`Comparing versions, Current: ${currentVersion}, Latest: ${latestVersion}`);

  return (
    <div className="d-flex index-wrapper">
      <div className="index-box-left">
        <div className="index-box d-flex">
          <div className="avatar-container">
            <img
              className="profile-picture"
              src={profile}
              alt="profile picture"
            ></img>
          </div>
          <div className="mt-2 ml-2">
            <h5 style={{ fontWeight: "700", fontSize: "1.5em" }}>
              {user ? user.firstname : ""} {user ? user.lastname : ""}
            </h5>
            <h6 style={{ marginTop: "-0.25em" }}>
              <em>{user ? user.city : ""}</em>
            </h6>
          </div>
        </div>

        <div className="index-box">
          <h1 className="index-title one">Messages</h1>
          <h6>
            <b>You have 1 new message</b>
          </h6>
          <p>
            Hello Lucas, can you work 6/6 between 8:00-13:00 in Bromma?{" "}
            <br></br> <em>Recieved: 10/5/2024</em>
          </p>
          {/* <p>
            Hello Lucas, can you work 8/6 between 8:00-16:00 in Tullinge?{" "}
            <br></br> <em>Recieved: 14/5/2024</em>
          </p>
          <p>
            Hello Lucas, can you work 12/6 between 9:00-16:00 in Märsta?{" "}
            <br></br> <em>Recieved: 15/5/2024</em>
          </p>
          <p>
            Hello Lucas, can you work 16/6 between 9:00-16:00 in Solna?{" "}
            <br></br> <em>Recieved: 18/5/2024</em>
          </p> */}
        </div>

        <hr style={{ width: "75%" }} className="hr"></hr>

        {projectsArray && projectsArray.length > 0 && (
          <div className="index-box">
            <h1 className="index-title two">Alerts</h1>
            <h6>
              <b>
                You have{" "}
                {projectsArray && projectsArray.length > 0
                  ? projectsArray.length
                  : 0}{" "}
                unsent job{projectsArray.length > 1 ? "s" : ""}
              </b>
            </h6>
            <ul>
              {projectsArray && projectsArray.length > 0 ? (
                projectsArray.map((project) => (
                  <div key={project.project_id}>
                    <li>{project.projectname}</li>
                  </div>
                ))
              ) : (
                <h6> </h6>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="index-box-right">
        {/* {currentVersion !== latestVersion.substring(1, 6) ? ( */}
        {latestVersion && currentVersion && semver.gt(latestVersion, currentVersion) ? (
          <div className="index-box">
            <h1 className="index-title three">News & updates</h1>
            <h6>
              <b>New updates for Fotografportalen</b>
            </h6>
            <p>
              Current Version: <b>{currentVersion}</b> - Latest Version:{" "}
              <b>{latestVersion.substring(1, 6)}</b>
            </p>
            <p style={{ marginTop: "-1em" }}>
              Get the latest updates from the button below
            </p>
            <p style={{ marginTop: "-1em" }}>
              Download version 'Fotografportalen v
              {latestVersion.substring(1, 6)}' here:
            </p>
            <button className="button normal" onClick={downloadLatestVersion}>
              Download v{latestVersion.substring(1, 6)}
            </button>
          </div>
        ) : (
          <>
            <div className="index-box">
              <h1 className="index-title three">News & updates</h1>
              <h6>
                <b>You're running the application on the latest version</b>
              </h6>
              <p>You're running the application on the latest version</p>
            </div>
          </>
        )}

        <hr style={{ width: "80%" }} className="hr"></hr>

        <div className="index-box">
          <h6>
            <b>We welcome three new Swedish photographers</b>
          </h6>
          <p>
            We welcome three new Swedish photographers to our company. Marcus,
            Sofia & Jakob, it's great to have you on board!{" "}
          </p>
        </div>
      </div>

      <Sidemenu />
      <Sidemenu_small />
      {/* <LoginModal showLoginModal={showLoginModal} handleCloseLoginModal={handleCloseLoginModal} /> */}
    </div>
  );
}
export default Index;
