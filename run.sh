#!/bin/bash

pm2 stop website-server
pm2 delete website-server
pm2 start /data/node/website-server/app.js --name=website-server -- --NODE_ENV=pro --log-date-format="YYYY-MM-DD HH:mm Z" -o /data/logs/pm2/website-server.log -e /data/logs/pm2/website-server.err
