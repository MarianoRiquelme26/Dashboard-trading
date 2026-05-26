#!/bin/bash
echo "Setting up Trading Alerts on Lubuntu..."
sudo apt-get update
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
echo "Setup complete!"
