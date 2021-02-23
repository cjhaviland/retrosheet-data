const fs = require('fs')
const prependFile = require('prepend-file');

function createPlayerList(yearToProcess) {
    fs.readdir(`./retrosheet/${yearToProcess}seve`, (err, files) => {
        if (err) return console.error(err)
        // let rosFiles = files.filter(f => f.slice(-3) === 'ROS')
        
        // fs.writeFileSync(`./retrosheet/${yearToProcess}seve/AllPlayers.csv`, '')
        
        // rosFiles.forEach(file => {
        //     prependFile(`./retrosheet/${yearToProcess}seve/AllPlayers.csv`, )    
        // })

        // prependFile(`./retrosheet/${yearToProcess}seve/AllPlayers.csv`, 'ID,lastName,firstName,battingHand,throwingHand,teamAbbreviation,positionAbbreviation\n')
    })
}

module.exports = createPlayerList