// provides functions to write the current frame number and info to a file.
// get config
const { appendFile } = require('fs');
const _ = require('lodash');
var exec = require('child_process').exec;

const config = {
  dolphin_path :
    'C:\\Users\\kevin\\AppData\\Roaming\\Slippi Desktop App\\dolphin\\Dolphin.exe',
  replay_txt   :
    '2360,C:\\Users\\kevin\\Documents\\Slippi\\Game_20200803T161502.slp'
};

function writeTimestamp(game_info, output_path) {
  let output_string = game_info_to_txt_line(game_info);
  if (!output_string) {
    console.log('no game_info supplied. is melee running?');
    return;
  }
  appendFile(output_path, output_string, function(err) {
    console.log(`writing ${JSON.stringify(game_info)} to ${output_path}`);
    if (err) throw err;
    console.log('Saved!');
  });
}

function game_info_to_txt_line(game_info) {
  // take the gamestate info (stocks, players, percent...)
  // returnt the line to go into the text file
  let output_string = `${game_info.frame},${game_info.path}\n`;
  return output_string;
}

function processTxtStamps(path) {
  // convert the text files to clippi-valid replay json files?
  return;
}

function generateTempReplayFile(timestamp) {
  // return path to the temp replay file
}

function launchReplay(path, info_obj) {
  const cmd = `"${config.dolphin_path}"`;
  exec(cmd, function callback(error, stdout, stderr) {
    if (error) {
      console.log(error);
    }
    // result
  });
}
launchReplay();
// https://github.com/project-slippi/slippi-wiki/blob/master/COMM_SPEC.md
module.exports = { writeTimestamp };
