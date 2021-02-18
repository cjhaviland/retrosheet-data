const fs = require('fs')
const { split } = require('lodash')
const _ = require('lodash')

let result = {}
const players = JSON.parse(fs.readFileSync(`./data/players.json`))

function getData(file) {
    const teamObj = JSON.parse(fs.readFileSync(`./data/json/${file}`))

    for (let item of teamObj) {
        // Ensure player and game record exists in the object
        createEntry(item.resBatter, item.gameId, true)
        createEntry(item.resPitcher, item.gameId, false)

        batterStats(item)
        pitcherStats(item)
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

        // console.log(`player entry created: ${player}`)
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
                'BB': 0,
                'H': 0,
                'WHIP': 0, 
                'K9': 0,
                'QS': 0,
                'SVH': 0
            }
        }
        // console.log(`game entry created: ${gameId}`)
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
        result[`${item.resPitcher}`][`${item.gameId}`]['H']++
    }

    // Increment HR
    if (item.eventType === 23) {
        result[`${item.resBatter}`][`${item.gameId}`]['HR']++
    }

    // Add any RBIs
    if (item.rbiOnPlay > 0) {
        result[`${item.resBatter}`][`${item.gameId}`]['RBI'] = result[`${item.resBatter}`][`${item.gameId}`]['RBI'] + item.rbiOnPlay

        // Increment Rs and ERs
        calcRuns(item.batterDest, item.resBatter, item.resPitcher, item.gameId)
        calcRuns(item.runnerOn1stDest, item.firstRunner, item.resPitcher, item.gameId)
        calcRuns(item.runnerOn2ndDest, item.secondRunner, item.resPitcher, item.gameId)
        calcRuns(item.runnerOn3rdDest, item.thirdRunner, item.resPitcher, item.gameId)
    }

    // Increment BB
    if (item.eventType === 14 || item.eventType === 15) {
        result[`${item.resBatter}`][`${item.gameId}`]['BB']++
        result[`${item.resPitcher}`][`${item.gameId}`]['BB']++
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

function pitcherStats(item) {
    // Record Outs
    result[`${item.resPitcher}`][`${item.gameId}`]['O'] = result[`${item.resPitcher}`][`${item.gameId}`]['O'] + item.outsOnPlay

    // Calculate IP
    result[`${item.resPitcher}`][`${item.gameId}`]['IP'] = 
        `${~~(result[`${item.resPitcher}`][`${item.gameId}`]['O']/3)}.${result[`${item.resPitcher}`][`${item.gameId}`]['O']%3}`

    // Iterate Ks
    if (item.eventType === 3) {
        result[`${item.resPitcher}`][`${item.gameId}`]['K']++
    }

    if (item.inning === 6 && (item.outs + item.outsOnPlay) === 3) {
        qualityStart(item.resPitcher, item.gameId)
    }

    // Calculate WHIP
    result[`${item.resPitcher}`][`${item.gameId}`]['WHIP'] = calcWhip(result[`${item.resPitcher}`][`${item.gameId}`])

    // Calculate K/9
    result[`${item.resPitcher}`][`${item.gameId}`]['K9'] = calcK9(result[`${item.resPitcher}`][`${item.gameId}`])
}

function calcRuns(dest, player, pitcher, gameId) {
    if (dest >= 4) {
        createEntry(player, gameId, true)
        
        result[`${player}`][`${gameId}`]['R']++
        
        if (dest === 4) {
            createEntry(pitcher, gameId, false)
            result[`${pitcher}`][`${gameId}`]['ER']++
        }
    }
}

function qualityStart(pitcher, gameId) {
    var ip = Number.parseFloat(result[`${pitcher}`][`${gameId}`]['IP']) 
    var er = result[`${pitcher}`][`${gameId}`]['ER']

    if (ip >= 6 && er <= 3) {
        result[`${pitcher}`][`${gameId}`]['QS'] = 1
    }
}

function calcWhip(player) {
    let ip = parseInningsPitched(player['IP'])
    return ((player['BB'] + player['H']) / ip)
}

function calcK9(player) {
    let ipParsed = parseInningsPitched(player['IP'])

    return (player['K'] * 9) / ipParsed
}

function parseInningsPitched(ipString) {
    let splitIp = ipString.split('.')

    let fullInnings = Number.parseFloat(splitIp[0])
    let thirdInnings = Number.parseFloat(splitIp[1])

    return fullInnings + (thirdInnings * (1/3))
}

module.exports = getData