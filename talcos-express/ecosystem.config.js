module.exports = {
  apps: [
    {
      name: "talcos-express",
      script: "./config/config.js",
      watch: true,
      env: {
        PORT: 3000,
      },
    },
  ],
};
