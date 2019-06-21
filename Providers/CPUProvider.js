const si = require('systeminformation')
const os = require('os');

module.exports = {
    loadData() {
        return new Promise((resolve, reject) => {
            si.currentLoad(resolve).catch(reject);
        })
    }
}