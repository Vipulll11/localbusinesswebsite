const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the directory containing HTML files
const htmlDirectory = path.join(__dirname, 'public');

// Define MIME types for different file types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif'
};

// Create a server
const server = http.createServer((req, res) => {
    // Get the URL and parse it
    const url = req.url;
    console.log(url);
    const parsedUrl = new URL(url, `http://${req.headers.host}`);
    console.log(parsedUrl);

    // Extract the pathname
    const pathname = parsedUrl.pathname;

    // Set default page to index.html if pathname is '/'
    const filePath = pathname === '/' ? '/index.html' : pathname;

    // Get the file extension
    const extname = path.extname(filePath);

    // Set the content type based on the file extension
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Read the file
    fs.readFile(path.join(htmlDirectory, filePath), (err, data) => {
        if (err) {
            // If the file is not found, return a 404 error
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                // For other errors, return a 500 error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // If the file is found, write the content to the response
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});
                                
// Set the port
const port = 3000;

// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
