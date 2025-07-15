module.exports = {
  apps: [
    {
      name: "talcos-express",
      script: "./config/config.js",
      watch: true,
      ignore_watch: ["uploads", "logs", "*.pdf", "tmp"],
      node_args: "--inspect=0.0.0.0:9229",
      env: {
        PORT: 3000,
        PM2_USE_WMIC: "false",
      },
    },
  ],
};