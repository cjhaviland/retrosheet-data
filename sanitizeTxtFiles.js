const fs = require('fs')

function sanitizeTxtFiles() {
    fs.readdir('./data/txt', (err, files) => {
        files.forEach(file => {
            console.log(file)
        })
    })
}

module.exports = sanitizeTxtFiles