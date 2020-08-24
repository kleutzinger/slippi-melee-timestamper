const { join } = require('path');
const config = {
  // *********************************************
  // uncomment and edit below to set where slippi puts your .slp files
  // slippi_output_dir        : 'C:\\Users\\kevin\\Documents\\Slippi',
  // *********************************************
  replay_dolphin_path   :
    'C:\\Users\\kevin\\AppData\\Roaming\\Slippi Desktop App\\dolphin\\Dolphin.exe',
  timestamp_output_path : join(__dirname, 'timestamps.txt'),
  port                  : 7789,

  // old stuff below
  startFileWatch        : true,
  fileChangeTimeoutMs   : 1200, // how long to wait after a game ends to quit out
  fileChangeDeltaPollMs : 250, // how often to check when a game
  autoClose2ndWebpage   : false, // broken
  autoOpenWebpageOnRun  : false, // auto open the webpage when the server starts
  socketDebug           : false,
  stage_id_info         : {
    '2'  : {
      dir_name   : 'fountain',
      stage_name : 'Fountain of Dreams'
    },
    '8'  : {
      dir_name   : 'yoshis',
      stage_name : "Yoshi's Story"
    },
    '31' : {
      dir_name   : 'battlefield',
      stage_name : 'Battlefield'
    },
    '32' : {
      dir_name   : 'final',
      stage_name : 'Final Destination'
    },
    '3'  : {
      dir_name   : 'stadium',
      stage_name : 'Pokémon Stadium',
      icon_path  : 'web/icon/stadium.png'
    },
    '28' : {
      dir_name   : 'dreamland',
      stage_name : 'Dream Land'
    },
    '4'  : {
      stage_name : 'PRINCESS_PEACHS_CASTLE'
    },
    '5'  : {
      stage_name : 'KONGO_JUNGLE'
    },
    '6'  : {
      stage_name : 'BRINSTAR'
    },
    '7'  : {
      stage_name : 'CORNERIA'
    },
    '9'  : {
      stage_name : 'ONETT'
    },
    '10' : {
      stage_name : 'MUTE_CITY'
    },
    '11' : {
      stage_name : 'RAINBOW_CRUISE'
    },
    '12' : {
      stage_name : 'JUNGLE_JAPES'
    },
    '13' : {
      stage_name : 'GREAT_BAY'
    },
    '14' : {
      stage_name : 'HYRULE_TEMPLE'
    },
    '15' : {
      stage_name : 'BRINSTAR_DEPTHS'
    },
    '16' : {
      stage_name : 'YOSHIS_ISLAND'
    },
    '17' : {
      stage_name : 'GREEN_GREENS'
    },
    '18' : {
      stage_name : 'FOURSIDE'
    },
    '19' : {
      stage_name : 'MUSHROOM_KINGDOM_I'
    },
    '20' : {
      stage_name : 'MUSHROOM_KINGDOM_II'
    },
    '22' : {
      stage_name : 'VENOM'
    },
    '23' : {
      stage_name : 'POKE_FLOATS'
    },
    '24' : {
      stage_name : 'BIG_BLUE'
    },
    '25' : {
      stage_name : 'ICICLE_MOUNTAIN'
    },
    '26' : {
      stage_name : 'ICETOP'
    },
    '27' : {
      stage_name : 'FLAT_ZONE'
    },

    '29' : {
      stage_name : 'YOSHIS_ISLAND_N64'
    },
    '30' : {
      stage_name : 'KONGO_JUNGLE_N64'
    }
  }
};

module.exports = config;
