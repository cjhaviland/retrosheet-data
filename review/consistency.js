const fs = require('fs')
const math = require('mathjs')

function consistency(yearToProcess) {
    const batters = JSON.parse(fs.readFileSync(`./data/output/${yearToProcess}/batterWeekly.json`))
    const pitchers = JSON.parse(fs.readFileSync(`./data/output/${yearToProcess}/pitcherWeekly.json`))

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
        const runMedian = math.median(runsArray)
        const runMean = math.mean(runsArray)

        const hrMedian = math.median(hrArray)
        const hrMean = math.mean(hrArray)

        const rbiMedian = math.median(rbiArray)
        const rbiMean = math.mean(rbiArray)
        
        const sbMedian = math.median(sbArray)
        const sbMean = math.mean(sbArray)

        const obpMedian = math.median(obpArray)
        const obpMean = math.mean(obpArray)
        
        const xbhMedian = math.median(xbhArray)
        const xbhMean = math.mean(xbhArray)

        batterOutput.push({
            player: playerName,
            totalGamesPlayed: totalGamesPlayed,

            runMean: runMean,
            runVariance: math.variance(runsArray),
            runSkew: 3 * (runMean - runMedian),
            runStdDev: math.std(runsArray),

            hrMean: hrMean,
            hrVariance: math.variance(hrArray),
            hrSkew: 3 * (hrMean - hrMedian),
            hrStdDev: math.std(hrArray),
            
            rbiMean: rbiMean,
            rbiVariance: math.variance(rbiArray),
            rbiSkew: 3 * (rbiMean - rbiMedian),
            rbiStdDev: math.std(rbiArray),

            sbMean: sbMean,
            sbVariance: math.variance(sbArray),
            sbSkew: 3 * (sbMean - sbMedian),
            sbStdDev: math.std(sbArray),

            obpMean: obpMean,
            obpVariance: math.variance(obpArray),
            obpSkew: 3 * (obpMean - obpMedian),
            obpStdDev: math.std(obpArray),
            
            xbhMean: xbhMean,
            xbhVariance: math.variance(xbhArray),
            xbhSkew: 3 * (xbhMean - xbhMedian),
            xbhStdDev: math.std(xbhArray),

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

        const kMedian = math.median(kArray)
        const kMean = math.mean(kArray)
        
        const eraMedian = math.median(eraArray)
        const eraMean = math.mean(eraArray)

        const whipMedian = math.median(whipArray)
        const whipMean = math.mean(whipArray)
        
        const k9Median = math.median(k9Array)
        const k9Mean = math.mean(k9Array)

        const qsMedian = math.median(qsArray)
        const qsMean = math.mean(qsArray)

        const svhMedian = math.median(svhArray)
        const svhMean = math.mean(svhArray)


        pitcherOutput.push({
            player: playerName,
            totalGamesPlayed: totalGamesPlayed,
            kMean: kMean,
            kVariance: math.variance(kArray),
            kSkew: 3 * (kMean - kMedian),
            kStdDev: math.std(kArray),
            
            eraMean: eraMean,
            eraVariance: math.variance(eraArray),
            eraSkew: 3 * (eraMean - eraMedian),
            eraStdDev: math.std(eraArray),
            
            whipMean: whipMean,
            whipVariance: math.variance(whipArray),
            whipSkew: 3 * (whipMean - whipMedian),
            whipStdDev: math.std(whipArray),
            
            k9Mean: k9Mean,
            k9Variance: math.variance(k9Array),
            k9Skew: 3 * (k9Mean - k9Median),
            k9StdDev: math.std(k9Array),
            
            qsMean: qsMean,
            qsVariance: math.variance(qsArray),
            qsSkew: 3 * (qsMean - qsMedian),
            qsStdDev: math.std(qsArray),
            
            svhMean: svhMean,
            svhVariance: math.variance(svhArray),
            svhSkew: 3 * (svhMean - svhMedian),
            svhStdDev: math.std(svhArray),
        })
    }
    
    fs.writeFileSync(`data/output/${yearToProcess}/batterStats.json`, JSON.stringify(batterOutput, null, 2))
    fs.writeFileSync(`data/output/${yearToProcess}/pitcherStats.json`, JSON.stringify(pitcherOutput, null, 2))
}

module.exports = consistency