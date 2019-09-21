const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser');
const app = express()
const port = 4000
const infoJsonFile = 'info.json'
const infoJsonFileBk = 'info.json.bk'

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");    
    next();
})

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/info', (req, res) => {
    res.send(fs.readFileSync(infoJsonFile));
})

app.post('/updateinfo', (req, res) => {
    if (!req.body) {
        res.send('body is empty');
        return;
    }

    fs.copyFileSync(infoJsonFile, infoJsonFileBk);
    fs.writeFileSync(infoJsonFile, JSON.stringify(req.body));

    res.send('done.');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))