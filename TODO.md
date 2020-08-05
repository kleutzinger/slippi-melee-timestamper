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
- [ ] make project clippi-valid ouptut files?
- [x] move button to AHK
- - [ ] AHK bound to gamecube?? (dpad down)
- [x] get it to launch dolphin (AppData\Roaming\Slippi Desktop App\dolphin\Dolphin.exe')
- [x] get it to launch slippi replays
- [x] skip to that frame specified in the file
- [x] accept POST request to start a timestamp (webpage of links/info?)
- [x] GET request to /recent starts most recent timestamp.txt entry
- [ ] smarter timing on saving replays?
  - webpage with buttons to save last 10 sec or 5 sec or minute??
- [ ] view replay.txt/launch replays from browser window
  - /browse
  - [ ] allow modification here
- [ ] add meaningful metadata to distinguish saved timestamps quickly
- [ ] after the game add a popup to ask for info on what each timestamp was about

### Important Links
- http://localhost:7789/timestamp  
- http://localhost:7789/recent  
- https://github.com/project-slippi/slippi-wiki/blob/master/COMM_SPEC.md

### Down the line:
- [ ] output as youtube video
- [ ] auto upload/rename video
- [ ] reposition / preview different timestamp start/end