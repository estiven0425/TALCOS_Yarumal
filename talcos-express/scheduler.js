// noinspection JSUnusedLocalSymbols

const { exec } = require("child_process");

const cron = require("node-cron");

cron.schedule("0 6 */3 * *", () => {
  // eslint-disable-next-line
  exec("node backup.js", (error, stdout, stderr) => {
    if (error) {
      console.error("Error ejecutando backup programado:", error);
    } else {
      console.log("Backup automático completado.");
    }
  });
});
