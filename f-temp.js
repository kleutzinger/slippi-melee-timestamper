const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const chokidar = require('chokidar');

let lastFileCount = -1;
let recentMostFile = '';

const watcher = chokidar.watch('', {
  // ignored       : '!*.slp', // TODO: This doesn't work. Use regex?
  depth         : 0,
  persistent    : true,
  usePolling    : true,
  ignoreInitial : true
});

function pollDirForNewFiles(_path) {
  fs.readdir(_path, (err, files) => {
    const fileCount = files.length;
    if (fileCount != lastFileCount) {
      lastFileCount = fileCount;
      handleNewFile(files, _path);
      // handleNewFile(files, _path);
    }
  });
}

function handleNewFile(files, basedir) {
  const newestFilename = _.maxBy(files, function(file) {
    fullpath = path.resolve(basedir, file);
    return fs.statSync(fullpath).ctime;
  });
  const newest = path.resolve(basedir, newestFilename);
  console.log(`newest file: ${newest}`);
  recentMostFile = newest;
  console.log(`newwwww: ${recentMostFile}`);
  // console.log(path.resolve(basedir, newest));
  // unwatch previous file, watch this one
  // chokidar.watching.foreach(e => unwatch(e))
  // chokidar.watch(newest)
}

async function sendFileToChokidar(filepath) {}

function chokInit(basedir) {
  pollDirForNewFiles('C:\\Users\\kevin\\Documents\\Slippi');
  console.log(recentMostFile);
  console.log(watcher.getWatched());
  watcher.add(recentMostFile);
  console.log(watcher.getWatched());
}

chokInit();
// // poll for new files, every 1 second
// setInterval(() => {
//   pollDirForNewFiles('.');
// }, 1000);

// chokidar.watch('.').on('all', (event, path) => {
//   console.log(event, path);
// });
