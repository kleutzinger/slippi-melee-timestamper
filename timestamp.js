// provides functions to write the current frame number and info to a file.
// get config
const { appendFile } = require('fs');

function writeTimestamp(game_info, output_path) {
  console.log(`writing ${JSON.stringify(game_info)} to ${output_path}`);
  let output_string = `${game_info.frame},${game_info.path}\n`;
  appendFile(output_path, output_string, function(err) {
    if (err) throw err;
    console.log('Saved!');
  });
}

module.exports = { writeTimestamp };
