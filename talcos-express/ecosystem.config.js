module.exports = {
  apps: [
    {
      name: "talcos-express",
      script: "./config/config.js",
      watch: true,
      ignore_watch: ["uploads", "logs", "*.pdf", "tmp"],
      env: {
        PORT: 3000,
      },
    },
  ],
};
