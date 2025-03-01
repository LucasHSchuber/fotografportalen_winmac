
// Aplly updates based on version
// function applySchemaUpdates(currentVersion) {
export default function applySchemaUpdates(db, currentVersion) {
    const updates = [
      {
        version: 102.3,
        query: `
          CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_project_uuid ON _projects (project_uuid);
        `,
      },
      {
        version: 102.4,
        query: `
          CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_news_id_user_id ON news (id, user_id);
        `,
      },
      {
        version: 102.5,
        query: `
          CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_project_user ON timereport (project_id, user_id);
        `,
      },
      {
        version: 103.4,
        query: `UPDATE ft_files SET is_sent = 1;
        `,
      }
    ];
    const updatesToApply = updates.filter((update) => update.version > currentVersion);

    if (updatesToApply.length === 0) {
      console.log("No tables needs updating.");
      return Promise.resolve();
    }

    const updatePromises = updatesToApply.map((update) => {
      return new Promise((resolve, reject) => {
        db.run(update.query, (err) => {
          if (err) {
            console.error(`Error applying update to version ${update.version}:`, err.message);
            reject(err); 
          } else {
            console.log(`Applied schema update to version ${update.version}`);
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
  
    return Promise.all(updatePromises)
      .then(() => {
        console.log("All schema updates have been successfully applied.");
      })
      .catch((err) => {
        console.error("One or more schema updates failed:", err.message);
      });
  }