const fs = require('fs');
const getMP3Duration = require('get-mp3-duration');

const getSongDuration = (filePath) => { 
  try {
    const buffer = fs.readFileSync(filePath);
    const durationMs = getMP3Duration(buffer);
    const durationSec = Math.floor(durationMs / 1000);
    return durationSec;
  } catch (err) {
    console.log(err);
    return 0;
  }
};

module.exports = { getSongDuration };
