const fs = require('fs')

function searchBatters(yearToProcess) {
    const outputObj = {}
    const outputArray = []

    const batterOutput = JSON.parse(fs.readFileSync(`./data/output/${yearToProcess}/batterOutput.json`))
    
    const playerId = 'bettm001'
    const batter = batterOutput[playerId]

    const playerGames = batter.games

    for(let game of playerGames) {
        outputArray.push(game['R'])
    }

    // console.log()
    const output = outputArray.sort((a,b) => b - a)
    fs.writeFileSync(`review/${yearToProcess}batterStatsReview.json`, JSON.stringify(output, null, 2))
}

module.exports = searchBatters