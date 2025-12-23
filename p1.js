const http = require("http");
const host = 'localhost';
const port = 8000;
const MAX_SIZE = 1 * 1024 * 1024;

const books = [
    { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
    { title: "The Prophet", author: "Kahlil Gibran", year: 1923 },
];

const requestListner = function(req,res) {
    try{

        const url = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`);

        const contentType = req.headers['content-type'];
        if (['POST','PUT','PATCH'].includes(req.method)&&(!contentType || !contentType.startsWith('application/json'))){
            res.writeHead(415, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unsupported Media Type' }));
            return;
        }

        switch(`${req.method} ${url.pathname}`){
            case 'GET /':
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Welcome to the api'}));
                return;
            case 'GET /books':
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(books));
                return;
            case 'POST /books':
                let body = '';
                let totalSize = 0;
                req.on('data', chunk => {
                    totalSize += chunk.length;

                    if(totalSize > MAX_SIZE){
                        res.writeHead(413, { 'Content-Type': 'application/json'});
                        res.end(JSON.stringify({error:'Request entry too large'}));
                        req.destroy();
                        return;
                    }
                    body += chunk;
                });
                req.on('end', () =>{
                    if(res.headersSent) return;
                    try{
                        const newBook = JSON.parse(body);
                        books.push(newBook);
                        res.writeHead(201, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({ message: 'Book added', book:newBook}));
                    } catch (e) {
                        res.writeHead(400, {'Content-Type':'application/json'});
                        res.end(JSON.stringify({error: 'Invalid JSON'}));
                    }
                });
                return;
            default:
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end();
        }
    } catch (err){
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Internal Server Error'}));
    }
};

const server = http.createServer(requestListner);

server.listen(port,host, () =>{
    console.log(`Server is running on http://${host}:${port}`);
})

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        process.exit(0);
    });
});