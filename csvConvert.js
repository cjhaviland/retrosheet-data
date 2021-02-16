const csvToJson = require('convert-csv-to-json')

function csvConvert(fileInputPath, fileOutputPath) {
    let fileInputName = fileInputPath
    let fileOutputName = fileOutputPath
    
    csvToJson.fieldDelimiter(',').formatValueByType().generateJsonFileFromCsv(fileInputName, fileOutputName)
}

module.exports = csvConvert