# Slippi melee timestamper
Press a hotkey on the keyboard to save a timestamp of where in a melee game you currently are.  
this would allow you to go back and find cool combos or moments you've manually saved  


### What we already have:
- auto music player
- listening for new melee
- - access to frame data each frame



### Add these:
- [x] listen for an input to make bookmark (button in html)
- - [x] get the current frame of melee game
- - [x] write bookmark (and frame data) to text file?
- - [x] come up with output format
- - - timestamps.txt => 22222,path/path/game.slp
- [x] listen for POST/GET requests on server
- [x] look into processing text files for Slippi Launcher (launch replay at that timestamp)
- [x] make project clippi-valid ouptut files? (on the fly)
- [x] move button to AHK
- - [ ] AHK bound to gamecube?? (dpad down)
- [x] get it to launch dolphin (AppData\Roaming\Slippi Desktop App\dolphin\Dolphin.exe')
- [x] get it to launch slippi replays
- [x] skip to that frame specified in the file
- [x] accept POST request to start a timestamp (webpage of links/info?)
- [x] GET request to /recent starts most recent timestamp.txt entry
- [ ] smarter timing on saving replays?
  - webpage with buttons to save last 10 sec or 5 sec or minute??
- [x] view replay.txt/launch replays from browser window
  - /browse
  - [x] `getAllTimestampArr() => [ts1,ts2,...]`
  - [ ] allow modification here
  - [x] "Generate Timestamp" button
- [x] add meaningful metadata to distinguish saved timestamps quickly
- [?] prune frame data some
- [x] make realtime or at least reload on newtimestamp
- [ ] after the game add a popup to ask for info on what each timestamp was about
- [ ] investigate rewinding to a point BEFORE startFrame
-  -  [ ] "play game from beginning?"
- [x] use pugJS /browse rendering
- [ ] you can leave most(all) of the gamestate inside the slp file
- [ ] figure out random high cpu usage on idle
- [?] stage pictures with stock icons to distinguish timestamps visually
- [ ] freeze timestmap json specification
- [x] accept that users will have to install node to use this
- good timestamp metadatas:
-  - [ ] `last_stock_lost: frame_no` (array?)
-  - [ ] slippi tags/connect codes
-  - [ ] date (of ingametime or irl clock? (same thing??))
- [x] ```function frame_to_igt(frame_count) {}```
### Important Links
- http://localhost:7789/timestamp  
- http://localhost:7789/recent  
- http://localhost:7789/browse  
- https://github.com/project-slippi/slippi-wiki/blob/master/COMM_SPEC.md

### Down the line:
- [ ] output as youtube video
- [ ] auto upload/rename video
- [ ] reposition / preview different timestamp start/end