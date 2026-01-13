import { addRoute,matchRoute } from '../routes/routes.js';

const http = require("http");
const host = 'localhost';
const port = 8000;
const { URL } = require('url');

addRoute('GET','/items', listItems);
addRoute('GET','/items/:id',getItem);
addRoute('POST','/items',createItem);
addRoute('DELETE','/items/:id',deleteItem);

const requestListner = function(req,res){

    const match = matchRoute(req,res);
    if(!match){
        res.statusCode = 404;
        return res.end(`Not found`);
    }

};

const server = http.createServer(requestListner);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});