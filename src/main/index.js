import { electronApp, optimizer, is } from "@electron-toolkit/utils";
// require('dotenv').config();
// const electron = require("electron");
const electron = require('electron');
const log = require("electron-log");
const path = require("path");
const fs = require("fs");
const fsa = require("fs/promises");
const util = require("util");
const sqlite3 = require("sqlite3").verbose();
const fse = require("fs-extra");
const axios = require('axios');
// const icon = path.join(__dirname, "../../resources/icon2.png");
const ipcMain = electron.ipcMain;
const app = electron.app;
const shell = electron.shell;
const dialog = electron.dialog;
const os = require("os");
const BrowserWindow = electron.BrowserWindow;
const isDev = require("electron-is-dev");
const { autoUpdater, AppUpdater } = require("electron-updater");
const { exec } = require("child_process");
const https = require("https");
const url = require("url");
const ftp = require("basic-ftp");
const bcrypt = require("bcrypt");
const saltRounds = 10;

import express from "express";

const ftpConfig = {
  host: "ftp.expressbild.org",
  Port: 21,
  user: "FileTransfer2",
  password: "J%sxdnNXT3YW",
  secure: false,
};

// Override isPackaged property to simulate a packaged environment - DO NOT USE IN PRODUCTION MODE
Object.defineProperty(app, "isPackaged", {
  get() {
    return true;
  },
});

if (isDev) {
  console.log("Running in development mode");
  // console.log('GitHub Token loaded:', process.env.GH_TOKEN ? 'Yes' : 'No');
} else {
  console.log("Running in production mode");
  // console.log('GitHub Token loaded:', process.env.GH_TOKEN ? 'Yes' : 'No');
}




// create instances of each window
let loginWindow;
let mainWindow;
let updateApplicationWindow;

// Method to create updatewindow
function createUpdateWindow(callback) {
  if (updateApplicationWindow) return;
  // Create the browser window.
  updateApplicationWindow = new BrowserWindow({
    // parent: mainWindow, // Set the parent window if needed
    // modal: true, // Example: Open as a modal window
    width: 360,
    height: 300,
    resizable: false,
    autoHideMenuBar: true,
    show: true,
    // backgroundColor: '#232323',
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      // nodeIntegration: false,
      // // webSecurity: false,
      // worldSafeExecuteJavaScript: true,
      // enableRemoteModule: false,
      // worldSafeExecuteJavaScript: true //good extra security measure to ensure that JavaScript code executes in a safe context.
    },
  });

  // Listen for when the DOM is ready
  // updateApplicationWindow.webContents.on("dom-ready", () => {
  //   autoUpdater.checkForUpdatesAndNotify()
  //     .then(() => console.log('Update check completed successfully.'))
  //     .catch((error) => console.error('Update check failed:', error));
  // });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    updateApplicationWindow.loadURL("http://localhost:5173/#/updateapplication_window");
  } else {
    updateApplicationWindow.loadURL(
      `file://${path.join(__dirname, "../renderer/index.html")}#/updateapplication_window`,
    );
  }

  updateApplicationWindow.on("ready-to-show", () => {
    updateApplicationWindow.show();
    callback?.();
  });

  updateApplicationWindow.on("closed", () => {
    updateApplicationWindow = null; 
  });

  if (isDev) {
    updateApplicationWindow.webContents.openDevTools({ mode: "detach" });
  }

  // updateApplicationWindow.webContents.setWindowOpenHandler((details) => {
  //   shell.openExternal(details.url);
  //   return { action: "deny" };
  // });
  // log.info(path.join(__dirname, "../preload/index.js"));
}



// --------- AUTO UPDATE METHODS --------

// Set autoDownload option to true to enable automatic downloading of updates
autoUpdater.autoDownload = false;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

import _env from "../renderer/src/assets/js/env"
console.log("_env", _env);
if (_env.production){
 // UPDATE SETFEEDURL WHEN IN PRODUCTION 
  autoUpdater.setFeedURL({
    provider: _env.provider,
    owner: _env.owner,
    repo: _env.repo
  });
} else {
  // SETFEEDURL WHEN TESTING UPDATES 
  autoUpdater.setFeedURL({
    provider: _env.provider,
    url: _env.url,
  });
}

app.on("ready", async () => {
  try {
    if (!is.dev) {
      const exApp = express();
      exApp.use(express.static(path.join(__dirname, "../renderer/")));
      exApp.listen(5173);
    }

    log.info("Ready!!");
    log.info("User Data Path:", app.getPath("userData"));
    // const programsFolder = path.join(os.homedir(), "Applications");
    // log.info("Programs folder:", programsFolder);
    log.info("Current App Version:", app.getVersion());

    if (!loginWindow && !updateApplicationWindow) {
    createUpdateWindow(() => {
      autoUpdater.checkForUpdates();
    });
  }  
  } catch (error) {
    log.error("Error in app initialization:", error); 
  }
});


autoUpdater.on("checking-for-update", () => {
  log.info("Checking for application updates...");
});

autoUpdater.on("update-available", (event, info) => {
  log.info("Update available:", info);
  setTimeout(() => {
    updateApplicationWindow.webContents.send("update-available", { message: "A new update was found" });
    setTimeout(() => {
      // starting the download
      autoUpdater.downloadUpdate(); 
    }, 500);
  }, 1500); 
});

autoUpdater.on("download-progress", (progress) => {
  log.info(`Download progress: ${progress.percent}%`);
  // if (updateApplicationWindow?.webContents) {
    updateApplicationWindow.webContents.send("download-progress", { message: "Downloading update...", progress: progress.percent });
  // }
});

autoUpdater.on("update-downloaded", (info) => {
  log.info("Update downloaded:", info);
  updateApplicationWindow.webContents.send("update-downloaded", { message: "Download completed! Preparing for restart." });
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 2500);
});

autoUpdater.on("error", (err) => {
  log.error("Error while checking for updates:", err);
  updateApplicationWindow.webContents.send("update-error", {
    message: `Update error: ${err.message || "Unknown error occurred"}`,
  });
});

autoUpdater.on("update-not-available", (event) => {
  log.info("No updates available");
  updateApplicationWindow.webContents.send("update-not-available", { message: "Starting..." });
});



// ------ Create Windows -------

//crate login window & close appilicationupdate window
function createLoginWindow() {
  if (loginWindow) return;
  try {
    // Create the loginWindow
    loginWindow = new BrowserWindow({
      width: 350,
      height: 460,
      resizable: false,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        sandbox: false,
        contextIsolation: true,
        // nodeIntegration: false,
        // // webSecurity: false,
        // worldSafeExecuteJavaScript: true,
        // enableRemoteModule: false,
        // worldSafeExecuteJavaScript: true //good extra security measure to ensure that JavaScript code executes in a safe context.
      },
    });
    // Open DevTools for the new window
    if (isDev) {
      loginWindow.webContents.openDevTools({ mode: "detach" });
    }
  
    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      loginWindow.loadURL("http://localhost:5173/#/login_window");
    } else {
      loginWindow.loadURL(
        `file://${path.join(__dirname, "../renderer/index.html")}#/login_window`,
      );
    }
    // Show the loginWindow when it's ready
    loginWindow.once("ready-to-show", () => {
      loginWindow.show();
    });

    loginWindow.on("closed", () => {
      loginWindow = null; 
    });

     // Listen for when the DOM is ready
     loginWindow.webContents.on("dom-ready", () => {
      updateApplicationWindow.close();
    });

    // Optionally return some data back to the renderer process
    return { success: true, message: "Login window created successfully" };
  } catch (error) {
    // Handle any errors that occur while creating the new window
    console.error("Error creating login window:", error);
    throw new Error("Failed to create login window");
  }
}

ipcMain.handle("createLoginWindow", async (event, args) => {
  // updateApplicationWindow.close();
  createLoginWindow()
});



//crate main window & close login window
ipcMain.handle("createMainWindow", async (event, args) => {
  loginWindow.close();

  if (mainWindow) return;

  try {
    // Create the MainWindow
    const mainWindow = new BrowserWindow({
      width: 1150,
      height: 750,
      minWidth: 820,
      minHeight: 550,
      show: false,
      autoHideMenuBar: true,
      // icon: iconPath,
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false,
        webSecurity: false,
        worldSafeExecuteJavaScript: true //good extra security measure to ensure that JavaScript code executes in a safe context.
      },
      // navigateOnDragDrop: true,
    });

    // Open DevTools for the new window
    if (isDev) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      mainWindow.loadURL("http://localhost:5173/");
    } else {
      mainWindow.loadURL(
        `file://${path.join(__dirname, "../renderer/index.html")}`,
      );
    }

    // // Listen for when the DOM is ready
    // mainWindow.webContents.on("dom-ready", () => {
    //   loginWindow.close();
    // });

    // Show the MainWindow when it's ready
    mainWindow.once("ready-to-show", () => {
      mainWindow.show();
    });

    mainWindow.on("closed", () => {
      mainWindow = null; 
    });

    // Optionally return some data back to the renderer process
    return { success: true, message: "Main window created successfully" };
  } catch (error) {
    // Handle any errors that occur while creating the new window
    console.error("Error creating main window:", error);
    throw new Error("Failed to create main window");
  }
});




// Restart application
ipcMain.handle("restartApplication", () => {
  app.relaunch();
  app.quit();
})


// ------ Manual update downlaod -------

// Send app version to front end
ipcMain.handle("getCurrentAppVersion", async (event) => {
  log.info("Getting current version to front end");
  const version = app.getVersion();
  // event.sender.send('app-version', version);
  return version;
});

// Apply updates handler
ipcMain.handle("applyUpdates", async (event, downloadUrl) => {
  try {
    console.log("Received update request with URL:", downloadUrl);
    const updateSuccessful = await applyUpdate(downloadUrl);
    if (updateSuccessful) {
      console.log("Update applied successfully.");
    } else {
      console.log("Update failed.");
    }
  } catch (error) {
    console.error("Error during update process:", error);
  } finally {
    app.exit(0);
  }
});

async function applyUpdate(downloadUrl) {
  const fileExtension = path.extname(downloadUrl);
  const localFilePath = path.join(
    os.homedir(),
    "Desktop",
    `downloadedUpdate${fileExtension}`
  );

  try {
    console.log(`Downloading ${fileExtension} from: ${downloadUrl}`);
    await downloadFile(downloadUrl, localFilePath);
    console.log(`Download complete, saved to: ${localFilePath}`);

    // Verify file exists
    if (!fs.existsSync(localFilePath)) {
      throw new Error("Downloaded file does not exist.");
    }

    // Extract the base name (without extension) from the download URL
    const fileName = path.basename(downloadUrl, path.extname(downloadUrl)); 
    log.info("fileName (OS)", fileName);

    if (fileExtension === '.dmg') {
      // Handle DMG file (macOS)
      const mountPoint = path.join(
        os.homedir(),
        'Desktop',
        fileName
      );
      console.log(`Mounting DMG at: ${mountPoint}`);
      await execPromise(
        `hdiutil attach "${localFilePath}" -nobrowse -mountpoint "${mountPoint}"`
      );
      console.log('DMG mounted');

      // Open the mounted dmg location
      console.log('Opening mounted DMG location...');
      await execPromise(`open "${mountPoint}"`);
      console.log('DMG mounted successfully, please replace the application manually.');
    } else if (fileExtension === '.exe') {
      // Handle exe file (Windows)
      console.log(`Executing EXE installer from: ${localFilePath}`);
      await execPromise(`"${localFilePath}"`);
      console.log('EXE file executed successfully.');
    } else {
      throw new Error('Unsupported file type.');
    }

    return true;
  } catch (error) {
    console.error('Failed to apply update:', error);
    return false;
  }
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${stderr}`);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

function downloadFile(fileUrl, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    function handleRedirect(response) {
      if (response.statusCode === 302 || response.statusCode === 301) {
        const newLocation = response.headers.location;
        console.log(`Redirecting to: ${newLocation}`);
        downloadFile(newLocation, dest).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(
          new Error(
            `Failed to download file: Status code ${response.statusCode}`,
          ),
        );
        return response.resume(); 
      }

      response.pipe(file);
      file.on("finish", () => {
        file.close(() => resolve(dest));
      });
    }

    const options = url.parse(fileUrl);
    options.headers = { "User-Agent": "Mozilla/5.0" };

    https.get(options, handleRedirect).on("error", (err) => {
      fs.unlink(dest, () => reject(err)); 
    });

    file.on("error", (err) => {
      // Handle errors on file write.
      fs.unlink(dest, () => reject(err)); 
    });
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createLoginWindow();
  }
});

process.on("uncaughtException", (error) => {
  log.info(`Exception: ${error}`);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

log.info(process.resourcesPath);




// ------ DATABASE -----

// Import external db files
import alterTable from "./alterTable_db"
import applySchemaUpdates from "./applySchemaUpdates_db"

//Database Connection And Instance
// Construct the absolute path to the SQLite database file
let dbPath;
if (isDev) {
  // Development mode path
  dbPath = path.join(__dirname, "..", "..", "resources", "fp.db");
} else {
  // Production mode path
  // dbPath = path
  //   .join(__dirname, "../../resources/fp.db")
  //   .replace("app.asar", "app.asar.unpacked");
  dbPath = path.join(app.getPath("userData"), "fp.db");
}

// Create or open SQLite database
const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.log("Database path:", dbPath);
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  
    try {
      // Drop tables (if needed), then create and alter tables
      // await dropTables();
      await createTables();

      const currentVersion = await getCurrentSchemaVersion();
      log.info("Current Schema Version: ", currentVersion);

      // Add columns to tables
      await alterTable(db, currentVersion);
      console.log("alterTable updates applied successfully");

      // Add constraints and foreign keys
      await applySchemaUpdates(db, currentVersion);
      console.log("Schema updates applied successfully");
    } catch (err) {
      console.error("Error during table operations:", err);
    }
  }
});
// Enable WAL mode
db.exec("PRAGMA journal_mode=WAL;", (err) => {
  if (err) {
    console.error("Failed to enable WAL mode:", err);
  } else {
    console.log("WAL mode enabled");
  }
});

// Get latest version from schema_version table
function getCurrentSchemaVersion() {
  return new Promise((resolve, reject) => {
    db.get(`SELECT MAX(version) as version FROM schema_version;`, (err, row) => {
      if (err) {
        console.error("Error fetching schema version:", err.message);
        reject(err);
      } else {
        resolve(row?.version || 0); 
      }
    });
  });
}

// Function to create tables
function createTables() {
  const tableDefinitions = [
    {
      name: "users",
      query: `
        CREATE TABLE IF NOT EXISTS users (
          user_id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          firstname TEXT NOT NULL,
          lastname TEXT NOT NULL,
          password TEXT NOT NULL,
          city TEXT,
          mobile VARCHAR,
          lang TEXT NOT NULL,
          token TEXT,
          created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `,
    },
    {
      name: "projects",
      query: `
        CREATE TABLE IF NOT EXISTS projects (
          project_id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_uuid TEXT NOT NULL,
          projectname TEXT NOT NULL,
          photographername TEXT,
          project_date TEXT NOT NULL,
          type TEXT NOT NULL,
          anomaly TEXT,
          merged_teams TEXT,
          unit BOOLEAN,
          lang TEXT,
          created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          alert_sale BOOLEAN,
          is_deleted BOOLEAN DEFAULT 0,
          is_sent BOOLEAN DEFAULT 0,
          is_sent_id INTEGER,
          files_uploaded BOOLEAN DEFAULT 0,
          sent_date TEXT,
          user_id INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
      `,
    },
    {
      name: "teams",
      query: `
        CREATE TABLE IF NOT EXISTS teams (
          team_id INTEGER PRIMARY KEY AUTOINCREMENT,
          teamname TEXT NOT NULL,
          amount INTEGER,
          leader_firstname TEXT,
          leader_lastname TEXT,
          leader_address TEXT,
          leader_postalcode TEXT,
          leader_county TEXT,
          leader_mobile TEXT,
          leader_email TEXT,
          leader_ssn INTEGER,
          calendar_amount INTEGER,
          portrait BOOLEAN DEFAULT 0,
          crowd BOOLEAN,
          reason_not_portrait TEXT,
          protected_id BOOLEAN,
          named_photolink BOOLEAN,
          sold_calendar BOOLEAN,
          is_deleted BOOLEAN DEFAULT 0,
          created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          project_id INTEGER NOT NULL,
          FOREIGN KEY (project_id) REFERENCES projects(project_id)
        )
      `,
    },
    {
      name: "teams_history",
      query: `
        CREATE TABLE IF NOT EXISTS teams_history (
          team_history_id INTEGER PRIMARY KEY AUTOINCREMENT,
          teamname TEXT,
          amount INTEGER,
          leader_firstname TEXT,
          leader_lastname TEXT,
          leader_address TEXT,
          leader_postalcode TEXT,
          leader_county TEXT,
          leader_mobile TEXT,
          leader_email TEXT,
          leader_ssn INTEGER,
          calendar_amount INTEGER,
          portrait BOOLEAN,
          crowd BOOLEAN,
          reason_not_portrait TEXT,
          protected_id BOOLEAN,
          named_photolink BOOLEAN,
          sold_calendar BOOLEAN,
          is_deleted BOOLEAN DEFAULT 0,
          created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          team_id INTEGER NOT NULL,
          FOREIGN KEY (team_id) REFERENCES teams(team_id)
        )
      `,
    },
    {
      name: "_projects",
      query: `
        CREATE TABLE IF NOT EXISTS _projects (
          project_id_ INTEGER PRIMARY KEY AUTOINCREMENT,
          project_uuid TEXT NOT NULL, 
          projectname TEXT NOT NULL,
          start TEXT NOT NULL,
          lang TEXT NOT NULL
          -- UNIQUE project_uuid
        )
      `,
    },
    {
      name: "ft_projects",
      query: `
        CREATE TABLE IF NOT EXISTS ft_projects (
          ft_project_id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_uuid TEXT,
          projectname TEXT,
          is_sent BOOLEAN DEFAULT 0,
          created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          user_id INTEGER,
          project_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users(user_id),
          FOREIGN KEY (project_id) REFERENCES projects(project_id)
        )
      `,
    },
    {
      name: "ft_files",
      query: `
        CREATE TABLE IF NOT EXISTS ft_files (
          ft_file_id INTEGER PRIMARY KEY AUTOINCREMENT,
          filename VARCHAR(255) NOT NULL,
          filepath VARCHAR(255),
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ft_project_id INTEGER,
          FOREIGN KEY (ft_project_id) REFERENCES ft_projects(ft_project_id)
        )
      `,
    },
    {
      name: "news",
      query: `
        CREATE TABLE IF NOT EXISTS news (
          id INTEGER,
          title TEXT,
          content TEXT,
          author TEXT,
          created_at TEXT,
          updated_at TEXT,
          is_read BOOLEAN DEFAULT 0,
          is_sent_date TIMESTAMP DEFAULT NULL,
          deleted BOOLEAN DEFAULT 0
        )
      `,
    },
    {
      name: "knowledgebase",
      query: `
        CREATE TABLE IF NOT EXISTS knowledgebase (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          article_id TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL UNIQUE,
          description TEXT NOT NULL,
          tags TEXT,
          langs TEXT,
          files TEXT,
          author TEXT,         
          created_at TEXT NOT NULL,
          updated_at TEXT,     
          deleted INTEGER DEFAULT 0
        )
      `,
    },
    {
      name: "timereport",
      query: `
      CREATE TABLE IF NOT EXISTS timereport (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          projectname TEXT NOT NULL,
          starttime TEXT NOT NULL, -- Changed TIME to TEXT
          endtime TEXT NOT NULL, -- Changed TIME to TEXT
          breaktime REAL DEFAULT 0.5, -- Use REAL for decimal numbers
          miles REAL DEFAULT 0, -- Use REAL for decimal numbers
          tolls REAL DEFAULT 0, -- Use REAL for decimal numbers
          park REAL DEFAULT 0, -- Use REAL for decimal numbers
          other_fees REAL DEFAULT 0, -- Use REAL for decimal numbers
          is_sent BOOLEAN DEFAULT 0,
          created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          project_date TEXT NOT NULL,
          user_id INTEGER NOT NULL,
          project_id INTEGER NOT NULL
        )
      `
    },
    {
      name: "schema_version",
      query: `
      CREATE TABLE IF NOT EXISTS schema_version (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          version INTEGER NOT NULL,
          applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `
    }
  ];
  return new Promise((resolve, reject) => {
    let createdTables = 0;
    tableDefinitions.forEach(({ name, query }) => {
      db.run(query, (err) => {
        if (err) {
          reject(`Error creating ${name} table: ${err.message}`);
        } else {
          console.log(`${name} table created successfully`);
          createdTables++;
          if (createdTables === tableDefinitions.length) {
            resolve();
          }
        }
      });
    });
  });
}

// // Function to drop tables
// function dropTables() {
//   const tablesToDrop = [];
//   let remainingDrops = tablesToDrop.length;

//   return new Promise((resolve, reject) => {
//     if (tablesToDrop.length > 0) {
//       tablesToDrop.forEach((table) => {
//         db.run(`DROP TABLE IF EXISTS ${table};`, (err) => {
//           if (err) {
//             reject(`Error dropping ${table} table: ${err.message}`);
//           } else {
//             console.log(`${table} table dropped successfully.`);
//             remainingDrops--;
//             if (remainingDrops === 0) {
//               resolve();
//             }
//           }
//         });
//       });
//     } else {
//       console.log("No tables to drop")
//       resolve();
//     }
//   });
// }


// function alterTable(currentVersion) {
//   const updates = [
//     {
//       version: 102.1,
//       query: `ALTER TABLE news ADD COLUMN user_id INTEGER;`,
//     },
//     {
//       version: 102.2,
//       query: `ALTER TABLE timereport ADD COLUMN is_sent_permanent BOOLEAN DEFAULT 0;`,
//     },
//   ];

//   // Sort updates by version to ensure correct order
//   const sortedUpdates = updates.filter((update) => update.version > currentVersion);

//   // Map updates to Promises
//   const updatePromises = sortedUpdates.map((update) => {
//     return new Promise((resolve, reject) => {
//       db.run(update.query, (err) => {
//         if (err) {
//           console.error(`Error applying update to version ${update.version}:`, err.message);
//           reject(err);
//         } else {
//           console.log(`Successfully applied schema update to version ${update.version}`);
//           db.run(
//             `INSERT INTO schema_version (version) VALUES (?)`,
//             [update.version],
//             (insertErr) => {
//               if (insertErr) {
//                 console.error("Error updating schema version:", insertErr.message);
//                 reject(insertErr); 
//               } else {
//                 console.log(`Schema version updated to ${update.version}`);
//                 resolve(); 
//               }
//             }
//           );
//         }
//       });
//     });
//   });

//   // Return Promise.all for aggregated results
//   return Promise.all(updatePromises)
//     .then(() => {
//       console.log("All schema updates have been applied successfully.");
//     })
//     .catch((err) => {
//       console.error("One or more schema updates failed:", err.message);
//     });
// }



// // Aplly updates based on version
// function applySchemaUpdates(currentVersion) {
//   const updates = [
//     {
//       version: 102.3,
//       query: `
//         CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_project_uuid ON _projects (project_uuid);
//       `,
//     },
//     {
//       version: 102.4,
//       query: `
//         CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_news_id_user_id ON news (id, user_id);
//       `,
//     },
//     {
//       version: 102.5,
//       query: `
//         CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_project_user ON timereport (project_id, user_id);
//       `,
//     }
//   ];
//   // Filter updates that need to be applied
//   const updatesToApply = updates.filter((update) => update.version > currentVersion);
//   const updatePromises = updatesToApply.map((update) => {
//     return new Promise((resolve, reject) => {
//       db.run(update.query, (err) => {
//         if (err) {
//           console.error(`Error applying update to version ${update.version}:`, err.message);
//           reject(err); 
//         } else {
//           console.log(`Applied schema update to version ${update.version}`);
//           db.run(
//             `INSERT INTO schema_version (version) VALUES (?)`,
//             [update.version],
//             (insertErr) => {
//               if (insertErr) {
//                 console.error("Error updating schema version:", insertErr.message);
//                 reject(insertErr);
//               } else {
//                 console.log(`Schema version updated to ${update.version}`);
//                 resolve(); 
//               }
//             }
//           );
//         }
//       });
//     });
//   });

//   // Use Promise.all to ensure all updates are applied
//   return Promise.all(updatePromises)
//     .then(() => {
//       console.log("All schema updates have been successfully applied.");
//     })
//     .catch((err) => {
//       console.error("One or more schema updates failed:", err.message);
//     });
// }




//Get user token
ipcMain.handle("updateUserToken", async (event, token, user_id) => {
  try {
    if (!user_id || !token) {
      throw new Error(
        "Missing required data (token, user_id) for updateUserToken",
      );
    }

    const result = await db.run(
      `
      UPDATE users
      SET 
        token = ? WHERE user_id = ?
      `,
      [token, user_id],
    );

    log.info(`Token updated successfully`);
    return { success: true };
  } catch (err) {
    log.error("Error updating token:", err.message);
    return { error: err.message };
  }
});

// Function To Minimize Window
ipcMain.handle("minimize", () => {
  mainWindow.minimize();
});

// Function To Maximize Window
ipcMain.handle("maximize", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});



// Create projects in SQLite database from company database
ipcMain.handle("create_Projects", async (event, projects) => {
  try {
    if (!Array.isArray(projects)) {
      throw new Error("Invalid data received for create_Projects");
    }

    // Initialize the database
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
        throw err;
      }
    });

    db.serialize(() => {
      // Delete existing data
      db.run("DELETE FROM _projects", (err) => {
        if (err) {
          console.error("Error deleting old projects:", err.message);
          throw err;
        }
        console.log("Deleted old projects successfully.");
      });

      // Insert new data
      const stmt = db.prepare(
        "INSERT INTO _projects (project_uuid, projectname, start, lang) VALUES (?, ?, ?, ?)"
      );

      for (const project of projects) {
        if (!project.project_uuid) {
          console.error("Skipping project with missing project_uuid:", project);
          continue;
        }
        stmt.run(
          project.project_uuid,
          project.projectname,
          project.start,
          project.lang,
          (err) => {
            if (err) {
              console.error("Error inserting project:", err.message);
            }
          }
        );
      }

      stmt.finalize((err) => {
        if (err) {
          console.error("Error finalizing statement:", err.message);
        } else {
          console.log("All projects added successfully.");
        }
      });
    });

    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err.message);
      } else {
        console.log("Database connection closed successfully.");
      }
    });

    return { success: true };
  } catch (err) {
    console.error("Error adding projects:", err.message);
    return {
      statusCode: 0,
      errorMessage: "Error adding projects to SQLITE _projects",
    };
  }
});





//add news to SQLlite news table
ipcMain.handle("create_news", async (event, news, user_id) => {
  log.info("news: ", news);
  log.info("user_id", user_id);
  try {
    if (!Array.isArray(news)) {
      throw new Error("Invalid data received for create_news,");
    }
    if (!user_id) {
      throw new Error("Missing user_id for create_news");
    }

    const db = new sqlite3.Database(dbPath);

    // Fetch all existing news records
    const existingNews = await new Promise((resolve, reject) => {
      db.all("SELECT id, updated_at FROM news WHERE user_id = ?", [user_id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.reduce((acc, row) => {
            acc[row.id.toString()] = row.updated_at;
            return acc;
          }, {}));
        }
      });
    });
    log.info("Existing news IDs and updated_at:", existingNews);

    const incomingNewsIds = new Set(news.map(item => item.id.toString()));
  
    // Identify ids to mark as deleted (those ids that exists in table but not incoming news array)
    const idsToMarkAsDeleted = Object.keys(existingNews).filter(id => !incomingNewsIds.has(id));
    // Insert new items (Those that exists in incoming news array but not in table)
    const newNewsItems = news.filter(item => !existingNews.hasOwnProperty(item.id.toString()));
    // Update items (those where updated_at in incoming news array are bigger than updated_at in table)
    const updates = news.filter(item => existingNews.hasOwnProperty(item.id.toString()) && new Date(item.updated_at) > new Date(existingNews[item.id.toString()]));

    // Batch insert new items
    const batchInsert = async (NewsBatch) => {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          const stmt = db.prepare(
            "INSERT INTO news (id, title, content, author, created_at, updated_at, is_read, deleted, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
          );
          db.run("BEGIN TRANSACTION");
          for (const item of NewsBatch) {
            stmt.run(
              item.id,
              item.title,
              item.content,
              item.author,
              item.created_at,
              item.updated_at,
              item.isRead ? 1 : 0,
              item.deleted || 0,
              user_id
            );
          }
          db.run("COMMIT", (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
          stmt.finalize();
        });
      });
    };
    const batchSize = 100;
    for (let i = 0; i < newNewsItems.length; i += batchSize) {
      const batch = newNewsItems.slice(i, i + batchSize);
      await batchInsert(batch);
    }

     // Update existing items with their is_read status
     const updateReadStatus = async (newsItem) => {
      return new Promise((resolve, reject) => {
        db.run(
          "UPDATE news SET is_read = ? WHERE id = ? AND user_id = ?",
          [newsItem.isRead ? 1 : 0, newsItem.id, user_id],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    };
    // Go through each incoming news item and update `is_read` status
    for (const newsItem of news) {
      await updateReadStatus(newsItem);
    }

    // Batch update existing items
    const batchUpdate = async (NewsBatch) => {
      return new Promise((resolve, reject) => {
        db.serialize(() => {
          const stmt = db.prepare(
            "UPDATE news SET title = ?, content = ?, author = ?, created_at = ?, updated_at = ?, is_read = ?, is_sent_date = ?, deleted = ? WHERE id = ? AND user_id = ?"
          );
          db.run("BEGIN TRANSACTION");
          for (const item of NewsBatch) {
            stmt.run(
              item.title,
              item.content,
              item.author,
              item.created_at,
              item.updated_at,
              0,
              "NULL",
              item.deleted || 0, 
              item.id,
              user_id
            );
          }
          db.run("COMMIT", (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
          stmt.finalize();
        });
      });
    };
    // Update items in batches
    if (updates.length > 0) {
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        await batchUpdate(batch);
      }
      log.info("News items updated successfully");
    }

    // Mark existing news items as deleted if they are not in the incoming news array
    if (idsToMarkAsDeleted.length > 0) {
      await new Promise((resolve, reject) => {
        db.serialize(() => {
          const stmt = db.prepare("UPDATE news SET deleted = 1 WHERE id = ? AND user_id = ?");
          db.run("BEGIN TRANSACTION");
          for (const id of idsToMarkAsDeleted) {
            stmt.run(
              id,
              user_id
            );
          }
          db.run("COMMIT", (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
          stmt.finalize();
        });
      });
      log.info("IDs marked as deleted:", idsToMarkAsDeleted);
    }

    log.info("News added successfully");
    db.close();
    return { success: true };
  } catch (err) {
    console.error("Error adding news:", err.message);
    return { statusCode: 0, errorMessage: "Error adding news to SQLITE news" };
  }
});




//get all news
ipcMain.handle("get_news", async (event, user_id) => {
  log.info("user_id: ", user_id);
  if (!user_id){
    throw new Error("Missing user_id for get_news")
  }
  const allNews = [];

  const retrieveQuery = "SELECT * FROM news WHERE deleted IS NULL OR deleted != 1 AND user_id = ?";
  console.log("SQL Query:", retrieveQuery, "Parameters:", []);

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    db.each(retrieveQuery, [user_id], (error, row) => {
      if (error != null) {
        db.close();
        reject({ statusCode: 0, errorMessage: error });
      }

      allNews.push({
        id: row.id,
        title: row.title,
        content: row.content,
        author: row.author,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted: row.deleted,
        is_read: row.is_read,
        is_sent_date: row.is_sent_date,
        user_id: user_id
      });
    });

    db.close(() => {
      resolve({ status: 200, news: allNews, message: "success" });
    });
  });
});


//confirm news and edit news table
ipcMain.handle("confirmNewsToSqlite", async (event, news_id, user_id) => {
  if (!news_id || !user_id) {
    throw new Error("Missing required data (news_id or user_id) for confirmNewsToSqlite");
  }
  try {
    await db.run(
      `UPDATE news SET is_read = 1 WHERE id = ? AND user_id = ?
      `,
      [news_id, user_id],
    );

    console.log(`News data updated successfully`);
    return { success: true };
  } catch (err) {
    console.error("Error updating confirm news in SQLite:", err.message);
    return { error: err.message };
  }
});

//getting all unsent news
ipcMain.handle("getAllUnsentNews", async (event, user_id) => {
  if (!user_id) {
    throw new Error("Missing required data (user_id) for getAllUnsentNews");
  }

  const retrieveQuery = "SELECT * FROM news WHERE is_read = 1 AND is_sent_date IS NULL AND user_id = ?";

  try {
    const db = new sqlite3.Database(dbPath);

    const rows = await executeQueryWithRetry(db, retrieveQuery, [user_id]);
    const unsentNews = rows.map((row) => ({
      id: row.id
    }));

    await closeDatabase(db);

    log.info("All unsent news:", unsentNews);
    return { statusCode: 1, allUnsentNews: unsentNews };
  } catch (error) {
    console.error("Error fetching unsent news:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});

//adding date to news table
ipcMain.handle("addSentDateToNews", async (event, news_id, user_id) => {
  try {
    if (!news_id || !user_id) {
      throw new Error("Missing required data (news_id or user_id) for addSentDateToNews");
    }

    await db.run(
      `
      UPDATE news
      SET 
        is_sent_date = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?
      `,
      [news_id, user_id],
    );

    console.log(`Date added to news table successfully`);
    return { status: 200, success: true };
  } catch (err) {
    console.error("Error adding date to news table:", err.message);
    return { error: err.message };
  }
});

//get spcific user
ipcMain.handle("getUser", async (event, id) => {
  const retrieveQuery = "SELECT * FROM users WHERE user_id = ?";

  const db = new sqlite3.Database(dbPath);

  try {
    const row = await executeGetWithRetry(db, retrieveQuery, [id]);
    if (!row) {
      await closeDatabase(db);
      return { statusCode: 0, errorMessage: "User not found" };
    }

    const user = {
      user_id: row.user_id,
      email: row.email,
      firstname: row.firstname,
      lastname: row.lastname,
      city: row.city,
      mobile: row.mobile,
      lang: row.lang,
      token: row.token,
      created: row.created,
    };

    await closeDatabase(db);
    return { statusCode: 1, user: user };
  } catch (error) {
    await closeDatabase(db);
    console.error("Error fetching user data:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});
async function executeGetWithRetry(
  db,
  query,
  params = [],
  retries = 5,
  delay = 1000,
) {
  return new Promise((resolve, reject) => {
    function attempt() {
      db.get(query, params, (error, row) => {
        if (error) {
          if (error.code === "SQLITE_BUSY" && retries > 0) {
            setTimeout(attempt, delay);
          } else {
            reject(error);
          }
        } else {
          resolve(row);
        }
      });
    }
    attempt();
  });
}
// ipcMain.handle("getUser", async (event, id) => {
//   const retrieveQuery = "SELECT * FROM users WHERE user_id = ?";

//   try {
//     const user = await new Promise((resolve, reject) => {
//       const db = new sqlite3.Database(dbPath);

//       db.get(retrieveQuery, [id], (error, row) => {
//         if (error) {
//           db.close();
//           reject({ statusCode: 0, errorMessage: error });
//         } else if (!row) {
//           db.close();
//           reject({ statusCode: 0, errorMessage: "User not found" });
//         } else {
//           db.close();
//           resolve({
//             user_id: row.user_id,
//             email: row.email,
//             firstname: row.firstname,
//             lastname: row.lastname,
//             city: row.city,
//             mobile: row.mobile,
//             lang: row.lang,
//             token: row.token,
//             created: row.created,
//           });
//         }
//       });
//     });

//     return { statusCode: 1, user: user };
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return { statusCode: 0, errorMessage: error.message };
//   }
// });

//get all users
ipcMain.handle("getAllUsers", async (event, args) => {
  const retrieveQuery = "SELECT * FROM users";

  try {
    const users = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.all(retrieveQuery, (error, rows) => {
        if (error != null) {
          db.close();
          reject({ statusCode: 0, errorMessage: error });
        }

        const allUsers = rows.map((row) => ({
          user_id: row.user_id,
          email: row.email,
          firstname: row.firstname,
          lastname: row.lastname,
          city: row.city,
          lang: row.lang,
          created: row.created,
        }));

        db.close(() => {
          resolve({ statusCode: 1, users: allUsers });
        });
      });
    });

    return { statusCode: 1, users: users }; // Corrected to return 'users' instead of 'allUsers'
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});

//create new user
ipcMain.handle("createUser", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for createUser");
    }

    const { email, firstname, surname, password, language, token } = args;

    if (!email || !firstname || !surname || !language || !token || !password) {
      throw new Error("Missing required user data for createUser");
    }

    const userExists = await checkUsernameInDatabase(email);
    if (userExists) {
      event.sender.send("createUser-response", {
        success: false,
        error: "User already exists",
      });
      return { success: false, error: "User already exists" };
    } else {
      //hashing password
      const hashedPassword = await hashPassword(password);

      // Insert the new user into the database
      await db.run(
        `
        INSERT INTO users (email, firstname, lastname, password, lang, token)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [email, firstname, surname, hashedPassword, language, token],
      );

      console.log("User added successfully");
      event.sender.send("createUser-response", { success: true });
      return { success: true };
    }
  } catch (err) {
    console.error("Error adding new user data:", err.message);
    event.sender.send("createUser-response", { error: err.message });
    return { error: err.message };
  }
});
const checkUsernameInDatabase = (email) => {
  return new Promise((resolve, reject) => {
    // Prepare the SQL query to check if the email and password match
    const checkUserQuery = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
    // Execute the SQL query
    db.get(checkUserQuery, [email], (err, row) => {
      if (err) {
        // Reject with error if query execution fails
        console.error("Error checking username in database:", err);
        reject(err);
        return;
      }
      // Resolve with the result of the query
      resolve(row.count === 1);
    });
  });
};
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    log.info("Hashing password error:", error);
  }
}


//loginUser
ipcMain.handle("loginUser", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for loginUser");
    }

    const { email, password } = args;

    if (!email || !password) {
      throw new Error("Missing required user data for loginUser");
    }
    const hashedPassword = await getUserHashedPassword(email);
    log.info(hashedPassword);
    if (hashedPassword === null) {
      event.sender.send("loginUser-response", { success: false });
      return { status: 202, success: false, message: "User with email not found in local database" };
    }

    if (hashedPassword && (await comparePassword(password, hashedPassword))) {
      // If the user exists and the password matches, send success response
      const user = await getUserDetails(email);
      log.info(user);

      event.sender.send("loginUser-response", { success: true, user });
      return {status: 200, success: true, user };
    } else {
      // If the user doesn't exist or password doesn't match, send error response
      throw new Error("Invalid username or password");
    }
  } catch (err) {
    console.error("Error logging user:", err.message);
    event.sender.send("loginUser-response", { error: err.message });
    return { error: err.message };
  }
});
const getUserHashedPassword = (email) => {
  return new Promise((resolve, reject) => {
    // Query to get the user's hashed password based on email
    const query = `SELECT password FROM users WHERE email = ?`;
    db.get(query, [email], (err, row) => {
      if (err) {
        console.error("Error fetching user password from database:", err);
        reject(err);
      } else if (row) {
        resolve(row.password);
      } else {
        resolve(null); // No user found
      }
    });
  });
};
const getUserDetails = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT user_id, email, firstname, lastname, lang, mobile, city, created, token FROM users WHERE email = ?`;
    db.get(query, [email], (err, row) => {
      if (err) {
        console.error("Error fetching user details from database:", err);
        reject(err);
      } else if (row) {
        resolve(row);
      } else {
        resolve(null); // No user found
      }
    });
  });
};
const comparePassword = (password, hash) => {
  try {
    return bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Comparison error:", error);
    return false;
  }
};
// const checkUserInDatabase = (email, password) => {
//   return new Promise((resolve, reject) => {
//     // Prepare the SQL query to check if the email and password match
//     const checkUserQuery = `SELECT COUNT(*) AS count FROM users WHERE email = ? AND password = ?`;

//     // Execute the SQL query
//     db.get(checkUserQuery, [email, password], (err, row) => {
//       if (err) {
//         // Reject with error if query execution fails
//         console.error("Error checking user in database:", err);
//         reject(err);
//         return;
//       }

//       // Resolve with the result of the query
//       resolve(row.count === 1);
//     });
//   });
// };

//edit user data
ipcMain.handle("editUser", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for editUser");
    }

    const { email, firstname, lastname, city, mobile, lang, user_id } = args;

    if (!user_id || !email || !lang) {
      throw new Error("Missing required data (user_id) for editUser");
    }

    const result = await db.run(
      `
      UPDATE users
      SET 
        email = ?, firstname = ?, lastname = ?, city = ?, mobile = ?, lang = ? WHERE user_id = ?
      `,
      [email, firstname, lastname, city, mobile, lang, user_id],
    );

    console.log(`User data edited successfully`);
    return { success: true };
  } catch (err) {
    console.error("Error editing user:", err.message);
    return { error: err.message };
  }
});

//get all current projects by user_id
ipcMain.handle("getAllProjects", async (event, user_id) => {
  const retrieveQuery =
    "SELECT * FROM projects WHERE user_id = ? AND files_uploaded = 0 AND is_deleted = 0";
  console.log("SQL Query:", retrieveQuery, "Parameters:", [user_id]);

  const db = new sqlite3.Database(dbPath);

  try {
    const rows = await executeQueryWithRetry(db, retrieveQuery, [user_id]);

    const allProjects = rows.map((row) => ({
      project_id: row.project_id,
      project_uuid: row.project_uuid,
      projectname: row.projectname,
      type: row.type,
      anomaly: row.anomaly,
      merged_teams: row.merged_teams,
      unit: row.unit,
      lang: row.lang,
      alert_sale: row.alert_sale,
      is_deleted: row.is_deleted,
      is_sent: row.is_sent,
      sent_date: row.sent_date,
      user_id: row.user_id,
      project_date: row.project_date,
      created: row.created,
    }));

    await closeDatabase(db);
    return { statusCode: 1, projects: allProjects };
  } catch (error) {
    await closeDatabase(db);
    console.error("Error fetching projects (getAllProjects):", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});
// ipcMain.handle("getAllProjects", async (event, user_id) => {
//   const retrieveQuery =
//     "SELECT * FROM projects WHERE user_id = ? AND files_uploaded = 0 AND is_deleted = 0";
//   console.log("SQL Query:", retrieveQuery, "Parameters:", [user_id]);

//   try {
//     const projects = await new Promise((resolve, reject) => {
//       const db = new sqlite3.Database(dbPath);

//       db.all(retrieveQuery, [user_id], (error, rows) => {
//         if (error != null) {
//           db.close();
//           reject({ statusCode: 0, errorMessage: error });
//         }

//         const allProjects = rows.map((row) => ({
//           project_id: row.project_id,
//           project_uuid: row.project_uuid,
//           projectname: row.projectname,
//           type: row.type,
//           anomaly: row.anomaly,
//           merged_teams: row.merged_teams,
//           unit: row.unit,
//           lang: row.lang,
//           alert_sale: row.alert_sale,
//           is_deleted: row.is_deleted,
//           is_sent: row.is_sent,
//           sent_date: row.sent_date,
//           user_id: row.user_id,
//           project_date: row.project_date,
//           created: row.created,
//         }));

//         db.close(() => {
//           resolve({ statusCode: 1, projects: allProjects });
//         });
//       });
//     });

//     return projects;
//   } catch (error) {
//     console.error("Error fetching projects (getAllProjects):", error);
//     return { statusCode: 0, errorMessage: error.message };
//   }
// });

//get all current projects by user_id
ipcMain.handle("getAllCurrentProjects", async (event, user_id) => {
  const retrieveQuery =
    "SELECT * FROM projects WHERE user_id = ? AND is_sent = 0 AND is_deleted = 0";
  console.log("SQL Query:", retrieveQuery, "Parameters:", [user_id]);

  const db = new sqlite3.Database(dbPath);

  try {
    const rows = await executeQueryWithRetry(db, retrieveQuery, [user_id]);

    const allProjects = rows.map((row) => ({
      project_id: row.project_id,
      project_uuid: row.project_uuid,
      projectname: row.projectname,
      project_date: row.project_date,
      type: row.type,
      anomaly: row.anomaly,
      merged_teams: row.merged_teams,
      unit: row.unit,
      alert_sale: row.alert_sale,
      is_deleted: row.is_deleted,
      is_sent: row.is_sent,
      sent_date: row.sent_date,
      user_id: row.user_id,
      project_date: row.project_date,
      created: row.created,
    }));

    await closeDatabase(db);
    return { statusCode: 1, projects: allProjects };
  } catch (error) {
    await closeDatabase(db);
    console.error("Error fetching projects (getAllCurrentProjects):", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});
// ipcMain.handle("getAllCurrentProjects", async (event, user_id) => {
//   const retrieveQuery =
//     "SELECT * FROM projects WHERE user_id = ? AND is_sent = 0 AND is_deleted = 0";
//   console.log("SQL Query:", retrieveQuery, "Parameters:", [user_id]);

//   try {
//     const projects = await new Promise((resolve, reject) => {
//       const db = new sqlite3.Database(dbPath);

//       db.all(retrieveQuery, [user_id], (error, rows) => {
//         if (error != null) {
//           db.close();
//           reject({ statusCode: 0, errorMessage: error });
//         }

//         const allProjects = rows.map((row) => ({
//           project_id: row.project_id,
//           project_uuid: row.project_uuid,
//           projectname: row.projectname,
//           type: row.type,
//           anomaly: row.anomaly,
//           merged_teams: row.merged_teams,
//           unit: row.unit,
//           alert_sale: row.alert_sale,
//           is_deleted: row.is_deleted,
//           is_sent: row.is_sent,
//           sent_date: row.sent_date,
//           user_id: row.user_id,
//           project_date: row.project_date,
//           created: row.created,
//         }));

//         db.close(() => {
//           resolve({ statusCode: 1, projects: allProjects });
//         });
//       });
//     });

//     return projects;
//   } catch (error) {
//     console.error("Error fetching projects (getAllCurrentProjects):", error);
//     return { statusCode: 0, errorMessage: error.message };
//   }
// });

//get all previous projects by user_id
ipcMain.handle("getAllPreviousProjects", async (event, user_id) => {
  const retrieveQuery =
    "SELECT * FROM projects WHERE user_id = ? AND is_sent = 1 AND is_deleted = 0";
  console.log("SQL Query:", retrieveQuery, "Parameters:", [user_id]);

  const db = new sqlite3.Database(dbPath);

  try {
    const rows = await executeQueryWithRetry(db, retrieveQuery, [user_id]);

    const allProjects = rows.map((row) => ({
      project_id: row.project_id,
      project_uuid: row.project_uuid,
      projectname: row.projectname,
      project_date: row.project_date,
      type: row.type,
      anomaly: row.anomaly,
      merged_teams: row.merged_teams,
      unit: row.unit,
      alert_sale: row.alert_sale,
      is_deleted: row.is_deleted,
      is_sent: row.is_sent,
      sent_date: row.sent_date,
      user_id: row.user_id,
      created: row.created,
    }));

    await closeDatabase(db);
    return { statusCode: 1, projects: allProjects };
  } catch (error) {
    await closeDatabase(db);
    console.error("Error fetching projects (getAllPreviousProjects):", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});
// ipcMain.handle("getAllPreviousProjects", async (event, user_id) => {
//   const retrieveQuery =
//     "SELECT * FROM projects WHERE user_id = ? AND is_sent = 1 AND is_deleted = 0";
//   console.log("SQL Query:", retrieveQuery, "Parameters:", [user_id]);

//   try {
//     const projects = await new Promise((resolve, reject) => {
//       const db = new sqlite3.Database(dbPath);

//       db.all(retrieveQuery, [user_id], (error, rows) => {
//         if (error != null) {
//           db.close();
//           reject({ statusCode: 0, errorMessage: error });
//         }

//         const allProjects = rows.map((row) => ({
//           project_id: row.project_id,
//           project_uuid: row.project_uuid,
//           projectname: row.projectname,
//           type: row.type,
//           anomaly: row.anomaly,
//           merged_teams: row.merged_teams,
//           unit: row.unit,
//           alert_sale: row.alert_sale,
//           is_deleted: row.is_deleted,
//           is_sent: row.is_sent,
//           sent_date: row.sent_date,
//           user_id: row.user_id,
//           created: row.created,
//         }));

//         db.close(() => {
//           resolve({ statusCode: 1, projects: allProjects });
//         });
//       });
//     });

//     return projects;
//   } catch (error) {
//     console.error("Error fetching projects (getAllPreviousProjects):", error);
//     return { statusCode: 0, errorMessage: error.message };
//   }
// });

//get all previous projects by user_id
ipcMain.handle(
  "getAllPreviousProjectsBySearch",
  async (event, user_id, searchString) => {
    const retrieveQuery =
      "SELECT * FROM projects WHERE user_id = ? AND is_sent = 1 AND is_deleted = 0 AND projectname LIKE ?";
    console.log("SQL Query:", retrieveQuery, "Parameters:", [
      user_id,
      `%${searchString}%`,
    ]);

    try {
      const projects = await new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);

        db.all(retrieveQuery, [user_id, `%${searchString}%`], (error, rows) => {
          if (error != null) {
            db.close();
            reject({ statusCode: 0, errorMessage: error });
          }

          const allProjects = rows.map((row) => ({
            project_id: row.project_id,
            project_uuid: row.project_uuid,
            projectname: row.projectname,
            type: row.type,
            anomaly: row.anomaly,
            merged_teams: row.merged_teams,
            unit: row.unit,
            alert_sale: row.alert_sale,
            is_deleted: row.is_deleted,
            is_sent: row.is_sent,
            sent_date: row.sent_date,
            user_id: row.user_id,
            created: row.created,
          }));

          db.close(() => {
            resolve({ statusCode: 1, projects: allProjects });
          });
        });
      });

      return projects;
    } catch (error) {
      console.error("Error fetching searched projects:", error);
      return { statusCode: 0, errorMessage: error.message };
    }
  },
);

//get project by porject_id
ipcMain.handle("getProjectById", async (event, project_id) => {
  const retrieveQuery = "SELECT * FROM projects WHERE project_id = ?";
  console.log("SQL Query:", retrieveQuery, "Parameters:", [project_id]);

  const db = new sqlite3.Database(dbPath);

  try {
    const row = await executeGetWithRetry(db, retrieveQuery, [project_id]);

    if (!row) {
      await closeDatabase(db);
      return { statusCode: 1, project: null };
    }

    const project = {
      project_id: row.project_id,
      project_uuid: row.project_uuid,
      projectname: row.projectname,
      photographername: row.photographername,
      type: row.type,
      anomaly: row.anomaly,
      merged_teams: row.merged_teams,
      unit: row.unit,
      alert_sale: row.alert_sale,
      is_deleted: row.is_deleted,
      is_sent: row.is_sent,
      sent_date: row.sent_date,
      user_id: row.user_id,
      created: row.created,
    };

    await closeDatabase(db);
    return { status: 200, statusCode: 1, project: project };
  } catch (error) {
    await closeDatabase(db);
    console.error("Error fetching projects (getProjectById):", error);
    return { status: 400, statusCode: 0, errorMessage: error.message };
  }
});
// ipcMain.handle("getProjectById", async (event, project_id) => {
//   const retrieveQuery = "SELECT * FROM projects WHERE project_id = ?";
//   console.log("SQL Query:", retrieveQuery, "Parameters:", [project_id]);

//   try {
//     const project = await new Promise((resolve, reject) => {
//       const db = new sqlite3.Database(dbPath);

//       db.get(retrieveQuery, [project_id], (error, row) => {
//         if (error != null) {
//           db.close();
//           reject({ statusCode: 0, errorMessage: error });
//         }

//         if (!row) {
//           // If no project is found, resolve with null
//           db.close();
//           resolve({ statusCode: 1, project: null });
//           return;
//         }

//         const project = {
//           project_id: row.project_id,
//           project_uuid: row.project_uuid,
//           projectname: row.projectname,
//           photographername: row.photographername,
//           type: row.type,
//           anomaly: row.anomaly,
//           merged_teams: row.merged_teams,
//           unit: row.unit,
//           alert_sale: row.alert_sale,
//           is_deleted: row.is_deleted,
//           is_sent: row.is_sent,
//           sent_date: row.sent_date,
//           user_id: row.user_id,
//           created: row.created,
//         };

//         db.close(() => {
//           resolve({ statusCode: 1, project: project });
//         });
//       });
//     });

//     return project;
//   } catch (error) {
//     console.error("Error fetching projects (getProjectById):", error);
//     return { statusCode: 0, errorMessage: error.message };
//   }
// });

//get all projects
ipcMain.handle("get_Projects", async (event, user_lang) => {
  const allProjects = [];

  const retrieveQuery = "SELECT * FROM _projects WHERE lang = ?";
  console.log("SQL Query:", retrieveQuery, "Parameters:", [user_lang]);

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    db.each(retrieveQuery, [user_lang], (error, row) => {
      if (error != null) {
        db.close();
        reject({ statusCode: 0, errorMessage: error });
      }

      allProjects.push({
        project_uuid: row.project_uuid,
        projectname: row.projectname,
        lang: row.lang,
        project_date: row.start,
      });
    });

    db.close(() => {
      resolve({ statusCode: 1, projects: allProjects });
    });
  });
});

//get spcific project and see if it exists
ipcMain.handle("checkProjectExists", async (event, project_uuid, user_id) => {
  const retrieveQuery =
    "SELECT * FROM projects WHERE project_uuid = ? AND user_id = ? AND is_deleted = 0";

  try {
    const project = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.get(retrieveQuery, [project_uuid, user_id], (error, row) => {
        if (error) {
          db.close();
          reject({ statusCode: 0, errorMessage: error.message });
        } else if (!row) {
          db.close();
          reject({ statusCode: 0, errorMessage: "Project not found" });
        } else {
          db.close();
          resolve({
            statusCode: 1,
            project_uuid: row.project_uuid,
            projectname: row.projectname,
            // Add other project details if needed
          });
        }
      });
    });

    return project;
  } catch (error) {
    console.error("Error checking project existence:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});

const executeInsertWithRetryAndId = (
  db,
  query,
  params = [],
  retries = 5,
  delay = 1000,
) => {
  return new Promise((resolve, reject) => {
    function attempt() {
      db.run(query, params, function (error) {
        if (error) {
          if (error.code === "SQLITE_BUSY" && retries > 0) {
            setTimeout(() => {
              attempt(--retries); // Decrement retries and try again
            }, delay);
          } else {
            reject(error);
          }
        } else {
          resolve(this.lastID); // Retrieve the last inserted row ID
        }
      });
    }
    attempt();
  });
};

//create new project
ipcMain.handle("createNewProject", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for createNewProject");
    }

    const {
      projectname,
      type,
      user_id,
      project_uuid,
      photographername,
      project_date,
      lang,
    } = args;

    if (
      !projectname ||
      !type ||
      !project_uuid ||
      !user_id ||
      !photographername ||
      !project_date ||
      !lang
    ) {
      throw new Error("Missing required user data for createNewProject");
    }

    const db = new sqlite3.Database(dbPath);

    const project_id = await executeInsertWithRetryAndId(
      db,
      `
        INSERT INTO projects (projectname, photographername, type, project_date, user_id, lang, project_uuid)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        projectname.toLowerCase(),
        photographername,
        type.toLowerCase(),
        project_date,
        user_id,
        lang,
        project_uuid,
      ],
    );

    log.info("Project added successfully with project_id:", project_id);

    return { success: true, project_id };
  } catch (err) {
    console.error(
      "Error adding new project data (createNewProject):",
      err.message,
    );
    return { error: err.message };
  }
});
// ipcMain.handle("createNewProject", async (event, args) => {
//   try {
//     if (!args || typeof args !== "object") {
//       throw new Error("Invalid arguments received for createNewProject");
//     }

//     const {
//       projectname,
//       type,
//       user_id,
//       project_uuid,
//       photographername,
//       project_date,
//       lang,
//     } = args;

//     if (
//       !projectname ||
//       !type ||
//       !project_uuid ||
//       !user_id ||
//       !photographername ||
//       !project_date ||
//       !lang
//     ) {
//       throw new Error("Missing required user data for createNewProject");
//     }

//     await db.run(
//       `
//           INSERT INTO projects (projectname, photographername, type, project_date, user_id, lang, project_uuid)
//           VALUES (?, ?, ?, ?, ?, ?, ?)
//           `,
//       [
//         projectname.toLowerCase(),
//         photographername,
//         type.toLowerCase(),
//         project_date,
//         user_id,
//         lang,
//         project_uuid,
//       ],
//     );

//     log.info("Project added successfully");
//     log.info("Fetching new project with UUID:", project_uuid);
//     // Send the newProject object as a response to the frontend
//     event.sender.send("createNewProject-response", { success: true });
//     return { success: true }; // Optionally, also return the newProject object
//   } catch (err) {
//     console.error("Error adding new project data:", err.message);
//     event.sender.send("createNewProject-response", { error: err.message });
//     return { error: err.message };
//   }
// });

//get latest project
// ipcMain.handle("getLatestProject", async (event, user_id, project_uuid) => {
//   const retrieveQuery = "SELECT project_id FROM projects WHERE user_id = ? AND project_uuid = ?";

//   log.info("SQL Query:", retrieveQuery, "Parameters:", [user_id, project_uuid]);

//   try {
//     const db = new sqlite3.Database(dbPath);

//     const row = await executeQueryWithRetry(db, retrieveQuery, [user_id, project_uuid]);

//     if (!row) {
//       log.info("Project not found (getLatestProject)");
//       return { statusCode: 0, errorMessage: "Project not found" };
//     }

//     log.info("Project found (getLatestProject):", row);

//     return {
//       statusCode: 1,
//       project_id: row.project_id
//     };
//   } catch (error) {
//     log.info("Error fetching project data (getLatestProject):", error);
//     return { statusCode: 0, errorMessage: error.message };
//   }
// });
ipcMain.handle("getLatestProject", async (event, user_id, project_uuid) => {
  const retrieveQuery =
    "SELECT * FROM projects WHERE user_id = ? AND project_uuid = ?";

  try {
    const project = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.get(retrieveQuery, [user_id, project_uuid], (error, row) => {
        if (error) {
          db.close();
          reject({ statusCode: 0, errorMessage: error });
        } else if (!row) {
          db.close();
          reject({ statusCode: 0, errorMessage: "Project not found" });
        } else {
          db.close();
          resolve({
            statusCode: 1,
            project_id: row.project_id,
          });
        }
      });
    });

    return project;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});

//delete project
ipcMain.handle("deleteProject", async (event, project_id, user_id) => {
  const updateQuery = "UPDATE projects SET is_deleted = 1 WHERE project_id = ? AND user_id = ?";

  try {
    const result = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.run(updateQuery, [project_id, user_id], function (error) {
        if (error) {
          db.close();
          reject({ status: 400, statusCode: 0, errorMessage: error });
        } else {
          db.close();
          resolve({ status: 200, rowsAffected: this.changes });
        }
      });
    });

    return { statusCode: 1, result };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});

//send project to DB
ipcMain.handle(
  "sendProjectToDb",
  async (event, project_id, alertSale, responseId) => {
    const updateQuery = `
    UPDATE projects 
    SET is_sent = 1, 
        sent_date = CURRENT_TIMESTAMP, 
        alert_sale = ?, 
        is_sent_id = ? 
    WHERE project_id = ?
  `;

    try {
      const db = new sqlite3.Database(dbPath);
      const params = [alertSale, responseId, project_id];

      const result = await executeUpdateWithRetry(db, updateQuery, params);
      console.log("Project sent to DB successfully");

      await closeDatabase(db);

      return { status: 200, statusCode: 1, result };
    } catch (error) {
      console.error("Error sending project to db:", error);
      return { statusCode: 0, errorMessage: error.message };
    }
  },
);
// ipcMain.handle(
//   "sendProjectToDb",
//   async (event, project_id, alertSale, responseId) => {
//     const updateQuery =
//       "UPDATE projects SET is_sent = 1, sent_date = CURRENT_TIMESTAMP, alert_sale = ?, is_sent_id = ? WHERE project_id = ?";

//     try {
//       const result = await new Promise((resolve, reject) => {
//         const db = new sqlite3.Database(dbPath);

//         db.run(
//           updateQuery,
//           [alertSale, responseId, project_id],
//           function (error) {
//             if (error) {
//               db.close();
//               reject({ statusCode: 0, errorMessage: error });
//             } else {
//               db.close();
//               resolve({ rowsAffected: this.changes });
//             }
//           },
//         );
//       });

//       return { statusCode: 1, result };
//     } catch (error) {
//       log.info("Error sending project to db:", error);
//       return { statusCode: 0, errorMessage: error.message };
//     }
//   },
// );

//create new team
ipcMain.handle("createNewTeam", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for createNewTeam");
    }

    const {
      teamname,
      leader_firstname,
      leader_lastname,
      leader_mobile,
      leader_email,
      calendar_amount,
      leader_address,
      leader_postalcode,
      leader_county,
      leader_ssn,
      project_id,
    } = args;

    if (
      !teamname ||
      !leader_firstname ||
      !leader_lastname ||
      !leader_mobile ||
      !leader_email ||
      !project_id
    ) {
      throw new Error("Missing required data for createNewTeam");
    }

    const result = await db.run(
      `
          INSERT INTO teams (
              teamname, leader_firstname, leader_lastname, leader_mobile, leader_email, calendar_amount, leader_address, leader_postalcode, leader_county, leader_ssn, project_id
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
      [
        teamname,
        leader_firstname,
        leader_lastname,
        leader_mobile,
        leader_email,
        calendar_amount,
        leader_address,
        leader_postalcode,
        leader_county,
        leader_ssn,
        project_id,
      ],
    );

    console.log(`Team added successfully`);

    event.sender.send("createNewTeam-response", {
      success: true,
      statusCode: 1,
    });
    return { success: true, statusCode: 1 };
  } catch (err) {
    console.error("Error adding new team:", err.message);
    event.sender.send("createNewTeam-response", { error: err.message });
    return { error: err.message };
  }
});

//get all teams by project_id
ipcMain.handle("getTeamsByProjectId", async (event, project_id) => {
  const retrieveQuery =
    "SELECT * FROM teams WHERE is_deleted = 0 AND project_id = ?";
  console.log("SQL Query:", retrieveQuery, "Parameters:", [project_id]);

  const db = new sqlite3.Database(dbPath);

  try {
    const rows = await executeQueryWithRetry(db, retrieveQuery, [project_id]);

    const allTeams = rows.map((row) => ({
      team_id: row.team_id,
      teamname: row.teamname,
      amount: row.amount,
      leader_firstname: row.leader_firstname,
      leader_lastname: row.leader_lastname,
      leader_address: row.leader_address,
      leader_postalcode: row.leader_postalcode,
      leader_county: row.leader_county,
      leader_mobile: row.leader_mobile,
      leader_email: row.leader_email,
      leader_ssn: row.leader_ssn,
      portrait: row.portrait,
      crowd: row.crowd,
      reason_not_portrait: row.reason_not_portrait,
      protected_id: row.protected_id,
      named_photolink: row.named_photolink,
      sold_calendar: row.sold_calendar,
      calendar_amount: row.calendar_amount,
      created: row.created,
      project_id: row.project_id,
    }));

    await closeDatabase(db);
    return { statusCode: 1, teams: allTeams };
  } catch (error) {
    await closeDatabase(db);
    console.error("Error fetching projects (getTeamsByProjectId):", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});

async function executeQueryWithRetry(
  db,
  query,
  params = [],
  retries = 5,
  delay = 1000,
) {
  return new Promise((resolve, reject) => {
    function attempt() {
      db.all(query, params, (error, rows) => {
        if (error) {
          log.info(
            `Error executing query: ${query}, params: ${params}, retries left: ${retries}`,
          );
          if (error.code === "SQLITE_BUSY" && retries > 0) {
            log.info(`Retrying query after ${delay}ms`);
            setTimeout(attempt, delay);
          } else {
            reject(error);
          }
        } else {
          resolve(rows);
        }
      });
    }
    attempt();
  });
}

function closeDatabase(db) {
  return new Promise((resolve, reject) => {
    db.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
// ipcMain.handle("getTeamsByProjectId", async (event, project_id) => {
//   const retrieveQuery =
//     "SELECT * FROM teams WHERE is_deleted = 0 AND project_id = ?";
//   console.log("SQL Query:", retrieveQuery, "Parameters:", [project_id]);

//   try {
//     const teams = await new Promise((resolve, reject) => {
//       const db = new sqlite3.Database(dbPath);

//       db.all(retrieveQuery, [project_id], (error, rows) => {
//         if (error != null) {
//           db.close();
//           reject({ statusCode: 0, errorMessage: error });
//         }

//         const allTeams = rows.map((row) => ({
//           team_id: row.team_id,
//           teamname: row.teamname,
//           amount: row.amount,
//           leader_firstname: row.leader_firstname,
//           leader_lastname: row.leader_lastname,
//           leader_address: row.leader_address,
//           leader_postalcode: row.leader_postalcode,
//           leader_county: row.leader_county,
//           leader_mobile: row.leader_mobile,
//           leader_email: row.leader_email,
//           leader_ssn: row.leader_ssn,
//           portrait: row.portrait,
//           crowd: row.crowd,
//           protected_id: row.protected_id,
//           named_photolink: row.named_photolink,
//           sold_calendar: row.sold_calendar,
//           calendar_amount: row.calendar_amount,
//           created: row.created,
//           project_id: row.project_id,
//         }));

//         db.close(() => {
//           resolve({ statusCode: 1, teams: allTeams });
//         });
//       });
//     });

//     return teams;
//   } catch (error) {
//     console.error("Error fetching projects (getTeamsByProjectId):", error);
//     return { statusCode: 0, errorMessage: error.message };
//   }
// });

//Update team
ipcMain.handle("addDataToTeam", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for addDataToTeam");
    }
    const {
      leader_address, leader_postalcode, leader_county, leader_ssn, calendar_amount, team_id, } = args;

    if ( !leader_address || !leader_postalcode || !leader_county || !leader_ssn || !calendar_amount || !team_id) {
      throw new Error("Missing required data for addDataToTeam");
    }

    const result = await db.run(
      `
          UPDATE teams
          SET leader_address = ?,
              calendar_amount = ?,  
              leader_postalcode = ?,
              leader_county = ?,
              leader_ssn = ?
          WHERE team_id = ?
          `,
      [
        leader_address,
        calendar_amount,
        leader_postalcode,
        leader_county,
        leader_ssn,
        team_id,
      ],
    );

    console.log(`Team updated successfully`);

    // Send success response to the frontend
    event.sender.send("addDataToTeam-response", { success: true });
    return { success: true };
  } catch (err) {
    console.error("Error updating team:", err.message);
    // Send error response to the frontend
    event.sender.send("addDataToTeam-response", { error: err.message });
    return { error: err.message };
  }
});

//create new class
// ipcMain.handle("createNewClass", async (event, args) => {
//   try {
//     if (!args || typeof args !== "object") {
//       throw new Error("Invalid arguments received for createNewClass");
//     }
//     const { teamname, amount, protected_id, portrait, project_id, crowd } = args;
//     if (!teamname || !amount || !project_id) {
//       throw new Error("Missing required data for createNewClass");
//     }

//     const db = new sqlite3.Database(dbPath);
//     const query = `
//       INSERT INTO teams (
//           teamname,
//           amount,
//           protected_id,
//           portrait,
//           crowd,
//           project_id
//       )
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;
//     const params = [
//       teamname,
//       amount,
//       protected_id ? 1 : 0, // Convert boolean to integer
//       portrait ? 1 : 0, // Convert boolean to integer
//       crowd ? 1 : 0, // Convert boolean to integer
//       project_id
//     ];

//     const result = await executeUpdateWithRetry(db, query, params);
//     console.log(`Class added successfully`);

//     await closeDatabase(db);

//     // Send success response to the frontend
//     return { success: true };
//   } catch (err) {
//     console.error("Error adding new class:", err.message);
//     // Send error response to the frontend
//     return { error: err.message };
//   }
// });
ipcMain.handle("createNewClass", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for createNewClass");
    }
    const {
      teamname,
      amount,
      protected_id,
      portrait,
      reason_not_portrait,
      project_id,
      crowd,
    } = args;
    if (!teamname || !amount || !project_id) {
      throw new Error("Missing required data for createNewClass");
    }

    const result = await db.run(
      `
          INSERT INTO teams (
              teamname, 
              amount, 
              protected_id,
              portrait, 
              reason_not_portrait, 
              crowd, 
              project_id
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
      [
        teamname,
        amount,
        protected_id ? 1 : 0, // Convert boolean to integer,
        portrait ? 1 : 0, // Convert boolean to integer
        reason_not_portrait,
        crowd ? 1 : 0, // Convert boolean to integer
        project_id,
      ],
    );

    console.log(`Class added successfully`);

    // Send success response to the frontend
    event.sender.send("createNewClass-response", { success: true });
    return { success: true };
  } catch (err) {
    console.error("Error adding new class:", err.message);
    // Send error response to the frontend
    event.sender.send("createNewClass-response", { error: err.message });
    return { error: err.message };
  }
});

//Add team data to team
// ipcMain.handle("addTeamDataToTeam", async (event, args) => {
//   try {
//     if (!args || typeof args !== "object") {
//       throw new Error("Invalid arguments received for addTeamDataToTeam");
//     }

//     const { amount, protected_id, portrait, crowd, sold_calendar, team_id } = args;

//     if (!amount || !team_id) {
//       throw new Error("Missing required data for addTeamDataToTeam");
//     }

//     const db = new sqlite3.Database(dbPath);
//     const query = `
//       UPDATE teams
//       SET amount = ?,
//       protected_id = ?,
//       portrait = ?,
//       crowd = ?,
//       sold_calendar = ?
//       WHERE team_id = ?
//     `;
//     const params = [
//       amount,
//       protected_id ? 1 : 0,
//       portrait ? 1 : 0,
//       crowd ? 1 : 0,
//       sold_calendar,
//       team_id
//     ];

//     const result = await executeUpdateWithRetry(db, query, params);
//     console.log(`Team data added successfully`);

//     await closeDatabase(db);

//     // Send success response to the frontend
//     return { success: true };
//   } catch (err) {
//     console.error("Error adding data to team:", err.message);
//     // Send error response to the frontend
//     return { error: err.message };
//   }
// });
ipcMain.handle("addTeamDataToTeam", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for addTeamDataToTeam");
    }

    const {
      amount,
      protected_id,
      portrait,
      reason_not_portrait,
      crowd,
      sold_calendar,
      team_id,
    } = args;

    if (!amount || !team_id) {
      throw new Error("Missing required data for addTeamDataToTeam");
    }

    const result = await db.run(
      `
        UPDATE teams
        SET amount = ?,
        protected_id = ?,
        portrait = ?,
        reason_not_portrait = ?,
        crowd = ?,
        sold_calendar = ?
        WHERE team_id = ?
        `,
      [
        amount,
        protected_id ? 1 : 0,
        portrait ? 1 : 0,
        reason_not_portrait,
        crowd ? 1 : 0,
        sold_calendar,
        team_id,
      ],
    );

    console.log(`Team data added successfully`);

    // Send success response to the frontend
    event.sender.send("addTeamDataToTeam-response", { success: true });
    return { success: true };
  } catch (err) {
    console.error("Error adding data to team:", err.message);
    // Send error response to the frontend
    event.sender.send("addTeamDataToTeam-response", { error: err.message });
    return { error: err.message };
  }
});

//delete team
ipcMain.handle("deleteTeam", async (event, team_id) => {
  const updateQuery = "UPDATE teams SET is_deleted = 1 WHERE team_id = ?";

  try {
    const result = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.run(updateQuery, [team_id], function (error) {
        if (error) {
          db.close();
          reject({ status: 500, statusCode: 500, errorMessage: error });
        } else {
          db.close();
          resolve({ rowsAffected: this.changes });
        }
      });
    });

    if (result.rowsAffected > 0) {
      return { status: 200, statusCode: 200, message: "Team deleted successfully", result };
    } else {
      return { status: 404, statusCode: 404, message: "Team not found or already deleted" };
    }
  } catch (error) {
    console.error("Error deleting team:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});

//edit team data
ipcMain.handle("editTeam", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for editTeam");
    }

    const {
      amount,
      protected_id,
      portrait,
      reason_not_portrait,
      crowd,
      teamname,
      team_id,
      sold_calendar,
      leader_firstname,
      leader_lastname,
      leader_email,
      leader_ssn,
      leader_mobile,
      leader_postalcode,
      leader_address,
      calendar_amount,
      leader_county,
    } = args;

    if (!amount || !teamname || !team_id) {
      throw new Error(
        "Missing required data for editTeam (amount, teamname, team_id)",
      );
    }

    // Adding data to teams_history table
    // Define SQL statement to insert updated team data into teams_history table
    const historySQL = `
            INSERT INTO teams_history (team_id, teamname, amount, leader_firstname, leader_lastname, leader_email, leader_mobile, leader_ssn, leader_address, leader_postalcode, leader_county, calendar_amount, portrait, reason_not_portrait, crowd, protected_id, sold_calendar)
            SELECT team_id, teamname, amount, leader_firstname, leader_lastname, leader_email, leader_mobile, leader_ssn, leader_address, leader_postalcode, leader_county, calendar_amount, portrait, reason_not_portrait, crowd, protected_id, sold_calendar
            FROM teams
            WHERE team_id = ?
        `;

    // Execute insertion SQL statement to copy current team data to teams_history table
    await db.run(historySQL, [team_id]);

    const result = await db.run(
      `
      UPDATE teams
      SET 
        amount = ?,
        teamname = ?,
        protected_id = ?,
        portrait = ?,
        reason_not_portrait = ?,
        sold_calendar = ?,
        crowd = ?,
        leader_firstname = ?,
        leader_lastname = ?,
        leader_email = ?,
        leader_ssn = ?,
        leader_mobile = ?,
        leader_postalcode = ?,
        leader_address = ?,
        calendar_amount = ?,
        leader_county = ?
      WHERE team_id = ?
      `,
      [
        amount,
        teamname,
        protected_id,
        portrait,
        reason_not_portrait,
        sold_calendar,
        crowd,
        leader_firstname,
        leader_lastname,
        leader_email,
        leader_ssn,
        leader_mobile,
        leader_postalcode,
        leader_address,
        calendar_amount,
        leader_county,
        team_id,
      ],
    );

    console.log(`Team data edited successfully`);
    return { success: true };
  } catch (err) {
    console.error("Error editing data:", err.message);
    return { error: err.message };
  }
});

//get team by team id
ipcMain.handle("getTeam", async (event, team_id) => {
  const retrieveQuery = "SELECT * FROM teams WHERE team_id = ?";
  console.log("SQL Query:", retrieveQuery, "Parameters:", [team_id]);

  try {
    const team = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.all(retrieveQuery, [team_id], (error, rows) => {
        if (error != null) {
          db.close();
          reject({ statusCode: 0, errorMessage: error });
        }

        const teamData = rows.map((row) => ({
          team_id: row.team_id,
          teamname: row.teamname,
          amount: row.amount,
          leader_firstname: row.leader_firstname,
          leader_lastname: row.leader_lastname,
          leader_address: row.leader_address,
          leader_postalcode: row.leader_postalcode,
          leader_county: row.leader_county,
          leader_mobile: row.leader_mobile,
          leader_email: row.leader_email,
          leader_ssn: row.leader_ssn,
          portrait: row.portrait,
          crowd: row.crowd,
          protected_id: row.protected_id,
          named_photolink: row.named_photolink,
          sold_calendar: row.sold_calendar,
          created: row.created,
          project_id: row.project_id,
        }));

        db.close(() => {
          resolve({ statusCode: 1, team: teamData });
        });
      });
    });

    return team;
  } catch (error) {
    console.error("Error fetching team:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});

//Add team data to team
ipcMain.handle("addAnomalyToProject", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for addAnomalyToProject");
    }

    const { anomaly, merged_teams, project_id } = args;

    if (!project_id) {
      throw new Error("Missing required project_id for addAnomalyToProject");
    }

    let query = "UPDATE projects SET";
    const params = [];

    if (anomaly !== undefined) {
      query += " anomaly = ?,";
      params.push(anomaly);
    }
    if (merged_teams !== undefined) {
      query += " merged_teams = ?,";
      params.push(merged_teams);
    }

    // Remove the trailing comma from query
    query = query.slice(0, -1);

    query += " WHERE project_id = ?";
    params.push(project_id);

    // Execute the query
    const result = await db.run(query, params);

    console.log(`Data (anomaly and/or merged_teams) added successfully`);

    // Send success response to the frontend
    event.sender.send("addAnomalyToProject-response", { success: true });
    return { success: true };
  } catch (err) {
    console.error("Error adding data to team:", err.message);
    // Send error response to the frontend
    event.sender.send("addAnomalyToProject-response", { error: err.message });
    return { error: err.message };
  }
});

//get all projects and teams by user_id
ipcMain.handle("getProjectsAndTeamsByUserId", async (event, user_id) => {
  const retrieveQuery = `
      SELECT t.team_id, t.teamname, t.amount, t.leader_firstname, t.leader_lastname,
            t.leader_address, t.leader_postalcode, t.leader_county, t.leader_mobile,
            t.leader_email, t.leader_ssn, t.calendar_amount, t.portrait, t.crowd,
            t.protected_id, t.named_photolink, t.sold_calendar, t.is_deleted, t.created,
            t.project_id, p.project_uuid, p.projectname, p.project_date, p.type, p.anomaly, p.merged_teams,
            p.unit, p.alert_sale, p.is_deleted AS project_is_deleted, p.is_sent, p.sent_date,
            p.user_id AS project_user_id, p.created AS project_created
      FROM teams AS t
      JOIN projects AS p ON t.project_id = p.project_id
      WHERE p.user_id = ? AND t.is_deleted = 0 AND p.is_deleted = 0 AND p.is_sent = 1
    `;
  // console.log("SQL Query:", retrieveQuery, "Parameters:", [user_id]);

  try {
    const data = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.all(retrieveQuery, [user_id], (error, rows) => {
        if (error != null) {
          db.close();
          reject({ statusCode: 0, errorMessage: error });
        }

        const allData = rows.map((row) => ({
          project_id: row.project_id,
          project_uuid: row.project_uuid,
          projectname: row.projectname,
          type: row.type,
          anomaly: row.anomaly,
          merged_teams: row.merged_teams,
          unit: row.unit,
          alert_sale: row.alert_sale,
          is_deleted: row.project_is_deleted,
          is_sent: row.is_sent,
          sent_date: row.sent_date,
          user_id: row.project_user_id,
          created: row.project_created,
          teams: {
            team_id: row.team_id,
            teamname: row.teamname,
            amount: row.amount,
            leader_firstname: row.leader_firstname,
            leader_lastname: row.leader_lastname,
            leader_address: row.leader_address,
            leader_postalcode: row.leader_postalcode,
            leader_county: row.leader_county,
            leader_mobile: row.leader_mobile,
            leader_email: row.leader_email,
            leader_ssn: row.leader_ssn,
            calendar_amount: row.calendar_amount,
            portrait: row.portrait,
            crowd: row.crowd,
            protected_id: row.protected_id,
            named_photolink: row.named_photolink,
            sold_calendar: row.sold_calendar,
            is_deleted: row.is_deleted,
            created: row.created,
          },
        }));

        db.close(() => {
          resolve({ statusCode: 1, data: allData });
        });
      });
    });

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});

ipcMain.on("navigateBack", (event) => {
  // Corrected to match the IPC event name
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    focusedWindow.webContents.goBack(); // Navigate back in the Electron window
  }
});

//GDPR protection
ipcMain.handle("gdprProtection", async (event) => {
  const updateQuery =
    "UPDATE teams SET leader_ssn = 'x', leader_firstname = 'x', leader_lastname = 'x', leader_email = 'x', leader_mobile = 'x', leader_address = 'x', leader_county = 'x', leader_postalcode = 'x' WHERE created < date('now', '-12 months')";

  const db = new sqlite3.Database(dbPath);

  try {
    const result = await executeUpdateWithRetry(db, updateQuery);
    await closeDatabase(db);
    return { statusCode: 1, result };
  } catch (error) {
    await closeDatabase(db);
    console.error("Error clearing GDPR data:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});
// ipcMain.handle("gdprProtection", async (event) => {
//   const updateQuery =
//     // "UPDATE teams SET leader_ssn = 'x', leader_firstname = 'x', leader_lastname = 'x', leader_email = 'x', leader_mobile = 'x',  leader_address = 'x',  leader_county = 'x',  leader_postalcode = 'x' WHERE created < DATE_SUB(NOW(), INTERVAL 12 MONTH)";
//     // const updateQuery = "UPDATE teams SET leader_ssn = 'x', leader_firstname = 'x', leader_lastname = 'x' WHERE created < DATE_SUB(NOW(), INTERVAL 6 MONTH);";
//     "UPDATE teams SET leader_ssn = 'x', leader_firstname = 'x', leader_lastname = 'x', leader_email = 'x', leader_mobile = 'x',  leader_address = 'x',  leader_county = 'x',  leader_postalcode = 'x'  WHERE created < date('now', '-12 months')";

//   try {
//     const result = await new Promise((resolve, reject) => {
//       const db = new sqlite3.Database(dbPath);

//       db.run(updateQuery, function (error) {
//         if (error) {
//           db.close();
//           reject({ statusCode: 0, errorMessage: error });
//         } else {
//           db.close();
//           resolve({ rowsAffected: this.changes });
//         }
//       });
//     });

//     return { statusCode: 1, result };
//   } catch (error) {
//     console.error("Error clearing GDPR data:", error);
//     return { statusCode: 0, errorMessage: error.message };
//   }
// });
//GDPR protection teams_history
ipcMain.handle("gdprProtection_teamshistory", async (event) => {
  const updateQuery =
    "UPDATE teams_history SET leader_ssn = 'x', leader_firstname = 'x', leader_lastname = 'x', leader_email = 'x', leader_mobile = 'x',  leader_address = 'x',  leader_county = 'x',  leader_postalcode = 'x'  WHERE created < date('now', '-12 months')";

  const db = new sqlite3.Database(dbPath);

  try {
    const result = await executeUpdateWithRetry(db, updateQuery);
    await closeDatabase(db);
    return { statusCode: 1, result };
  } catch (error) {
    await closeDatabase(db);
    console.error("Error clearing GDPR data in teams_history:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});

// async function executeUpdateWithRetry(query, params = [], retries = 5, delay = 1000) {
//   return new Promise((resolve, reject) => {
//     const db = new sqlite3.Database(dbPath);
//     function attempt() {
//       db.run(query, params, function (error) {
//         if (error) {
//           if (error.code === 'SQLITE_BUSY' && retries > 0) {
//             log.info('Database is busy, retrying...', { retries, delay });
//             setTimeout(() => {
//               attempt(--retries); // Decrement retries and try again
//             }, delay);
//           } else {
//             log.error('Database error:', error.message);
//             db.close();
//             reject(error);
//           }
//         } else {
//           const lastID = this.lastID;
//           db.close();
//           resolve(lastID); // Resolve with the last inserted row ID
//         }
//       });
//     }
//     attempt();
//   });
// }
async function executeUpdateWithRetry(
  db,
  query,
  params = [],
  retries = 5,
  delay = 1000,
) {
  return new Promise((resolve, reject) => {
    function attempt() {
      db.run(query, params, function (error) {
        if (error) {
          if (error.code === "SQLITE_BUSY" && retries > 0) {
            setTimeout(attempt, delay);
          } else {
            reject(error);
          }
        } else {
          resolve({ rowsAffected: this.changes });
        }
      });
    }
    attempt();
  });
}

// ipcMain.handle("gdprProtection_teamshistory", async (event) => {
//   const updateQuery =
//     // "UPDATE teams SET leader_ssn = 'x', leader_firstname = 'x', leader_lastname = 'x', leader_email = 'x', leader_mobile = 'x',  leader_address = 'x',  leader_county = 'x',  leader_postalcode = 'x' WHERE created < DATE_SUB(NOW(), INTERVAL 12 MONTH)";
//     // const updateQuery = "UPDATE teams SET leader_ssn = 'x', leader_firstname = 'x', leader_lastname = 'x' WHERE created < DATE_SUB(NOW(), INTERVAL 6 MONTH);";
//     "UPDATE teams_history SET leader_ssn = 'x', leader_firstname = 'x', leader_lastname = 'x', leader_email = 'x', leader_mobile = 'x',  leader_address = 'x',  leader_county = 'x',  leader_postalcode = 'x'  WHERE created < date('now', '-12 months')";

//   try {
//     const result = await new Promise((resolve, reject) => {
//       const db = new sqlite3.Database(dbPath);

//       db.run(updateQuery, function (error) {
//         if (error) {
//           db.close();
//           reject({ statusCode: 0, errorMessage: error });
//         } else {
//           db.close();
//           resolve({ rowsAffected: this.changes });
//         }
//       });
//     });

//     return { statusCode: 1, result };
//   } catch (error) {
//     console.error("Error clearing GDPR data in teams_history:", error);
//     return { statusCode: 0, errorMessage: error.message };
//   }
// });




//Creating window for showing file in knowledge base
ipcMain.handle('createknowledgebasewindow', async (event, url) => {
  const win = new BrowserWindow({
      autoHideMenuBar: true,
      width: 1200,
      height: 600,
      // parent: mainWindow, // Set the parent window
      // modal: true, // Makes the window modal
  });

  win.loadURL(url);
});

//download file from knowledge base to desktop
ipcMain.handle('downloadKnowledgebaseFile', (event, base64Data, fileName) => {
  return new Promise((resolve, reject) => {
    try {
      // Define path to desktop
      const desktopPath = app.getPath('desktop');
      const fullPath = path.join(desktopPath, fileName);

      // Decode the Base64 string and write to file
      const buffer = Buffer.from(base64Data, 'base64');

      fs.writeFile(fullPath, buffer, (err) => {
        if (err) {
          console.error('File write error:', err);
          reject({ status: 500, error: 'Failed to download file' });
        } else {
          console.log('File saved successfully:', fullPath);
          resolve({ status: 200, message: fullPath });
        }
      });
    } catch (error) {
      console.error('Error in downloadKnowledgebaseFile:', error);
      reject({ status: 500, error: 'Failed to download file' });
    }
  });
});



//get all articles in knowledgebase table
ipcMain.handle("getKnowledgebaseArticles", async (event, user_lang) => {
  console.log("getKnowledgebaseArticles user_lang: ", user_lang);

  const retrieveQuery =
    "SELECT * FROM knowledgebase WHERE deleted = 0 AND langs = ?";
  

  const db = new sqlite3.Database(dbPath);

  try {
    const rows = await executeQueryWithRetry(db, retrieveQuery, [user_lang]);

    const articles = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      tags: row.tags ? row.tags.split(",") : [], 
      langs: row.langs ? row.langs.split(",") : [],
      files: row.files ? JSON.parse(row.files) : [], 
      author: row.author,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted: row.deleted,
    }));

    await closeDatabase(db);
    return { statusCode: 200, articles: articles };
  } catch (error) {
    await closeDatabase(db);
    console.error("Error fetching knowledgebase articles (getKnowledgebaseArticles):", error);
    return { statusCode: 500, errorMessage: error.message };
  }
});


//post articles to knowledgebase table
ipcMain.handle("createKnowledgebaseArticles", async (event, data) => {
  
  const insertQuery = `
  INSERT INTO knowledgebase (article_id, title, description, tags, langs, files, author, created_at, updated_at, deleted)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(article_id) DO UPDATE SET
    title = excluded.title,
    description = excluded.description,
    tags = excluded.tags,
    langs = excluded.langs,
    files = excluded.files,
    author = excluded.author,
    created_at = excluded.created_at,
    updated_at = excluded.updated_at,
    deleted = excluded.deleted;`;

  const deleteQuery = `
  UPDATE knowledgebase SET deleted = 1 WHERE article_id = ?`;

  const db = new sqlite3.Database(dbPath);

  try {
    const existingIdQuery = `SELECT article_id FROM knowledgebase WHERE deleted = 0`;
    const existingIds = await executeQueryWithRetry(db, existingIdQuery); 
    const existingIdSet = new Set(existingIds.map(row => row.article_id));

    const incomingIdSet = new Set(data.map(article => article.id));
    for (const articleId of existingIdSet) {
      if (!incomingIdSet.has(articleId)){
        await executeQueryWithRetry(db, deleteQuery, [articleId]); 
      }
    }

    for (const article of data) {
      const { id, title, description, tags, langs, files, author, created_at, updated_at } = article;

      if (!id || !title || !description || !langs || !tags || !created_at) {
        return { statusCode: 400, errorMessage: "Missing required fields for one or more articles" };
      }

      const tagsArray = Array.isArray(tags) ? tags.join(", ") : "";
      const langsArray = Array.isArray(langs) ? langs.join(", ") : "";
      const filesArray = JSON.stringify(files);
      const deleted = 0

      await executeQueryWithRetry(db, insertQuery, [
        id, title, description, tagsArray, langsArray, filesArray, author, created_at, updated_at, deleted 
      ]);

    }
    await closeDatabase(db);
    return { statusCode: 201, message: "Articles added successfully" };
  } catch (error) {
    await closeDatabase(db);
    console.error("Error adding knowledgebase article:", error);
    return { statusCode: 500, errorMessage: error.message };
  }
});


//Download knowledge base file to locale computer
ipcMain.handle('donwloadKnowledgeBaseFiles', async (event, file) => {
  try {
    const localFilePath = path.join(
      'C:',
      'ProgramData',
      'Photographer Portal',
      'KnowledgeBaseFiles', 
      `${file.originalname}`
    );
    // log.info("localFilePath:", localFilePath);

    if (fs.existsSync(localFilePath)) {
      console.log(`File already exists: ${file.originalname}`);
      return { statusCode: 200, status: "skipped", fileName: file.originalname, fileId: file.id };
    }
      // Make sure directory exists
      const pathDir = path.dirname(localFilePath);
      if (!fs.existsSync(pathDir)) {
        fs.mkdirSync(pathDir, { recursive: true });
      }
      // log.info("pathDir:", pathDir);

    // Download file
    const downloadUrl = `https://fs.ebx.nu/download/${file.id}`;
    const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(localFilePath, response.data);

    console.log(`Downloaded and saved: ${file.originalname, "to path:", pathDir}`);
    return { statusCode: 200, status: "success", fileName: file.originalname, fileId: file.id };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { statusCode: 400, status: "failure", fileName: file.originalname, fileId: file.id, message: error.message };
  }
});


// Open knowledge base file
ipcMain.handle('openLocallyKnowledgeBaseFile', async (event, filename) => {
  log.info("filename", filename);
  try {
     const localFilePath = path.join(
      'C:',
      'ProgramData',
      'Photographer Portal',
      'KnowledgeBaseFiles', 
      `${filename}`
    );

    if (fs.existsSync(localFilePath)) {
      await shell.openPath(localFilePath);
      return { statusCode: 200, status: 'success', fileName: filename, filePath: localFilePath };
    }else {
      console.error('File does not exist locally:', localFilePath);
      return { statusCode: 404, status: 'failure', fileName: filename, filePath: localFilePath };
    }
  } catch (error) {
    console.log("Error viewing file:", error)
    return { statusCode: 400, status: "failure", fileName: filename, message: error.message }
  }
})

// DO NOT NEED
// Download knowledge base file
ipcMain.handle('downloadLocallyKnowledgeBaseFile', async (event, filename) => {
  log.info("filename", filename);
  try {

    const result = await dialog.showSaveDialog({
      title: 'Save Knowledge Base File',
      defaultPath: path.join(os.homedir(), 'Desktop', filename),
      filters: [
        { name: 'All Files', extensions: ['*'] } 
      ]
    });

    if (result.canceled) {
      console.log('User canceled the save dialog');
      return { statusCode: 0, status: 'canceled' };
    }

    const selectedPath = result.filePath;

    if (fs.existsSync(selectedPath)) {
      await shell.openPath(selectedPath); 
      return {
        statusCode: 200,
        status: 'success',
        fileName: filename,
        filePath: selectedPath
      };
    } else {
      console.error('File does not exist locally:', selectedPath);
      // resolve({ status: 'failure' });
      return {
        statusCode: 404,
        status: 'failure',
        fileName: filename,
        filePath: selectedPath
      };
    }
  } catch (error) {
    console.log("Error viewing file:", error)
    return { statusCode: 400, status: "failure", fileName: filename, message: error.message }
  }
})




//upload file in filetransfer
ipcMain.handle("uploadFile", async (event, filePath, lang, filesize) => {
  log.info("uploadFile triggered");

  let country = "";
  if (lang === "SE") {
    country = "Sweden";
  } else if (lang === "NO") {
    country = "Norway";
  } else if (lang === "FI") {
    country = "Finland";
  } else if (lang === "DE") {
    country = "Germany";
  } else if (lang === "DK") {
    country = "Denmark";
  }

  try {
    log.info("starting file upload");
    const result = await uploadFileToFTP(event, filePath, ftpConfig, country, filesize);
    log.info("result uploadFileToFTP:", result);
    return { statusCode: 200, status: "success", message: result };
  } catch (error) {
    log.info("error file upload");
    log.info(error.message);
    return { statusCode: 400, status: "failure", message: error.message };
  }
});

//uploadfiletoFTP method
async function uploadFileToFTP(event, filePath, ftpConfig, country, filesize) {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access(ftpConfig);
    log.info(`Uploading ${filePath} to FTP server...`);
    log.info(`Connected to FTP server: ${ftpConfig.host}`);

    const remoteDirectory = `FileTransfer/${country}/`;
    log.info("remote directory:", remoteDirectory);

    const remotePath = path.posix.join(
      remoteDirectory,
      path.basename(filePath),
    );
    log.info(`Uploading ${filePath} to FTP server as ${remotePath}...`);

    client.trackProgress((info) => {
      console.log("File", info.name);
      console.log("File size", filesize);
      console.log("Type", info.type);
      console.log("Transferred", info.bytes);
      console.log("Transferred Overall", info.bytesOverall);
      const percentage = ((info.bytesOverall / filesize) * 100).toFixed(2);
      console.log(`Upload Progress: ${percentage}%`);
      event.sender.send("upload-progress", { percentage });
    });

    await client.uploadFrom(filePath, remotePath);
    log.info("Upload successful!");
    return "Upload successful!";
  } catch (err) {
    log.info("Error uploading file:", err);
    throw new Error(`Error uploading file: ${err.message}`);
  } finally {
    client.close();
  }
}



//create new FT project
ipcMain.handle("createNewFTProject", async (event, data) => {
  log.info("createNewFTProject triggered");
  return new Promise((resolve, reject) => {
    try {
      if (!data || typeof data !== "object") {
        throw new Error("Invalid arguments received for createNewFTProject");
      }
      const { project_uuid, projectname, user_id, project_id } = data;
      if (!project_uuid || !projectname || !user_id || !project_id) {
        throw new Error("Missing required data for createNewFTProject");
      }

      const query = `
          INSERT INTO ft_projects (
              project_uuid, projectname, user_id, project_id 
          )
          VALUES (?, ?, ?, ?)
        `;
      const params = [project_uuid, projectname, user_id, project_id];

      db.run(query, params, function (err) {
        if (err) {
          log.error("Error adding new createNewFTProject:", err.message);
          reject({ status: 400, error: err.message });
        } else {
          const ft_project_id = this.lastID;
          log.info(
            `createNewFTProject added successfully with id ${ft_project_id}`,
          );
          resolve({ status: 200, success: true, ft_project_id });
        }
      });
    } catch (err) {
      log.error("Error adding new createNewFTProject:", err.message);
      reject({ error: err.message });
    }
  });
});

//add new FT file
ipcMain.handle("addFTFile", async (event, fileData) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fileData || typeof fileData !== "object") {
        throw new Error("Invalid arguments received for addFTFile");
      }
      const { filename, ft_project_id, filepath } = fileData;
      if (!filename || !ft_project_id) {
        throw new Error("Missing required data for addFTFile");
      }

      const query = `
            INSERT INTO ft_files (
              filename, ft_project_id, filepath 
            )
            VALUES (?, ?, ?)
          `;
      const params = [filename, ft_project_id, filepath];

      db.run(query, params, function (err) {
        if (err) {
          log.error("Error adding new addFTFile:", err.message);
          reject({status: 400, error: err.message });
        } else {
          log.info(`addFTFile added successfully`);
          resolve({ status: 201, success: true, message: "success", filename: filename });
        }
      });
    } catch (err) {
      log.error("Error adding new addFTFile:", err.message);
      reject({ status: 400, error: err.message });
    }
  });
});

ipcMain.handle("getAllFTData", async (event, user_id) => {
  return new Promise((resolve, reject) => {
    const query = `
          SELECT p.ft_project_id, p.project_uuid, p.projectname, p.is_sent, p.created, p.user_id, p.project_id, f.ft_file_id, f.filename, f.filepath, f.uploaded_at
          FROM ft_projects p
          INNER JOIN ft_files f ON p.ft_project_id = f.ft_project_id
          WHERE p.user_id = ?
        `;

    db.all(query, [user_id], (err, rows) => {
      if (err) {
        log.error("Error fetching FT data:", err.message);
        reject(new Error(err.message));
      } else {
        const projects = {};

        rows.forEach((row) => {
          if (!projects[row.ft_project_id]) {
            projects[row.ft_project_id] = {
              ft_project_id: row.ft_project_id,
              project_uuid: row.project_uuid,
              projectname: row.projectname,
              is_sent: row.is_sent,
              created: row.created,
              user_id: row.user_id,
              project_id: row.project_id,
              files: [],
            };
          }
          projects[row.ft_project_id].files.push({
            ft_file_id: row.ft_file_id,
            filename: row.filename,
            filepath: row.filepath,
            uploaded_at: row.uploaded_at,
          });
        });

        const result = Object.values(projects);
        log.info("FT data fetched and organized successfully");
        resolve(result);
      }
    });
  }).catch((err) => {
    log.error("Unhandled error in getAllFTData:", err.message);
    throw err;
  });
});

//get all previous projects by user_id
ipcMain.handle("getAllFTDataBySearch", async (event, user_id, searchString) => {
  const retrieveQuery = `
        SELECT p.ft_project_id, p.project_uuid, p.projectname, p.is_sent, p.created, p.user_id, p.project_id, 
               f.ft_file_id, f.filename, f.filepath, f.uploaded_at
               FROM ft_projects p
               INNER JOIN ft_files f ON p.ft_project_id = f.ft_project_id
               WHERE p.user_id = ? AND p.projectname LIKE ?
      `;

  console.log("SQL Query:", retrieveQuery, "Parameters:", [
    user_id,
    `%${searchString}%`,
  ]);

  try {
    const projects = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.all(retrieveQuery, [user_id, `%${searchString}%`], (error, rows) => {
        if (error) {
          db.close();
          return reject({ statusCode: 0, errorMessage: error.message });
        }

        const projects = {};

        rows.forEach((row) => {
          if (!projects[row.ft_project_id]) {
            projects[row.ft_project_id] = {
              ft_project_id: row.ft_project_id,
              project_uuid: row.project_uuid,
              projectname: row.projectname,
              is_sent: row.is_sent,
              created: row.created,
              user_id: row.user_id,
              project_id: row.project_id,
              files: [],
            };
          }
          projects[row.ft_project_id].files.push({
            ft_file_id: row.ft_file_id,
            filename: row.filename,
            filepath: row.filepath,
            uploaded_at: row.uploaded_at,
          });
        });

        db.close(() => {
          resolve({ statusCode: 1, projects: Object.values(projects) });
        });
      });
    });

    return projects;
  } catch (error) {
    console.error("Error fetching searched projects:", error);
    return { statusCode: 0, errorMessage: error.message };
  }
});


// get all unsent ft data with project_date > 3 days ago
ipcMain.handle("getUnsentFTProjects", async (event, user_id) => {
  log.info("user_id", user_id)
  const retrieveQuery = `
    SELECT p.*
    FROM projects p
    LEFT JOIN ft_projects ftp ON p.project_id = ftp.project_id
    WHERE 
      p.project_date < DATE('now', '-3 days')
      AND ftp.project_id IS NULL
      AND p.user_id = ?;
  `;
  // console.log("SQL Query:", retrieveQuery, "Parameters:", [user_id]);
  const db = new sqlite3.Database(dbPath);

  try {
    const rows = await executeQueryWithRetry(db, retrieveQuery, [user_id]);

    const unsentFTdata = rows.map((row) => ({
          project_uuid: row.project_uuid,
          projectname: row.projectname,
          project_date: row.project_date,
          created: row.created,
          is_sent: row.is_sent,
          created: row.created,
          user_id: row.user_id,
          project_id: row.project_id
    }));
    log.info("unsentFTdata", unsentFTdata)
    return { statusCode: 200, data: unsentFTdata };
  } catch (error) {
    console.error("Error fetching data (getAllTimereports):", error);
    return { statusCode: 0, errorMessage: error.message };
  } finally{
    await closeDatabase(db);
  }
});




// FILE REPORT

//get all currents in timereport table by user_id
ipcMain.handle("getAllTimereports", async (event, user_id) => {
  const retrieveQuery = "SELECT * FROM timereport WHERE user_id = ? AND is_deleted = 0";
  console.log("SQL Query:", retrieveQuery, "Parameters:", [user_id]);

  const db = new sqlite3.Database(dbPath);

  try {
    const rows = await executeQueryWithRetry(db, retrieveQuery, [user_id]);

    const allTimeReport = rows.map((row) => ({
      id: row.id,
      projectname: row.projectname,
      starttime: row.starttime,
      endtime: row.endtime,
      breaktime: row.breaktime,
      miles: row.miles,
      tolls: row.tolls,
      park: row.park,
      other_fees: row.other_fees,
      timereport_is_sent: row.is_sent,
      timereport_is_sent_permanent: row.is_sent_permanent,
      project_id: row.project_id,
      project_date: row.project_date,
      user_id: row.user_id,
      created: row.created,
    }));
    log.info("allTimeReport", allTimeReport)
    return { statusCode: 200, data: allTimeReport };
  } catch (error) {
    console.error("Error fetching data (getAllTimereports):", error);
    return { statusCode: 0, errorMessage: error.message };
  } finally {
    await closeDatabase(db);
  }
});



//get all currents in timereport table by user_id
ipcMain.handle("getUnsubmittedTimeReport", async (event, user_id) => {
  const now = new Date();
  // Get the start of this month
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfThisMonth.setHours(0, 0, 0, 0);
  // Get the start of last month
  const startOfLastMonth = new Date(startOfThisMonth);
  startOfLastMonth.setMonth(startOfThisMonth.getMonth() - 1);
  startOfLastMonth.setHours(0, 0, 0, 0); 

  const startOfLastMonthISO = startOfLastMonth.toISOString().slice(0, 19).replace('T', ' ');
  const startOfThisMonthISO = startOfThisMonth.toISOString().slice(0, 19).replace('T', ' ');
  console.log("Start of last month:", startOfLastMonthISO);
  console.log("Start of this month:", startOfThisMonthISO);

  // SQL query with dynamic date range
  const retrieveQuery = `
    SELECT * FROM timereport
    WHERE user_id = ?
      AND is_deleted = 0
      AND project_date >= ? 
      AND project_date < ?;
  `;

  const db = new sqlite3.Database(dbPath);

  try {
    const rows = await executeQueryWithRetry(db, retrieveQuery, [user_id, startOfLastMonthISO, startOfThisMonthISO]);

    const UnsubmittedTimeReport = rows.map((row) => ({
      id: row.id,
      projectname: row.projectname,
      starttime: row.starttime,
      endtime: row.endtime,
      breaktime: row.breaktime,
      miles: row.miles,
      tolls: row.tolls,
      park: row.park,
      other_fees: row.other_fees,
      timereport_is_sent: row.is_sent,
      timereport_is_sent_permanent: row.is_sent_permanent,
      project_id: row.project_id,
      project_date: row.project_date,
      user_id: row.user_id,
      created: row.created,
    }));

    console.log("Unsubmitted Time Report:", UnsubmittedTimeReport);
    return { statusCode: 200, data: UnsubmittedTimeReport };
  } catch (error) {
    console.error("Error fetching data (getUnsubmittedTimeReport):", error);
    return { statusCode: 0, errorMessage: error.message };
  } finally {
    await closeDatabase(db);
  }
});



// //get projects from lastr report period by user_id
ipcMain.handle("getLastReportPeriodProjects", async (event, user_id) => {
  const now = new Date();
  // Get the start of this month
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfThisMonth.setHours(0, 0, 0, 0); 
  // Get the start of last month
  const startOfLastMonth = new Date(startOfThisMonth);
  startOfLastMonth.setMonth(startOfThisMonth.getMonth() - 1);
  startOfLastMonth.setHours(0, 0, 0, 0); 
  // Convert to ISO string to match the format of your `project_date` field
  const startOfLastMonthISO = startOfLastMonth.toISOString().slice(0, 19).replace('T', ' ');
  const startOfThisMonthISO = startOfThisMonth.toISOString().slice(0, 19).replace('T', ' ');
  console.log("Start of last month:", startOfLastMonthISO);
  console.log("Start of this month:", startOfThisMonthISO);

  const retrieveQuery = `
    SELECT * FROM projects
    WHERE user_id = ?
      AND is_deleted = 0 
      AND project_date >= ? 
      AND project_date < ?;
  `;

  const db = new sqlite3.Database(dbPath);

  try {
    const rows = await executeQueryWithRetry(db, retrieveQuery, [user_id, startOfLastMonthISO, startOfThisMonthISO]);

    const previousProjects = rows.map((row) => ({
      project_id: row.project_id,
      project_uuid: row.project_uuid,
      projectname: row.projectname,
      type: row.type,
      anomaly: row.anomaly,
      merged_teams: row.merged_teams,
      unit: row.unit,
      lang: row.lang,
      alert_sale: row.alert_sale,
      is_deleted: row.is_deleted,
      is_sent: row.is_sent,
      sent_date: row.sent_date,
      user_id: row.user_id,
      project_date: row.project_date,
      created: row.created,
    }));
    
    return { statusCode: 1, projects: previousProjects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { statusCode: 0, errorMessage: error.message };
  } finally {
    await closeDatabase(db);
  }
});


// set is_sent = 0
ipcMain.handle("changeCompleted", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for changeCompleted");
    }
    const { project_id, user_id } = args;

    if ( !project_id || !user_id ) {
      throw new Error("Missing required data (project_id, user_id) for changeCompleted");
    }

      const updateResult = await db.run(
        `
        UPDATE timereport SET is_sent = 0 WHERE project_id = ? AND user_id = ?
        `,
        [project_id, user_id]
      );

      console.log(`Updated is_sent to 0 for project_id: ${project_id}`, updateResult);
      event.sender.send("changeCompleted-response", { statusCode: 200, success: true });
      return { statusCode: 200, success: true };
        
  } catch (err) {
    console.error("Error inserting timereport:", err.message);
    event.sender.send("changeCompleted-response", { error: err.message });
    return { error: err.message };
  }
});



// mark activity as completed
ipcMain.handle("markActivityAsCompleted", async (event, args) => {
  try {
    if (!args || typeof args !== "object") {
      throw new Error("Invalid arguments received for markActivityAsCompleted");
    }
    const { starttime, endtime, breaktime, miles, tolls, park, other_fees, project_id, user_id, project_date, projectname } = args;

    if ( !starttime || !endtime || !breaktime || !project_id || !user_id || !project_date || !projectname ) {
      throw new Error("Missing required data for markActivityAsCompleted");
    }

     // Insert the new user into the database
     await db.run(
      `
      INSERT INTO timereport (starttime, endtime, breaktime, miles, tolls, park, other_fees, is_sent, project_id, user_id, project_date, projectname)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
      ON CONFLICT(project_id, user_id) 
      DO UPDATE SET 
        starttime = excluded.starttime,
        endtime = excluded.endtime,
        breaktime = excluded.breaktime,
        miles = excluded.miles,
        tolls = excluded.tolls,
        park = excluded.park,
        other_fees = excluded.other_fees,
        is_sent = 1,
        project_date = excluded.project_date,
        projectname = excluded.projectname
      `,
      [starttime, endtime, breaktime, miles, tolls, park, other_fees, project_id, user_id, project_date, projectname],
    );

    console.log("Timereport added successfully");
    event.sender.send("markActivityAsCompleted-response", { statusCode: 201, success: true });
    return { statusCode: 201, success: true };
  } catch (err) {
    console.error("Error inserting timereport:", err.message);
    // Send error response to the frontend
    event.sender.send("markActivityAsCompleted-response", { error: err.message });
    return { error: err.message };
  }
});


// Mark all jobs in time span as completed by setting is_sent_permanent = 1
ipcMain.handle("markAsCompletedPermanent", async (event, args) => {
  const { project_id, user_id } = args;
  log.info("project_id: ", project_id)
  const updateQuery =
    `
    UPDATE timereport SET is_sent_permanent = 1 WHERE project_id = ? AND user_id = ?
    `;
  
  const db = new sqlite3.Database(dbPath);

  try {
    // Loop through each project_id and update is_sent_permanent
    const result = await executeUpdateWithRetry(db, updateQuery, [project_id, user_id]);
    await closeDatabase(db);
    return { status: 200, result: result, message: "is_sent_permanent was set to 1" };
  } catch (error) {
    await closeDatabase(db);
    console.error("Error setting is_sent_permanent to 1 in timereport table:", error);
    return { status: 0, errorMessage: error.message };
  }
});


// delete row in timereport table
ipcMain.handle("deleteTimereportRow", async (event, args) => {
  const { project_id, user_id } = args;
  log.info("project_id: ", project_id);

  const updateQuery = `
    UPDATE timereport SET is_deleted = 1 WHERE project_id = ? AND user_id = ?
  `;

  const db = new sqlite3.Database(dbPath);

  try {
    const result = await executeUpdateWithRetry(db, updateQuery, [project_id, user_id]);
    log.info("Row updated successfully: ", result);

    return { status: 200, result: result, message: "Deleted", project_id: project_id };
  } catch (error) {
    console.error("Error deleting row in timereport table:", error);
    return { status: 0, errorMessage: error.message };
  } finally {
    db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err.message);
      } else {
        log.info("Database connection closed.");
      }
    });
  }
});












