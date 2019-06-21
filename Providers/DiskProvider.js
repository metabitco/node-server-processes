const si = require('systeminformation')

module.exports = {
    loadData() {
        return new Promise((resolve, reject) => {
            si.fsSize().then(dataBits => {
                dataBits = dataBits.filter(disk => !disk.mount.includes('private')).filter(disk => disk.mount).map(disk => {
                    disk.human_size = disk.size / 1000000000;
                    disk.human_used = disk.used / 1000000000;
                    return disk;
                })

                resolve(dataBits);
            })
            .catch(reject);
        })
    }
}
