#!/bin/bash

/usr/local/share/node-v12.14.1-linux-x64/bin/pm2 stop website-server
/usr/local/share/node-v12.14.1-linux-x64/bin/pm2 delete website-server
/usr/local/share/node-v12.14.1-linux-x64/bin/pm2 start /data/node/website-server/app.js --name=website-server --log-date-format="YYYY-MM-DD HH:mm Z" -o /data/logs/pm2/website-server.log -e /data/logs/pm2/website-server.err
