const { exec } = require('child_process');

exec('node create-app-updater-yml.js', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error executing create-app-updater-yml.js: ${err.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
