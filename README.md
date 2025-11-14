# Frame My Path

Una galería interactiva y elegante para exhibir certificaciones y logros profesionales. **Frame My Path** combina diseño minimalista con funcionalidad intuitiva para crear un muro digital que celebra tu dedicación al aprendizaje continuo.

## ✨ Características

- **Galería Responsiva**: Diseño adaptable que se ve impecable en dispositivos de cualquier tamaño
- **Filtrado por Institución**: Organiza y explora tus certificaciones por institución educativa
- **Paginación Inteligente**: Navegación fluida entre páginas con transiciones elegantes
- **Tema Dual**: Soporte completo para modo claro y oscuro
- **Diseño Moderno**: Interfaz limpia con colores tierra y tipografía serif profesional

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 16+
- pnpm (o npm/yarn como alternativa)

### Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/RoneyVaLo/frame-my-path.git
cd frame-my-path
```

2. Instala las dependencias:

```bash
pnpm install
```

3. Inicia el servidor de desarrollo:

```bash
pnpm dev
```

4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador

## 🏗️ Estructura del Proyecto

```
frame-my-path/
├── src/
│   ├── components/
│   │   ├── CertificateWall.jsx      # Componente principal de galería
│   │   ├── CertificateFrame.jsx     # Tarjeta individual de certificado
│   │   ├── Loader.jsx               # Componente de carga
│   │   └── ui/                      # Componentes reutilizables
│   │       ├── Button.jsx
│   │       ├── Dialog.jsx
│   │       └── Select.jsx
│   ├── assets/
│   │   └── certificates.json        # Base de datos de certificaciones
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/                           # Imágenes de certificados
├── vite.config.js
├── eslint.config.js
└── package.json
```

## 📋 Configuración de Certificaciones

Edita el archivo `src/assets/certificates.json` para agregar tus certificaciones:

```json
{
  "id": 1,
  "title": "Nombre del Certificado",
  "institution": "Institución Emisora",
  "year": "2024",
  "image": "/nombre-imagen.webp"
}
```

**Campos requeridos:**

- `id`: Identificador único
- `title`: Nombre del certificado
- `institution`: Institución que lo emite
- `year`: Año de obtención
- `image`: Ruta relativa a la imagen (colocada en `/public`)

## 🛠️ Tecnologías

- **React 19** - Librería de interfaz de usuario
- **Vite 7** - Empaquetador y servidor de desarrollo
- **Tailwind CSS 4** - Framework de estilos utilitarios
- **Lucide React** - Iconografía moderna

## 📦 Scripts Disponibles

```bash
pnpm dev       # Inicia servidor de desarrollo
pnpm build     # Compila para producción
pnpm lint      # Ejecuta ESLint
pnpm preview   # Previsualiza la compilación
```

## 🎨 Personalización de Estilos

El proyecto utiliza Tailwind CSS con un sistema de temas personalizado. Los colores y variables de tema se definen en `src/index.css`:

- **Colores Base**: Paleta de tierra (beige, marrón, blanco)
- **Modo Oscuro**: Automáticamente activado según preferencias del sistema
- **Tipografía**: Serif para encabezados, sans-serif para contenido

## 📱 Características Principales

### Galería Inteligente

La galería muestra hasta 4 certificados por página con navegación fluida entre ellas.

### Filtrado Dinámico

Filtra certificados por institución educativa. Al cambiar el filtro, la paginación se reinicia automáticamente.

### Indicador de Carga

Transiciones suaves de 1 segundo al cambiar de página para una experiencia visual mejorada.

## 🔍 Mejores Prácticas

- Los certificados se ordenan por año de forma descendente (más recientes primero)
- El filtro "Todas las instituciones" muestra la colección completa
- Las imágenes se recomiendan en formato WebP para optimizar rendimiento

## 👤 Autor

**Roney Valdelomar López**

---

Hecho con dedicación y código limpio. Frame My Path es tu muro digital de logros.
