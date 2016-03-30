var http = require('http');
var server = http.createServer(function(req, res) {
    // req - request readable stream
    // res - response writable stream
    console.log("Opening a new JSON stream")
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
    });
    const intervalId = setInterval(() => {
        res.write(JSON.stringify({
            value: "InputStreamOptionsBugReproData",
            timeStamp: new Date().toUTCString()
        }))
    }, 1000);
    res.on("close", () => {
        clearInterval(intervalId);
        console.log("closed")
    })
});
server.listen(8000, '127.0.0.1');