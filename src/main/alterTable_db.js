export default function alterTable(db, currentVersion) {
  console.log("alterTable currentVersion", currentVersion)
  const updates = [
      // { version: 10201, table: "news", column: "user_id", query: `ALTER TABLE news ADD COLUMN user_id INTEGER;` },
      { version: 10201, table: "timereport", column: "is_sent_permanent", query: `ALTER TABLE timereport ADD COLUMN is_sent_permanent BOOLEAN DEFAULT 0;` },
      { version: 10301, table: "timereport", column: "is_deleted", query: `ALTER TABLE timereport ADD COLUMN is_deleted BOOLEAN DEFAULT 0;` },
      // { version: 10302, table: "ft_files", column: "is_sent", query: `ALTER TABLE ft_files ADD COLUMN is_sent INTEGER DEFAULT 0;` },
      // { version: 10303, table: "ft_projects", column: "is_deleted", query: `ALTER TABLE ft_projects ADD COLUMN is_deleted INTEGER DEFAULT 0;` },
  ];

  const updatesToApply = updates.filter(update => update.version > currentVersion);

  if (updatesToApply.length === 0) {
      console.log("No tables need updating (alterTable).");
      return Promise.resolve();
  }

  const updatePromises = updatesToApply.map(update => {
      return new Promise((resolve, reject) => {
          db.all(`PRAGMA table_info(${update.table});`, (err, rows) => {
              if (err) {
                  console.error(`Error fetching table info for ${update.table}:`, err.message);
                  return reject(err);
              }

              const columnExists = rows.some(row => row.name === update.column);
              if (columnExists) {
                  console.log(`Column '${update.column}' already exists in '${update.table}', skipping.`);
                  return resolve();
              }

              db.run(update.query, err => {
                  if (err) {
                      console.error(`Error applying update to version ${update.version}:`, err.message);
                      return reject(err);
                  }

                  console.log(`Successfully applied schema update to version ${update.version}`);
                  db.run(`INSERT INTO schema_version (version) VALUES (?)`, [update.version], insertErr => {
                      if (insertErr) {
                          console.error("Error updating schema version:", insertErr.message);
                          return reject(insertErr);
                      }
                      console.log(`Schema version updated to ${update.version}`);
                      resolve();
                  });
              });
          });
      });
  });

  return Promise.all(updatePromises)
      .then(() => console.log("All schema updates have been applied successfully."))
      .catch(err => console.error("One or more schema updates failed:", err.message));
}


// // function alterTable(db, currentVersion) {
// export default function alterTable(db, currentVersion) {
//     const updates = [
//       {
//         version: 102.1,
//         query: `ALTER TABLE news ADD COLUMN user_id INTEGER;`,
//       },
//       {
//         version: 102.2,
//         query: `ALTER TABLE timereport ADD COLUMN is_sent_permanent BOOLEAN DEFAULT 0;`,
//       },
//       {
//         version: 103.1,
//         query: `ALTER TABLE timereport ADD COLUMN is_deleted BOOLEAN DEFAULT 0;`,
//       },
//       {
//         version: 103.2,
//         query: `ALTER TABLE ft_files ADD COLUMN is_sent INTEGER DEFAULT 0;`,
//       },
//       {
//         version: 103.3,
//         query: `ALTER TABLE ft_projects ADD COLUMN is_deleted INTEGER DEFAULT 0;`,
//       },
//     ];
  
//     // Sort updates by version to ensure correct order
//     const sortedUpdates = updates.filter((update) => update.version > currentVersion);
  
//     if (sortedUpdates.length === 0) {
//       console.log("No tables needs updating (alterTable).");
//       return Promise.resolve();
//     }

//     // Map updates to Promises
//     const updatePromises = sortedUpdates.map((update) => {
//       return new Promise((resolve, reject) => {
//         db.run(update.query, (err) => {
//           if (err) {
//             console.error(`Error applying update to version ${update.version}:`, err.message);
//             reject(err);
//           } else {
//             console.log(`Successfully applied schema update to version ${update.version}`);
//             db.run(
//               `INSERT INTO schema_version (version) VALUES (?)`,
//               [update.version],
//               (insertErr) => {
//                 if (insertErr) {
//                   console.error("Error updating schema version:", insertErr.message);
//                   reject(insertErr); 
//                 } else {
//                   console.log(`Schema version updated to ${update.version}`);
//                   resolve(); 
//                 }
//               }
//             );
//           }
//         });
//       });
//     });
  
//     return Promise.all(updatePromises)
//       .then(() => {
//         console.log("All schema updates have been applied successfully.");
//       })
//       .catch((err) => {
//         console.error("One or more schema updates failed:", err.message);
//       });
//   }