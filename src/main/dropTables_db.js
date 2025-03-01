// Drop tables
export default function dropTables(db, currentVersion) {

    const drops = [
        {
          version: 103.5,
          query: `DROP table IF EXISTS users;`,
        }
      ];
  
    const dropsToQuery = drops.filter(d => d.version > currentVersion);

    if (dropsToQuery.length === 0) {
        console.log("No tables need to be dropped.");
        return Promise.resolve();
    }

    const dropPromises = dropsToQuery.map((update) => {
      return new Promise((resolve, reject) => {
        db.run(update.query, (err) => {
          if (err) {
            console.error(`Error applying update to version ${update.version}:`, err.message);
            reject(err);
          } else {
            console.log(`Successfully applied schema update to version ${update.version}`);
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
          }
        });
      });
    });
  
    return Promise.all(dropPromises)
      .then(() => {
        // console.log("All schema updates have been applied successfully.");
        console.log("All required table drops have been completed successfully.");
      })
      .catch((err) => {
        // console.error("One or more schema updates failed:", err.message);
        console.error("One or more table drops failed:", err.message);
      });
  }
  