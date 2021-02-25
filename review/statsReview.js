const fs = require('fs')

function statsReview(yearToProcess) {
    const output = {}
    const teams = JSON.parse(fs.readFileSync(`./data/json/${yearToProcess}_Fantasy_Teams.json`))
    const batterStats = JSON.parse(fs.readFileSync(`./data/output/${yearToProcess}/batterStats.json`))

    for (let team in teams) {
        if (!output[team]) {
            output[team] = {
                battingStats: {
                    runTotal: 0,
                    avgRunTotal: 0,
                    avgRunMean: 0,
                    avgRunVariance: 0,
                    avgRunSkew: 0,
                    avgRunStdDev: 0
                },
                pitchingStat: {}
            }
        }

        for (let player of teams[team].batters) {
            let normalizedPlayerName = player.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            let playerStats = batterStats.find(b => b.player === normalizedPlayerName)
            if (playerStats) {
                output[team].battingStats.runTotal += playerStats.runTotal
                output[team].battingStats.avgRunTotal += playerStats.runTotal
                output[team].battingStats.avgRunMean += playerStats.runMean
                output[team].battingStats.avgRunVariance += playerStats.runVariance
                output[team].battingStats.avgRunSkew += playerStats.runSkew
                output[team].battingStats.avgRunStdDev += playerStats.runStdDev
            }
            else {
                console.log(`${normalizedPlayerName} missing`)
            }
        }

        output[team].battingStats.avgRunTotal = output[team].battingStats.avgRunTotal / teams[team].batters.length
        output[team].battingStats.avgRunMean = output[team].battingStats.avgRunMean / teams[team].batters.length
        output[team].battingStats.avgRunVariance = output[team].battingStats.avgRunVariance / teams[team].batters.length
        output[team].battingStats.avgRunSkew = output[team].battingStats.avgRunSkew / teams[team].batters.length
        output[team].battingStats.avgRunStdDev = output[team].battingStats.avgRunStdDev / teams[team].batters.length
    }

    fs.writeFileSync(`review/${yearToProcess}batterStatsReview.json`, JSON.stringify(output, null, 2))
}

module.exports = statsReview