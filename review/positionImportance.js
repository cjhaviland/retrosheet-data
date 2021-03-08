const fs = require('fs')
const math = require('mathjs')

exports.positionImportance = function(yearToProcess) {
    const batters = JSON.parse(fs.readFileSync(`./data/output/${yearToProcess}/batterOutput.json`))
    let positionArrays = {}
    let positionOutput = {}

    // Iterate through batters
    for (let batterId in batters) {
        const batterObj = batters[batterId]
        
        // Iterate through each batters game stats
        for (let game of batterObj.games) {
            const position = game.lineupPosition
            
            if (position) {
                // If position entry doesn't exist, then create it
                if (!positionArrays[position]) {
                    positionArrays[position] = {
                        "AB": [],
                        "R": [],
                        "H": [],
                        "HR": [],
                        "RBI": [],
                        "BB": [],
                        "HBP": [],
                        "SF": [],
                        "SB": [],
                        "OBP": [],
                        "XBH": []
                    }
                }
    
                positionArrays[position]['AB'].push(game['AB'])
                positionArrays[position]['R'].push(game['R'])
                positionArrays[position]['H'].push(game['H'])
                positionArrays[position]['HR'].push(game['HR'])
                positionArrays[position]['RBI'].push(game['RBI'])
                positionArrays[position]['BB'].push(game['BB'])
                positionArrays[position]['HBP'].push(game['HBP'])
                positionArrays[position]['SF'].push(game['SF'])
                positionArrays[position]['SB'].push(game['SB'])
                positionArrays[position]['OBP'].push(game['OBP'])
                positionArrays[position]['XBH'].push(game['XBH'])
            }
        }
    }

    for (let pos in positionArrays) {
        positionOutput[pos] = {}

        for (let stat in positionArrays[pos]) {
            positionOutput[pos][stat] = math.mean(positionArrays[pos][stat])
        }
    }

    fs.writeFileSync(`data/output/${yearToProcess}/positionImportance.json`, JSON.stringify(positionOutput, null, 2))
}

exports.pitcherImportance = function(yearToProcess) {
    const pitchers = JSON.parse(fs.readFileSync(`./data/output/${yearToProcess}/pitcherOutput.json`))
    let ipArrays = {
        'SP': {},
        'P': {}
    }
    let pitcherOutput = {
        'SP': {},
        'P': {}
    }

    // Iterate through batters
    for (let playerId in pitchers) {
        const pitcherObj = pitchers[playerId]
        
        // Iterate through each batters game stats
        for (let game of pitcherObj.games) {
            const position = game['SP'] ? 'SP' : 'P'
            const ip = game['IP']
            
            // Filter out random fielders who pitched
            if (pitcherObj.position == 'P') {
                if (!ipArrays[position][ip]) {
                    ipArrays[position][ip] = {
                        "O": [],
                        "K": [],
                        "ER": [],
                        "ERA": [],
                        "ERA-INF": 0,
                        "BB": [],
                        "H": [],
                        "WHIP": [],
                        "WHIP-INF": 0,
                        "K9": [],
                        "QS": [],
                        "SVH": []
                    }
                }
    
                ipArrays[position][ip]['O'].push(game['O'])
                ipArrays[position][ip]['K'].push(game['K'])
                ipArrays[position][ip]['ER'].push(game['ER'])
                
                if (game['ERA'] != null) {
                    ipArrays[position][ip]['ERA'].push(game['ERA'])
                }
                else {
                    ipArrays[position][ip]['ERA-INF']++
                }

                ipArrays[position][ip]['BB'].push(game['BB'])
                ipArrays[position][ip]['H'].push(game['H'])

                if (game['WHIP'] != null) {
                    ipArrays[position][ip]['WHIP'].push(game['WHIP'])
                }
                else {
                    ipArrays[position][ip]['WHIP-INF']++
                }

                ipArrays[position][ip]['K9'].push(game['K9'])
                ipArrays[position][ip]['QS'].push(game['QS'])
                ipArrays[position][ip]['SVH'].push(game['SVH'])
            }
        }
    }

    for (let pos in ipArrays) {
        pitcherOutput[pos] = {}

        for (let ip in ipArrays[pos]) {
            if (!pitcherOutput[pos][ip]) {
                pitcherOutput[pos][ip] = {}
            }

            for (let stat in ipArrays[pos][ip]) {
                if (ipArrays[pos][ip][stat].length > 0) {
                    if (stat.includes('INF')) {
                        pitcherOutput[pos][ip][stat] = ipArrays[pos][ip][stat]
                    }
                    else {
                        pitcherOutput[pos][ip][stat] = math.mean(ipArrays[pos][ip][stat])
                    }
                }
                else {
                    pitcherOutput[pos][ip][stat] = 0
                }
            }
        }
    }

    fs.writeFileSync(`data/output/${yearToProcess}/pitcherImportance.json`, JSON.stringify(pitcherOutput, null, 2))
}