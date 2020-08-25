const PImage = require('pureimage');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { stage_id_info, char_id_info } = require('./web/infos.json');

const example_input = {
  output_path : 'web/out.png',
  ingame_time : '04:08.66',
  stage_name  : 'Pokémon Stadium',
  stage_id    : 1,
  p0_char     : 19,
  p1_char     : 19,
  p1_stock    : 0,
  p0_stock    : 1
};

function tsToPaths(ts) {
  // take a timestamp => return icon_paths = [stage, char0, char1]
  const img_basedir = 'web/icon';
  const nice = ts.nice; // chg to info.meta.nice
  const stage_img = stage_id_info[nice.stage_id].icon;
  const char0_img = char_id_info[nice.p0_char].icon;
  const char1_img = char_id_info[nice.p1_char].icon;
  return [ stage_img, char0_img, char1_img ].map((filename) => {
    return path.join(img_basedir, filename);
  });
}

function makeImg(image_paths, output_path, nice) {
  // image paths: [stage, char0, char1...]

  Promise.all(
    image_paths.map((img_path) => {
      return PImage.decodePNGFromStream(fs.createReadStream(img_path));
    })
  ).then((images) => {
    const cw = 640;
    const ch = 480;
    let background = PImage.make(cw, ch);
    let ctx = background.getContext('2d');
    const icon_scale = 4;
    let img = images[0];
    //prettier-ignore
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 640, 480);
    img = images[1]; // char0
    //prettier-ignore
    ctx.drawImage(img, 0, 0, img.width, img.height, 200, 20, img.width * icon_scale, img.height * icon_scale);
    img = images[2]; // char1
    //prettier-ignore
    ctx.drawImage(img, 0, 0, img.width, img.height, 380, 20, img.width * icon_scale, img.height * icon_scale);
    // time bckgrnd
    ctx.fillStyle = '#000000';
    ctx.fillRect(250, 400, 400, 100);
    // time text
    ctx.fillStyle = '#ffffff';
    ctx.font = "100pt 'Arial Narrow'";
    ctx.fillText(nice.ingame_time, 300, 480);

    PImage.encodeJPEGToStream(
      background,
      fs.createWriteStream(output_path),
      50
    ).then(() => {
      console.log(`wrote ${output_path}`);
    });
  });
}

function storeThumbnail(timestamp, out_path) {
  const src_paths = tsToPaths(timestamp);
  makeImg(src_paths, out_path, timestamp.nice);
}

function setAllThumbnail() {
  const { getAllTimestampsArr } = require('./api.js');
  const all_timestamps = getAllTimestampsArr();
  let to_write = [];
  for (const ts of all_timestamps) {
    const out_path = path.join('web', 'thumbnail', ts.uid + '.png');
    if (!fs.existsSync(out_path)) {
      to_write.push([ ts, out_path ]);
    }
  }
  if (to_write.length > 0) {
    var fnt = PImage.registerFont('web/arial_narrow_7.ttf', 'Arial Narrow');
    fnt.load(() => {
      to_write.map((el) => {
        storeThumbnail(el[0], el[1]);
      });
    });
  }
}

// for (const id of _.values(stage_id_info)) {
//   if (id.icon) {
//     let img = path.join('web', 'icon', id.icon);
//     console.log(fs.existsSync(img));
//   }
// }

// const i = infoToPaths(example_input);
// makeImg(i, {example_input});

module.exports = { setAllThumbnail };
