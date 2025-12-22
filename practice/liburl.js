const http = require("http");
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
    const host = req.headers.host || 'localhost:8000';
    const url = new URL(req.url, `http://${host}`);
    res.setHeader("Content-Type", "application/json");
    switch (url.pathname){
        case '/books':
            if(req.method !== 'GET') {
                res.writeHead(405, { 'Allow':'GET'});
                return res.end(JSON.stringify({ error: 'Method not allowed'}));
            }
            res.writeHead(200);
            return res.end(books);
        case '/authors':
            if(req.method !== 'GET'){
                res.writeHead(405, { 'Allow': 'GET'});
                return res.end(JSON.stringify({error: 'Method not allowed'}));
            }
            res.writeHead(200);
            return res.end(authors);
        default:
            res.writeHead(404);
            return res.end(JSON.stringify({ error: 'Resource not found'}));
    }
}

const server = http.createServer(requestListner);

server.listen(port,host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});