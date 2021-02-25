require('dotenv').config()
const fs = require('fs')
const createPlayerList = require('./helpers/createPlayerList')
const sanitizeTxtFiles = require('./helpers/sanitizeTxtFiles')
const csvConvert = require('./helpers/csvConvert')
const getData = require('./helpers/getData')
const weeklyReview = require('./review/weekly')
const consistency = require('./review/consistency')
const statsReview = require('./review/statsReview')
const searchBatters = require('./review/searchBatters')
const { yahooFantasy } = require('./helpers/yahoo')

const yearToProcess = '2019'
// fs.readdir('./data/txt', (err, files) => {
//     if (err) return console.error(err)

//     txtFilesList = files
// })

// Step 1 - Run bevent.bat

// Step 2 - Sanitize the TXT Files
// sanitizeTxtFiles(yearToProcess)

// Step 3 - Convert to JSON
// csvConvert(yearToProcess)

// Step 4 - Get the data from the JSON files
// createPlayerList(yearToProcess)
// fs.readdir(`./data/json/${yearToProcess}`, (err, files) => {
//     if (err) return console.error(err)
    
//     files.forEach(file => {
//         // console.log(file)
//         getData(file, yearToProcess)
//     })
// })

// Step 5 - Analyze the data
// weeklyReview(yearToProcess)
// consistency(yearToProcess)
// statsReview(yearToProcess)
// searchBatters(yearToProcess)
yahooFantasy()