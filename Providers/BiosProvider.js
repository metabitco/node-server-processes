const si = require('systeminformation')

module.exports = {
    loadData() {
        return new Promise((resolve, reject) => {
            si.bios().then(resolve).catch(reject)
        })
    }
}