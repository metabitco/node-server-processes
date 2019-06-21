const si = require('systeminformation')

module.exports = {
    loadData() {
        return new Promise((resolve, reject) => {
            si.mem().then(resolve).catch(reject)
        })
    }
}