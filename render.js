// render clips as video
// use frame dumps to do so

const chokidar = require('chokidar');
const _ = require('lodash');
const config = require('./config');
const path = require('path');
const api = require('./api');
const fs = require('fs');
const { getAllTimestampsArr } = require('./api');
const { startTimestampObj, launchReplays } = require('./timestamp');

const dolphin_dump_video = path.resolve(config.framedump_dir, 'framedump0.avi');
const dolphin_dump_aduio0 = path.resolve(config.audiodump_dir, 'dspdump.wav');
const dolphin_dump_aduio1 = path.resolve(config.audiodump_dir, 'dtkdump.wav');

const example_ts = getAllTimestampsArr()[1];

function setFrameDump(offon) {
  // assume on for now
  return;
}

function initChokidar() {}

function takeDumps(timestamps) {
  // remove pre-existing framedump0.avi files
  for (const to_remove of [
    dolphin_dump_video,
    dolphin_dump_aduio0,
    dolphin_dump_aduio1
  ]) {
    if (fs.existsSync(to_remove)) {
      fs.unlinkSync(to_remove);
    }
  }
  // frame Dump must be ON
  launchReplays(timestamps);
}

function afterDump(timestamp) {
  const output_path = `renders/${timestamp.uid}+${timestamp.startFrame}+${timestamp.endFrame}.avi`;
  fs.copyFile(dolphin_dump_video, output_path, () => {
    console.log('wrote ' + output_path);
  });
  try {
    // delete framedump
    // fs.unlinkSync(dump_file);
    //file removed
  } catch (err) {
    console.error(err);
  }
}

function dumpTimestamp(timestamp) {
  let ts = timestamp;
}

takeDumps([ example_ts ]);
// afterDump(example_ts);
module.exports = {};
