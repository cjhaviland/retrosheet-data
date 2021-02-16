const { execFile } = require('child_process');

function execBevent() {
    const basePath = 'C:/Users/C839184/repos/Misc/2020seve'
    let file = `2020ARI.EVN`
    execFile(`${basePath}/BEVENT.EXE`, ['-y', '2020', '-f', '0-6,8-9,12-13,16-17,26-40,43-45,51,58-61,66-68', file, '>', `${basePath}/data/text/${file}.txt`], (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      })
}

module.exports = execBevent