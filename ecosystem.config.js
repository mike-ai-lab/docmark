// PM2 Configuration for DocMark PDF Server
module.exports = {
  apps: [{
    name: 'docmark-pdf-server',
    script: './pdf-server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pdf-server-error.log',
    out_file: './logs/pdf-server-out.log',
    log_file: './logs/pdf-server-combined.log',
    time: true
  }]
};
