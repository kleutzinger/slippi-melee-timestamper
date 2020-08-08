const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ timestamps: [], user: {}, count: 0 }).write();

function init() {
  var olArr = require('./timestamp').getAllTimestampsArr();
  db.set('timestamps', olArr).write();
}

function getAllTimestampsArr() {
  return db.get('timestamps').value();
}

function pushTimestamp(ts) {
  db.get();
}

// console.log(getAllTimestampsArr());
