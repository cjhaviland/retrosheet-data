const fs = require('fs')
const dayjs = require('dayjs')
const isoWeek = require('dayjs/plugin/isoWeek')
dayjs.extend(isoWeek)

function weeklyReview(yearToProcess) {
    const batters = JSON.parse(fs.readFileSync(`./data/output/${yearToProcess}/batterOutput.json`))
    let batterWeeklyStats = {}

    for (let batterId in batters) {
        const batterObj = batters[batterId]
        
        for (let game of batterObj.games) {
            const playerName = batters[batterId].name
            
            if (!batterWeeklyStats[playerName]) {
                batterWeeklyStats[playerName] = {
                }
            }
        
            let week = dayjs(game.gameDate).isoWeek()
        
            if (!batterWeeklyStats[playerName][week]) {
                batterWeeklyStats[playerName][week] = {
                    "gamesPlayed": 0,
                    "R": 0,
                    "HR": 0,
                    "RBI": 0,
                    "SB": 0,
                    "XBH": 0,
                    "OBP": 0
                }
            }
        
            let currStats = batterWeeklyStats[playerName][week]
            
            batterWeeklyStats[playerName][week]['gamesPlayed']++
            batterWeeklyStats[playerName][week]['R'] = currStats['R'] + game['R']
            batterWeeklyStats[playerName][week]['HR'] = currStats['HR'] + game['HR']
            batterWeeklyStats[playerName][week]['RBI'] = currStats['RBI'] + game['RBI']
            batterWeeklyStats[playerName][week]['SB'] = currStats['SB'] + game['SB']
            batterWeeklyStats[playerName][week]['XBH'] = currStats['XBH'] + game['XBH']
            batterWeeklyStats[playerName][week]['OBP'] = currStats['OBP'] + ((game['OBP'] - currStats['OBP']) / batterWeeklyStats[playerName][week]['gamesPlayed'])
        }
    }

    fs.writeFileSync(`data/output/${yearToProcess}/batterWeekly.json`, JSON.stringify(batterWeeklyStats, null, 2))
    
    /**
     * Pitchers
     */
    const pitchers = JSON.parse(fs.readFileSync(`./data/output/${yearToProcess}/pitcherOutput.json`))
    let pitcherWeeklyStats = {}

    for (let pitcherId in pitchers) {
        const pitcherObj = pitchers[pitcherId]
        
        for (let game of pitcherObj.games) {
            const playerName = pitchers[pitcherId].name

            if (!pitcherWeeklyStats[playerName]) {
                pitcherWeeklyStats[playerName] = {}
            }
        
            let week = dayjs(game.gameDate).isoWeek()
        
            if (!pitcherWeeklyStats[playerName][week]) {
                pitcherWeeklyStats[playerName][week] = {
                    "gamesPlayed": 0,
                    "K": 0,
                    "ERA": 0,
                    "WHIP": 0,
                    "K9": 0,
                    "QS": 0,
                    "SVH": 0
                }
            }
        
            let currStats = pitcherWeeklyStats[playerName][week]
            
            pitcherWeeklyStats[playerName][week]['gamesPlayed']++
            pitcherWeeklyStats[playerName][week]['K'] = currStats['K'] + game['K']
            pitcherWeeklyStats[playerName][week]['ERA'] = currStats['ERA'] + ((game['ERA'] - currStats['ERA']) / pitcherWeeklyStats[playerName][week]['gamesPlayed'])
            pitcherWeeklyStats[playerName][week]['WHIP'] = currStats['WHIP'] + ((game['WHIP'] - currStats['WHIP']) / pitcherWeeklyStats[playerName][week]['gamesPlayed'])
            pitcherWeeklyStats[playerName][week]['K9'] = currStats['K9'] + ((game['K9'] - currStats['K9']) / pitcherWeeklyStats[playerName][week]['gamesPlayed'])
            pitcherWeeklyStats[playerName][week]['QS'] = currStats['QS'] + game['QS']
            pitcherWeeklyStats[playerName][week]['SVH'] = currStats['SVH'] + game['SVH']
        }
    }

    fs.writeFileSync(`data/output/${yearToProcess}/pitcherWeekly.json`, JSON.stringify(pitcherWeeklyStats, null, 2))
}

module.exports = weeklyReview