# Simple Node.js Server

This repository contains a simple Node.js server that demonstrates basic HTTP operations, file reading, and compression techniques.

## Features

- **Basic HTTP Server**: Responds with a plain text greeting on the root path (`/`).
- **Echo Service**: Returns the content of a specified file with optional GZIP compression if supported by the client.
- **User-Agent Printer**: Sends back the `User-Agent` header with whitespace removed.
- **File Operations**: Handles file retrieval and creation under the `/files/` path.



## Endpoints

- `/`: Returns a simple greeting.
- `/echo/[filename]`: Returns the content of `[filename]` from the specified directory.
- `/user-agent`: Returns the client's User-Agent string.
- `/files/[filename]`: GET to retrieve a file; POST to create or overwrite a file.



## Error Handling

The server includes a `handleError` function to manage HTTP errors gracefully. It can handle the following errors:
- **400 Bad Request**: When the request cannot be processed due to client error (e.g., missing User-Agent header).
- **404 Not Found**: When the requested resource (e.g., file) is not found.
- **405 Method Not Allowed**: When the request method is not supported by the server (e.g., PUT method on `/files/`).
- **500 Internal Server Error**: When the server encounters an unexpected condition that prevents it from fulfilling the request (e.g., error during file creation).



## Dependencies

- `http`: Core HTTP module to create the server.
- `fs`: File System module to handle file operations.
- `zlib`: Module to perform GZIP compression.



