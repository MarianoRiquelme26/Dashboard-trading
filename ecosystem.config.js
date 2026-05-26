module.exports = {
  apps: [
    {
      name: 'trading-alerts',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
