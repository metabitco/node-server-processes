const si = require('systeminformation')

module.exports = {
    loadData() {
        return new Promise((resolve, reject) => {
            si.osInfo().then(resolve).catch(reject)
        })
    }
}