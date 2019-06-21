const winston = require('winston');
const {format} = winston;
const fs = require('fs');
const path = require('path');
const LOG_DIR = '/var/log/basement-agent';
const ETC_DIR = '/etc/basement/';
const CONFIG_PATH = '/etc/basement/config.json';
const SONAR_HOST = 'http://basement.test/api/metrics/';
const si = require('systeminformation');
const axios = require('axios');
const io = require('socket.io')(4000, {origins: '*:*'});
io.origins((origin, callback) => {
    callback(null, true);
});


if (!fs.existsSync(ETC_DIR) || !fs.existsSync(CONFIG_PATH)) {
    if (!process.env.API_TOKEN) {
        console.error('You MUST run this command with the API_TOKEN env set on the first run!');
        console.error('API_TOKEN=YOUR_API_TOKEN node index.js');
        process.exit(1);
    }

    try {
        fs.mkdirSync(ETC_DIR);
    } catch (e) {
    }

    let config = {
        uuid: require('uuid/v4')(),
        token: process.env.API_TOKEN
    };

    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
    } catch (e) {
    }


    axios.post(SONAR_HOST + 'register', {
        uuid: config.uuid
    }, {
        headers: {
            'Authorization': 'Bearer ' + config.token
        }
    }).then(({data}) => {
        console.log(data)
    }).catch(({response: {data}}) => {
        console.log(data)
    })

}

try {
    fs.mkdirSync(LOG_DIR);
} catch (e) {
}

const config = require(CONFIG_PATH);

const cpuProvider = require('./Providers/CPUProvider');
const ramProvider = require('./Providers/MemoryProvider');
const diskProvider = require('./Providers/DiskProvider');

const load = (provider, name, accessor) => () => {
    provider.loadData().then((data) => {
        io.sockets.in('server.' + config.uuid)
            .emit(name, accessor ? data[accessor] : data)
    }).catch(e => console.error(e));

}

const getRamData = load(ramProvider, 'ram');
const getCpuData = load(cpuProvider, 'cpu', 'currentload');
const getDiskData = load(diskProvider, 'disk');
io.on('connection', function (socket) {
    socket.join('server.' + config.uuid);


    let cpuInterval = setInterval(getCpuData, 2500);
    let ramInterval = setInterval(getRamData,2500);
    let diskInterval = setInterval(getDiskData,2500);
    getRamData();
    getCpuData();
    getDiskData()
    socket.on('disconnect', () => {
        clearInterval(ramInterval);
        clearInterval(cpuInterval);
        clearInterval(diskInterval);
    })
});
