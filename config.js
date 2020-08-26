const path = require('path');
const { mkdirSync } = require('fs');
const { homedir } = require('os');
const { existsSync, readdirSync, fstat } = require('fs');
const { max } = require('lodash');
const { stage_id_info, char_id_info } = require('./web/infos.json');
const { exception } = require('console');

let action_required = false;

let config = {
  // *********************************************
  // uncomment and edit below to set where slippi ouputs your .slp files
  // slippi_output_dir        : 'C:\\Users\\kevin\\Documents\\Slippi',
  // replay_dolphin_path      : 'C:\\Users\\kevin\\AppData\\Roaming\\Slippi Desktop App\\dolphin\\Dolphin.exe',
  // *********************************************

  timestamp_output_path : path.join(__dirname, 'timestamps.txt'),
  port                  : 7789,

  // old stuff below
  startFileWatch        : true,
  fileChangeTimeoutMs   : 1200, // how long to wait after a game ends to quit out
  fileChangeDeltaPollMs : 250, // how often to check when a game
  autoClose2ndWebpage   : false, // broken
  autoOpenWebpageOnRun  : false, // auto open the webpage when the server starts
  socketDebug           : false,
  required_folders      : [ 'web', 'web/thumbnail', 'renders' ],
  stage_id_info,
  char_id_info
};

if (!config.slippi_output_dir) {
  config.slippi_output_dir = path.join(homedir(), 'Documents', 'Slippi');
}

config.getRecentSlp = () => {
  try {
    let files = readdirSync(config.slippi_output_dir);
    return path.join(config.slippi_output_dir, max(files));
  } catch (err) {
    console.log(err);
    return null;
  }
};

if (!config.replay_dolphin_path) {
  config.replay_dolphin_path = path.join(
    homedir(),
    'AppData/Roaming/Slippi Desktop App/dolphin/Dolphin.exe'
  );
}

if (!existsSync(config.replay_dolphin_path)) {
  action_required = true;
  console.log(
    `warning! I can't launch replays \n\tPlease install Slippi Desktop App` +
      `\n\t${config.replay_dolphin_path}`
  );
}

config.slippi_desktop_roaming_dir = path.resolve(
  config.replay_dolphin_path,
  '../..'
);

config.framedump_dir = path.resolve(
  config.slippi_desktop_roaming_dir,
  'dolphin/User/Dump/Frames'
);

config.audiodump_dir = path.resolve(
  config.slippi_desktop_roaming_dir,
  'dolphin/User/Dump/Audio'
);

// console.log(existsSync(config.framedump_dir));

for (const _path of config.required_folders) {
  if (!existsSync(_path)) {
    console.log('init ' + _path);
    mkdirSync(_path);
  }
}

module.exports = config;
