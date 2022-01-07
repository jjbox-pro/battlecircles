const fs = require("fs");


const timingFile = `~timing`;


if (fs.existsSync(timingFile)) {
    console.log('\u001b[1;33m' + 'Build compiled in: ' + '\u001b[0m' + `${(Date.now() - fs.readFileSync(timingFile)) / 1000}s`);
    
    fs.unlinkSync(timingFile);
}