// provides functions to write the current frame number and info to a file.
// get config
const fs = require('fs');
var path = require('path');
const config = require(path.join(process.cwd(), 'config.js'));
const _ = require('lodash');
const { json } = require('express');
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var api = require('./api.js');

function writeTimestamp(game_info, output_path, discard_meta = true) {
  let output_string = game_info_to_txt_line(game_info);
  if (discard_meta) {
    delete game_info.meta;
  }
  if (output_string === 'bad') {
    console.log(
      '(timestamp.js) no write. game_info incomplete. is melee running?'
    );
    // console.log(game_info);
    return;
  }
  fs.appendFile(output_path, output_string + '\n', function(err) {
    // console.log(`writing ${JSON.stringify(game_info)} to ${output_path}`);
    console.log(Date.now(), 'wrote');
    if (err) throw err;
    console.log('Saved!');
  });
}

function game_info_to_txt_line(game_info) {
  // take the gamestate info (stocks, players, percent...)
  // returnt the line to go into the text file
  if (game_info.path === null) {
    return 'bad';
  }
  // console.log(game_info);
  return JSON.stringify(game_info);
  // let output_string = `${game_info.frame},${game_info.path}\n`;
  // return output_string;
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
  execFile(config.replay_dolphin_path, args, function callback(
    error,
    stdout,
    stderr
  ) {
    if (error) {
      console.log('error executing replay dolphin');
    }
    // result
  });
}
function startReplay(slp_path, startFrame = 0, duration = 60 * 7) {
  let tmpObj = {
    path       : slp_path,
    startFrame : startFrame,
    endFrame   : startFrame + duration
  };
  launchReplays([ tmpObj ]);
}

function startTimestampObj(timestamp) {
  // console.log('starting timestamp obj ' + timestamp);
  launchReplays([ timestamp ]);
}

function getAllTimestampsArr() {
  return api.getAllTimestampsArr();
}

function getRecentTimestamp() {
  const all = getAllTimestampsArr();
  return all[all.length - 1];
}

function frame_to_igt(frame_count) {
  if (frame_count <= 0) {
    // return '08:00.00';
    frame_count = 0;
  }
  const seconds_elapsed = frame_count / 60;
  const eight_min = 60 * 8;
  const igt = new Date((eight_min - seconds_elapsed) * 1000)
    .toISOString()
    .substr(14, 8);
  return igt;
}

// https://github.com/project-slippi/slippi-wiki/blob/master/COMM_SPEC.md
module.exports = {
  writeTimestamp,
  startReplay,
  startTimestampObj,
  getRecentTimestamp,
  getAllTimestampsArr,
  frame_to_igt
};
