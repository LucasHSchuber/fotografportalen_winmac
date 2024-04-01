import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const electron = require("electron");
const log = require('electron-log');
const path = require("path");
const fs = require("fs");
const fsa = require("fs/promises");
const sqlite3 = require('sqlite3').verbose();
const fse = require("fs-extra");
const icon = path.join(__dirname, "../../resources/icon2.png");
const ipcMain = electron.ipcMain;
const app = electron.app;
const os = require('os'); // Import the os module
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');
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


 
let mainWindow , CourseWindow;
function createWindow() {
  
  if(!is.dev){
    const exApp = express()
    exApp.use(express.static(path.join(__dirname, '../renderer/')));
    exApp.listen(5173)
  } 
  
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 650,
    minWidth: 600,
    minHeight: 550,
    show: false,
    // frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    // icon: path.join(__dirname, '../../resources/icon2.png'),
    webPreferences: {
      preload : path.join(__dirname, '../preload/index.js') ,
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: false
    }
  })


  // Hide the menu bar
  // mainWindow.setMenuBarVisibility(false);
// Open DevTools in development mode
  // if (isDev) {
  //  mainWindow.webContents.openDevTools({ mode: 'detach' });
  // }
  if (isDev) {
    mainWindow.webContents.openDevTools({});
   }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  log.info(path.join(__dirname, '../preload/index.js'))
  
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  log.info("Ready")
  electronApp.setAppUserModelId('com.exampapersetter')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on("uncaughtException", (error) => {
  log.info(`Exception: ${error}`);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

log.info(process.resourcesPath)

//Database Connection And Instance
// Construct the absolute path to the SQLite database file
const dbPath = path.join(__dirname, '..', '..', 'resources', 'mydb.db');

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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      workname TEXT NOT NULL,
      county TEXT NOT NULL,
      anomaly TEXT NOT NULL,
      projectname TEXT,
      date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created successfully');
    }
  });

  // Create org table
  db.run(`
    CREATE TABLE IF NOT EXISTS org (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orgname TEXT NOT NULL,
      amount INTEGER NOT NULL,
      portrait BOOLEAN NOT NULL,
      unit BOOLEAN NOT NULL,
      date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating org table:', err.message);
    } else {
      console.log('Org table created successfully');
    }
  });
}




// const database = new sqlite.Database(
//   is.dev
//     ? path.join(path.join(app.getAppPath(), "resources/database.db"))
//     : path.join(__dirname, "../../resources/database.db").replace("app.asar", "app.asar.unpacked"),
//   (err) => {
//     if (err) log.log("Database Error" + app.getAppPath());
//     else log.log("Database Loaded");
//   }
// );

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

//create new user
ipcMain.handle("createUser", async (event, args) => {
  try {
      if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments received for createUser');
      }

      const { name, workname, county, anomaly } = args;

      if (!name || !workname || !county) {
          throw new Error('Missing required user data for createUser');
      }
      const anomalyValue = anomaly || ''; // Set anomalyValue to empty string if anomaly is empty
      await db.run(`
          INSERT INTO users (name, workname, county, anomaly)
          VALUES (?, ?, ?, ?)
          `, [name.toLowerCase(), workname.toLowerCase(), county.toLowerCase(), anomalyValue.toLowerCase()]);

      console.log('User data added successfully');
      event.sender.send('add-user-response', { success: true });
      
  } catch (err) {
      console.error('Error adding user data:', err.message);
      event.sender.send('add-user-response', { error: err.message });
  }
});

//get all users
ipcMain.handle("getUsers", async () => {
  const users = [];

  const retrieveQuery = "SELECT * FROM users"; 

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);

    db.each(retrieveQuery, (error, row) => {
      if (error != null) {
        db.close();
        reject({ statusCode: 0, errorMessage: error });
      }

      users.push({
        id: row.id,
        name: row.name,
        workname: row.workname,
        county: row.county,
        date: row.date,
      });
    });

    db.close(() => {
      resolve({ statusCode: 1, users: users });
    });
  });
});

//get spcific user
ipcMain.handle("getUser", async (event, workname) => {
  const retrieveQuery = "SELECT * FROM users WHERE workname = ?"; 

  try {
      const user = await new Promise((resolve, reject) => {
          const db = new sqlite3.Database(dbPath);

          db.get(retrieveQuery, [workname], (error, row) => {
              if (error) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: error });
              } else if (!row) {
                  db.close();
                  reject({ statusCode: 0, errorMessage: 'User not found' });
              } else {
                  db.close();
                  resolve({
                      id: row.id,
                      name: row.name,
                      workname: row.workname,
                      county: row.county,
                      anomaly: row.anomaly,
                      date: row.date
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


//create new / add new file/data to local computer
ipcMain.handle("createUserToComp", async (event, args) => {
  const desktopPath = path.join(os.homedir(), 'Desktop'); // Get the desktop path
  const dataFolderPath = path.join(desktopPath, 'data'); // Create a folder path named "data"
  const filePath = path.join(dataFolderPath, 'userData.json'); // Specify the filename

  const { name, workname, county, anomaly } = args;
  
  if (!name || !workname || !county) {
    throw new Error('Missing required user input to write to file');
}

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, async (err) => {
    if (err) {
      // File doesn't exist, create a new file and write the data
      const data = JSON.stringify(args, null, 2); // Convert args to JSON string
      await fs.promises.mkdir(dataFolderPath, { recursive: true }); // Create the data folder if it doesn't exist
      await fs.promises.writeFile(filePath, data + '\n');
      console.log('New file created and data written successfully');
      event.sender.send('createUserToComp-response', { success: true }); // Send success response
    } else {
      // File exists, append the data
      const existingData = await fs.promises.readFile(filePath, 'utf8'); // Read existing data from file
      const newData = existingData + '\n' + JSON.stringify(args, null, 2); // Append new data
      await fs.promises.writeFile(filePath, newData); // Write the updated data back to the file
      console.log('Data appended to existing file');
      event.sender.send('createUserToComp-response', { success: true }); // Send success response
    }
  });
});


//create new group
ipcMain.handle("createGroup", async (event, args) => {
  try {
      if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments received for createGroup');
      }

      const { orgname, amount, portrait, unit, user_id } = args;

      if (!orgname || !amount || user_id === undefined || user_id === null) {
        throw new Error('Missing required data for createGroup');
    }

      // Assuming you have a 'users' table with 'id' column
      const userExists = await db.get("SELECT id FROM users WHERE id = ?", user_id);
      if (!userExists) {
          throw new Error('Invalid user ID');
      }

      await db.run(`
          INSERT INTO org (orgname, amount, portrait, unit, user_id)
          VALUES (?, ?, ?, ?, ?)
      `, [orgname.toLowerCase(), amount.toLowerCase(), portrait, unit, user_id]);


      console.log('Group data added successfully');
      event.sender.send('add-group-response', { success: true });
      
  } catch (err) {
      console.error('Error adding user data:', err.message);
      event.sender.send('add-group-response', { error: err.message });
  }
});


//crate new window
ipcMain.handle("createNewWindow", async (event, args) => {
  try {
      const CourseWindow = new BrowserWindow({
          parent: mainWindow, // Set the parent window if needed
          modal: true, // Example: Open as a modal window
          width: 900,
          height: 550,
          minWidth: 600,
          minHeight: 550,
          // show: false,
          // frame: false,
          autoHideMenuBar: true,
          webPreferences: {
              preload: path.join(__dirname, '../preload/index.html'),
              worldSafeExecuteJavaScript: true,
              contextIsolation: true,
          },
      });
      // Load the URL for the new window if needed
      CourseWindow.loadURL(
        isDev
            ? "http://localhost:5173/#/addgroup"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );
      // Optionally return some data back to the renderer process
      return { success: true, message: 'New window created successfully' };
  } catch (error) {
      // Handle any errors that occur while creating the new window
      console.error('Error creating new window:', error);
      throw new Error('Failed to create new window');
  }
});







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

