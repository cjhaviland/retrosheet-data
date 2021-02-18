const fs = require('fs')
const _ = require('lodash')

let result = {}
const players = JSON.parse(fs.readFileSync(`./data/players.json`))

function getData(file) {
    const teamJson = JSON.parse(fs.readFileSync(`./data/json/${file}`))
    const teamObj = _.filter(teamJson, t => t.gameId === 'NYN202007240')

    for (let item of teamObj) {
        if (item) {
            // Ensure player and game record exists in the object
            createEntry(item.resBatter, item.gameId, true)
            createEntry(item.resPitcher, item.gameId, false)
    
            batterStats(item)
            pitcherStats(item)
        }
    }

    fs.writeFileSync('data/output.json', JSON.stringify(result, null, 2))
}

function createEntry(player, gameId, isBatter) {
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
                'OBH': 0,
                'XBH': 0 
            }
        }
        else {
            // IP* K ERA WHIP K/9 QS SV+H
            result[`${player}`][`${gameId}`] = {
                'IP': '',
                'SP': false,
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
        calcRuns(item.runnerOn1stDest, item.firstRunner, item.responsiblePitcherForRunnerOn1st, item.gameId)
        calcRuns(item.runnerOn2ndDest, item.secondRunner, item.responsiblePitcherForRunnerOn2nd, item.gameId)
        calcRuns(item.runnerOn3rdDest, item.thirdRunner, item.responsiblePitcherForRunnerOn3rd, item.gameId)
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

    // Calculate OBP
    result[`${item.resBatter}`][`${item.gameId}`]['OBP'] = calcObp(result[`${item.resBatter}`][`${item.gameId}`])
}

function pitcherStats(item) {
    // Is SP
    if (item.inning === 1 && item.outs === 0) {
        result[`${item.resPitcher}`][`${item.gameId}`]['SP'] = true
    }
    
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

    // Calculat ERA
    result[`${item.resPitcher}`][`${item.gameId}`]['ERA'] = calcEra(result[`${item.resPitcher}`][`${item.gameId}`])

    savesHolds(item)
}

/**
 * Helpers
 */

function parseInningsPitched(ipString) {
    let splitIp = ipString.split('.')

    let fullInnings = Number.parseFloat(splitIp[0])
    let thirdInnings = Number.parseFloat(splitIp[1])

    return fullInnings + (thirdInnings * (1/3))
}

/**
 * Batter Helpers
 */

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

function calcObp(playerGameStats) {
    // H + BB + HBP
    // AB + BB + HBP + SF
    const num = playerGameStats['H'] + playerGameStats['BB'] + playerGameStats['HBP']
    const den = playerGameStats['AB'] + playerGameStats['BB'] + playerGameStats['HBP'] + playerGameStats['SF']
    return num / den
}

/**
 * Pitcher Helpers
 */

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

function calcEra(player) {
    let ip = parseInningsPitched(player['IP'])

    return ((9 * player['ER']) / ip)
}

function calcK9(player) {
    let ipParsed = parseInningsPitched(player['IP'])

    return (player['K'] * 9) / ipParsed
}


function savesHolds(item) {
    if (!result[`${item.resPitcher}`])
    {
        console.log('Pitcher does not exist')
    }
    else if (!result[`${item.resPitcher}`][`${item.gameId}`]) {
        console.log(`GameID does not exist for pitcher ${result[`${item.resPitcher}`]}`)
    }

    const isSP = result[`${item.resPitcher}`][`${item.gameId}`]['SP']
    
    if (!isSP) {
        let pitcherTeamScore = 0
        let oppTeamScore = 0
        let ip = parseInningsPitched(result[`${item.resPitcher}`][`${item.gameId}`]['IP'])
   
        if (item.battingTeam === 0) {
           pitcherTeamScore = item.homeScore
           oppTeamScore = item.visScore
        }
        else {
           pitcherTeamScore = item.visScore
           oppTeamScore = item.homeScore
        }

        let scoreDifference = pitcherTeamScore - oppTeamScore

        /**
         * Hold Conditions (One of the following)
         * 1) He enters with a lead of three runs or less 
         * and maintains that lead while recording at least one out. 
         * 2) He enters the game with the tying run on-deck, 
         * at the plate or on the bases, and records an out.
         */
        /**
         * Save Conditions (One of the following)
         * Not the winning pitcher.
         * Finishing pitcher in a game won by his club. 
         * Credited with at least 1/3 of an inning pitched.
         * AND (One of the following)
         * Pitches for at least 3 innings.
         * Enters the game with a lead of no more than 3 runs and pitches for at least 1 inning.
         * Enters the game, regardless of the count, with the potential tying run either on base, at bat, or on deck.
         */
        if (scoreDifference >= 0 && scoreDifference <= 3) {
            if (ip <= 1 && item.endGameFlag === "T") {
                // Record Save
                result[`${item.resPitcher}`][`${item.gameId}`]['SVH'] = 1
            }
            else if(ip < 3) {
                result[`${item.resPitcher}`][`${item.gameId}`]['SVH'] = 1
            }
        }
        else {
            // Either lost the situation or never had it, no SV+H
            result[`${item.resPitcher}`][`${item.gameId}`]['SVH'] = 0
        }
    }
}

module.exports = getData