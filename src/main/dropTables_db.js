// import fs from 'fs';
// import path from 'path';
// import isDev from "electron-is-dev";
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url)); 

// Drop tables
export default async function dropTables(db, currentVersion) {

    // Only drop the tables specified in the drops array
    const drops = [
        { version: 10305, query: `DROP TABLE IF EXISTS users;` },
        { version: 10306, query: `DROP TABLE IF EXISTS bt_files;` },
        { version: 10307, query: `DROP TABLE IF EXISTS bt_projects;` },
        { version: 10308, query: `DROP TABLE IF EXISTS ft_files;` },
        { version: 10309, query: `DROP TABLE IF EXISTS ft_projects;` },
        { version: 10310, query: `DROP TABLE IF EXISTS news;` },
        { version: 10311, query: `DROP TABLE IF EXISTS teams;` },
        { version: 10312, query: `DROP TABLE IF EXISTS projects;` },
    ];

    // const dropsToQuery = drops.filter(d => d.version > currentVersion);
    // if (dropsToQuery.length > 0 && !isDev){
    //     try {
    //         await backupDatabase();
    //         console.log("Backup completed. Proceeding with table drops...");
    //     } catch (error) {
    //         console.error("Backup failed. Aborting table drop process.");
    //         return Promise.reject(error);
    //     }
    // }

    return new Promise((resolve, reject) => {
        const dropsToQuery = drops.filter(d => d.version > currentVersion);
        
        if (dropsToQuery.length === 0) {
            console.log("No tables need to be dropped.");
            return resolve({ status: 400, message: "No tables need to be dropped" });
        }

        console.log(`Dropping selected tables: ${dropsToQuery.map(d => d.query).join(" ")}`);

        // Drop the selected tables and update schema version
        const dropPromises = dropsToQuery.map((update) => {
            return new Promise((resolve, reject) => {
                db.run(update.query, (err) => {
                    if (err) {
                        console.error(`Error dropping table for version ${update.version}:`, err.message);
                        return reject(err);
                    }

                    console.log(`Successfully dropped table for version ${update.version}`);
                    db.run(
                        `INSERT INTO schema_version (version) VALUES (?)`,
                        [update.version],
                        (insertErr) => {
                            if (insertErr) {
                                console.error("Error updating schema version:", insertErr.message);
                                reject(insertErr);
                            } else {
                                console.log(`Schema version updated to ${update.version}`);
                                resolve();
                            }
                        }
                    );
                });
            });
        });

        Promise.all(dropPromises)
        .then(() => {
            resolve({ status: 200, message: "Tables dropped and schema updated successfully" });
        })
        .catch((err) => {
            console.error("One or more table drops failed:", err.message);
            reject(err);
        });
    });
}

// // Backup database before making changes
// export async function backupDatabase() {
//     const dbPath = path.join(__dirname, 'fp.db');
//     const backupFolder = path.join(__dirname, 'database_backups');

//     try {
//         // Ensure backup folder exists
//         await fs.promises.mkdir(backupFolder, { recursive: true });

//         // Create a timestamped backup filename
//         const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//         const backupPath = path.join(backupFolder, `fp_backup_${timestamp}.db`);

//         // Copy the database file
//         await fs.promises.copyFile(dbPath, backupPath);
//         console.log(`Database backed up successfully to ${backupPath}`);

//         return { status: 200, message: "Backup created successfully" };
//     } catch (err) {
//         console.error("Error backing up the database:", err);
//         throw err;
//     }
// }




// // Drop tables
// export default function dropTables(db, currentVersion) {

//     const drops = [
//         { version: 103.5, query: `DROP TABLE IF EXISTS users;` },
//         { version: 103.6, query: `DROP TABLE IF EXISTS bt_files;` },
//         { version: 103.7, query: `DROP TABLE IF EXISTS bt_projects;` },
//         { version: 103.8, query: `DROP TABLE IF EXISTS ft_files;` },
//         { version: 103.9, query: `DROP TABLE IF EXISTS ft_projects;` },
//         { version: 103.10, query: `DROP TABLE IF EXISTS news;` },
//         { version: 103.11, query: `DROP TABLE IF EXISTS teams;` },
//     ];
  
//     const dropsToQuery = drops.filter(d => d.version > currentVersion);

//     if (dropsToQuery.length === 0) {
//         console.log("No tables need to be dropped.");
//         return Promise.resolve({ status: 400, message: "No tables need to be dropped"});
//     }

//     const dropPromises = dropsToQuery.map((update) => {
//       return new Promise((resolve, reject) => {
//         db.run(update.query, (err) => {
//           if (err) {
//             console.error(`Error applying update to version ${update.version}:`, err.message);
//             reject(err);
//           } else {
//             console.log(`Successfully applied schema update to version ${update.version}`);
//             db.run(
//                 `INSERT INTO schema_version (version) VALUES (?)`,
//                 [update.version],
//                 (insertErr) => {
//                   if (insertErr) {
//                     console.error("Error updating schema version:", insertErr.message);
//                     reject(insertErr); 
//                   } else {
//                     console.log(`Schema version updated to ${update.version}`);
//                     resolve(); 
//                   }
//                 }
//             );
//           }
//         });
//       });
//     });
  
//     return Promise.all(dropPromises)
//       .then(() => {
//         // console.log("All schema updates have been applied successfully.");
//         console.log("All required table drops have been completed successfully.");
//         resolve({status: 200, message: "Tables dropped succesfully"});
//       })
//       .catch((err) => {
//         // console.error("One or more schema updates failed:", err.message);
//         console.error("One or more table drops failed:", err.message);
//       });
//   }
  