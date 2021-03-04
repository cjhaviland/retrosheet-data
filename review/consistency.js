const fs = require('fs')
const math = require('mathjs')

function consistency(yearToProcess) {
    const batters = JSON.parse(fs.readFileSync(`./data/output/${yearToProcess}/batterWeekly.json`))
    const pitchers = JSON.parse(fs.readFileSync(`./data/output/${yearToProcess}/pitcherWeekly.json`))

    let batterOutput = []
    let pitcherOutput = []

    let populationStatArrays = {}

    for (let playerName in batters) {
        const batterWeeks = batters[playerName]
        let player = { 
            name: playerName,  
            weeksPlayed: 0
        }
        let playerStatArrays = { }

        // Collect all weekly stats into arrays
        for (let week in batterWeeks) {
            player.weeksPlayed++
            for (let stat in batterWeeks[week]) {
                (populationStatArrays[stat] || (populationStatArrays[stat] = [])).push(Number.parseFloat(batterWeeks[week][stat])); 
                (playerStatArrays[stat] || (playerStatArrays[stat] = [])).push(Number.parseFloat(batterWeeks[week][stat])); 
            }
        }

        // Create output for that players stat arrays
        let playerStats = calcStats(playerStatArrays)

        player = { ...player, stats: playerStats }

        // Push the player object to the output object
        batterOutput.push(player)
    }
    
    let popStats = calcStats(populationStatArrays)
    let population = {
        name: 'population',
        weeksPlayed: 0,
        stats: popStats
    }

    batterOutput.push(population)

    // z = (x – μ) / (σ / √n)
    for (let index in batterOutput) {
        if (batterOutput[index].name != 'population') {
            for (let stat in batterOutput[index].stats) {
                let playerMean = batterOutput[index].stats[stat].mean
                let popMean = population.stats[stat].mean
                let popStdDev = population.stats[stat].stdDev
                let weeksPlayedSqrt = math.sqrt(batterOutput[index].weeksPlayed)
    
    
                batterOutput[index].stats[stat] = {
                    ...batterOutput[index].stats[stat],
                    zScore: (playerMean - popMean) / (popStdDev / weeksPlayedSqrt)
                } 
            }
        }
    }
    
    /**
     * Pitcher Variance
     */
    // for (let playerName in pitchers) {
    //     const pitcherWeeks = pitchers[playerName]
    // }
    
    fs.writeFileSync(`data/output/${yearToProcess}/batterStats.json`, JSON.stringify(batterOutput, null, 2))
    // fs.writeFileSync(`data/output/${yearToProcess}/pitcherStats.json`, JSON.stringify(pitcherOutput, null, 2))
}

function calcStats(playerStatArrays) {
    let player = {}

    for (let stat in playerStatArrays) {
        let statArray = playerStatArrays[stat]
        let statMean = math.mean(statArray)
        let statMedian = math.median(statArray)
        let stdDev = math.std(statArray)
        let skew = (3 * (statMean - statMedian)) / stdDev

        player[stat] = {
            total: math.sum(statArray),
            mean: statMean,
            median: statMedian,
            variance: math.variance(statArray),
            skew: skew != null ? skew : 0,
            stdDev: stdDev
        }
    }

    return player
}

module.exports = consistency