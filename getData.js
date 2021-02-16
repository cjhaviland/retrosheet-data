const fs = require('fs')
const _ = require('lodash')

let result = {}

function getData(file) {
    const teamObj = JSON.parse(fs.readFileSync(`./data/json/${file}`))


    for (let item of teamObj) {
        // Ensure player and game record exists in the object
        createEntry(item.resBatter, item.gameId)

        // Increment AB
        if (item.abFlag === 'T') {
            console.log(`${item.resBatter} ${item.gameId}`)
            result[`${item.resBatter}`][`${item.gameId}`]['AB']++
        }
        
        // Increment Hits
        if (item.hitValue > 0) {
            result[`${item.resBatter}`][`${item.gameId}`]['H']++
        }

        // Increment HR
        if (item.eventType === 23) {
            result[`${item.resBatter}`][`${item.gameId}`]['HR']++
        }

        // Add any RBIs
        if (item.rbiOnPlay > 0) {
            result[`${item.resBatter}`][`${item.gameId}`]['RBI'] = result[`${item.resBatter}`][`${item.gameId}`]['RBI'] + item.rbiOnPlay

            // Increment Rs
            if (item.runnerOn1stDest === 4) {
                createEntry(item.firstRunner, item.gameId)

                result[`${item.firstRunner}`][`${item.gameId}`]['R']++
            }
            
            if (item.runnerOn2ndDest === 4) {
                createEntry(item.secondRunner, item.gameId)

                result[`${item.secondRunner}`][`${item.gameId}`]['R']++
            }

            if (item.runnerOn3rdDest === 4) {
                createEntry(item.thirdRunner, item.gameId)

                result[`${item.thirdRunner}`][`${item.gameId}`]['R']++
            }
        }

        // Increment BB
        if (item.eventType === 14 || item.eventType === 15) {
            result[`${item.resBatter}`][`${item.gameId}`]['BB']++
        }
        
        // Increment HBP
        if (item.eventType === 16) {
            result[`${item.resBatter}`][`${item.gameId}`]['HBP']++
        }
        
        // Increment SF
        if (item.SFFlag === 'T') {
            result[`${item.resBatter}`][`${item.gameId}`]['SF']++
        }

        // Increment SBs
        if (item.sbForRunnerOn1stFlag === 'T') {
            createEntry(item.firstRunner, item.gameId)

            result[`${item.firstRunner}`][`${item.gameId}`]['SB']++
        }
        
        if (item.sbForRunneron2ndFlag === 'T') {
            createEntry(item.secondRunner, item.gameId)

            result[`${item.secondRunner}`][`${item.gameId}`]['SB']++
        }
        
        if (item.sbForRunnerOn3rdFlag === 'T') {
            createEntry(item.thirdRunner, item.gameId)

            result[`${item.thirdRunner}`][`${item.gameId}`]['SB']++
        }

        // Increment XBH
        if (item.eventType === 21 || item.eventType === 22 || item.eventType === 23) {
            result[`${item.resBatter}`][`${item.gameId}`]['XBH']++
        }
    }

    fs.writeFileSync('data/output.json', JSON.stringify(result, null, 2))    
}

function createEntry(player, gameId) {
    // console.log('createEntry')
    if(!result[`${player}`]) {
        result[`${player}`] = {}
        console.log(`player entry created: ${player}`)
    }

    if (!result[`${player}`][`${gameId}`]) {
        result[`${player}`][`${gameId}`] = {
            'AB': 0,
            'R': 0,
            'H': 0,
            'HR': 0, 
            'RBI': 0,
            'BB': 0,
            'HBP': 0,
            'SF': 0,
            'SB': 0,
            'XBH': 0 
        }
        console.log(`game entry created: ${gameId}`)
    }
}


module.exports = getData