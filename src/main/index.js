import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const electron = require("electron");
const log = require('electron-log');
const path = require("path");
const fs = require("fs");
const fsa = require("fs/promises");
const util = require('util');
const sqlite3 = require('sqlite3').verbose();
const fse = require("fs-extra");
// const icon = path.join(__dirname, "../../resources/icon2.png");
const ipcMain = electron.ipcMain;
const app = electron.app;
const os = require('os'); // Import the os module
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
// const icon = path.join(__dirname, "../../resources/icon2.png");
// const icon2 = path.join(__dirname, "../../resources/icon2.icns");

// Set the icon path based on the build environment
let iconPath;
if (isDev) {
  // Development mode path
  let iconPath = path.join(__dirname, '..', '..', 'resources', 'logo.png');
  if (process.platform === 'darwin') {
    iconPath = path.join(__dirname, '..', '..', 'resources', 'icon2.icns');
  }
} else {
  // Production mode path
  let iconPath = path.join(__dirname, '../../resources/logo.png').replace("app.asar", "app.asar.unpacked");
  if (process.platform === 'darwin') {
    iconPath = path.join(__dirname, '../../resources/icon2.icns').replace("app.asar", "app.asar.unpacked");
  }
}




// import updateQuestion from "./api/updateQuestion"
// import deleteQuestion from "./api/deleteQuestion"
// import insertQuestion from "./api/insertQuestion"
// import getUnits from "./api/getUnits"
// import getCourseOutcomes from "./api/getCourseOutcomes"
// import updateCourseOutcomes from "./api/updateCourseOutcomes"
import express from 'express';

if (isDev) {
  console.log('Running in development mode');
} else {
  console.log('Running in production mode');
}


let loginWindow;
let mainWindow;

function createLoginWindow() {
  if(!is.dev){
    const exApp = express()
    exApp.use(express.static(path.join(__dirname, '../renderer/')));
    exApp.listen(5173)
  } 

  // Create the browser window.
  loginWindow = new BrowserWindow({
     // parent: mainWindow, // Set the parent window if needed
          // modal: true, // Example: Open as a modal window
          width: 350,
          height: 460,
          resizable: false, 
          // frame: false,
          // show: false,
          autoHideMenuBar: true,
          // ...(process.platform === 'linux' ? { icon } : {}),
          // icon: iconPath, 
          // icon: path.join(__dirname, '../../resources/icon2.png'),
          webPreferences: {
            preload : path.join(__dirname, '../preload/index.js') ,
            sandbox: false,
            contextIsolation: true,
            nodeIntegration: true,
            webSecurity: false,
            worldSafeExecuteJavaScript: true,
          }
  })

  // Hide the menu bar
  // mainWindow.setMenuBarVisibility(false);

  // Open DevTools in development mode
  if (isDev) {
    loginWindow.webContents.openDevTools({ mode: 'detach' });
  }
  // if (isDev) {
  //   mainWindow.webContents.openDevTools({});
  //  }

  loginWindow.on('ready-to-show', () => {
    loginWindow.show()
  })

  loginWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  log.info(path.join(__dirname, '../preload/index.js'))
  
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  // loginWindow.loadURL(
  //   isDev
  //       ? "http://localhost:5173/#/login_window"
  //       : `file://${path.join(__dirname, "../build/index.html#/login_window")}`
  // );
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // loginWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    // loginWindow.loadURL("http://localhost:5173/#/login_window")
    loginWindow.loadURL("http://localhost:5173/#/login_window")
  } else {
    // loginWindow.loadFile(path.join(__dirname, '../renderer/index.html/#login_window"'))
    // loginWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    loginWindow.loadURL(`file://${path.join(__dirname, '../renderer/index.html#/login_window')}`);
  }
}

app.whenReady().then(() => {
  log.info("Ready")
  electronApp.setAppUserModelId('ElectronReactApplication')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createLoginWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Create mainWindow when Electron has finished initialization
// // app.on("activate", () => {
// //   if (loginWindow.getAllWindows().length === 0) {
// //     createLoginWindow();
// //   }
// // });
// app.on('ready', () => {
//   createMainWindow();
//   // When the main window is ready, load the login_window route
//   mainWindow.webContents.on('did-finish-load', () => {
//     mainWindow.webContents.send('navigate-to', '/login_window');
//   });
// });

process.on("uncaughtException", (error) => {
  log.info(`Exception: ${error}`);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

log.info(process.resourcesPath)


//Database Connection And Instance
// Construct the absolute path to the SQLite database file
let dbPath;
if (isDev) {
  // Development mode path
  dbPath = path.join(__dirname, '..', '..', 'resources', 'fp.db');
} else {
  // Production mode path
  dbPath = path.join(__dirname, "../../resources/fp.db").replace("app.asar", "app.asar.unpacked")
}

// Create or open SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    createTables(); // Call the function to create tables
  }
});



// Function to create tables
function createTables() {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      password TEXT NOT NULL,
      city TEXT,
      lang STRING NOT NULL,
      token STRING,
      created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created successfully');
      // insertDataToTables();
    }
  });

  // Create project table
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      project_id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_uuid STRING NOT NULL,
      projectname TEXT NOT NULL,
      photographername TEXT,
      project_date TEXT NOT NULL,
      type SRTING NOT NULL,
      anomaly TEXT,
      merged_teams TEXT,
      unit BOOLEAN,
      created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      alert_sale BOOLEAN,
      is_deleted BOOLEAN DEFAULT 0,
      is_sent BOOLEAN DEFAULT 0,
      sent_date TEXT,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating projects table:', err.message);
    } else {
      console.log('Projects table created successfully');
    }
  });

    // Create teams table
    db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      team_id INTEGER PRIMARY KEY AUTOINCREMENT,
      teamname TEXT NOT NULL,
      amount INT,
      leader_firstname STRING,
      leader_lastname STRING,
      leader_address STRING,
      leader_postalcode STRING,
      leader_county STRING,
      leader_mobile STRING,
      leader_email STRING,
      leader_ssn INTEGER,
      calendar_amount INTEGER,
      portrait BOOLEAN,
      crowd BOOLEAN,
      protected_id BOOLEAN,
      named_photolink BOOLEAN,
      sold_calendar BOOLEAN,
      is_deleted BOOLEAN DEFAULT 0,
      created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      project_id INTEGER NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(project_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating teams table:', err.message);
    } else {
      console.log('Teams table created successfully');
    }
  });

  
    // Create teams_history table
    db.run(`
    CREATE TABLE IF NOT EXISTS teams_history (
      team_history_id INTEGER PRIMARY KEY AUTOINCREMENT,
      teamname TEXT,
      amount INT,
      leader_firstname STRING,
      leader_lastname STRING,
      leader_address STRING,
      leader_postalcode STRING,
      leader_county STRING,
      leader_mobile STRING,
      leader_email STRING,
      leader_ssn INTEGER,
      calendar_amount INTEGER,
      portrait BOOLEAN,
      crowd BOOLEAN,
      protected_id BOOLEAN,
      named_photolink BOOLEAN,
      sold_calendar BOOLEAN,
      is_deleted BOOLEAN DEFAULT 0,
      created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      team_id INTEGER NOT NULL,
      FOREIGN KEY (team_id) REFERENCES teams(team_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating teams_history table:', err.message);
    } else {
      console.log('Teams_history table created successfully');
    }
  });

   // Create _projects table
   db.run(`
   CREATE TABLE IF NOT EXISTS _projects (
     project_id_ INTEGER PRIMARY KEY AUTOINCREMENT,
     project_uuid STRING NOT NULL,
     projectname STRING NOT NULL,
     start TEXT NOT NULL,
     lang STRING NOT NULL
   )
 `, (err) => {
   if (err) {
     console.error('Error creating _projects table:', err.message);
   } else {
     console.log('_projects table created successfully');
   }
 });

}

// Function to insert data into tables
function insertDataToTables(){

  db.run(`
  INSERT INTO users (email, firstname, lastname, city, lang, token) 
  VALUES ('user@example.com', 'John', 'Doe', 'New York', 'SE', '123xyz')
`, (err) => {
  if (err) {
    console.error('Error inserting user:', err.message);
  } else {
    console.log('User inserted successfully');
  }
});

  db.run(`
  INSERT INTO users (email, firstname, lastname, city, lang, token) 
  VALUES ('lucas@example.com', 'Lucas', 'Schuber', 'Stockholm', 'SE', 'abc098')
  `, (err) => {
  if (err) {
    console.error('Error inserting user:', err.message);
  } else {
    console.log('User inserted successfully');
  }
  });

}


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




ipcMain.handle("create_Projects", async (event, projects) => {
  try {
    console.log('Received projects data:', projects); // Log received data for debugging

    if (!Array.isArray(projects)) {
      throw new Error('Invalid data received for create_Projects');
    }

     // Clear existing data from the _projects table
     await db.run('DELETE FROM _projects');

    // Insert each project into the database
    const stmt = db.prepare('INSERT INTO _projects (project_uuid, projectname, start, lang) VALUES (?, ?, ?, ?)');
    for (const project of projects) {
      // Check if _project_uuid is provided and not null
      if (!project.project_uuid) {
        console.error('Error adding project:', 'Missing _project_uuid');
        continue; // Skip insertion for this project
      }

      stmt.run(project.project_uuid, project.projectname, project.start, project.lang);
    }
    stmt.finalize();

    console.log('Projects added successfully');
    event.sender.send('add-projects-response', { success: true }); // Send success response
  } catch (err) {
    console.error('Error adding projects:', err.message);
    event.sender.send('add-projects-response', { error: err.message }); // Send error response
  }
});




//get spcific user
ipcMain.handle("getUser", async (event, id) => {
  const retrieveQuery = "SELECT * FROM users WHERE user_id = ?"; 

  try {
      const user = await new Promise((resolve, reject) => {
          const db = new sqlite3.Database(dbPath);

          db.get(retrieveQuery, [id], (error, row) => {
              if (error) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: error });
              } else if (!row) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: 'User not found' });
              } else {
                  db.close();
                  resolve({
                      user_id: row.user_id,
                      email: row.email,
                      firstname: row.firstname,
                      lastname: row.lastname,
                      city: row.city,
                      lang: row.lang,
                      created: row.created
                  });
              }
          });
      });

      return { statusCode: 1, user: user };
  } catch (error) {
      console.error('Error fetching user data:', error);
      return { statusCode: 0, errorMessage: error.message };
  }
});



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

        const allUsers = rows.map(row => ({
          user_id: row.user_id,
          email: row.email,
          firstname: row.firstname,
          lastname: row.lastname,
          city: row.city,
          lang: row.lang,
          created: row.created
        }));

        db.close(() => {
          resolve({ statusCode: 1, users: allUsers });
        });
      });
    });

    return { statusCode: 1, users: users }; // Corrected to return 'users' instead of 'allUsers'
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { statusCode: 0, errorMessage: error.message };
  }
});




//create new user
ipcMain.handle("createUser", async (event, args) => {
  try {
      if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments received for createUser');
      }

      const { email, firstname, surname, password, language, token } = args;

      if (!email || !firstname || !surname || !language || !token || !password ) {
          throw new Error('Missing required user data for createUser');
      }

      const userExists = await checkUsernameInDatabase(email);
      if (userExists) {
        event.sender.send('createUser-response', { success: false, error: 'User already exists' });
        return { success: false, error: 'User already exists' };

      } else {
        // Insert the new user into the database
        await db.run(`
        INSERT INTO users (email, firstname, lastname, password, lang, token)
        VALUES (?, ?, ?, ?, ?, ?)
        `, [email, firstname, surname, password, language, token]);

        console.log('User added successfully');
        event.sender.send('loginUser-response', { success: true });
        return { success: true };  
      }
  } catch (err) {
      console.error('Error adding new user data:', err.message);
      event.sender.send('createUser-response', { error: err.message });
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
              console.error('Error checking username in database:', err);
              reject(err);
              return;
          }

          // Resolve with the result of the query
          resolve(row.count === 1);
      });
  });
};


//loginUser
ipcMain.handle("loginUser", async (event, args) => {
  try {
    if (!args || typeof args !== 'object') {
        throw new Error('Invalid arguments received for loginUser');
    }

    const { email, password } = args;

    if (!email || !password ) {
        throw new Error('Missing required user data for loginUser');
    }

    const userExists = await checkUserInDatabase(email, password);
    
    if (userExists) {
        // If the user exists and the password matches, send success response
        const user = await getUserDetails(email);
        
        event.sender.send('loginUser-response', { success: true, user });
        return { success: true, user }; 
    } else {
        // If the user doesn't exist or password doesn't match, send error response
        throw new Error('Invalid username or password');
    }
} catch (err) {
    console.error('Error logging user:', err.message);
    event.sender.send('loginUser-response', { error: err.message });
    return { error: err.message };
}
});
const checkUserInDatabase = (email, password) => {
  return new Promise((resolve, reject) => {
      // Prepare the SQL query to check if the email and password match
      const checkUserQuery = `SELECT COUNT(*) AS count FROM users WHERE email = ? AND password = ?`;

      // Execute the SQL query
      db.get(checkUserQuery, [email, password], (err, row) => {
          if (err) {
              // Reject with error if query execution fails
              console.error('Error checking user in database:', err);
              reject(err);
              return;
          }

          // Resolve with the result of the query
          resolve(row.count === 1);
      });
  });
};
const getUserDetails = (email) => {
  return new Promise((resolve, reject) => {
      // Prepare the SQL query to fetch user details based on email
      const getUserQuery = `SELECT * FROM users WHERE email = ?`;

      // Execute the SQL query
      db.get(getUserQuery, [email], (err, row) => {
          if (err) {
              // Reject with error if query execution fails
              console.error('Error fetching user details from database:', err);
              reject(err);
              return;
          }

          // Resolve with the user details
          resolve(row);
      });
  });
};






//edit user data
ipcMain.handle("editUser", async (event, args) => {
  try {
      if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments received for editUser');
      }

      const { email, firstname, lastname, city, lang, user_id } = args;

      if (!user_id || !email || !lang ) {
          throw new Error('Missing required data (user_id) for editUser');
      }

      const result = await db.run(`
      UPDATE users
      SET 
        email = ?, firstname = ?, lastname = ?, city = ?, lang = ? WHERE user_id = ?
      `, [ email, firstname, lastname, city, lang, user_id ]);
          
      console.log(`User data edited successfully`);
      // Send success response to the frontend
      event.sender.send('editUser-response', { success: true });
      return { success: true };
      
  } catch (err) {
      console.error('Error editing user:', err.message);
      // Send error response to the frontend
      event.sender.send('editUser-response', { error: err.message });
      return { error: err.message };
  }
});





//get all current projects by user_id
ipcMain.handle("getAllCurrentProjects", async (event, user_id) => {
  const retrieveQuery = "SELECT * FROM projects WHERE user_id = ? AND is_sent = 0 AND is_deleted = 0"; 
  console.log('SQL Query:', retrieveQuery, 'Parameters:', [user_id]);

  try {
    const projects = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.all(retrieveQuery, [user_id], (error, rows) => {
        if (error != null) {
          db.close();
          reject({ statusCode: 0, errorMessage: error });
        }

        const allProjects = rows.map(row => ({
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
          project_date: row.project_date,
          created: row.created
        }));

        db.close(() => {
          resolve({ statusCode: 1, projects: allProjects });
        });
      });
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { statusCode: 0, errorMessage: error.message };
  }
});


//get all previous projects by user_id
ipcMain.handle("getAllPreviousProjects", async (event, user_id) => {
  const retrieveQuery = "SELECT * FROM projects WHERE user_id = ? AND is_sent = 1 AND is_deleted = 0"; 
  console.log('SQL Query:', retrieveQuery, 'Parameters:', [user_id]);

  try {
    const projects = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.all(retrieveQuery, [user_id], (error, rows) => {
        if (error != null) {
          db.close();
          reject({ statusCode: 0, errorMessage: error });
        }

        const allProjects = rows.map(row => ({
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
          created: row.created
        }));

        db.close(() => {
          resolve({ statusCode: 1, projects: allProjects });
        });
      });
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { statusCode: 0, errorMessage: error.message };
  }
});



//get all previous projects by user_id
ipcMain.handle("getAllPreviousProjectsBySearch", async (event, user_id, searchString) => {
  const retrieveQuery = "SELECT * FROM projects WHERE user_id = ? AND is_sent = 1 AND is_deleted = 0 AND projectname LIKE ?";
  console.log('SQL Query:', retrieveQuery, 'Parameters:', [user_id, `%${searchString}%`]);

  try {
    const projects = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.all(retrieveQuery, [user_id, `%${searchString}%`], (error, rows) => {
        if (error != null) {
          db.close();
          reject({ statusCode: 0, errorMessage: error });
        }

        const allProjects = rows.map(row => ({
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
          created: row.created
        }));

        db.close(() => {
          resolve({ statusCode: 1, projects: allProjects });
        });
      });
    });

    return projects;
  } catch (error) {
    console.error('Error fetching searched projects:', error);
    return { statusCode: 0, errorMessage: error.message };
  }
});


//get project by porject_id
ipcMain.handle("getProjectById", async (event, project_id) => {
  const retrieveQuery = "SELECT * FROM projects WHERE project_id = ?"; 
  console.log('SQL Query:', retrieveQuery, 'Parameters:', [project_id]);

  try {
    const project = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.get(retrieveQuery, [project_id], (error, row) => {
        if (error != null) {
          db.close();
          reject({ statusCode: 0, errorMessage: error });
        }

        if (!row) {
          // If no project is found, resolve with null
          db.close();
          resolve({ statusCode: 1, project: null });
          return;
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
          created: row.created
        };

        db.close(() => {
          resolve({ statusCode: 1, project: project });
        });
      });
    });

    return project;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { statusCode: 0, errorMessage: error.message };
  }
});





//get all projects
ipcMain.handle("get_Projects", async (event, user_lang) => {
  const allProjects = [];

  const retrieveQuery = "SELECT * FROM _projects WHERE lang = ?"; 
  console.log('SQL Query:', retrieveQuery, 'Parameters:', [user_lang]);


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
      });
    });

    db.close(() => {
      resolve({ statusCode: 1, projects: allProjects });
    });
  });
});




//get spcific project and see if it exists
ipcMain.handle("checkProjectExists", async (event, project_uuid) => {
  const retrieveQuery = "SELECT * FROM projects WHERE project_uuid = ? AND is_deleted = 0";

  try {
      const project = await new Promise((resolve, reject) => {
          const db = new sqlite3.Database(dbPath);

          db.get(retrieveQuery, [project_uuid], (error, row) => {
              if (error) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: error.message });
              } else if (!row) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: 'Project not found' });
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
      console.error('Error checking project existence:', error);
      return { statusCode: 0, errorMessage: error.message };
  }
});



//create new project
ipcMain.handle("createNewProject", async (event, args) => {
  try {
      if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments received for createNewProject');
      }

      const { projectname, type, user_id, project_uuid, photographername, project_date } = args;

      if (!projectname || !type || !project_uuid || !user_id || !photographername || !project_date ) {
          throw new Error('Missing required user data for createNewProject');
      }
      
      await db.run(`
          INSERT INTO projects (projectname, photographername, type, project_date, user_id, project_uuid)
          VALUES (?, ?, ?, ?, ?, ?)
          `, [projectname.toLowerCase(), photographername, type.toLowerCase(), project_date, user_id, project_uuid]);

      console.log('Project added successfully');
      console.log('Fetching new project with UUID:', project_uuid);

      // Send the newProject object as a response to the frontend
      event.sender.send('createNewProject-response', { success: true });
      return { success: true }; // Optionally, also return the newProject object
      
  } catch (err) {
      console.error('Error adding new project data:', err.message);
      event.sender.send('createNewProject-response', { error: err.message });
      return { error: err.message };
  }
});



//get latest project
ipcMain.handle("getLatestProject", async (event, project_uuid) => {
  const retrieveQuery = "SELECT * FROM projects WHERE project_uuid = ?"; 

  try {
      const project = await new Promise((resolve, reject) => {
          const db = new sqlite3.Database(dbPath);

          db.get(retrieveQuery, [project_uuid], (error, row) => {
              if (error) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: error });
              } else if (!row) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: 'Project not found' });
              } else {
                  db.close();
                  resolve({
                      statusCode: 1,
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
                      created: row.created
                  });
              }
          });
      });

      return project;
  } catch (error) {
      console.error('Error fetching project data:', error);
      return { statusCode: 0, errorMessage: error.message };
  }
});


//delete project 
ipcMain.handle("deleteProject", async (event, project_id) => {
  const updateQuery = "UPDATE projects SET is_deleted = 1 WHERE project_id = ?"; 

  try {
      const result = await new Promise((resolve, reject) => {
          const db = new sqlite3.Database(dbPath);

          db.run(updateQuery, [project_id], function(error) {
              if (error) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: error });
              } else {
                  db.close();
                  resolve({ rowsAffected: this.changes });
              }
          });
      });

      return { statusCode: 1, result };
  } catch (error) {
      console.error('Error deleting project:', error);
      return { statusCode: 0, errorMessage: error.message };
  }
});


//send project to DB
ipcMain.handle("sendProjectToDb", async (event, project_id, alertSale) => {
  const updateQuery = "UPDATE projects SET is_sent = 1, sent_date = CURRENT_TIMESTAMP, alert_sale = ? WHERE project_id = ?"; 

  try {
      const result = await new Promise((resolve, reject) => {
          const db = new sqlite3.Database(dbPath);

          db.run(updateQuery, [alertSale, project_id], function(error) {
              if (error) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: error });
              } else {
                  db.close();
                  resolve({ rowsAffected: this.changes });
              }
          });
      });

      return { statusCode: 1, result };
  } catch (error) {
      console.error('Error sending project to db:', error);
      return { statusCode: 0, errorMessage: error.message };
  }
});

// ipcMain.handle("sendProjectToDb", async (event, project_id) => {
//   const updateQuery = "UPDATE projects SET is_sent = 1, sent_date = CURRENT_TIMESTAMP WHERE project_id = ?"; 

//   try {
//       const result = await new Promise((resolve, reject) => {
//           const db = new sqlite3.Database(dbPath);

//           db.run(updateQuery, [project_id], function(error) {
//               if (error) {
//                   db.close();
//                   reject({ statusCode: 0, errorMessage: error });
//               } else {
//                   db.close();
//                   resolve({ rowsAffected: this.changes });
//               }
//           });
//       });

//       return { statusCode: 1, result };
//   } catch (error) {
//       console.error('Error sending project to db:', error);
//       return { statusCode: 0, errorMessage: error.message };
//   }
// });



//create new team
ipcMain.handle("createNewTeam", async (event, args) => {
  try {
      if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments received for createNewTeam');
      }

      const { teamname, leader_firstname, leader_lastname, leader_mobile, leader_email, calendar_amount, leader_address, leader_postalcode, leader_county, leader_ssn, project_id } = args;

      if (!teamname || !leader_firstname || !leader_lastname || !leader_mobile || !leader_email || !project_id) {
          throw new Error('Missing required data for createNewTeam');
      }
      
      const result = await db.run(`
          INSERT INTO teams (
              teamname, leader_firstname, leader_lastname, leader_mobile, leader_email, calendar_amount, leader_address, leader_postalcode, leader_county, leader_ssn, project_id
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
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
              project_id
          ]);

      console.log(`Team added successfully`);
      
      event.sender.send('createNewTeam-response', { success: true, statusCode: 1 });
      return { success: true, statusCode: 1 };
      
  } catch (err) {
      console.error('Error adding new team:', err.message);
      event.sender.send('createNewTeam-response', { error: err.message });
      return { error: err.message };
  }
});


//get all teams by project_id
ipcMain.handle("getTeamsByProjectId", async (event, project_id) => {
  const retrieveQuery = "SELECT * FROM teams WHERE is_deleted = 0 AND project_id = ?"; 
  console.log('SQL Query:', retrieveQuery, 'Parameters:', [project_id]);

  try {
    const teams = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.all(retrieveQuery, [project_id], (error, rows) => {
        if (error != null) {
          db.close();
          reject({ statusCode: 0, errorMessage: error });
        }

        const allTeams = rows.map(row => ({
          team_id: row.team_id,
          teamname: row.teamname,
          amount: row.amount,
          leader_firstname: row.leader_firstname,
          leader_lastname	: row.leader_lastname	,
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
          calendar_amount: row.calendar_amount,
          created: row.created,
          project_id: row.project_id
        }));

        db.close(() => {
          resolve({ statusCode: 1, teams: allTeams });
        });
      });
    });

    return teams;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { statusCode: 0, errorMessage: error.message };
  }
});


//Update team
ipcMain.handle("addDataToTeam", async (event, args) => {
  try {
      if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments received for addDataToTeam');
      }
      const { leader_address, leader_postalcode, leader_county, leader_ssn, calendar_amount, team_id } = args;

      if (!leader_address || !leader_postalcode || !leader_county || !leader_ssn || !calendar_amount || !team_id) {
          throw new Error('Missing required data for addDataToTeam');
      }
      
      const result = await db.run(`
          UPDATE teams
          SET leader_address = ?,
              calendar_amount = ?,  
              leader_postalcode = ?,
              leader_county = ?,
              leader_ssn = ?
          WHERE team_id = ?
          `, [
            leader_address, 
            calendar_amount,
            leader_postalcode, 
            leader_county, 
            leader_ssn,
            team_id
          ]);
          
      console.log(`Team updated successfully`);
      
      // Send success response to the frontend
      event.sender.send('addDataToTeam-response', { success: true });
      return { success: true };
      
  } catch (err) {
      console.error('Error updating team:', err.message);
      // Send error response to the frontend
      event.sender.send('addDataToTeam-response', { error: err.message });
      return { error: err.message };
  }
});



//create new class
ipcMain.handle("createNewClass", async (event, args) => {
  try {
      if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments received for createNewClass');
      }
      const { teamname, amount, protected_id, portrait, project_id, crowd } = args;
      if (!teamname || !amount || !project_id) {
          throw new Error('Missing required data for createNewClass');
      }
      
      const result = await db.run(`
          INSERT INTO teams (
              teamname, 
              amount, 
              protected_id,
              portrait, 
              crowd, 
              project_id
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `, [
              teamname, 
              amount, 
              protected_id ? 1 : 0, // Convert boolean to integer,
              portrait ? 1 : 0, // Convert boolean to integer
              crowd ? 1 : 0, // Convert boolean to integer
              project_id
          ]);
          
      console.log(`Class added successfully`);
      
      // Send success response to the frontend
      event.sender.send('createNewClass-response', { success: true });
      return { success: true };
      
  } catch (err) {
      console.error('Error adding new class:', err.message);
      // Send error response to the frontend
      event.sender.send('createNewClass-response', { error: err.message });
      return { error: err.message };
  }
});





//Add team data to team
ipcMain.handle("addTeamDataToTeam", async (event, args) => {
  try {
      if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments received for addTeamDataToTeam');
      }

      const { amount, protected_id, portrait, crowd, sold_calendar, team_id } = args;

      if (!amount || !team_id) {
          throw new Error('Missing required data for addTeamDataToTeam');
      }
      
      const result = await db.run(`
        UPDATE teams
        SET amount = ?,
        protected_id = ?,
        portrait = ?,
        crowd = ?,
        sold_calendar = ?
        WHERE team_id = ?
        `, [
          amount, 
          protected_id ? 1 : 0,
          portrait ? 1 : 0,
          crowd ? 1 : 0,
          sold_calendar,
          team_id
      ]);
          
      console.log(`Team data added successfully`);
      
      // Send success response to the frontend
      event.sender.send('addTeamDataToTeam-response', { success: true });
      return { success: true };
      
  } catch (err) {
      console.error('Error adding data to team:', err.message);
      // Send error response to the frontend
      event.sender.send('addTeamDataToTeam-response', { error: err.message });
      return { error: err.message };
  }
});




//delete team 
ipcMain.handle("deleteTeam", async (event, team_id) => {
  const updateQuery = "UPDATE teams SET is_deleted = 1 WHERE team_id = ?"; 

  try {
      const result = await new Promise((resolve, reject) => {
          const db = new sqlite3.Database(dbPath);

          db.run(updateQuery, [team_id], function(error) {
              if (error) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: error });
              } else {
                  db.close();
                  resolve({ rowsAffected: this.changes });
              }
          });
      });

      return { statusCode: 1, result };
  } catch (error) {
      console.error('Error deleting team:', error);
      return { statusCode: 0, errorMessage: error.message };
  }
});





// //edit team data
// ipcMain.handle("editTeam", async (event, args) => {
//   try {
//       if (!args || typeof args !== 'object') {
//           throw new Error('Invalid arguments received for editTeam');
//       }

//       const { amount, protected_id, portrait, crowd, teamname, team_id, sold_calendar } = args;

//       if (!amount || !teamname || !team_id) {
//           throw new Error('Missing required data for editTeam (amount, teamname, team_id)');
//       }
      
//       const result = await db.run(`
//         UPDATE teams
//         SET amount = ?,
//         teamname = ?,
//         protected_id = ?,
//         portrait = ?,
//         sold_calendar = ?,
//         crowd = ?
//         WHERE team_id = ?
//         `, [
//           amount, 
//           teamname,
//           protected_id,
//           portrait,
//           sold_calendar,
//           crowd,
//           team_id
//       ]);
          
//       console.log(`Team data edited successfully`);
      
//       // Send success response to the frontend
//       event.sender.send('editTeam-response', { success: true });
//       return { success: true };
      
//   } catch (err) {
//       console.error('Error editing data:', err.message);
//       // Send error response to the frontend
//       event.sender.send('editTeam-response', { error: err.message });
//       return { error: err.message };
//   }
// });




//edit team data
ipcMain.handle("editTeam", async (event, args) => {
  try {
      if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments received for editTeam');
      }

      const { amount, protected_id, portrait, crowd, teamname, team_id, sold_calendar, leader_firstname, leader_lastname, leader_email, leader_ssn, leader_mobile, leader_postalcode, leader_address, calendar_amount, leader_county} = args;

      if (!amount || !teamname || !team_id) {
          throw new Error('Missing required data for editTeam (amount, teamname, team_id)');
      }

      // Adding data to teams_history table
      // Define SQL statement to insert updated team data into teams_history table
        const historySQL = `
            INSERT INTO teams_history (team_id, teamname, amount, leader_firstname, leader_lastname, leader_email, leader_mobile, leader_ssn, leader_address, leader_postalcode, leader_county, calendar_amount, portrait, crowd, protected_id, sold_calendar)
            SELECT team_id, teamname, amount, leader_firstname, leader_lastname, leader_email, leader_mobile, leader_ssn, leader_address, leader_postalcode, leader_county, calendar_amount, portrait, crowd, protected_id, sold_calendar
            FROM teams
            WHERE team_id = ?
        `;

        // Execute insertion SQL statement to copy current team data to teams_history table
        await db.run(historySQL, [team_id]);

      const result = await db.run(`
      UPDATE teams
      SET 
        amount = ?,
        teamname = ?,
        protected_id = ?,
        portrait = ?,
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
      `, [
        amount,
        teamname,
        protected_id,
        portrait,
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
        team_id
      ]);
          
      console.log(`Team data edited successfully`);
      
      // Send success response to the frontend
      event.sender.send('editTeam-response', { success: true });
      return { success: true };
      
  } catch (err) {
      console.error('Error editing data:', err.message);
      // Send error response to the frontend
      event.sender.send('editTeam-response', { error: err.message });
      return { error: err.message };
  }
});




//get team by team id
ipcMain.handle("getTeam", async (event, team_id) => {
  const retrieveQuery = "SELECT * FROM teams WHERE team_id = ?"; 
  console.log('SQL Query:', retrieveQuery, 'Parameters:', [team_id]);

  try {
    const team = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.all(retrieveQuery, [team_id], (error, rows) => {
        if (error != null) {
          db.close();
          reject({ statusCode: 0, errorMessage: error });
        }

        const teamData = rows.map(row => ({
          team_id: row.team_id,
          teamname: row.teamname,
          amount: row.amount,
          leader_firstname: row.leader_firstname,
          leader_lastname	: row.leader_lastname	,
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
          project_id: row.project_id
        }));

        db.close(() => {
          resolve({ statusCode: 1, team: teamData });
        });
      });
    });

    return team;
  } catch (error) {
    console.error('Error fetching team:', error);
    return { statusCode: 0, errorMessage: error.message };
  }
});



//Add team data to team
ipcMain.handle("addAnomalyToProject", async (event, args) => {
  try {
    if (!args || typeof args !== 'object') {
      throw new Error('Invalid arguments received for addAnomalyToProject');
    }

    const { anomaly, merged_teams, project_id } = args;

    if (!project_id) {
      throw new Error('Missing required project_id for addAnomalyToProject');
    }

    let query = 'UPDATE projects SET';
    const params = [];

    if (anomaly !== undefined) {
      query += ' anomaly = ?,';
      params.push(anomaly);
    }
    if (merged_teams !== undefined) {
      query += ' merged_teams = ?,';
      params.push(merged_teams);
    }

    // Remove the trailing comma from query
    query = query.slice(0, -1);

    query += ' WHERE project_id = ?';
    params.push(project_id);

    // Execute the query
    const result = await db.run(query, params);

    console.log(`Data (anomaly and/or merged_teams) added successfully`);

    // Send success response to the frontend
    event.sender.send('addAnomalyToProject-response', { success: true });
    return { success: true };

  } catch (err) {
    console.error('Error adding data to team:', err.message);
    // Send error response to the frontend
    event.sender.send('addAnomalyToProject-response', { error: err.message });
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
            t.project_id, p.project_uuid, p.projectname, p.type, p.anomaly, p.merged_teams,
            p.unit, p.alert_sale, p.is_deleted AS project_is_deleted, p.is_sent, p.sent_date,
            p.user_id AS project_user_id, p.created AS project_created
      FROM teams AS t
      JOIN projects AS p ON t.project_id = p.project_id
      WHERE p.user_id = ? AND t.is_deleted = 0 AND p.is_deleted = 0 AND p.is_sent = 1
    `;
  console.log('SQL Query:', retrieveQuery, 'Parameters:', [user_id]);

  try {
    const data = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);

      db.all(retrieveQuery, [user_id], (error, rows) => {
        if (error != null) {
          db.close();
          reject({ statusCode: 0, errorMessage: error });
        }

        const allData = rows.map(row => ({
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
    console.error('Error fetching data:', error);
    return { statusCode: 0, errorMessage: error.message };
  }
});





ipcMain.on('navigateBack', (event) => { // Corrected to match the IPC event name
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
      focusedWindow.webContents.goBack(); // Navigate back in the Electron window
  }
});



//GDPR protection 
ipcMain.handle("gdprProtection", async (event) => {
  const updateQuery = "UPDATE teams SET leader_ssn = 'x', leader_firstname = 'x', leader_lastname = 'x', leader_email = 'x', leader_mobile = 'x',  leader_address = 'x',  leader_county = 'x',  leader_postalcode = 'x' WHERE created < DATE_SUB(NOW(), INTERVAL 12 MONTH)";
  // const updateQuery = "UPDATE teams SET leader_ssn = 'x', leader_firstname = 'x', leader_lastname = 'x' WHERE created < DATE_SUB(NOW(), INTERVAL 6 MONTH);"; 
  // const updateQuery = "UPDATE teams SET leader_ssn = 'x', leader_firstname = 'x', leader_lastname = 'x', leader_email = 'x', leader_mobile = 'x',  leader_address = 'x',  leader_county = 'x',  leader_postalcode = 'x'  WHERE created < DATETIME('now', '-12 hour');";

  try {
      const result = await new Promise((resolve, reject) => {
          const db = new sqlite3.Database(dbPath);

          db.run(updateQuery, function(error) {
              if (error) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: error });
              } else {
                  db.close();
                  resolve({ rowsAffected: this.changes });
              }
          });
      });

      return { statusCode: 1, result };
  } catch (error) {
      console.error('Error clearing GDPR data:', error);
      return { statusCode: 0, errorMessage: error.message };
  }
});




// const database = new sqlite.Database(
//   is.dev
//     ? path.join(path.join(app.getAppPath(), "resources/database.db"))
//     : path.join(__dirname, "../../resources/database.db").replace("app.asar", "app.asar.unpacked"),
//   (err) => {
//     if (err) log.log("Database Error" + app.getAppPath());
//     else log.log("Database Loaded");
//   }
// );


// //get all users
// ipcMain.handle("getUser", async () => {
//   const user = [];

//   const retrieveQuery = "SELECT * FROM users"; 

//   return new Promise((resolve, reject) => {
//     const db = new sqlite3.Database(dbPath);

//     db.each(retrieveQuery, (error, row) => {
//       if (error != null) {
//         db.close();
//         reject({ statusCode: 0, errorMessage: error });
//       }

//       user.push({
//         id: row.id,
//         name: row.name,
//         workname: row.workname,
//         county: row.county,
//         date: row.date,
//       });
//     });

//     db.close(() => {
//       resolve({ statusCode: 1, users: user });
//     });
//   });
// });



// //create new user
// ipcMain.handle("createUser", async (event, args) => {
//   try {
//       if (!args || typeof args !== 'object') {
//           throw new Error('Invalid arguments received for createUser');
//       }

//       const { name, workname, county, anomaly } = args;

//       if (!name || !workname || !county) {
//           throw new Error('Missing required user data for createUser');
//       }
//       const anomalyValue = anomaly || ''; // Set anomalyValue to empty string if anomaly is empty
//       await db.run(`
//           INSERT INTO users (name, workname, county, anomaly)
//           VALUES (?, ?, ?, ?)
//           `, [name.toLowerCase(), workname.toLowerCase(), county.toLowerCase(), anomalyValue.toLowerCase()]);

//       console.log('User data added successfully');
//       event.sender.send('add-user-response', { success: true });
      
//   } catch (err) {
//       console.error('Error adding user data:', err.message);
//       event.sender.send('add-user-response', { error: err.message });
//   }
// });



// //create new / add new file/data to local computer
// ipcMain.handle("createUserToComp", async (event, args) => {
//   const desktopPath = path.join(os.homedir(), 'Desktop'); // Get the desktop path
//   const dataFolderPath = path.join(desktopPath, 'data'); // Create a folder path named "data"
//   const filePath = path.join(dataFolderPath, 'userData.json'); // Specify the filename

//   const { name, workname, county, anomaly } = args;
  
//   if (!name || !workname || !county) {
//     throw new Error('Missing required user input to write to file');
// }

//   // Check if the file exists
//   fs.access(filePath, fs.constants.F_OK, async (err) => {
//     if (err) {
//       // File doesn't exist, create a new file and write the data
//       const data = JSON.stringify(args, null, 2); // Convert args to JSON string
//       await fs.promises.mkdir(dataFolderPath, { recursive: true }); // Create the data folder if it doesn't exist
//       await fs.promises.writeFile(filePath, data + '\n');
//       console.log('New file created and data written successfully');
//       event.sender.send('createUserToComp-response', { success: true }); // Send success response
//     } else {
//       // File exists, append the data
//       const existingData = await fs.promises.readFile(filePath, 'utf8'); // Read existing data from file
//       const newData = existingData + '\n' + JSON.stringify(args, null, 2); // Append new data
//       await fs.promises.writeFile(filePath, newData); // Write the updated data back to the file
//       console.log('Data appended to existing file');
//       event.sender.send('createUserToComp-response', { success: true }); // Send success response
//     }
//   });
// });


// //create new group
// ipcMain.handle("createGroup", async (event, args) => {
//   try {
//       if (!args || typeof args !== 'object') {
//           throw new Error('Invalid arguments received for createGroup');
//       }

//       const { orgname, amount, portrait, unit, user_id } = args;

//       if (!orgname || !amount || user_id === undefined || user_id === null) {
//         throw new Error('Missing required data for createGroup');
//     }

//       // Assuming you have a 'users' table with 'id' column
//       const userExists = await db.get("SELECT id FROM users WHERE id = ?", user_id);
//       if (!userExists) {
//           throw new Error('Invalid user ID');
//       }

//       await db.run(`
//           INSERT INTO org (orgname, amount, portrait, unit, user_id)
//           VALUES (?, ?, ?, ?, ?)
//       `, [orgname.toLowerCase(), amount.toLowerCase(), portrait, unit, user_id]);


//       console.log('Group data added successfully');
//       event.sender.send('add-group-response', { success: true });
      
//   } catch (err) {
//       console.error('Error adding user data:', err.message);
//       event.sender.send('add-group-response', { error: err.message });
//   }
// });


// //crate login window
// ipcMain.handle("createLoginWindow", async (event, args) => {
//   try {
//       const loginWindow = new BrowserWindow({
//           // parent: mainWindow, // Set the parent window if needed
//           // modal: true, // Example: Open as a modal window
//           width: 400,
//           height: 500,
//           resizable: false, 
//           // frame: false,
//           // show: false,
//           autoHideMenuBar: true,
//           // ...(process.platform === 'linux' ? { icon } : {}),
//           icon: iconPath, 
//           // icon: path.join(__dirname, '../../resources/icon2.png'),
//           webPreferences: {
//             preload : path.join(__dirname, '../preload/index.js') ,
//             sandbox: false,
//             contextIsolation: true,
//             nodeIntegration: true,
//             webSecurity: false,
//             worldSafeExecuteJavaScript: true,
//           }
//       });

//       // Open DevTools for the new window
//       if (isDev) {
//         loginWindow.webContents.openDevTools({ mode: 'detach' });
//        }
    
//       // Load the URL for the new window if needed
//       loginWindow.loadURL(
//         isDev
//             ? "http://localhost:5173/#/login_window"
//             : `file://${path.join(__dirname, "../build/index.html#/login_window")}`
//      );
     
//       // Optionally return some data back to the renderer process
//       return { success: true, message: 'Login window created successfully' };
//   } catch (error) {
//       // Handle any errors that occur while creating the new window
//       console.error('Error creating login window:', error);
//       throw new Error('Failed to create login window');
//   }
  
// });


//crate main window & close login window
ipcMain.handle("createMainWindow", async (event, args) => {
  loginWindow.close();
  try {
      // Create the MainWindow
      const mainWindow = new BrowserWindow({
          width: 1150,
          height: 750,
          minWidth: 820,
          minHeight: 550,
          show: false,
          autoHideMenuBar: true,
          icon: iconPath, 
          webPreferences: {
            preload : path.join(__dirname, '../preload/index.js') ,
            sandbox: false,
            contextIsolation: true,
            nodeIntegration: true,
            webSecurity: false
          }
      });

      // Open DevTools for the new window
      if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
      }
    
      // Load the URL for the MainWindow
      // mainWindow.loadURL(
      //   isDev
      //       ? "http://localhost:5173/"
      //       : `file://${path.join(__dirname, "../build/index.html")}`
      // );
      if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL("http://localhost:5173/")
      } else {
        mainWindow.loadURL(`file://${path.join(__dirname, '../renderer/index.html')}`);
      }
    

      // Show the MainWindow when it's ready
      mainWindow.once('ready-to-show', () => {
        mainWindow.show();
      });

      // Optionally return some data back to the renderer process
      return { success: true, message: 'Main window created successfully' };
  } catch (error) {
      // Handle any errors that occur while creating the new window
      console.error('Error creating main window:', error);
      throw new Error('Failed to create main window');
  }
});


// //crate login window & close login window
// ipcMain.handle("createNewuserWindow", async (event) => {
//   try {
//     // Create the new user window
//     const newuserWindow = new BrowserWindow({
//       width: 350,
//       height: 460,
//       resizable: false,
//       autoHideMenuBar: true,
//       icon: iconPath,
//       webPreferences: {
//         preload: path.join(__dirname, '../preload/index.js'),
//         sandbox: false,
//         contextIsolation: true,
//         nodeIntegration: true,
//         webSecurity: false
//       }
//     });

//     // Load the URL for the new user window
//     newuserWindow.loadURL(
//       isDev
//         ? "http://localhost:5173/#/login_window"
//         : `file://${path.join(__dirname, "../build/index.html#/login_window")}`
//     );

//     // Show the new user window when it's ready
//     newuserWindow.once('ready-to-show', () => {
//       newuserWindow.show();
//     });

//     // Optionally return some data back to the renderer process
//     return { success: true, message: 'New user window created successfully' };
//   } catch (error) {
//     console.error('Error creating new user window:', error);
//     throw new Error('Failed to create new user window');
//   }
// });



// ipcMain.handle("createMainWindow", async (event, args) => {
//   try {
//       const loginWindow = new BrowserWindow({
//           // parent: mainWindow, // Set the parent window if needed
//           // modal: true, // Example: Open as a modal window
//           width: 400,
//           height: 500,
//           resizable: false, 
//           // frame: false,
//           // show: false,
//           autoHideMenuBar: true,
//           // ...(process.platform === 'linux' ? { icon } : {}),
//           icon: iconPath, 
//           // icon: path.join(__dirname, '../../resources/icon2.png'),
//           webPreferences: {
//             preload : path.join(__dirname, '../preload/index.js') ,
//             sandbox: false,
//             contextIsolation: true,
//             nodeIntegration: true,
//             webSecurity: false,
//             worldSafeExecuteJavaScript: true,
//           }
//       });

//       // Open DevTools for the new window
//       if (isDev) {
//         loginWindow.webContents.openDevTools({ mode: 'detach' });
//        }
    
//       // Load the URL for the new window if needed
//       loginWindow.loadURL(
//         isDev
//             ? "http://localhost:5173/#/login_window"
//             : `file://${path.join(__dirname, "../build/index.html#/login_window")}`
//      );
     
//       // Optionally return some data back to the renderer process
//       return { success: true, message: 'Login window created successfully' };
//   } catch (error) {
//       // Handle any errors that occur while creating the new window
//       console.error('Error creating login window:', error);
//       throw new Error('Failed to create login window');
//   }
// });






// ipcMain.handle("showDialog", async (event, args) => {
//   let win = null;
//   switch (args.window) {
//     case "mainWindow":
//       win = mainWindow;
//       break;
//     case "CourseWindow":
//       win = CourseWindow;
//       break;
//     default:
//       break;
//   }

//   return dialog.showMessageBox(win, args.options);
// });

// ipcMain.handle("saveFile", async (event, args) => {
//   let options = {
//     title: "Save files",

//     defaultPath: app.getPath("downloads"),

//     buttonLabel: "Save Output File",

//     properties: ["openDirectory"],
//   };

//   let filename = await dialog.showOpenDialog(mainWindow, options);
//   if (!filename.canceled) {
//     var base64Data = args.replace(/^data:application\/pdf;base64,/, "");
    
//     const p = path.join(filename.filePaths[0], "/exampaper")
//     if (!fs.existsSync(p)){
//       fs.mkdirSync(p);
//     }
//     fs.writeFileSync(
//       path.join(p, "output.pdf"),
//       base64Data,
//       "base64"
//     );


//     fse.copySync("input", path.join(p,"input"))
      
//   }
// });

// // Function To Close Window
// ipcMain.handle("close", (event, args) => {
//   switch (args) {
//     case "mainWindow":
//       app.quit();
//       break;
//     case "CourseWindow":
//       mainWindow.webContents.send("reload");
//       CourseWindow.close();
//       break;
//     default:
//       break;
//   }
// });

// ipcMain.handle("createCourse", (event, args) => {
//   // insertCourseQuery to Insert Courese details into database
//   const insertCourseQuery =
//     "INSERT INTO course(course_code,course_name) VALUES(?,?)";

//   let course_id;
//   new Promise((resolve, reject) => {
//     database.run(insertCourseQuery, [args.code, args.name], function (error) {
//       if (error) {
//         return reject(-1);
//       }

//       return resolve(this.lastID);
//     });
//   }).then((result) => {
//     course_id = result;

//     //insertCoQuery to insert Co details into database
//     const insertCoQuery =
//       "INSERT INTO course_outcomes(course_outcomes_number,course_outcomes_description,course_id) VALUES(?,?,?)";
//     const cos = args.co.map((value) => value.value);

//     cos.forEach((co, index) => {
//       database.run(insertCoQuery, [index + 1, co, course_id], (error) => {
//         if (error) {
//           console.log(error);
//         }
//       });
//     });

//     //insertUnit to insert Unit details into database
//     const insertUnitQuery = "INSERT INTO unit(unit_name,course_id) VALUES(?,?)";

//     args.unit.forEach((value) => {
//       database.run(insertUnitQuery, [value.value, course_id], (error) => {
//         if (error) {
//           console.log(error);
//         }
//       });
//     });
//   });
//   return true;
// });

// ipcMain.handle("getCourses", async () => {
//   //function returns JSON Object which contains list of courses
//   const courses = [];

//   const retriveQuery = "SELECT * from course";

//   return new Promise((resolve, reject) => {
//     database.each(retriveQuery, (error, row) => {
//       if (error != null) reject({ statusCode: 0, errorMessage: error });

//       courses.push({
//         id: row.course_id,
//         code: row.course_code,
//         name: row.course_name,
//       });
//       resolve({ statusCode: 1, courses: courses });
//     });
//   });
// });

// // Opens Update Course Window On Edit Button Of Course
// ipcMain.handle("updateCourseWindow", (events, args) => {
//   CourseWindow = new BrowserWindow({
//     parent: mainWindow,
//     modal: true,
//     height: 400,
//     width: 600,
//     frame: false,
//     webPreferences: {
//       preload: isDev
//         ? path.join(app.getAppPath(), "./backend/preload.js")
//         : path.join(app.getAppPath(), "./build/preload.js"),
//       worldSafeExecuteJavaScript: true,
//       contextIsolation: true,
//     },
//   });
//   CourseWindow.setResizable(false);

//   CourseWindow.loadURL(
//     isDev
//       ? `http://localhost:5173/updateCourse/?course_name=${args.name}&course_id=${args.id}&course_code=${args.code}`
//       : `file://${path.join(__dirname, "../build/index.html")}`
//   );
// });

// //Remove course from database
// ipcMain.handle("removeCourse", async (event, args) => {
//   let status;
//   const removeCourseQuery = "DELETE FROM course WHERE course_id=?";
//   new Promise((resolve, reject) => {
//     database.run(removeCourseQuery, [args], (error) => {
//       if (error != null) {
//         console.log(error);
//         reject(false);
//       }
//       console.log("couse with course_id " + args + " removed succesfully");
//       resolve(true);
//     });
//   }).then(function (res) {
//     status = res;
//   });

//   return status;
// });

// // Update Course function
// ipcMain.handle("updateCourse", async (event, args) => {
//   const course_id = args.CourseID;
//   const course_name = args.CourseName;
//   const course_code = args.CourseCode;
//   //update Query to updatecourse details
//   const updateCourseQuery =
//     "UPDATE course SET course_code=? , course_name=? WHERE course_id=?";

//   const status = new Promise((resolve, reject) => {
//     database.run(
//       updateCourseQuery,
//       [course_code, course_name, course_id],
//       (error) => {
//         if (error) {
//           console.log(error);
//           reject(false);
//         }
//         console.log(
//           "course with course_id " + course_id + " updated successfully"
//         );
//         resolve(true);
//       }
//     );
//   });
//   return status;
// });

// //Used to insert College Metadata into database.
// ipcMain.handle("setInstituteMetaData", (event, args) => {
//   if (args == null) return false;
//   args = JSON.stringify(args);
//   // console.log(args)
//   fs.writeFileSync(path.join(app.getAppPath(), "./metadata.json"), args);

//   const windowParameters = {
//     width: 800,
//     height: 600,
//     frame: false,
//     webPreferences: {
//       preload: isDev
//         ? path.join(app.getAppPath(), "./backend/preload.js")
//         : path.join(app.getAppPath(), "./build/preload.js"),
//       worldSafeExecuteJavaScript: true,
//       contextIsolation: true,
//     },
//   };

//   mainWindow = new BrowserWindow(windowParameters);

//   mainWindow.loadURL(
//     isDev
//       ? "http://localhost:5173/"
//       : `file://${path.join(__dirname, "../build/index.html")}`
//   );
// });

//Retrive units of perticuler course


// ipcMain.handle("s", (event, args) => {
//   const getUnitsQuery = `SELECT * FROM question WHERE course_id='${args}'`;
//   const questions = [];

//   return new Promise((resolve, reject) => {
//     database.each(getUnitsQuery, (error, row) => {
//       if (error != null) reject({ statusCode: 0, errorMessage: error });

//       questions.push({
//         question_id: row.question_id,
//         question_text: row.question_text,
//         question_type_id: row.question_type_id,
//         marks: row.marks,
//         taxonomy_id: row.taxonomy_id,
//         unit_id: row.unit_id,
//         question_image: row.question_image,
//       });
//       resolve({ statusCode: 1, questions: questions });
//     });
//   });
// });

//Retrive course_outcomes of perticuler course
// ipcMain.handle("getCOs", (event, args) => {
//   const getCOsQuery = `SELECT * FROM course_outcomes WHERE course_id='${args}'`;
//   const cos = [];

//   return new Promise((resolve, reject) => {
//     database.each(getCOsQuery, (error, row) => {
//       if (error != null) reject({ statusCode: 0, errorMessage: error });

//       cos.push({
//         course_id: row.course_id,
//         course_outcomes_id: row.course_outcomes_id,
//         course_outcomes_description: row.course_outcomes_description,
//         course_outcomes_number: row.course_outcomes_number,
//       });
//       resolve({ statusCode: 1, cos: cos });
//     });
//   });
// });

/** to insert question types
  
  insert into question_type(question_type_name) VALUES ("MCQ"),("SHORT"),("MEDIUM"),("LONG")

 */
//get Question Types
// ipcMain.handle("getQuestionTypes", () => {
//   const getQuestionTypesQuery = `SELECT * FROM question_type `;
//   const question_types = [];

//   return new Promise((resolve, reject) => {
//     database.each(getQuestionTypesQuery, (error, row) => {
//       if (error != null) reject({ statusCode: 0, errorMessage: error });

//       question_types.push({
//         question_type_id: row.question_type_id,
//         question_type_name: row.question_type_name,
//       });
//       resolve({ statusCode: 1, question_types: question_types });
//     });
//   });
// });

/** to insert Taxonomy
 
 INSERT INTO 
  taxonomy(taxonomy_name,taxonomy_letter) 
  VALUES ('Remember','R'),('Understand','U'),('Apply','A'),('Analyze','N'),('Evaluate','E'),('Create','C')
  
 */
//get Taxonomy
// ipcMain.handle("getTaxonomy", () => {
//   const getTaxonomyQuery = `SELECT * FROM taxonomy`;
//   const taxonomy = [];
//   const count = "SELECT count(*) FROM taxonomy";

//   return new Promise((resolve, reject) => {
//     database.get(count, (error, row) => {
//       if (error) reject({ statusCode: 0, errorMessage: error });

//       if (row["count(*)"] === 0)
//         reject({ statusCode: 0, errorMessage: "No Rows" });
//     });

//     database.each(getTaxonomyQuery, (error, row) => {
//       if (error) reject({ statusCode: 0, errorMessage: error });

//       taxonomy.push({
//         taxonomy_id: row.taxonomy_id,
//         taxonomy_name: row.taxonomy_name,
//         taxonomy_letter: row.taxonomy_letter,
//       });
//       resolve({ statusCode: 1, taxonomy: taxonomy });
//     });
//   });
// });

// ipcMain.handle("openNewCourse", () => {
//   CourseWindow = new BrowserWindow({
//     parent: mainWindow,
//     modal: true,
//     height: 400,
//     width: 600,
//     frame: false,
//     webPreferences: {
//       preload: isDev
//         ? path.join(app.getAppPath(), "./backend/preload.js")
//         : path.join(app.getAppPath(), "./build/preload.js"),
//       worldSafeExecuteJavaScript: true,
//       contextIsolation: true,
//     },
//   });

//   CourseWindow.loadURL(
//     isDev
//       ? "http://localhost:5173/createCourse"
//       : `file://${path.join(__dirname, "../build/index.html")}`
//   );
// });

// ipcMain.handle("openCourse", (event, args) => {
//   mainWindow.loadURL(
//     isDev
//       ? "http://localhost:5173/Course?course_id=" + args
//       : `file://${path.join(__dirname, "../build/index.html")}`
//   );
// });

// ipcMain.handle("openManageQuestion", (event, args) => {
//   mainWindow.loadURL(
//     isDev
//       ? "http://localhost:5173/ManageQuestion?course_id=" + args
//       : `file://${path.join(__dirname, "../build/index.html")}`
//   );
// });

// ipcMain.handle("openModifyQuestion", (event, args) => {
//   mainWindow.loadURL(
//     isDev
//       ? "http://localhost:5173/ModifyQuestion?course_id=" + args
//       : `file://${path.join(__dirname, "../build/index.html")}`
//   );
// });

// ipcMain.handle("getCourseFromID", async (event, args) => {
//   //function returns JSON Object which contains list of courses

//   const retriveQuery = `SELECT * from course where course_id='${args}'`;

//   return new Promise((resolve, reject) => {
//     database.each(retriveQuery, (error, row) => {
//       if (error != null) reject({ statusCode: 0, errorMessage: error });

//       resolve({
//         id: row.course_id,
//         code: row.course_code,
//         name: row.course_name,
//       });
//     });
//   });
// });

// ipcMain.handle("openAddQuestions", (event, args) => {
//   mainWindow.loadURL(
//     isDev
//       ? "http://localhost:5173/AddQuestions?course_id=" + args
//       : `file://${path.join(__dirname, "../build/index.html")}`
//   );
// });

// ipcMain.handle("getFile", async (event, args) => {
//   try {
//     const data = await fsa.readFile(
//       path.join(app.getAppPath(), "/output/exam_paper.pdf"),
//       { encoding: "base64" }
//     );
//     return data;
//   } catch (err) {
//     console.log(err);
//   }
// });

// ipcMain.handle("openGenereatePaper", (event, args) => {
//   mainWindow.loadURL(
//     isDev
//       ? "http://localhost:5173/GeneratePaper?course_id=" + args
//       : `file://${path.join(__dirname, "../build/index.html")}`
//   );
// });

// ipcMain.handle("openUpdateQuestion", (event, args) => {
//   mainWindow.loadURL(
//     isDev
//       ? "http://localhost:5173/UpdateQuestion?course_id=" + args
//       : `file://${path.join(__dirname, "../build/index.html")}`
//   );
// });

// ipcMain.handle("goBack", () => {
//   mainWindow.webContents.goBack();
// });

// ipcMain.handle("getQuestions", async (_, args) => {
//   const CourseID = args.course_id;

//   let sql = `SELECT * FROM question INNER JOIN taxonomy ON taxonomy.taxonomy_id = question.taxonomy_id INNER JOIN unit 
//   ON unit.unit_id = question.unit_id AND question.course_id = ${CourseID} INNER JOIN question_type ON question.question_type_id = question_type.question_type_id`;

//   return new Promise((resolve, reject) => {
//     database.all(sql, async (error, rows) => {
//       if (error) reject(error);

//       if (rows === undefined) return;
//       const Questions = await Promise.all(
//         rows.map(async (row) => {
//           sql =
//             `SELECT course_outcomes_question.course_outcomes_id,course_outcomes.course_outcomes_description,course_outcomes.course_outcomes_number FROM course_outcomes_question INNER JOIN course_outcomes 
//         ON course_outcomes_question.course_outcomes_id = course_outcomes.course_outcomes_id AND course_outcomes_question.question_id = ` +
//             row.question_id;

//           const CourseOutcomes = new Promise((resolve, reject) => {
//             database.all(sql, (error, rows) => {
//               if (error) reject(error);
//               resolve(rows);
//             });
//           });

//           sql =
//             `SELECT * FROM mcq_option where question_id = ` + row.question_id;

//           const MCQOptions = new Promise((resolve, reject) => {
//             database.all(sql, (error, rows) => {
//               if (error) reject(error);
//               resolve(rows);
//             });
//           });

//           await Promise.all([CourseOutcomes, MCQOptions]).then((values) => {
//             row.cource_outcomes = values[0];
//             row.mcqs = values[1];
//           });

//           return row;
//         })
//       );

//       resolve(Questions);
//     });
//   });
// });

// ipcMain.handle("updateQuestion", async (_, args) => {
//   const result = await updateQuestion(args, database);
//   return result;
// });

// ipcMain.handle("deleteQuestion", async (_, args) => {
//   const result = await deleteQuestion(args, database);
//   return result;
// });


// ipcMain.handle("insertQuestion", async (_, args) => {
//   const result = await insertQuestion(args, database);
//   console.log(result)
//   return result;
// });

// ipcMain.handle("getUnits", async (_, args) => {
//   const result = await getUnits(args, database);
//   return result;
// });

// ipcMain.handle("updateUnits", async (_, args) => {
//   const result = await updateUnits(args, database);
//   return result;
// });

// ipcMain.handle("getCourseOutcomes", async (_, args) => {
//   const result = await getCourseOutcomes(args, database);
//   return result;
// });

// ipcMain.handle("updateCourseOutcomes", async (_, args) => {
//   const result = await updateCourseOutcomes(args, database);
//   return result;
// });

// ipcMain.handle("generatePaper", async (_,args) => {
//   // const result = await generatePaper(args,path.join(app.getAppPath(), "/output/"));
  
//   // return result;
// });

