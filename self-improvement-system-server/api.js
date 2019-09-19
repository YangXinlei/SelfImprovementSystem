const express = require('express')
const fs = require('fs')
const app = express()
const port = 4000
const infoJsonFile = 'info.json'
const infoJsonFileBk = 'info.json.bk'

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/info', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(fs.readFileSync(infoJsonFile));
})

app.post('/updateinfo', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!req.body) {
        res.send('body is empty');
        return;
    }

    fs.copyFileSync(infoJsonFile, infoJsonFileBk);
    fs.writeFileSync(infoJsonFile, req.body);

    res.send('done.');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))