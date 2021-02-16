const fs = require('fs');
const csvToJson = require('convert-csv-to-json')

function csvConvert() {
    fs.readdir('./data/txt', (err, files) => {
        files.forEach(file => {
            let fileName = file.split('.')[0]
            csvToJson.fieldDelimiter(',').formatValueByType().generateJsonFileFromCsv(`./data/txt/${file}`, `./data/json/${fileName}.json`)
        })
    })
}

module.exports = csvConvert