const si = require('systeminformation')

module.exports = {
    loadData() {
        return new Promise((resolve, reject) => {
            si.cpuTemperature().then(resolve).catch(reject)
        })
    }
}