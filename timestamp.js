// provides functions to write the current frame number and info to a file.
// get config
const { appendFile } = require('fs');
const _ = require('lodash');
var exec = require('child_process').exec;

const config = {
  dolphin_path :
    'C:\\Users\\kevin\\AppData\\Roaming\\Slippi Desktop App\\dolphin.exe',
  replay_path  :
    '2360,C:\\Users\\kevin\\Documents\\Slippi\\Game_20200803T161502.slp'
};

function writeTimestamp(game_info, output_path) {
  console.log(`writing ${JSON.stringify(game_info)} to ${output_path}`);
  let output_string = `${game_info.frame},${game_info.path}\n`;
  appendFile(output_path, output_string, function(err) {
    if (err) throw err;
    console.log('Saved!');
  });
}

function processTxtStamps(path) {
  // convert the text files to clippi-valid replay json files?
  return;
}

function launchReplay(path, info_obj) {
  // C:\Users\kevin\AppData\Roaming\Slippi Desktop App\dolphin
  exec(config.dolphin_path, function callback(error, stdout, stderr) {
    // result
  });
}
// launchReplay();
// https://github.com/project-slippi/slippi-wiki/blob/master/COMM_SPEC.md
module.exports = { writeTimestamp };
