const path = require('path');
const config = require(path.join(process.cwd(), 'config.js'));
// const config = require('./data/config2.js');
const low = require('lowdb');
const _ = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
const { copyFile } = require('fs');

// Set some defaults (required if your JSON file is empty)
db.defaults({ timestamps: [], user: {}, count: 0 }).write();

function populate_from_txt() {
  var olArr = require('./timestamp').getAllTimestampsArr();
  db.set('timestamps', olArr).write();
}

function getAllTimestampsArr() {
  return db.get('timestamps').value();
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
