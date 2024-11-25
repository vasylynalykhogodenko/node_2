const fs = require('fs');
const path = require('path');

function logRequest(req, payload) {
  const logFile = path.join(__dirname, '../server.log');
  const logEntry = `
[${new Date().toISOString()}]
URL: ${req.url}
Method: ${req.method}
Payload: ${JSON.stringify(payload, null, 2)}
---------------------------------------------
`;
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error('Error writing log:', err.message);
  });
}

module.exports = { logRequest };
