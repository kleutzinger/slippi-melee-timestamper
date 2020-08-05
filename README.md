click the button to save your place in melee history!  
work in progress.  
read the TODO.md to see some stuff it's got done  
to run:  
### Requirements:
- [node+npm](https://www.npmjs.com/get-npm)
- [project slippi](https://slippi.gg/netplay)
### Running:
```
npm install
node server.js
```
during slippi game, visit in browser (or send GET request)  
`http://localhost:7789/timestamp`  
your timestamp will be appended to `timestamps.txt`  
play your most recently-saved replay by visiting:
`http://localhost:7789/recent`  
example timestamps.txt:  
```
{"startFrame":588,"endFrame":888,"ts_frame":888,"path":"C:\\Users\\kevin\\Documents\\Slippi\\Game_20200804T210400.slp"}
{"startFrame":284,"endFrame":584,"ts_frame":584,"path":"C:\\Users\\kevin\\Documents\\Slippi\\Game_20200804T211025.slp"}
```