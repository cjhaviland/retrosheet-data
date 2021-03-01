const { kMaxLength } = require('buffer')
const fs = require('fs')
const math = require('mathjs')

exports.yahooWeekly = function() {
    // Get weekly stats for each team
    const weeklyStats = JSON.parse(fs.readFileSync(`./data/yahoo/collectedWeeklyStats.json`))
    let output = {}

    // Iterate through each team
    for (let teamIndex in weeklyStats) {
        // Teams stat output
        let teamStatOutput = {}

        for (let stat in weeklyStats[teamIndex].stats) {
            let statArray = weeklyStats[teamIndex].stats[stat]
            let statMean = math.mean(statArray)
            let statMedian = math.median(statArray)
            let stdDev = math.std(statArray)

            teamStatOutput[stat] = {
                total: math.sum(statArray),
                mean: statMean,
                median: statMedian,
                variance: math.variance(statArray),
                skew: (3 * (statMean - statMedian)) / stdDev,
                stdDev: stdDev
            }
        }

        // Add team output to the main output under team name
        output[weeklyStats[teamIndex].name] = teamStatOutput
    }
    
    fs.writeFileSync(`review/yahoo/yahooWeeklyReview.json`, JSON.stringify(output, null, 2))
}