const fs = require('fs')
const _ = require('lodash')

let result = {}
const players = JSON.parse(fs.readFileSync(`./data/players.json`))

function getData(file) {
    const teamObj = JSON.parse(fs.readFileSync(`./data/json/${file}`))

    for (let item of teamObj) {
        // Ensure player and game record exists in the object
        createEntry(item.resBatter, item.gameId, true)

        batterStats(item)

        createEntry(item.resPitcher, item.gameId, false)

        // Record Outs
        result[`${item.resPitcher}`][`${item.gameId}`]['O'] = result[`${item.resPitcher}`][`${item.gameId}`]['O'] + item.outsOnPlay

        // Calculate IP
        result[`${item.resPitcher}`][`${item.gameId}`]['IP'] = 
            `${~~(result[`${item.resPitcher}`][`${item.gameId}`]['O']/3)}.${result[`${item.resPitcher}`][`${item.gameId}`]['O']%3}`

        // Iterate Ks
        if (item.eventType === 3) {
            result[`${item.resPitcher}`][`${item.gameId}`]['K']++
        }
    }

    fs.writeFileSync('data/output.json', JSON.stringify(result, null, 2))    
}

function createEntry(player, gameId, isBatter) {
    // console.log('createEntry')
    if(!result[`${player}`]) {
        const playerInfo = players.find(p => p.ID === player)

        result[`${player}`] = {
            name: `${playerInfo.firstName} ${playerInfo.lastName}`,
            team: playerInfo.teamAbbreviation,
            position: playerInfo.positionAbbreviation
        }

        console.log(`player entry created: ${player}`)
    }

    if (!result[`${player}`][`${gameId}`]) {
        if (isBatter) {
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
        }
        else {
            // IP* K ERA WHIP K/9 QS SV+H
            result[`${player}`][`${gameId}`] = {
                'IP': '',
                'O': 0,
                'K': 0,
                'ER': 0,
                'ERA': 0,
                'WHIP': 0, 
                'K9': 0,
                'QS': 0,
                'SVH': 0
            }
        }
        console.log(`game entry created: ${gameId}`)
    }
}

function batterStats(item) {
    // Increment AB
    if (item.abFlag === 'T') {
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

        // Increment Rs and ERs
        if (item.runnerOn1stDest === 4) {
            createEntry(item.firstRunner, item.gameId, true)
            createEntry(item.resPitcher, item.gameId, false)

            result[`${item.firstRunner}`][`${item.gameId}`]['R']++
            result[`${item.resPitcher}`][`${item.gameId}`]['ER']++
        }
        
        if (item.runnerOn2ndDest === 4) {
            createEntry(item.secondRunner, item.gameId, true)
            createEntry(item.resPitcher, item.gameId, false)

            result[`${item.secondRunner}`][`${item.gameId}`]['R']++
            result[`${item.resPitcher}`][`${item.gameId}`]['ER']++
        }

        if (item.runnerOn3rdDest === 4) {
            createEntry(item.thirdRunner, item.gameId, true)
            createEntry(item.resPitcher, item.gameId, false)

            result[`${item.thirdRunner}`][`${item.gameId}`]['R']++
            result[`${item.resPitcher}`][`${item.gameId}`]['ER']++
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
        createEntry(item.firstRunner, item.gameId, true)

        result[`${item.firstRunner}`][`${item.gameId}`]['SB']++
    }

    if (item.sbForRunneron2ndFlag === 'T') {
        createEntry(item.secondRunner, item.gameId, true)

        result[`${item.secondRunner}`][`${item.gameId}`]['SB']++
    }

    if (item.sbForRunnerOn3rdFlag === 'T') {
        createEntry(item.thirdRunner, item.gameId, true)

        result[`${item.thirdRunner}`][`${item.gameId}`]['SB']++
    }

    // Increment XBH
    if (item.eventType === 21 || item.eventType === 22 || item.eventType === 23) {
        result[`${item.resBatter}`][`${item.gameId}`]['XBH']++
    }
}


module.exports = getData