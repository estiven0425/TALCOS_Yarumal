// noinspection JSUnusedLocalSymbols

const { exec } = require("child_process");

const fs = require("fs");
const path = require("path");

const DB_NAME = "talcos_yarumal";
const DB_USER = "TAYA";
const DB_PASS = "TAYA-0000";

const fecha = new Date().toISOString().slice(0, 10);

const outputPath = path.join(__dirname, "backups", `backup-${fecha}.sql`);

if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath));
}

const comando = `mysqldump -u${DB_USER} -p${DB_PASS} ${DB_NAME} > "${outputPath}"`;

// eslint-disable-next-line
exec(comando, (error, stdout, stderr) => {
  if (error) {
    console.error("Error generando backup:", error);
    return;
  }
  console.log(`Backup creado: ${outputPath}`);
});
