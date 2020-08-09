const path = require('path');
const config = require(path.join(process.cwd(), 'config.js'));
// const config = require('./data/config2.js');
const low = require('lowdb');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
const { startTimestampObj } = require('./timestamp');
const { copyFile } = require('fs');

// Set some defaults (required if your JSON file is empty)
db.defaults({ timestamps: [], user: {}, count: 0 }).write();

function init() {
  var olArr = require('./timestamp').getAllTimestampsArr();
  db.set('timestamps', olArr).write();
}

function getAllTimestampsArr() {
  return db.get('timestamps').value();
}

function niceData(ts) {
  // give me a timestamp obj
  // return object with useful data about the frame metadata
  ts = getAllTimestampsArr()[0];
  data = {};
  // prettier-ignore
  let stage_id = _.get(ts, 'meta.game_state.settings.stageId');
  let player_0_settings = _.get(ts, 'meta.game_state.settings.players[0]');
  let player_1_settings = _.get(ts, 'meta.game_state.settings.players[1]');

  let p0_char = player_0_settings.characterId;
  let p1_char = player_1_settings.characterId;
  let p0_stock = _.get(ts, 'meta.p1_p2_frame["0"].post.stocksRemaining');
  let p1_stock = _.get(ts, 'meta.p1_p2_frame["1"].post.stocksRemaining');

  let data_pool = { stage_id, p0_char, p1_char, p1_stock, p0_stock };
  return data_pool;
}

function pushTimestamp(ts) {
  db.get('timestamps').push(ts).write();
}

function getTimestampById(id) {
  return db.get('timestamps').find({ uid: id }).value();
}

function updateTimestamp(ts) {
  db
    .get('timestamps')
    .find({ uid: ts.uid }) // Lodash shorthand syntax
    .assign(ts)
    .write();
}

// console.log(getTimestampById('0.4466991633600961'));
// console.log(getAllTimestampsArr());
module.exports = { getAllTimestampsArr, getTimestampById };
