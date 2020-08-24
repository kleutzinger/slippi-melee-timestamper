var PImage = require('pureimage');
var img1 = PImage.make(640, 480);
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const example_input = {
  output_path : 'web/out.png',
  ingame_time : '04:08.66',
  stage_name  : 'Pokémon Stadium',
  stage_id    : 3,
  p0_char     : 19,
  p1_char     : 19,
  p1_stock    : 0,
  p0_stock    : 1
};

function infoToPaths(info) {
  const img_basedir = 'web/icon';
  const nice = info; // chg to info.meta.nice
  const stage_img = stage_id_info[nice.stage_id].icon;
  const char0_img = char_id_info[nice.p0_char].icon;
  const char1_img = char_id_info[nice.p1_char].icon;

  return [ stage_img, char0_img, char1_img ].map((filename) => {
    return path.join(img_basedir, filename);
  });
}
function makeImg(image_paths, nice) {
  // image paths: [stage, char0, char1...]
  Promise.all(
    image_paths.map((img_path) => {
      console.log(img_path);
      return PImage.decodePNGFromStream(fs.createReadStream(img_path));
    })
  ).then((images) => {
    var fnt = PImage.registerFont('web/arial_narrow_7.ttf', 'Arial Narrow');
    fnt.load(() => {
      const output_path = 'out.png';
      const cw = 640;
      const ch = 480;

      var background = PImage.make(cw, ch);
      var ctx = background.getContext('2d');
      // console.log(images[0])
      let img = images[0];
      const icon_scale = 4;
      //prettier-ignore
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 640, 480);
      img = images[1];
      //prettier-ignore
      ctx.drawImage(img, 0, 0, img.width, img.height, 200, 20, img.width * icon_scale, img.height * icon_scale);
      img = images[2];
      //prettier-ignore
      ctx.drawImage(img, 0, 0, img.width, img.height, 380, 20, img.width * 4, img.height * 4);
      ctx.fillStyle = '#000000';
      ctx.fillRect(250, 400, 400, 100);

      ctx.fillStyle = '#ffffff';
      ctx.font = "100pt 'Arial Narrow'";

      ctx.fillText(nice.ingame_time, 300, 480);

      PImage.encodeJPEGToStream(
        background,
        fs.createWriteStream(output_path),
        50
      ).then(() => {
        console.log('done writing');
      });
    });
  });
}

const stage_id_info = {
  icon_basedir : 'web/icon',
  '2'          : {
    dir_name   : 'fountain',
    stage_name : 'Fountain of Dreams'
  },
  '8'          : {
    dir_name   : 'yoshis',
    stage_name : "Yoshi's Story"
  },
  '31'         : {
    dir_name   : 'battlefield',
    stage_name : 'Battlefield'
  },
  '32'         : {
    dir_name   : 'final',
    stage_name : 'Final Destination'
  },
  '3'          : {
    dir_name   : 'stadium',
    stage_name : 'Pokémon Stadium',
    icon       : 'stadium.png'
  },
  '28'         : {
    dir_name   : 'dreamland',
    stage_name : 'Dream Land'
  }
};

const char_id_info = {
  icon_base_dir : 'web/icon',
  '19'          : { icon: 'fox-original.png' } //fox?
};

// const i = infoToPaths(example_input);
// makeImg(i, example_input);
