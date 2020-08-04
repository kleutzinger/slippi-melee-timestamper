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
format (separated by newlines): `FRAME_NUMBER,PATH`  

example timestamps.txt:  
```
1924,C:\Users\kevin\Documents\Slippi\Game_20200803T161211.slp
190,C:\Users\kevin\Documents\Slippi\Game_20200803T161502.slp
```