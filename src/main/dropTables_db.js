// Drop tables
export default function dropTables(db) {
    const tablesToDrop = []; // Add tables to drop inside the array
    if (tablesToDrop.length === 0) {
      console.log("No tables to drop");
      return Promise.resolve();
    }
  
    const dropPromises = tablesToDrop.map((table) => {
      return new Promise((resolve, reject) => {
        db.run(`DROP TABLE IF EXISTS ${table};`, (err) => {
          if (err) {
            console.error(`Error dropping ${table} table: ${err.message}`);
            reject(err);
          } else {
            console.log(`${table} table dropped successfully.`);
            resolve();
          }
        });
      });
    });
  
    return Promise.all(dropPromises)
      .then(() => {
        console.log("All tables dropped successfully.");
      })
      .catch((err) => {
        console.error("One or more table drops failed:", err.message);
      });
  }
  