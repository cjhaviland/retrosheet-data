const fs = require('fs')
const sanitizeTxtFiles = require('./sanitizeTxtFiles')
const csvConvert = require('./csvConvert')
const getData = require('./getData')
const weeklyReview = require('./review/weekly')


// fs.readdir('./data/txt', (err, files) => {
//     if (err) return console.error(err)

//     txtFilesList = files
// })

// Step 1 - Run bevent.bat

// Step 2 - Sanitize the TXT Files
// sanitizeTxtFiles()

// Step 3 - Convert to JSON
// csvConvert()

// Step 4 - Get the data from the JSON files
// fs.readdir('./data/json', (err, files) => {
//     if (err) return console.error(err)
    
//     files.forEach(file => {
//         // console.log(file)
//         getData(file)
//     })
// })

// Step 5 - Analyze the data
// weeklyReview()
