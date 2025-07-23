# 🏭 talcos-react

> Frontend del software **Talcos Yarumal** — Página web construida con **React.js** con **Vite**, enfocada en gestión de usuarios, gestión de informes e inventario y cálculos de información.
>
> ⚙️ Esta página web **cuenta con su backend en Express**. **React** solo provee la interfaz de usuario, navegación, cálculos y un sistema modular.

---

## 📁 Estructura del Proyecto

```bash
talcos-express/
│
├── public/           # Íconos del software
│   └── *.svg
│
├── src/              # Archivos y carpetas del software
│   └── assets/       # Archivos privados como el fondo
│   │   └── *.jsx
│   └── components/   # Componentes JSX
│   │   └── styles/   # Estilos modulares
│   │   │   └── *.module.css
│   │   └── *.jsx
│   └── pages/       # Páginas JSX
│   │   └── styles/   # Estilos modulares
│   │   │   └── *.module.css
│   │   └── *.jsx
│   └── styles/       # Estilos generales
│   │   └── *.css
│   └── utils/       # Utilidades y APIS
│   │   └── *.jsx
│   └── Main.jsx       # Archivo principal
├── .env            # Variables de entorno
├── .gitignore         # Configurador de carpetas para Git
├── .eslintrc.js       # Configurador de Eslint
├── index.html          # Archivo principal de la página web
├── package.json        # package.JSON del software
├── package-lock.json   # package-lock.json del software
├── README.md          # Readme
└── vite.config.js     # Archivo de configuración de Vite
```

---

## 🛠️ Comandos Disponibles

| Comando           | Descripción                                                                   |
|-------------------|-------------------------------------------------------------------------------|
| `npm run predev`  | Ejecuta un script que obtiene la IP local y la imprime en consola             |
| `npm run dev`     | Inicia el proyecto en modo desarrollo con **Vite**                            |
| `npm run build`   | Genera una versión optimizada para producción del proyecto React              |
| `npm run preview` | Sirve localmente la build generada para verificar su comportamiento final     |
| `npm run lint`    | Ejecuta ESLint sobre el código fuente para detectar errores o malas prácticas |

> 📌 Se recomienda ejecutar `npm run predev` antes de `dev` si deseas conocer la IP local del servidor (útil para pruebas en red local o dispositivos móviles).

---

## 📦 Dependencias

### Producción

- **react** – Librería principal para construir la interfaz.
- **react-dom** – Entrada del DOM para React.
- **react-router-dom** – Navegación y rutas.
- **axios** – Cliente HTTP para consumir el backend Express.
- **bootstrap** – Framework CSS responsivo.
- **bootstrap-icons** – Conjunto de íconos oficiales de Bootstrap.
- **date-fns** – Librería de fechas moderna y funcional.
- **framer-motion** – Animaciones fluidas y declarativas en React.
- **jwt-decode** – Decodifica tokens JWT sin necesidad de validarlos.
- **prop-types** – Valida los props de los componentes React.

### Desarrollo

- **vite** – Herramienta de construcción ultrarrápida para proyectos modernos con React.
- **@vitejs/plugin-react** – Plugin oficial de React para Vite.
- **eslint** – Analizador de código estático.
- **@eslint/js** – Configuración de reglas base de ESLint.
- **eslint-plugin-react** – Reglas adicionales específicas para React.
- **eslint-plugin-react-hooks** – Reglas para el uso correcto de hooks.
- **eslint-plugin-react-refresh** – Soporte para hot reloading.
- **@types/react / @types/react-dom** – Tipado para usar con TypeScript o validaciones en entornos mixtos.
- **globals** – Lista de variables globales conocida para mejorar análisis estático.

---

## 🚀 Cómo iniciar el proyecto

```bash
# Clonar el repositorio
git clone https://github.com/estiven0425/TALCOS_Yarumal
cd talcos-react

# Instalar dependencias
npm install

# Obtener IP local (opcional)
npm run predev

# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Servir la versión de producción localmente
npm run preview
```

---

## 🌐 Comunicación con el Backend

Este proyecto se conecta al backend desarrollado en **Express**, ubicado en el mismo repositorio bajo la carpeta `talcos-express/`. Las peticiones se hacen usando `axios` y gestionan autenticación, reportes, novedades y más.

---

## ✅ Linter y buenas prácticas

Para mantener un código limpio y consistente se utiliza **ESLint** con reglas específicas para React y sus hooks. Puedes verificar errores potenciales o estilos inconsistentes usando:

```bash
npm run lint
```

Puedes personalizar las reglas en el archivo `.eslintrc.js`.

---

## 📬 Contacto

Si tienes dudas, sugerencias o deseas contribuir, puedes abrir un issue o enviar un pull request.

---

**© 2025 - TALCOS Yarumal - [estiven0425](https://github.com/estiven0425)**  
