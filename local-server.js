const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = 3000;
const updateFilesPath = path.join(__dirname, 'dist');

console.log("updateFilesPath: ", updateFilesPath)
app.use(express.static(updateFilesPath));

app.get('/app-update.yml', (req, res) => {
  const filePath = path.join(updateFilesPath, 'app-update.yml');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(404).send('File not found');
      return;
    }
    res.type('application/octet-stream');
    res.send(data);
  });
});

app.get('/latest.yml', (req, res) => {
  const filePath = path.join(updateFilesPath, 'latest.yml');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(404).send('File not found');
      return;
    }
    res.type('application/json');
    res.send(data);
  });
});

http.createServer(app).listen(PORT, () => {
  console.log(`Local HTTP server is running on http://localhost:${PORT}`);
});
