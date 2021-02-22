const fs = require('fs')
const dayjs = require('dayjs')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)

function weeklyReview() {
    const batters = JSON.parse(fs.readFileSync(`./data/batterOutput.json`))
    let batterWeeklyStats = {}

    for (let batterId in batters) {
        const batterObj = batters[batterId]
        
        for (let game of batterObj.games) {
            if (!batterWeeklyStats[batterId]) {
                batterWeeklyStats[batterId] = {}
            }
        
            let week = dayjs(game.gameDate).week()
        
            if (!batterWeeklyStats[batterId][week]) {
                batterWeeklyStats[batterId][week] = {
                    "gamesPlayed": 0,
                    "name": batters[batterId].name,
                    "R": 0,
                    "HR": 0,
                    "RBI": 0,
                    "SB": 0,
                    "XBH": 0,
                    "OBP": 0
                }
            }
        
            let currStats = batterWeeklyStats[batterId][week]
            
            batterWeeklyStats[batterId][week]['gamesPlayed']++
            batterWeeklyStats[batterId][week]['R'] = currStats['R'] + game['R']
            batterWeeklyStats[batterId][week]['HR'] = currStats['HR'] + game['HR']
            batterWeeklyStats[batterId][week]['RBI'] = currStats['RBI'] + game['RBI']
            batterWeeklyStats[batterId][week]['SB'] = currStats['SB'] + game['SB']
            batterWeeklyStats[batterId][week]['XBH'] = currStats['XBH'] + game['XBH']
            batterWeeklyStats[batterId][week]['OBP'] = currStats['OBP'] + ((game['OBP'] - currStats['OBP']) / batterWeeklyStats[batterId][week]['gamesPlayed'])
        }
    }

    fs.writeFileSync('data/output/batterWeekly.json', JSON.stringify(batterWeeklyStats, null, 2))
    
    /**
     * Pitchers
     */
    const pitchers = JSON.parse(fs.readFileSync(`./data/pitcherOutput.json`))
    let pitcherWeeklyStats = {}

    for (let pitcherId in pitchers) {
        const pitcherObj = pitchers[pitcherId]
        
        for (let game of pitcherObj.games) {
            if (!pitcherWeeklyStats[pitcherId]) {
                pitcherWeeklyStats[pitcherId] = {}
            }
        
            let week = dayjs(game.gameDate).week()
        
            if (!pitcherWeeklyStats[pitcherId][week]) {
                pitcherWeeklyStats[pitcherId][week] = {
                    "gamesPlayed": 0,
                    "name": pitchers[pitcherId].name,
                    "K": 0,
                    "ERA": 0,
                    "WHIP": 0,
                    "K9": 0,
                    "QS": 0,
                    "SVH": 0
                }
            }
        
            let currStats = pitcherWeeklyStats[pitcherId][week]
            
            pitcherWeeklyStats[pitcherId][week]['gamesPlayed']++
            pitcherWeeklyStats[pitcherId][week]['K'] = currStats['K'] + game['K']
            pitcherWeeklyStats[pitcherId][week]['ERA'] = currStats['ERA'] + ((game['ERA'] - currStats['ERA']) / pitcherWeeklyStats[pitcherId][week]['gamesPlayed'])
            pitcherWeeklyStats[pitcherId][week]['WHIP'] = currStats['WHIP'] + ((game['WHIP'] - currStats['WHIP']) / pitcherWeeklyStats[pitcherId][week]['gamesPlayed'])
            pitcherWeeklyStats[pitcherId][week]['K9'] = currStats['K9'] + ((game['K9'] - currStats['K9']) / pitcherWeeklyStats[pitcherId][week]['gamesPlayed'])
            pitcherWeeklyStats[pitcherId][week]['QS'] = currStats['QS'] + game['QS']
            pitcherWeeklyStats[pitcherId][week]['SVH'] = currStats['SVH'] + game['SVH']
        }
    }

    fs.writeFileSync('data/output/pitcherWeekly.json', JSON.stringify(pitcherWeeklyStats, null, 2))
}

module.exports = weeklyReview