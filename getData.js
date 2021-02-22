const fs = require('fs')
const _ = require('lodash')

let batterResult = {}
let pitcherResult = {}

const players = JSON.parse(fs.readFileSync(`./data/players.json`))

function getData(file) {
    const teamObj = JSON.parse(fs.readFileSync(`./data/json/${file}`))
    // const teamJson = JSON.parse(fs.readFileSync(`./data/json/${file}`))
    // const teamObj = _.filter(teamJson, t => t.gameId === 'NYN202007240')

    for (let item of teamObj) {
        if (item) {
            // Ensure player and game record exists in the object
            createEntry(item.resBatter, item.gameId, true)
            createEntry(item.resPitcher, item.gameId, false)
    
            batterStats(item)
            pitcherStats(item)
        }
    }

    fs.writeFileSync('data/batterOutput.json', JSON.stringify(batterResult, null, 2))
    fs.writeFileSync('data/pitcherOutput.json', JSON.stringify(pitcherResult, null, 2))
}

function createEntry(player, gameId, isBatter) {
    if (isBatter) {
        if(!batterResult[`${player}`]) {
            const playerInfo = players.find(p => p.ID === player)
    
            batterResult[`${player}`] = {
                name: `${playerInfo.firstName} ${playerInfo.lastName}`,
                team: playerInfo.teamAbbreviation,
                position: playerInfo.positionAbbreviation,
                games: []
            }
        }

        let batterGameIndex = batterResult[`${player}`]['games'].findIndex(g => g.gameId === gameId)
        if (batterGameIndex === -1) {
            const gameDate = parseGameId(gameId)
            batterResult[`${player}`]['games'].push(
                {
                    'gameId': gameId,
                    'gameDate': gameDate,
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
            )
        }
    }
    else {
        if(!pitcherResult[`${player}`]) {
            const playerInfo = players.find(p => p.ID === player)
    
            pitcherResult[`${player}`] = {
                name: `${playerInfo.firstName} ${playerInfo.lastName}`,
                team: playerInfo.teamAbbreviation,
                position: playerInfo.positionAbbreviation,
                games: []
            }
        }

        let pitcherGameIndex = pitcherResult[`${player}`]['games'].findIndex(g => g.gameId === gameId)
        if (pitcherGameIndex === -1) {
            // IP* K ERA WHIP K/9 QS SV+H
            const gameDate = parseGameId(gameId)
            pitcherResult[`${player}`]['games'].push(
                {
                    'gameId': gameId,
                    'gameDate': gameDate,
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
            )
        }
    }
}

function batterStats(item) {
    let batter = getPlayer(item.resBatter, item.gameId, true)
    let pitcher = getPlayer(item.resPitcher, item.gameId, false)
    
    // Increment AB`
    if (item.abFlag === 'T') {
        batter.gameItem['AB']++
    }

    // Increment Hits
    if (item.hitValue > 0) {
        batter.gameItem['H']++
        pitcher.gameItem['H']++
    }

    // Increment HR
    if (item.eventType === 23) {
        batter.gameItem['HR']++
    }

    // Add any RBIs
    if (item.rbiOnPlay > 0) {
        batter.gameItem['RBI'] = batter.gameItem['RBI'] + item.rbiOnPlay

        // Increment Rs and ERs
        calcRuns(item.batterDest, item.resBatter, item.resPitcher, item.gameId)
        calcRuns(item.runnerOn1stDest, item.firstRunner, item.responsiblePitcherForRunnerOn1st, item.gameId)
        calcRuns(item.runnerOn2ndDest, item.secondRunner, item.responsiblePitcherForRunnerOn2nd, item.gameId)
        calcRuns(item.runnerOn3rdDest, item.thirdRunner, item.responsiblePitcherForRunnerOn3rd, item.gameId)
    }

    // Increment BB
    if (item.eventType === 14 || item.eventType === 15) {
        batter.gameItem['BB']++
        pitcher.gameItem['BB']++
    }

    // Increment HBP
    if (item.eventType === 16) {
        batter.gameItem['HBP']++
    }

    // Increment SF
    if (item.SFFlag === 'T') {
        batter.gameItem['SF']++
    }

    // Increment SBs
    if (item.sbForRunnerOn1stFlag === 'T') {
        createEntry(item.firstRunner, item.gameId, true)
        let firstRunner = getPlayer(item.firstRunner, item.gameId, true)
        firstRunner['SB']++
        writeBatter(item.firstRunner, firstRunner.index, firstRunner.gameItem)
    }

    if (item.sbForRunneron2ndFlag === 'T') {
        createEntry(item.secondRunner, item.gameId, true)
        let secondRunner = getPlayer(item.secondRunner, item.gameId, true)
        secondRunner['SB']++
        writeBatter(item.secondRunner, secondRunner.index, secondRunner.gameItem)
    }

    if (item.sbForRunnerOn3rdFlag === 'T') {
        createEntry(item.thirdRunner, item.gameId, true)

        let thirdRunner = getPlayer(item.thirdRunner, item.gameId, true)
        thirdRunner['SB']++
        writeBatter(item.thirdRunner, thirdRunner.index, thirdRunner.gameItem)
    }

    // Increment XBH
    if (item.eventType === 21 || item.eventType === 22 || item.eventType === 23) {
        batter.gameItem['XBH']++
    }

    // Calculate OBP
    batter.gameItem['OBP'] = calcObp(batter.gameItem)

    // Replace array object
    writeBatter(item.resBatter, batter.index, batter.gameItem)
    writePitcher(item.resPitcher, pitcher.index, pitcher.gameItem)
}

function pitcherStats(item) {
    let pitcher = getPlayer(item.resPitcher, item.gameId, false)

    // Is SP
    if (item.inning === 1 && item.outs === 0) {
        pitcher.gameItem['SP'] = true
    }
    
    // Record Outs
    pitcher.gameItem['O'] = pitcher.gameItem['O'] + item.outsOnPlay

    // Calculate IP
    pitcher.gameItem['IP'] = `${~~(pitcher.gameItem['O'] / 3)}.${pitcher.gameItem['O'] % 3}`

    // Iterate Ks
    if (item.eventType === 3) {
        pitcher.gameItem['K']++
    }

    if (item.inning === 6 && (item.outs + item.outsOnPlay) === 3) {
        qualityStart(item.resPitcher, pitcher)
    }

    // Calculate WHIP
    pitcher.gameItem['WHIP'] = calcWhip(pitcher.gameItem)

    // Calculate K/9
    pitcher.gameItem['K9'] = calcK9(pitcher.gameItem)

    // Calculate ERA
    pitcher.gameItem['ERA'] = calcEra(pitcher.gameItem)

    // Calculate SV+H
    savesHolds(item.resPitcher, pitcher, item)

    writePitcher(item.resPitcher, pitcher.index, pitcher.gameItem)
}

/**
 * Helpers
 */

function parseGameId(gameId) {
    // const homeTeam = gameId.substring(0, 3)
    const gameDateYear = gameId.substring(3, 7)
    const gameDateMonth = gameId.substring(7, 9)
    const gameDateDay = gameId.substring(9, 11)

    // console.log(`${gameDateYear}-${gameDateMonth}-${gameDateDay}`)
    return `${gameDateYear}-${gameDateMonth}-${gameDateDay}`
} 

function getPlayer(playerId, gameId, isBatter) {
    let index = -1
    let gameItem = {}

    if (isBatter) {
        index = batterResult[`${playerId}`]['games'].findIndex(g => g.gameId === gameId)
        gameItem = batterResult[`${playerId}`]['games'][index]
    }
    else {
        index = pitcherResult[`${playerId}`]['games'].findIndex(g => g.gameId === gameId)
        gameItem = pitcherResult[`${playerId}`]['games'][index]
    }

    return { index, gameItem }
}

function writeBatter(batterId, index, gameItem) {
    batterResult[`${batterId}`]['games'][index] = gameItem
}

function writePitcher(pitcherId, index, gameItem) {
    pitcherResult[`${pitcherId}`]['games'][index] = gameItem
}

/**
 * Batter Helpers
 */

function calcRuns(dest, player, pitcherId, gameId) {
    if (dest >= 4) {
        createEntry(player, gameId, true)
        
        let batter = getPlayer(player, gameId, true)
        batter.gameItem['R']++
        writeBatter(player, batter.index, batter.gameItem)
        
        if (dest === 4) {
            createEntry(pitcherId, gameId, false)
            let pitcher = getPlayer(pitcherId, gameId, false)
            pitcher.gameItem['ER']++
            writePitcher(pitcherId, pitcher.index, pitcher.gameItem)
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

function parseInningsPitched(ipString) {
    let splitIp = ipString.split('.')

    let fullInnings = Number.parseFloat(splitIp[0])
    let thirdInnings = Number.parseFloat(splitIp[1])

    return fullInnings + (thirdInnings * (1/3))
}

function qualityStart(playerId, pitcher) {
    var ip = Number.parseFloat(pitcher.gameItem['IP']) 
    var er = pitcher.gameItem['ER']

    if (ip >= 6 && er <= 3) {
        pitcher.gameItem['QS'] = 1
    }

    writePitcher(playerId, pitcher.index, pitcher.gameItem)
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

function savesHolds(playerId, pitcher, item) {
    const isSP = pitcher.gameItem['SP']
    
    if (!isSP) {
        let pitcherTeamScore = 0
        let oppTeamScore = 0
        let ip = parseInningsPitched(pitcher.gameItem['IP'])
   
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
                pitcher.gameItem['SVH'] = 1
            }
            else if(ip < 3) {
                pitcher.gameItem['SVH'] = 1
            }
        }
        else {
            // Either lost the situation or never had it, no SV+H
            pitcher.gameItem['SVH'] = 0
        }

        writePitcher(playerId, pitcher.index, pitcher.gameItem)
    }
}

module.exports = getData