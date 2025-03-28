### DATABASE MIGRATIONS - (update fp.db)
### This readme file includes a simple guide on how to update the database in photographer portal. The main/index.js file (main-process) and three external scripts handles the database updates.
### 1. src/main/index.js - handles "CREATE TABLES IF NOT EXISTS"
### 2. src/main/dropTables_db.js - handles "DROP TABLE"
### 3. src/main/alterTables_db.js - handles "ALTER TABLE"
### 4. src/main/miscUpdates_db.js - handles other database updates

#### CREATE TABLE IF NOT EXITST
##### All tables are created in createTables method placed in main/index.js file.

#### DROP TABLES (only drop)
##### If you need to drop tables, add a new object in the drop array placed in main/dropTables_db.js. Make sure version value in the array differs from other versions value in the different files inside main folder. Also make sure its a greater value than the last added value in any of the files inside main folder.

#### ALTER TABLE (only add columns)
##### If you need to alter table, add a new object in the updates array placed in main/alterTable_db.js. Make sure version value in the array differs from other versions value in the different files inside main folder.

#### MISC UPDATES (create unique indexes, updated values in columns, etc..)
##### If you need to e.g. update columns or create unique indexes, add a new object in the updates array placed in main/miscUpdates_db.js. Make sure version value in the array differs from other versions value in the different files inside main folder. Also make sure its a greater value than the last added value in any of the files inside main folder.