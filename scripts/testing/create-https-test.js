const fs = require('fs');
const path = require('path');

const scriptDirectory = __dirname;
let code = fs.readFileSync(path.join(scriptDirectory, 'test-production-api.js'), 'utf8');
code = code.replace('const http = require("http");', 'const https = require("https");');
code = code.replace('const BASE_PORT = 80;', 'const BASE_PORT = 443;');
code = code.replace('const req = http.request(reqOptions,', 'const req = https.request(reqOptions,');
code = code.replace('const reqOptions = {', 'const reqOptions = {\n      rejectUnauthorized: false,');
code = code.replace('Target: http://', 'Target: https:// (HTTPS/TLS Port 443) ');

fs.writeFileSync(path.join(scriptDirectory, 'test-production-https.js'), code);
console.log('Successfully generated test-production-https.js');

