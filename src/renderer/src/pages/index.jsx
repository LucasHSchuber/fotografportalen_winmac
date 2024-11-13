import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profile from "../assets/images/photographer.png";
import semver from "semver";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";

import Sidemenu from "../components/sidemenu";
import Sidemenu_small from "../components/sidemenu_small";

import {
  gdprProtectionMethod,
  gdprProtectionMethod_teamshistory,
} from "../assets/js/gdprProtection";
import fetchNews from "../assets/js/fetchNews";
import env from "../assets/js/env";
import DOMPurify from "dompurify";

function Index() {
  //define states
  const [user, setUser] = useState({});
  const [homeDir, setHomeDir] = useState("");
  const [projectsArray, setProjectsArray] = useState([]);
  const [unsentNewsArray, setUnsentNewsArray] = useState([]);

  const [githubURL, setGithubURL] = useState("");
  const [currentVersion, setCurrentVersion] = useState("");
  const [latestVersion, setLatestVersion] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [normalizedLatestVersion, setNormalizedLatestVersion] = useState("");

  const [allNews, setAllNews] = useState([]);

  const [loading, setLoading] = useState(false);


  // ---------- CHECK FOR UPDATES AND UPDATES METHODS ---------- 

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
        console.log('response', response);
        // Extract realase notes
        const releaseNotes = response.data[0].body;
        console.log(releaseNotes);
        setReleaseNotes(releaseNotes);
        // Extract the latest release version
        const latestReleaseVersion = response.data[0].tag_name;
        console.log("Latest release version:", latestReleaseVersion);
        setLatestVersion(latestReleaseVersion);
        const normalizedLatestReleaseVersion = latestVersion.startsWith("v")
          ? latestVersion.slice(1)
          : latestVersion;
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
    // finding users platform
    let platform;
    try {
      platform = await window.api.getPlatform();
      console.log('platform', platform);
    } catch (error) {
      console.error('Error fetching platform:', error);
      showErrorModal('Failed to fetch platform information.');
      return;
    }
    let fileExtension;
    if (platform === 'win32') {
      fileExtension = '.exe';
    } else if (platform === 'darwin') {
      fileExtension = '.dmg';
    } else {
      console.error("Unsupported platform - unable to find installation file");
      showErrorModal('Unsupported platform.');
      return;
    }
    // finding the correct installation file with correct extension
    try {
      const githubResponse = await axios.get(githubURL);
      const latestRelease = githubResponse.data;
      const downloadUrl = latestRelease.assets.find((asset) =>
        asset.name.endsWith(fileExtension),
      )?.browser_download_url;

      if (!downloadUrl) {
        throw new Error(`No ${fileExtension} file found in the latest release`);
      }
      console.log(downloadUrl);
      console.log("Update available, preparing to download from url", downloadUrl);
      // propting user, and starting update
      const userConfirmed = await promptUserToCloseApp();
      if (userConfirmed) {
        if (!navigator.onLine) {
            console.log("No internet access");
            showErrorModal('No internet connection! Please connect to internet and try again.');
            return;
        }
        setLoading(true);
        console.log("User confirmed, proceeding with update...");
        try {
          localStorage.setItem("pendingUpdateUrl", downloadUrl);
          await window.api.applyUpdates(downloadUrl);
          console.log("Update applied successfully.");
        } catch (error) {
          console.error("Error applying update:", error);
          showErrorModal('Failed to apply the update.');
        } finally {
          setLoading(false); 
        }
      } else {
        console.log("User canceled the update.");
      }
    } catch (error) {
      console.error("Download error:", error);
      showErrorModal('Failed to download the update.');

    }
  };

  const promptUserToCloseApp = async () => {
    const result = await MySwal.fire({
      title: 'Update Available',
      text: "The Application is about to start downloading the new installation file to your desktop. Once it's finished, the application will automatically quit. The download might take a few minutes. Do you wish to continue?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, start download',
      cancelButtonText: 'No, cancel',
      customClass: {
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button' 
      },
      didOpen: () => {
        // Style the title
        const title = document.querySelector('.swal2-title');
        if (title) {
          title.style.fontSize = '1.2em';  
        }
        // Style the content text
        const content = document.querySelector('.swal2-html-container');
        if (content) {
          content.style.fontSize = '0.85em';  
        }
      }
    });
    return result.isConfirmed;
  };



  // ---------- NEWS METHODS ---------- 

  //fetch all news from company database
  const fetchAllNews = async () => {
    const allNews = await fetchNews();
    console.log("allnews", allNews);

    if (allNews !== null){
      try {
        const newsFromTable = await window.api.get_news();
        console.log("News from table:", newsFromTable);
        const sortedNews = newsFromTable.news.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        console.log('sortedNews', sortedNews);
        setAllNews(sortedNews);
      } catch (error) {
        console.log("Error fetching news from table:", error);
      }
    }
  };
  useEffect(() => {
    fetchAllNews();
  }, []);
  

  //scanning news table for unsent news and then sending to db
  const scanNewsTable = async () => {
    // Check for internet connection
    if (navigator.onLine) {
      let responseAllUnsentNews;
      try {
        responseAllUnsentNews = await window.api.getAllUnsentNews();
        console.log("All unsent news:", responseAllUnsentNews.allUnsentNews);

        const unsentIdArray = responseAllUnsentNews.allUnsentNews.map(
          (news) => news.id,
        );
        console.log(unsentIdArray);

        if (unsentIdArray.length > 0) {
          const token = localStorage.getItem("token");
          for (const news_id of unsentIdArray) {
            console.log(news_id);
            try {
              const responseDb = await axios.post(
                "https://backend.expressbild.org/index.php/rest/photographer_portal/newsread",
                { id: news_id },
                {
                  headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              );

              console.log("ResponseDb for news_id", news_id, ":", responseDb);

              if (responseDb.status === 200) {
                console.log(
                  "Successfully sent news_id to the backend:",
                  news_id,
                );
                try {
                  const responseNewsDate =
                    await window.api.addSentDateToNews(news_id);
                  console.log(
                    "is_sent_date added to NEWS table for news_id:",
                    news_id,
                    responseNewsDate,
                  );
                } catch (error) {
                  console.log(
                    "Error adding is_sent_date in NEWS table for news_id:",
                    news_id,
                    error,
                  );
                }
              } else {
                console.log(
                  "Error sending news_id to the company database:",
                  news_id,
                );
              }
            } catch (error) {
              console.log(
                "Could not send news_id to company database:",
                news_id,
                error,
              );
            }
          }
        } else {
          console.log("No unsent news to process.");
        }
      } catch (error) {
        console.log("Error getting all news from news table", error);
      }
    } else {
      console.log("No internet connection. Unable to scan news table");
    }
  };
  useEffect(() => {
    scanNewsTable();
  }, []);

  //confirming news and updating news table
  const confirmNews = async (news_id) => {
    console.log("Confirm news!", news_id);
    let token = localStorage.getItem("token");
    try {
      const responseSqlite = await window.api.confirmNewsToSqlite(news_id);
      console.log("confirm news successfully updated", responseSqlite);

      if (responseSqlite.success !== true) {
        console.log('error confirming news to sqlite table');
        return;
      }else {  
      // Check for internet connection
        if (navigator.onLine) {
          console.log("Sending news id to db:", news_id);
          try {
            const responseDb = await axios.post(
              "https://backend.expressbild.org/index.php/rest/photographer_portal/newsread",
              { id: news_id },
              {
                headers: {
                  Authorization: `Token ${token}`,
                  "Content-Type": "application/json",
                },
              },
            );
            console.log("ResponseDb:", responseDb);

            // Check if the response status is 200
            if (responseDb.status === 200) {
              console.log(
                "Trigger method to update is_sent_date timestamp column in table NEWS",
              );
              try {
                const responseNewsDate = await window.api.addSentDateToNews(news_id);
                console.log("is_sent_date added to NEWS table", responseNewsDate);
              } catch (error) {
                console.log("Error adding is_sent_date in NEWS table", error);
              }
            }
          } catch (error) {
            console.log("error when sending news id to company database");
            console.log("error:", error);
          }
        }

        setTimeout(() => {
          fetchAllNews();  
        }, 1000);
        
      }
    } catch (error) {
      console.log("error updatating news", error);
    }
  };



  // ----------- GET ALL CURRENT PROJECTS BY USER -----------

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



    // ----------- FETCH USER DATA -----------

    // fetch user data
    const fetchUser = async () => {
      try {
        const usersData = await window.api.getUser(user_id); 
        console.log("Users Data:", usersData);
        setUser(usersData.user);
        console.log(usersData.user);
        localStorage.setItem(
          "user_name",
          usersData.user.firstname + " " + usersData.user.lastname,
        );
        localStorage.setItem("user_lang", usersData.user.lang);
        localStorage.setItem("token", usersData.user.token);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };



    // ----------- GDPR -----------

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

      try {
        const response = await gdprProtectionMethod_teamshistory();
        console.log("GDPR response:", response);

        if (response && response.statusCode === 1) {
          console.log("GDPR data cleared successfully in teams_history");
        } else {
          console.error(
            "Error clearing GDPR data in teams_history:",
            response?.errorMessage || "Unknown error",
          );
        }
      } catch (error) {
        console.error("Error clearing GDPR data in teams_history:", error);
      }
    };
    fetchUser();
    getAllProjects();
    runGdprProtection();
  }, []);
  console.log(
    `Comparing versions, Current: ${currentVersion}, Latest: ${latestVersion}`,
  );

  
  // SweetAlert2 error modal
  const showErrorModal = (errorMessage) => {
      MySwal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Close',
      });
  };




  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ textAlign: "center", marginTop: "1em" }}>Downloading update. It might take a few minutes. <br></br> Please wait...</p>
      </div>
    );
  }
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

        {/* <div className="index-box">
          <h1 className="index-title one">Messages</h1>
          <h6>
            <b>You have 1 new message</b>
          </h6>
          <p>
            Hello Lucas, can you work 6/6 between 8:00-13:00 in Bromma?{" "}
            <br></br> <em>Recieved: 10/5/2024</em>
          </p>
        </div> */}

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
        {latestVersion &&
        currentVersion &&
        semver.gt(latestVersion, currentVersion) ? (
          <div className="index-box">
            <h1 className="index-title three">News & updates</h1>
            <h6>
              <b>New updates for Photographer Portal</b>
            </h6>
            <p>
              Current Version: <b>v{currentVersion}</b> - Latest Version:{" "}
              <b>{latestVersion}</b>
            </p>
            {releaseNotes && (
            <div style={{ marginBottom: "2em" }}>
              <h6 style={{fontSize: "1em", fontWeight: "600"}} >Release notes:</h6>
              <p>{releaseNotes}</p>
            </div>
            )}
            {/* <p style={{ marginTop: "-1em" }}>
              Get the latest updates from the button below
            </p> */}
            {/* <p style={{ marginTop: "-1em" }}>
              Download version 'Photographer Portal v
              {latestVersion}' here:
            </p> */}
            <button className="button normal" onClick={downloadLatestVersion}>
              Download {latestVersion}
            </button>
          </div>
        ) : (
          <>
            <div className="index-box">
              <h1 className="index-title three">News & updates</h1>
              <h6>
                <b>You're running the application on the latest version - v{currentVersion}</b>
              </h6>
              <p>There are no current updates</p>
            </div>
          </>
        )}

        <hr style={{ width: "80%" }} className="hr"></hr>

        <div className="index-box">
          {allNews &&
            allNews.map((news) => (
              <div key={news.id} className="mb-4">
                <div className="d-flex">
                  <h6>
                    <b>{news.title}</b>
                  </h6>
                  {news.is_read === 1 && news.is_sent_date === null ? (
                    <h6 className="ml-2 confirmed-box" style={{ color: "green" }}>
                      <span style={{ fontSize: "0.75em" }}>Confirmed</span>
                      <FontAwesomeIcon icon={faCheck} title="Confirmed" style={{ fontSize: "0.75em" }} className="ml-1"/>
                    </h6>
                  ) : news.is_read === 1 && news.is_sent_date !== null ? (
                    <h6 className="ml-2 confirmed-box" style={{ color: "green" }}>
                      <span style={{ fontSize: "0.75em" }}>Confirmed & sent</span>
                      <FontAwesomeIcon icon={faCheckDouble} title="Confirmed & sent" style={{ fontSize: "0.75em" }} className="ml-1"/>
                    </h6>
                  ) : null}
                </div>
                <div className="mb-2" style={{ marginTop: "-0.5em", fontSize: "0.85em" }}>
                  {news && !news.updated_at ? (
                    <em>
                      Posted: {news?.created_at ? news.created_at.substring(0, 10) : "N/A"}, at:{" "}
                      {news?.created_at ? news.created_at.substring(11, 16) : "N/A"}
                    </em>
                  ) : (
                    <div>
                      <em>
                        Posted: {news?.created_at ? news.created_at.substring(0, 10) : "N/A"}, at:{" "}
                        {news?.created_at ? news.created_at.substring(11, 16) : "N/A"}
                        &nbsp;
                        (Updated: {news?.updated_at ? news.updated_at.substring(0, 10) : "N/A"}, at:{" "}
                        {news?.updated_at ? news.updated_at.substring(11, 16) : "N/A"})
                      </em>
                    </div>
                  )}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(news.content),
                  }}
                ></div>

                {news.is_read === 0 ? (
                  <>
                    <button
                      className="mt-1 confirm-news-button"
                      title="Confirm news article to office"
                      onClick={() => confirmNews(news.id)}
                    >
                      Roger that!
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))}
        </div>
      </div>

      <Sidemenu />
      <Sidemenu_small />
    </div>
  );
}
export default Index;
