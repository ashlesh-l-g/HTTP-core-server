const http = require("http");
const fs = require('fs');

const host = 'localhost';
const port = 8000;

const books = JSON.stringify([
    { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
    { title: "The Prophet", author: "Kahlil Gibran", year: 1923 },
]);
const authors = JSON.stringify([
    { name: "Paul Coelho", countryofBirth: "Brazil", birthYear: 1947 },
    { name: "Kahlil Gibran", countryofBirth: "Lebanon", birthYear: 1883 },
]);

const requestListner = function(req,res){
    res.setHeader("Content-Type", "application/json");
    switch(req.url){
        case "/books":
            res.writeHead(200);
            res.end(books);
            break;
        case "/authors":
            res.writeHead(200);
            res.end(authors);
            break;
        default:
            res.writeHead(404);
            res.end(JSON.stringify({error: "Resource not found"}));
    }
}

const server = http.createServer(requestListner);

server.listen(port,host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});