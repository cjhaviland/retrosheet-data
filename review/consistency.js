const fs = require('fs')
const math = require('mathjs')

function consistency() {
    const batters = JSON.parse(fs.readFileSync(`./data/output/batterWeekly.json`))
    const pitchers = JSON.parse(fs.readFileSync(`./data/output/pitcherWeekly.json`))

    let batterOutput = []
    let pitcherOutput = []

    for (let playerName in batters) {
        const batterWeeks = batters[playerName]

        let totalGamesPlayed = 0
        let runsArray = []
        let hrArray = []
        let rbiArray = []
        let sbArray = []
        let xbhArray = []
        let obpArray = []

        for (let week in batterWeeks) {
            totalGamesPlayed = totalGamesPlayed + batterWeeks[week]['gamesPlayed'] 
            runsArray.push(batterWeeks[week]['R'])
            hrArray.push(batterWeeks[week]['HR'])
            rbiArray.push(batterWeeks[week]['RBI'])
            sbArray.push(batterWeeks[week]['SB'])
            xbhArray.push(batterWeeks[week]['XBH'])
            obpArray.push(batterWeeks[week]['OBP'])
        }

        batterOutput.push({
            player: playerName,
            totalGamesPlayed: totalGamesPlayed,
            runVariance: math.variance(runsArray),
            hrVariance: math.variance(hrArray),
            rbiVariance: math.variance(rbiArray),
            sbVariance: math.variance(sbArray),
            xbhVariance: math.variance(xbhArray),
            obpVariance: math.variance(obpArray)
        })
    }
    
    /**
     * Pitcher Variance
     */
    for (let playerName in pitchers) {
        const pitcherWeeks = pitchers[playerName]

        let totalGamesPlayed = 0
        let kArray = []
        let eraArray = []
        let whipArray = []
        let k9Array = []
        let qsArray = []
        let svhArray = []

        for (let week in pitcherWeeks) {
            totalGamesPlayed = totalGamesPlayed + pitcherWeeks[week]['gamesPlayed'] 
            kArray.push(pitcherWeeks[week]['K'])
            eraArray.push(pitcherWeeks[week]['ERA'])
            whipArray.push(pitcherWeeks[week]['WHIP'])
            k9Array.push(pitcherWeeks[week]['K9'])
            qsArray.push(pitcherWeeks[week]['QS'])
            svhArray.push(pitcherWeeks[week]['SVH'])
        }

        pitcherOutput.push({
            player: playerName,
            totalGamesPlayed: totalGamesPlayed,
            kVariance: math.variance(kArray),
            eraVariance: math.variance(eraArray),
            whipVariance: math.variance(whipArray),
            k9Variance: math.variance(k9Array),
            qsVariance: math.variance(qsArray),
            svhVariance: math.variance(svhArray)
        })
    }
    
    fs.writeFileSync('data/output/batterVariance.json', JSON.stringify(batterOutput, null, 2))
    fs.writeFileSync('data/output/pitcherVariance.json', JSON.stringify(pitcherOutput, null, 2))
}

module.exports = consistency