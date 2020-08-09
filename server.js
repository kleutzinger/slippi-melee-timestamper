var open = require('open');
const path = require('path');
const config = require(path.join(process.cwd(), 'config.js'));
// console.log(config);
config.royalty_status = 'exclude';
const fs = require('fs');
const { default: SlippiGame } = require('slp-parser-js');
const chokidar = require('chokidar');
const _ = require('lodash');
const { connect } = require('http2');
const { exit } = require('process');

const homedir = require('os').homedir();
if (!config.slippi_output_dir) {
  config.slippi_output_dir = path.join(homedir, 'Documents', 'Slippi');
}
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
const sounds_dir = path.join(process.cwd(), 'sounds');

const bodyParser = require('body-parser');
const { isNumber } = require('lodash');
const {
  startReplay,
  writeTimestamp,
  getRecentTimestamp,
  startTimestampObj,
  getAllTimestampsArr
} = require('./timestamp');
var express = require('express'),
  app = express(),
  // port = process.env.PORT || 5669;
  port = config.port || 7789;
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(express.static(path.join(process.cwd(), 'web')));
// app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
app.use('/sounds', express.static(sounds_dir));
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
      game_state  : latest_game_state,
      p1_p2_frame : latest_player1_2,
      desc        : '',
      igt         : '0'
    }
  };
  writeTimestamp(outputObj, config.timestamp_output_path);
  outputObj.meta = {
    msg         : 'trying to write timestamp',
    working_dir : __dirname
  };
  res.json(outputObj);
});

app.get('/recent', (req, res) => {
  // play the recentmost timestamp in timestamps.txt
  const recent_timestamp = getRecentTimestamp();
  startTimestampObj(recent_timestamp);
  recent_timestamp.meta = { msg: 'launching this replay section!' };
  res.json(recent_timestamp);
});

app.get('/browse', (req, res) => {
  const allTimestampsArr = getAllTimestampsArr();
  res.render('index', {
    title            : 'Hey',
    message          : 'Hello there!',
    allTimestamps    : allTimestampsArr,
    allTimestampsStr : JSON.stringify(allTimestampsArr)
  });
});

app.post('/api/getall', function(req, res) {
  res.json(getAllTimestampsArr());
});

app.get('/api/update/:id', function(req, res) {
  res.json(getAllTimestampsArr());
});

app.post('/play_slp', (req, res) => {
  // needs {slp_path:___, start_frame:___}
  const slp_path = req.body.slp_path;
  const start_frame = req.body.start_frame;
  if (slp_path && _.isNumber(start_frame)) {
    timestamp.startReplay(slp_path, start_frame);
  }
});

const server = app.listen(port, (req, res) => {
  console.log('Listening on port: ' + port);
  console.log(
    `please open in web browser or send GET request to:\n` +
      `http://localhost:${port}/timestamp  save a timestamp\n` +
      `http://localhost:${port}/recent     play your most recent timestamp\n` +
      `http://localhost:${port}/browse     watch and find your clips`
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

const watcher = chokidar.watch(listenPath, {
  ignored       : '!*.slp', // TODO: This doesn't work. Use regex?
  depth         : 0,
  persistent    : true,
  usePolling    : true,
  ignoreInitial : true
});

const gameByPath = {};

function startWatch() {
  watcher.on('change', (path) => {
    const start = Date.now();
    timeOfLastFileChange = start;
    let gameState, settings, stats, frames, latestFrame, gameEnd;
    try {
      let game = _.get(gameByPath, [ path, 'game' ]);
      if (!game) {
        console.log(`New file at: ${path}`);
        gameAborted = false;
        game = new SlippiGame(path);
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
}
if (config.startFileWatch) {
  startWatch();
}
