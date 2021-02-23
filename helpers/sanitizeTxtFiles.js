const fs = require('fs');
const prependFile = require('prepend-file');
const replace = require('replace')

function sanitizeTxtFiles(year) {
    fs.readdir(`./data/txt/${year}`, (err, files) => {
        files.forEach(file => {
            replace({
                regex: '"',
                replacement: "",
                paths: [`./data/txt/${year}/${file}`],
                recursive: true,
                silent: true,
              });

            prependFile(`./data/txt/${year}/${file}`, 'gameId,visitingTeam,inning,battingTeam,outs,balls,strikes,visScore,homeScore,resBatter,resBatterHand,resPitcher,resPitcherHand,firstRunner,secondRunner,thirdRunner,eventText,leadoffFlag,pinchhitFlag,defensivePosition,lineupPosition,eventType,batterEventFlag,abFlag,hitValue,SHFlag,SFFlag,outsOnPlay,rbiOnPlay,wildPitchFlag,passedBallFlag,numErrors,batterDest,runnerOn1stDest,runnerOn2ndDest,runnerOn3rdDest,sbForRunnerOn1stFlag,sbForRunneron2ndFlag,sbForRunnerOn3rdFlag,responsiblePitcherForRunnerOn1st, responsiblePitcherForRunnerOn2nd,responsiblePitcherForRunnerOn3rd,newGameFlag,endGameFlag\n')
        })
    })
}

module.exports = sanitizeTxtFiles