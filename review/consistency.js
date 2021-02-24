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
        let runTotal = 0
        let hrArray = []
        let hrTotal = 0
        let rbiArray = []
        let rbiTotal = 0
        let sbArray = []
        let sbTotal = 0
        let xbhArray = []
        let xbhTotal = 0
        let obpArray = []
        let obpTotal = 0

        for (let week in batterWeeks) {
            totalGamesPlayed = totalGamesPlayed + batterWeeks[week]['gamesPlayed'] 
            runsArray.push(batterWeeks[week]['R'])
            runTotal = runTotal + batterWeeks[week]['R']
            hrArray.push(batterWeeks[week]['HR'])
            hrTotal = hrTotal + batterWeeks[week]['HR']
            rbiArray.push(batterWeeks[week]['RBI'])
            rbiTotal = rbiTotal + batterWeeks[week]['RBI']
            sbArray.push(batterWeeks[week]['SB'])
            sbTotal = sbTotal + batterWeeks[week]['SB']
            xbhArray.push(batterWeeks[week]['XBH'])
            xbhTotal = xbhTotal + batterWeeks[week]['XBH']
            obpArray.push(batterWeeks[week]['OBP'])
            obpTotal = obpTotal + batterWeeks[week]['OBP']
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

            runTotal: runTotal,
            runMean: runMean,
            runVariance: math.variance(runsArray),
            runSkew: 3 * (runMean - runMedian),
            runStdDev: math.std(runsArray),

            hrTotal: hrTotal,
            hrMean: hrMean,
            hrVariance: math.variance(hrArray),
            hrSkew: 3 * (hrMean - hrMedian),
            hrStdDev: math.std(hrArray),
            
            rbiTotal: rbiTotal,
            rbiMean: rbiMean,
            rbiVariance: math.variance(rbiArray),
            rbiSkew: 3 * (rbiMean - rbiMedian),
            rbiStdDev: math.std(rbiArray),

            sbTotal: sbTotal,
            sbMean: sbMean,
            sbVariance: math.variance(sbArray),
            sbSkew: 3 * (sbMean - sbMedian),
            sbStdDev: math.std(sbArray),

            obpTotal: obpTotal,
            obpMean: obpMean,
            obpVariance: math.variance(obpArray),
            obpSkew: 3 * (obpMean - obpMedian),
            obpStdDev: math.std(obpArray),
            
            xbhTotal: xbhTotal,
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
        let kTotal = 0
        let eraArray = []
        let eraTotal = 0
        let whipArray = []
        let whipTotal = 0
        let k9Array = []
        let k9Total = 0
        let qsArray = []
        let qsTotal = 0
        let svhArray = []
        let svhTotal = 0

        for (let week in pitcherWeeks) {
            totalGamesPlayed = totalGamesPlayed + pitcherWeeks[week]['gamesPlayed'] 
            kArray.push(pitcherWeeks[week]['K'])
            kTotal = kTotal + pitcherWeeks[week]['K']
            eraArray.push(pitcherWeeks[week]['ERA'])
            eraTotal = eraTotal + pitcherWeeks[week]['ERA']
            whipArray.push(pitcherWeeks[week]['WHIP'])
            whipTotal = whipTotal + pitcherWeeks[week]['WHIP']
            k9Array.push(pitcherWeeks[week]['K9'])
            k9Total = k9Total + pitcherWeeks[week]['K9']
            qsArray.push(pitcherWeeks[week]['QS'])
            qsTotal = qsTotal + pitcherWeeks[week]['QS']
            svhArray.push(pitcherWeeks[week]['SVH'])
            svhTotal = svhTotal + pitcherWeeks[week]['SVH']
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

            kTotal: kTotal,
            kMean: kMean,
            kVariance: math.variance(kArray),
            kSkew: 3 * (kMean - kMedian),
            kStdDev: math.std(kArray),
            
            eraTotal: eraTotal,
            eraMean: eraMean,
            eraVariance: math.variance(eraArray),
            eraSkew: 3 * (eraMean - eraMedian),
            eraStdDev: math.std(eraArray),
            
            whipTotal: whipTotal,
            whipMean: whipMean,
            whipVariance: math.variance(whipArray),
            whipSkew: 3 * (whipMean - whipMedian),
            whipStdDev: math.std(whipArray),
            
            k9Total: k9Total,
            k9Mean: k9Mean,
            k9Variance: math.variance(k9Array),
            k9Skew: 3 * (k9Mean - k9Median),
            k9StdDev: math.std(k9Array),
            
            qsTotal: qsTotal,
            qsMean: qsMean,
            qsVariance: math.variance(qsArray),
            qsSkew: 3 * (qsMean - qsMedian),
            qsStdDev: math.std(qsArray),
            
            svhTotal: svhTotal,
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