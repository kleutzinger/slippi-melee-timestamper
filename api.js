const path = require('path');
const config = require(path.join(process.cwd(), 'config.js'));
// const config = require('./data/config2.js');
const low = require('lowdb');
const _ = require('lodash');
const { default: SlippiGame } = require('@slippi/slippi-js');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
const { copyFile } = require('fs');
const { niceData } = require('./timestamp');

// Set some defaults (required if your JSON file is empty)
db.defaults({ timestamps: [], user: {}, count: 0 }).write();

function getAllTimestampsArr(ensure_metadata = false) {
  let all_ts = db.get('timestamps').value();
  if (!ensure_metadata) {
    return all_ts;
  }
}

function getMetaStats(timestamp) {
  try {
    const game = new SlippiGame(timestamp.path);
    return [ game.getMetadata(), game.getStats() ];
  } catch (error) {
    console.log(error.message);
    console.log("can't get metadata on ", timestamp.path);
    return [ {}, {} ];
  }
}

function pushTimestamp(ts) {
  db.get('timestamps').push(ts).write();
}

function getTimestampById(id) {
  return db.get('timestamps').find({ uid: id }).value();
}

function getRecentTimestamp() {
  let tsarr = getAllTimestampsArr();
  return tsarr[tsarr.length - 1];
}

function updateTimestamp(ts, ensure_metadata = false) {
  if (ensure_metadata) {
    const metastat = getMetaStats(ts);
    if (!_.isEmpty(metastat[0])) {
      _.set(ts, 'meta.metadata', metastat[0]);
    }
    // _.set(ts, 'meta.nice', niceData(ts)); // hard to import niceData
    // _.set(ts, 'meta.stats', metastat[1]); //don't really care about stats, actually
  }
  db
    .get('timestamps')
    .find({ uid: ts.uid }) // Lodash shorthand syntax
    .assign(ts)
    .write();
}

function deleteTimestamp(ts) {
  db
    .get('timestamps')
    .remove({ uid: ts.uid }) // Lodash shorthand syntax
    .write();
}
// console.log(getTimestampById('0.4466991633600961'));
// console.log(getAllTimestampsArr());
module.exports = {
  getAllTimestampsArr,
  getTimestampById,
  pushTimestamp,
  updateTimestamp,
  deleteTimestamp,
  getRecentTimestamp
};
