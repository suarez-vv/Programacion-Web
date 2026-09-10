/* Author: Suarez, V.V.*/
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const server = express();

//Get full path of this file (include file)
const fileName = fileURLToPath(import.meta.url);

//Get directory path of this file (without file)
const dirName = path.dirname(fileName);

//Access to directory frontend, and get all resource from this path
server.use(
    express.static(
        path.join(dirName, '../../frontend')
    )
);

server.listen(3000, () => {
    console.log('Server running on port 3000');
})