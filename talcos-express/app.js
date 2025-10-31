const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const path = require("path");
const os = require("os");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const cors = require("./middlewares/cors");
const logger = require("./middlewares/logger");
const jsonParser = require("./middlewares/jsonParser");
const urlencodedParser = require("./middlewares/urlencodedParser");
const cookieParser = require("./middlewares/cookieParser");
const {
  notFoundHandler,
  globalErrorHandler,
} = require("./middlewares/errorHandler");

const perfilesRoutes = require("./routes/perfilesRoutes");
const molinosRoutes = require("./routes/molinosRoutes");
const molinosApRoutes = require("./routes/molinosApRoutes");
const bultosRoutes = require("./routes/bultosRoutes");
const turnosRoutes = require("./routes/turnosRoutes");
const referenciasRoutes = require("./routes/referenciasRoutes");
const productosRechazadosRoutes = require("./routes/productosRechazadosRoutes");
const materiasPrimasRoutes = require("./routes/materiasPrimasRoutes");
const bobCatsRoutes = require("./routes/bobCatsRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const informesInicialesRoutes = require("./routes/informesInicialesRoutes");
const novedadesRoutes = require("./routes/novedadesRoutes");
const controlesCalidadRoutes = require("./routes/controlesCalidadRoutes");
const informesFinalesRoutes = require("./routes/informesFinalesRoutes");
const mensajesRoutes = require("./routes/mensajesRoutes");
const registrosRoutes = require("./routes/registrosRoutes");
const registrosApRoutes = require("./routes/registrosApRoutes");
const inventarioApRoutes = require("./routes/inventarioApRoutes");
const presupuestoComercialRoutes = require("./routes/presupuestoComercialRoutes");
const despachoComercialRoutes = require("./routes/despachoComercialRoutes");
const despachosRoutes = require("./routes/despachosRoutes");
const login = require("./utils/login");
const pdfRoutes = require("./routes/pdfRoutes");
const monitoreoRoutes = require("./routes/monitoreosRoutes");
const parosRoutes = require("./routes/parosRoutes");
const { networkInterfaces } = require("os");

app.use(cors);
app.use(logger);
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cookieParser);

app.use("/perfiles", perfilesRoutes);
app.use("/molinos", molinosRoutes);
app.use("/molinos_ap", molinosApRoutes);
app.use("/bultos", bultosRoutes);
app.use("/turnos", turnosRoutes);
app.use("/referencias", referenciasRoutes);
app.use("/productos_rechazados", productosRechazadosRoutes);
app.use("/materias_primas", materiasPrimasRoutes);
app.use("/bob_cats", bobCatsRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/informes_iniciales", informesInicialesRoutes);
app.use("/novedades", novedadesRoutes);
app.use("/controles_calidad", controlesCalidadRoutes);
app.use("/informes_finales", informesFinalesRoutes);
app.use("/mensajes", mensajesRoutes);
app.use("/registros", registrosRoutes);
app.use("/registros_ap", registrosApRoutes);
app.use("/inventario_ap", inventarioApRoutes);
app.use("/presupuestos_comerciales", presupuestoComercialRoutes);
app.use("/despachos_comerciales", despachoComercialRoutes);
app.use("/despachos", despachosRoutes);
app.use("/login", login);
app.use("/pdf", pdfRoutes);
app.use("/monitoreo", monitoreoRoutes);
app.use("/paros", parosRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/verify", (req, res) => {
  const serverStatus = {
    message: "Servidor funcionando correctamente",
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    loadAverage: os.loadavg(),
    freeMemory: os.freemem(),
    totalMemory: os.totalmem(),
    cpus: os.cpus().length,
  };
  res.render("verify", serverStatus);
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

function getLocalIP() {
  const interfaces = networkInterfaces();

  for (const [name, ifaceList] of Object.entries(interfaces)) {
    if (!name.toLowerCase().includes("wi-fi")) continue;

    for (const iface of ifaceList) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return "127.0.0.1";
}

const HOST = getLocalIP();

http.createServer(app).listen(PORT, HOST, () => {
  // noinspection HttpUrlsUsage
  console.log(`Servidor disponible en http://${HOST}:${PORT}`);
});

module.exports = app;
