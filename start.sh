#!/bin/bash

# Start the http-server in the background
npx http-server &

# Start ngrok in the background, allowing some time for http-server to start
sleep 2
ngrok http 8080 > /dev/null &
sleep 5

# Extract the ngrok URL from the ngrok API
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

# Pass the ngrok URL to the TypeScript script as an environment variable
export NGROK_URL
npx ts-node update-feed.ts

# Commit and push the updated RSS feed to GitHub
git add rss.xml
git commit -m "Feed me"
git push
