const express = require("express")
const cors = require("cors")
const app = express()
const fs = require('fs')
const range = require("range-parser")
const path = require('path')

let arr = []

app.use(cors())
app.get("/notification", (req, res) => {

    res.setHeader('Content-Type', 'text/event-stream');

    res.flushHeaders(); // flush the headers to establish SSE with client

    res.write(`data: ${JSON.stringify(arr)}\n\n`)

    const id = setInterval(() => {
        arr.push(arr[arr.length - 1] ?? 0 + 1)
        console.log("sending data")
        res.write(`data: ${JSON.stringify(arr)}\n\n`)
    }, 1000)

    res.on('close', () => {
        console.log('client dropped me');
        clearInterval(id);
        arr = []
        res.end();
    });
})

app.get("/download", (req, res) => {
    const filePath = path.join(__dirname, 'video.mov');
    const fileStream = fs.createReadStream(filePath);
    const fileStats = fs.statSync(filePath);

    const headers = {
        // 'Content-Type': 'video/mp4',
        'Content-Length': fileStats.size,
    };

    // // res.set("book", "Designing-Data-Intensive-Applications.pdf");
    // res.download(filePath)

    res.writeHead(200, headers);
    fileStream.pipe(res);
})

// app.get('/download', (req, res) => {
//     const filePath = path.join(__dirname, 'video.mov');

//     const fileStream = fs.createReadStream(filePath);
//     const fileStats = fs.statSync(filePath);

//     const headers = {
//         // 'Content-Type': 'video/mp4',
//         'Content-Length': fileStats.size,
//     };

//     // Handle range requests
//     const rangeHeader = req.headers.range;
//     if (rangeHeader) {
//         const positions = range(fileStats.size, rangeHeader, { combine: true });
//         if (positions === -1 || positions === -2) {
//             res.status(416).send('Invalid range');
//             return;
//         }

//         const start = positions[0].start;
//         const end = positions[0].end;

//         headers['Content-Range'] = `bytes ${start}-${end}/${fileStats.size}`;
//         headers['Content-Length'] = end - start + 1;

//         res.writeHead(206, headers);
//         fileStream.pipe(res);
//     } else {
//         // No range header present, just send the entire file
//         res.writeHead(200, headers);
//         fileStream.pipe(res);
//     }
// });

app.listen(4000, () => {
    console.log("server running on port 4000")
})