const http = require('http'); 
const fs = require('fs');
const zlib = require('zlib');
const PORT = 4221; 

// Error handling function for a cleaner approach
function handleError(socket, code, message) 
{
  socket.writeHead(code, { 'Content-Type': 'text/plain' });
  socket.end(message);
}
const server = http.createServer((req, res) => {
  const { method, url, headers } = req; // Destructure request object
  const directory = process.argv[3]; // Directory path from arguments
  if (url === '/') 
  {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from the server!');
  }
  else if (url.startsWith('/echo/')) 
  {
    const acceptEncoding = headers['accept-encoding']; // Check for encoding header
    const fileName = url.split('/').pop();
    const content = fs.readFileSync(directory + fileName, 'utf8');
    const compressed = acceptEncoding?.includes('gzip') ? zlib.gzipSync(content) : content;
    res.writeHead(200, 
    {
      'Content-Type': 'text/plain',
      'Content-Length': compressed.length,
      ...(acceptEncoding?.includes('gzip') && { 'Content-Encoding': 'gzip' }), });
      res.end(compressed);
    }  
  else if (url.startsWith('/user-agent')) 
  {
    const userAgent = req.headers['user-agent'];
    if (userAgent) 
      {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(userAgent.replace(/\s/g, ''));
      }
    else 
      {
        handleError(res, 400, 'Missing User-Agent header');
      }
  } 
  else if (url.startsWith('/files/')) 
  {
    if (method === 'GET') 
    {
      const fileName = url.split('/').pop();
      const filePath = directory + fileName;
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, null); // Read binary data
        res.writeHead(200, {
           'Content-Type': 'application/octet-stream','Content-Length': content.length, });
            res.end(content);
      }
      else 
      {
        handleError(res, 404, 'File not found');
      }
    } 
    else if (method === 'POST') 
    {
      const fileName = url.split('/').pop();
      const filePath = directory + fileName;
      let content = '';
      req.on('data', (chunk) => {
        content += chunk;
      });
      req.on('end', () => {
        fs.writeFileSync(filePath, content);
        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.end('File created successfully');
      });
      req.on('error', (err) => {
        handleError(res, 500, 'Error creating file');
      });
    }
    else 
    {
      handleError(res, 405, 'Method not allowed');
    }
  } 
  else 
  {
    handleError(res, 404, 'Not found');
  }
});
server.listen(PORT, () => 
  {
  console.log(`Server listening on port ${PORT}`);
});
