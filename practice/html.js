const http = require("http");

const host = 'localhost';
const port = 8000;

const requestListner = function(req,res) {
    res.setHeader("content-Type","text/html");
    res.writeHead(200);
    res.end(`<html><body><h1> This is HTML</h1></body></html>`);
};

const server = http.createServer(requestListner);
server.listen(port,host, () =>{
    console.log(`Server is running on http://${host}:${port}`);
});