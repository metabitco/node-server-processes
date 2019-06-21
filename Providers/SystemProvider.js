const si = require('systeminformation')

module.exports = {
    loadData() {
        return new Promise((resolve, reject) => {
            si.system().then(resolve).catch(reject)
        })
    }
}