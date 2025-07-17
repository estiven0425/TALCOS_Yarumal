# 🏭 talcos-express

> Backend del software **Talcos Yarumal** — API REST construida con **Express.js**, enfocada en gestión de usuarios, gestión de informes e inventario y cálculos de información.
>
> ⚙️ Este servidor **cuenta con su frontend en React**. **Express** solo provee servicios API, utilidades, vistas de estado y una organización clara del backend.

---

## 📁 Estructura del Proyecto

```bash
talcos-express/
│
├── config/           # Configuración de Sequelize y del servidor, conexión a la BD y arranque del servidor
│   └── conectionDatabase.js
│   └── config.js
│   └── db.sql
│   └── normalizePort.js
│   └── onError.js
│   └── onListening.js
│
├── controllers/      # Controladores para los modelos de Sequelize
│   └── *.js
│
├── middlewares/      # Middlewares personalizados
│   └── cookieParser.js
│   └── coors.js
│   └── errorHandler.js
│   └── jsonParser.js
│   └── logger.js
│   └── urlencodedParser.js
│
├── models/           # Modelos de Sequelize que representan las tablas de la base de datos
│   └── *.js
│
├── routes/           # Definición de rutas y endpoints para el API
│   └── *.js
│
├── uploads/           # Archivos estáticos como íconos
│   └── /icons/
│
├── utils/            # Funciones auxiliares. Aquí está la lógica de login y JWT.
│   └── login.js
│
├── views/            # Plantilla Pug para renderizar una vista simple del estado del servidor
│   └── status.pug
│
├── .eslintrc.js       # Configurador de Eslint
├── .gitignore         # Configurador de carpetas para Git
├── app.js             # Archivo principal del servidor
├── debug.pdf          # Plantilla debug para la generación de PDF
├── ecosystem.config.js  # Configuración de PM2 para producción
├── package.json        # package.JSON del servidor
├── package-lock.json   # package-lock.json del servidor
└── README.md          # Readme
```

---

## 🛠️ Comandos Disponibles

| Comando       | Descripción                                                                            |
|---------------|----------------------------------------------------------------------------------------|
| `npm start`   | Inicia el servidor usando `node ./config/config.js` (modo producción simple)           |
| `npm run dev` | Inicia el servidor con **PM2** en modo desarrollo y aplica configuración personalizada |

> 📌 En `npm run dev` se usa `cross-env` para evitar errores relacionados con `wmic` en Windows.

> ❗ Se recomienda encarecidamente usar siempre el comando `npm run dev` para tener un mayor control asistido por PM2 del servidor

---

## 📦 Dependencias

### Producción

- **express** – Framework principal para construir el servidor.
- **sequelize** – ORM para MySQL.
- **mysql2** – Driver para conectar con MySQL.
- **jsonwebtoken** – Para autenticación con JWT.
- **bcrypt** – Para hashear contraseñas.
- **cors** – Permite solicitudes entre dominios.
- **cookie-parser** – Manejo de cookies.
- **body-parser** – Procesa el cuerpo de las solicitudes.
- **http-errors** – Manejo elegante de errores HTTP.
- **morgan** – Logger de peticiones.
- **pug** – Motor de plantillas.
- **puppeteer** – Generación de PDF desde HTML usando Chromium.
- **date-fns** – Manejo de fechas.

### Desarrollo

- **cross-env** – Ayuda con variables de entorno cross-platform.
- **eslint** – Linter para mantener código limpio.

---

## 🚀 Cómo iniciar el proyecto

```bash
# Clonar repositorio
git clone https://github.com/estiven0425/TALCOS_Yarumal
cd talcos-express

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción simple
npm start
```

> 📌 Tanto el servidor **Express** como el frontend **React** se encuentran en el mismo repositorio

---

## 🔐 Autenticación

El login está implementado en `utils/`. Usa JWT y `bcrypt` para encriptar contraseñas y validar sesiones.

---

## 🧪 Vista del servidor

Visita la ruta `/verify` para renderizar una vista `pug` sencilla con el estado del servidor. Puedes modificar esta vista en `views/verify.pug`.

---

## 📬 Contacto

Si tienes dudas o quieres contribuir, no dudes en abrir un issue o enviar un pull request.

---

**Powered by TALCOS Yarumal - estiven0425 - 2025**
