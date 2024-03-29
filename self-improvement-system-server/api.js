const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const {exec} = require('child_process')
const app = express()
const port = 31117
const infoJsonFile = 'info.json'
const dir = '/root/projects/SelfImprovementSystem/self-improvement-system-server/'
// const dir = './'
const infoJsonDatabase = dir +'sis_database/info.json'
const rewardFile = dir + 'sis_database/reward.json'
const databaseUpdateScript = dir + 'sis_database/update.sh'
var currentInfoJson;
var rewards = JSON.parse(fs.readFileSync(rewardFile));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");    
    next();
})

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/info', (req, res) => {
    if (!currentInfoJson) {
        currentInfoJson = fs.readFileSync(infoJsonFile);
    }
    res.send(currentInfoJson);
})

app.post('/updateinfo', (req, res) => {
    if (!req.body) {
        res.send(currentInfoJson);
        return;
    }
    let newInfoJson = JSON.stringify(req.body);
    if (currentInfoJson === newInfoJson) {
        res.send(currentInfoJson);
        return;
    }

    if (!isValidInfo(req.body)) {
        res.send(currentInfoJson);
        return;
    }

    req.body.gain = calculateReward(req.body);

    newInfoJson = JSON.stringify(req.body);
    fs.writeFileSync(infoJsonFile, newInfoJson);
    fs.writeFileSync(infoJsonDatabase, newInfoJson);
    currentInfoJson = newInfoJson;
    exec(databaseUpdateScript, (err, stdout, stderr) => {
        console.log(`update with error: ${err}, stdout: ${stdout}, stderr: ${stderr}`);
    });

    res.send(currentInfoJson);
})

function isValidInfo(info) {
    if (!info.books || !info.commits || !info.generalStudy || !info.blogs) {
        return false;
    }
    return true;
}

function calculateReward(info) {
    if (!info) {
        return 0;
    }
    let reward = info.books.reduce((previous, currentBook)=>{
        return previous + rewards[ currentBook.type ] * currentBook.current;
    }, 0);
    reward += info.blogs * rewards.blogs;
    reward += info.commits * rewards.commits;
    reward += info.generalStudy * rewards.generalStudy;
    console.log('reward ', reward)
    return reward;
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))