// provides functions to write the current frame number and info to a file.
// get config
const fs = require('fs');
var path = require('path');
const _ = require('lodash');
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;

const config = {
  dolphin_path :
    'C:\\Users\\kevin\\AppData\\Roaming\\Slippi Desktop App\\dolphin\\Dolphin.exe'
};

function writeTimestamp(game_info, output_path) {
  let output_string = game_info_to_txt_line(game_info);
  if (!output_string) {
    console.log('no game_info supplied. is melee running?');
    return;
  }
  fs.appendFile(output_path, output_string, function(err) {
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

function generateTempReplayFile(timestamp_arr) {
  // return path to the temp replay file
  let clippi_json = {
    mode               : 'queue',
    replay             : '',
    isRealTimeMode     : false,
    outputOverlayFiles : true
  };
  clippi_json.queue = timestamp_arr.filter((ts) => {
    const exists = fs.existsSync(ts.path);
    if (!exists) console.log(`no file at ${ts.path}`);
    return exists;
  });
  const out_path = path.resolve('temp.json');
  fs.writeFileSync(out_path, JSON.stringify(clippi_json));
  return out_path;
}

function launchReplays(timestamp_arr) {
  const json_path = generateTempReplayFile(timestamp_arr);
  // const json_path = 'C:\\Users\\kevin\\Desktop\\combosnew.json';
  const args = [ '-i', json_path ];
  execFile(config.dolphin_path, args, function callback(error, stdout, stderr) {
    if (error) {
      console.log(error);
    }
    // result
  });
}
function startReplay(slp_path, start_frame = 0, duration = 60 * 7) {
  let tmpObj = {
    path       : slp_path,
    startFrame : start_frame,
    endFrame   : start_frame + duration
  };
  launchReplays([ tmpObj ]);
}

const timestamp_example_obj = {
  path        : 'C:\\Users\\kevin\\Documents\\Slippi\\Game_20200731T205716.slp',
  gameStartAt : '06/22/20 10:48 am',
  startFrame  : 200,
  endFrame    : 1000,
  metadata    : {
    description : 'hella sick knee',
    dmg_done    : 0,
    gamestate   : {},
    stage       : '',
    chars       : 'falcon/peach'
  }
};
// launchReplays([ timestamp_example_obj, timestamp_example_obj ]);
// https://github.com/project-slippi/slippi-wiki/blob/master/COMM_SPEC.md
module.exports = { writeTimestamp, startReplay };
