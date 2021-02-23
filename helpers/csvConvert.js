const fs = require('fs');
const csvToJson = require('convert-csv-to-json')

function csvConvert(yearToProcess) {
    fs.readdir(`./data/txt/${yearToProcess}`, (err, files) => {
        files.forEach(file => {
            let fileName = file.split('.')[0]
            csvToJson.fieldDelimiter(',').formatValueByType().generateJsonFileFromCsv(`./data/txt/${yearToProcess}/${file}`, `./data/json/${yearToProcess}/${fileName}.json`)
        })
    })
}

module.exports = csvConvert