var open = require('open');
const path = require('path');
const config = require(path.join(process.cwd(), 'config.js'));
// console.log(config);
config.royalty_status = 'exclude';
const fs = require('fs');
const { default: SlippiGame } = require('@slippi/slippi-js');
const chokidar = require('chokidar');
const _ = require('lodash');
const homedir = require('os').homedir();
let foundSlippiFiles = false;
try {
  for (file of fs.readdirSync(config.slippi_output_dir)) {
    if (file.endsWith('.slp')) {
      foundSlippiFiles = true;
      break;
    }
  }
} catch (err) {
  // console.log(err);
}
if (!foundSlippiFiles) {
  console.log(`warning! no .slp files found in:
     ${config.slippi_output_dir}
please modify your config.js -> slippi_output_dir
  `);
}

const bodyParser = require('body-parser');
const { isNumber } = require('lodash');
const { writeTimestamp, startTimestampObj } = require('./timestamp');
const {
  getAllTimestampsArr,
  getTimestampById,
  pushTimestamp,
  getRecentTimestamp,
  updateTimestamp,
  deleteTimestamp
} = require('./api');
var express = require('express'),
  app = express(),
  // port = process.env.PORT || 5669;
  port = config.port || 7789;
// prettier-ignore
let LAN_IP = _.chain(require('os').networkInterfaces()).values().flatten().find({ family: 'IPv4', internal: false }).value().address;
let phone_link = `http://${LAN_IP}:${port}`;

app.use(bodyParser.json());
app.set('view engine', 'pug');
app.use(express.static(path.join(process.cwd(), 'web')));

app.get('/timestamp', (req, res) => {
  // console.log(JSON.stringify(latest_frame_data));
  console.log(`(server.js) latest frame was ${frame_count}`);
  let outputObj = {
    startFrame : frame_count - 60 * 5, // starts 5 seconds before timestamp
    endFrame   : frame_count,
    ts_frame   : frame_count, // frame timestamp button was pressed
    uid        : `${Date.now()}`,
    path       : latest_path,
    meta       : {
      metadata    : latest_metadata,
      game_state  : latest_game_state,
      p1_p2_frame : latest_player1_2,
      desc        : '',
      igt         : '0'
    }
  };
  // writeTimestamp(outputObj, config.timestamp_output_path); // legacy wirte to .txt
  const { niceData } = require('./timestamp');
  outputObj.nice = niceData(outputObj);
  if (latest_path != null) {
    pushTimestamp(outputObj);
    console.log('wrote: ', outputObj.nice);
  } else {
    console.log('no write, game uninitialized?');
  }
  // outputObj.meta = {
  //   msg         : 'trying to write timestamp',
  //   working_dir : __dirname
  // };
  res.json(outputObj);
});

app.get('/', (req, res) => {
  res.redirect('/browse');
});

app.get('/recent', (req, res) => {
  // play the recentmost timestamp in timestamps.txt
  const recent_timestamp = getRecentTimestamp();
  startTimestampObj(recent_timestamp);
  recent_timestamp.meta = { msg: 'launching this replay section!' };
  res.json(recent_timestamp);
});

app.get('/thumbgen', (req, res) => {
  require('./icon-gen').setAllThumbnail(true);
  res.json('gend thumbs');
});

app.get('/browse', (req, res) => {
  const allTimestampsArr = getAllTimestampsArr();
  const { niceData } = require('./timestamp');
  const { setAllThumbnail } = require('./icon-gen');
  try {
    setAllThumbnail();
  } catch (err) {
    console.log('error generating thumbnails');
    console.log(err);
  }
  res.render('browse', {
    title            : 'Hey',
    message          : 'Hello there!',
    phone_link       : phone_link,
    allTimestamps    : getAllTimestampsArr().map((e) => {
      let nice = niceData(e);
      e.nice = nice;
      return e;
    }),
    allTimestampsStr : JSON.stringify(allTimestampsArr)
  });
});

app.get('/edit/:id', (req, res) => {
  const timestamp = getTimestampById(req.params.id);
  res.render('edit', {
    timestamp : JSON.stringify(timestamp)
  });
});

app.get('/start_dolphin', function(req, res) {
  console.log('launch dolphin');
  res.json('ill start up dolphin');
  require('child_process').execFile(
    config.replay_dolphin_path,
    [ '--exec="nope"' ],
    (error, stdout, stderr) => {
      if (error) {
        console.log('error executing replay dolphin');
      }
    }
  );
});

app.post('/api/getall', function(req, res) {
  res.json(getAllTimestampsArr());
});

app.get('/api/getall', function(req, res) {
  res.json(getAllTimestampsArr());
});

app.get('/api/update/:id', function(req, res) {
  res.json(getAllTimestampsArr());
});

app.post('/ahk_post', function(req, res) {
  // console.log(req.body);
  console.log(req.body);
  res.json(req.body);
});

app.post('/api/update', function(req, res) {
  let given_timestamp = req.body.timestamp;
  updateTimestamp(given_timestamp, true);
  res.json(req.body);
});

app.get('/api/delete/:id', function(req, res) {
  try {
    let timestamp_id = req.params.id;
    deleteTimestamp({ uid: timestamp_id });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json('err');
  }
  res.json(getAllTimestampsArr());
});

app.get('/play_slp/:id', (req, res) => {
  try {
    let timestamp_id = req.params.id;
    let timestamp = getTimestampById(timestamp_id);
    startTimestampObj(timestamp);
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json('err');
  }
});

app.post('/play_slp', function(req, res) {
  // console.log(req.body);
  let given_timestamp = req.body.timestamp;
  startTimestampObj(given_timestamp);
  res.json(req.body);
});

const server = app.listen(port, (req, res) => {
  console.log('Listening on port: ' + port);
  console.log(
    `please open in web browser or send GET request to:\n` +
      `http://localhost:${port}/timestamp  save a timestamp\n` +
      // `http://localhost:${port}/recent     play your most recent timestamp\n` +
      `http://localhost:${port}/browse     watch and find your clips\n` +
      `${phone_link}        on your phone (local network)`
  );
});

// ************************   Slippi stuff below ****** ******

var stage_id_info = config.stage_id_info;
// console.log(stage_id_info);
const listenPath = process.argv[2] || config['slippi_output_dir'];
// console.log(`Looking for Slippi files at: ${listenPath}`);
var timeOfLastFileChange = null;
var gameAborted = false;
var frame_count = 0;
var latest_game_state = null;
var latest_path = null;
var latest_player1_2 = {};
var lastFileCount = -1;
var latest_metadata = {};
var recentMostFile = '';
var watchHistory = [];

const gameByPath = {};

function pollDirForNewFiles(_path) {
  fs.readdir(_path, (err, files) => {
    if (files === undefined) {
      console.log(`(server.js) no path at ${_path}`);
      return;
    }
    const fileCount = files.length;
    if (fileCount != lastFileCount) {
      lastFileCount = fileCount;
      handleNewFile(files, _path);
    }
  });
}
console.log(config.recent_slp);

async function sendFileToChokidar(filepath) {
  // console.log(`set chok to ${filepath}`);
  watcher.add(filepath);
  for (const p of watchHistory) {
    // remove old watched files
    watcher.unwatch(watchHistory);
  }
  watchHistory.push(filepath);
  // console.log('currently watching: ', watcher.getWatched());
}

function handleNewFile(files, basedir) {
  const newestFilename = _.max(files); // newest by filename
  const newest = path.resolve(basedir, newestFilename);
  console.log(`newest file: ${newest}`);
  recentMostFile = newest;
  sendFileToChokidar(newest);
  // console.log(path.resolve(basedir, newest));
  // unwatch previous file, watch this one
  // chokidar.watching.foreach(e => unwatch(e))
  // chokidar.watch(newest)
}

const watcher = chokidar.watch('', {
  ignored       : '!*.slp', // TODO: This doesn't work. Use regex?
  depth         : 0,
  persistent    : true,
  usePolling    : true,
  ignoreInitial : true
});

if (config.startFileWatch && foundSlippiFiles) {
  setInterval(() => {
    pollDirForNewFiles(config.slippi_output_dir);
  }, 1000);
}

watcher.on('change', (path) => {
  // console.log(watcher.getWatched());
  const start = Date.now();
  timeOfLastFileChange = start;
  let gameState, settings, stats, frames, latestFrame, gameEnd;
  try {
    let game = _.get(gameByPath, [ path, 'game' ]);
    if (!game) {
      console.log(`New file at: ${path}`);
      gameAborted = false;
      game = new SlippiGame(path, { processOnTheFly: true });
      gameByPath[path] = {
        game  : game,
        state : {
          settings         : null,
          detectedPunishes : {}
        }
      };
      var slippiFileActiveCheck = setInterval(() => {
        let fileChangeTimeDelta = Date.now() - timeOfLastFileChange;
        if (fileChangeTimeDelta > config.fileChangeTimeoutMs) {
          gameAborted = true;
          clearInterval(slippiFileActiveCheck);
          console.log(
            `Game ended (no new frames for at least ${config.fileChangeTimeoutMs}ms)`
          );
        }
      }, config.fileChangeDeltaPollMs);
    }

    gameState = _.get(gameByPath, [ path, 'state' ]);

    settings = game.getSettings();

    frames = game.getFrames();
    latestFrame = game.getLatestFrame();
    gameEnd = game.getGameEnd();
  } catch (err) {
    console.log(err);
    return;
  }

  if (!gameState.settings && settings) {
    // new game startup
    console.log(`[Game Start] New game has started`);
    // console.log(settings);
    // console.log(settings.stageId);
    frame_count = 0;
    let stage_id = settings.stageId;
    console.log(stage_id_info[stage_id]);
    let stage_info = stage_id_info[stage_id];
    gameState.settings = settings;
  }
  let player1_2 = {};

  // console.log(`We have ${_.size(frames)} frames.`);
  settings.players.forEach((player, idx) => {
    const frameData = _.get(latestFrame, [ 'players', player.playerIndex ]);
    if (!frameData) {
      return;
    }
    // P1/P2 Dependent: player, settings.players
    if (frameData.post) {
      frame_count = frameData.post.frame;
      latest_game_state = gameState;
      latest_path = path;
      player1_2[idx] = frameData;
    }
    // console.log(
    //   `[Port ${player.port}] ${frameData.post.percent.toFixed(1)}% | ` +
    //     `${frameData.post.stocksRemaining} stocks`
    // );
  });
  latest_player1_2 = player1_2;
  if (gameEnd) {
    // NOTE: These values and the quitter index will not work until 2.0.0 recording code is
    // NOTE: used. This code has not been publicly released yet as it still has issues
    const endTypes = {
      1 : 'TIME!',
      2 : 'GAME!',
      7 : 'No Contest'
    };
    console.log('Game over. Ending Song');
    const endMessage = _.get(endTypes, gameEnd.gameEndMethod) || 'Unknown';

    const lrasText =
      gameEnd.gameEndMethod === 7
        ? ` | Quitter Index: ${gameEnd.lrasInitiatorIndex}`
        : '';
    console.log(`[Game Complete] Type: ${endMessage}${lrasText}`);
  }
  // console.log(`Read took: ${Date.now() - start} ms`);
});

if (config.startFileWatch) {
  // startWatch();
  // setTimeout(() => {
  //   startWatch();
  // }, 2000);
}
