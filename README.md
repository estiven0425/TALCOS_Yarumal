# TALCOS Yarumal

> Sistema de gestión para **TALCOS Yarumal**  
> Plataforma web desarrollada con **React.js** en el frontend y **Express.js** en el backend.  
> Permite la gestión de usuarios, informes de producción, paros de molino, inventario y generación de reportes PDF.

---

## 🧱 Tecnologías utilizadas

| Área          | Tecnología                                                                             |
|---------------|----------------------------------------------------------------------------------------|
| Frontend      | [React.js](https://reactjs.org/)                                                       |
| Backend       | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)                   |
| Base de datos | [MySQL](https://www.mysql.com/) gestionado con [Sequelize ORM](https://sequelize.org/) |
| Estilos       | CSS Modules + Bootstrap Icons                                                          |
| Autenticación | JWT (JSON Web Tokens), bcrypt                                                          |
| PDF Reports   | Puppeteer + plantillas HTML                                                            |

---

## 📁 Estructura del Repositorio

```bash
TALCOS_Yarumal/
│
├── talcos-express/   # Backend en Express
│   └── README.md     # Documentación específica del backend
│
├── talcos-react/     # Frontend en React con Vite
│   └── README.md     # Documentación específica del frontend
│
├── .gitignore
└── README.md         # <--- ESTE ARCHIVO (documentación general)
```

---

## 🚀 Instalación y ejecución del proyecto completo

### 🔧 1. Clonar el repositorio

```bash
git clone https://github.com/estiven0425/TALCOS_Yarumal.git
cd TALCOS_Yarumal
```

### 🖥️ 2. Backend (Express)

```bash
cd talcos-express
npm install

# Ejecutar en desarrollo con PM2
npm run dev

# O ejecutar en modo producción básico
npm start
```

### 🌐 3. Frontend (React)

En otra terminal:

```bash
cd talcos-react
npm install

# Obtener IP local (opcional, para debug en red local)
npm run predev

# Iniciar en desarrollo
npm run dev
```

> 📌 Ambos servicios deben ejecutarse simultáneamente.

---

## 🔐 Autenticación

El sistema utiliza autenticación con JWT:

- El backend se encarga de generar y verificar tokens.
- El frontend guarda el token en `localStorage` y lo incluye en cada petición segura con `axios`.

---

## 🧪 Generación de reportes

Desde el frontend se puede solicitar la generación de reportes en formato PDF, los cuales:

- Se renderizan en HTML.
- Se convierten a PDF usando **Puppeteer** en el backend.
- Incluyen encabezados personalizados, fecha formateada con `date-fns`, y contenido dinámico enviado desde React.

---

## 📬 Contacto y soporte

Este proyecto fue desarrollado por **estiven0425** con mucha pasión y dolores de cabeza.  
Si tienes preguntas, sugerencias o quieres colaborar:

- Abre un [issue](https://github.com/estiven0425/TALCOS_Yarumal/issues)
- O crea un Pull Request

---

**© 2025 - TALCOS Yarumal - [estiven0425](https://github.com/estiven0425)**  
