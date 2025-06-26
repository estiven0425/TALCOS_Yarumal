const express = require("express");
const path = require("path");
const os = require("os");
const app = express();

// Establecer motor de vistas
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Importar middlewares
const cors = require("./middlewares/cors");
const logger = require("./middlewares/logger");
const jsonParser = require("./middlewares/jsonParser");
const urlencodedParser = require("./middlewares/urlencodedParser");
const cookieParser = require("./middlewares/cookieParser");
const {
  notFoundHandler,
  globalErrorHandler,
} = require("./middlewares/errorHandler");

// Importar rutas
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
const informesIniciaeslRoutes = require("./routes/informesInicialesRoutes");
const novedadesRoutes = require("./routes/novedadesRoutes");
const controlesCalidadRoutes = require("./routes/controlesCalidadRoutes");
const informesFinalesRoutes = require("./routes/informesFinalesRoutes");
const mensajesRoutes = require("./routes/mensajesRoutes");
const registrosRoutes = require("./routes/registrosRoutes");
const registrosApRoutes = require("./routes/registrosApRoutes");
const inventarioApRoutes = require("./routes/inventarioApRoutes");
const presupuestoComercialRoutes = require("./routes/presupuestoComercialRoutes");
const despachosRoutes = require("./routes/despachosRoutes");
const login = require("./utils/login");
const pdfRoutes = require("./routes/pdfRoutes");
const monitoreoRoutes = require("./routes/monitoreosRoutes");

// Usar middlewares
app.use(cors);
app.use(logger);
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cookieParser);

// Usar rutas
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
app.use("/informes_iniciales", informesIniciaeslRoutes);
app.use("/novedades", novedadesRoutes);
app.use("/controles_calidad", controlesCalidadRoutes);
app.use("/informes_finales", informesFinalesRoutes);
app.use("/mensajes", mensajesRoutes);
app.use("/registros", registrosRoutes);
app.use("/registros_ap", registrosApRoutes);
app.use("/inventario_ap", inventarioApRoutes);
app.use("/presupuesto_comercial", presupuestoComercialRoutes);
app.use("/despachos", despachosRoutes);
app.use("/login", login);
app.use("/pdf", pdfRoutes);
app.use("/monitoreo", monitoreoRoutes);

// Ruta para archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ruta de verificación
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

// Usar middlewares de errores
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
