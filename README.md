
## 📝 Descripción del Proyecto

**Nombre:** Recipe Marcos 
**Objetivo:** Sistema full-stack de gestión de recetas utilizando arquitectura MEAN (MongoDB, Express, Angular, Node.js) con un segundo cliente en React

### Problema a Resolver
Crear una plataforma centralizada e intuitiva para gestionar recetas, permitiendo a múltiples aplicaciones frontend (Angular y React) consumir la misma API REST. Esto demuestra la capacidad de crear una API robusta que puede ser consumida por diferentes tecnologías frontend sin modificaciones.

### Descripción Funcional
El sistema permite:
- **Gestión completa de recetas** (CRUD): Crear, consultar, actualizar y eliminar recetas
- **Filtrado avanzado**: Por categoría y por tipo (veganas) 
- **Paginación**: Visualizar resultados en páginas configurables
- **Validaciones**: Tanto en backend como en frontend para garantizar integridad de datos
- **Acceso multi-plataforma**: Consumo de la misma API desde Angular y React
- **Interfaz responsiva**: Utilizando Bootstrap para diseño adaptable

---

## 📊 Modelo de Datos

### Entidad: Recipe (Receta)

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| **_id** | ObjectId | Identificador único | Auto-generado por MongoDB |
| **title** | String | Nombre de la receta | Obligatorio, único, 3-100 caracteres |
| **description** | String | Descripción detallada | Obligatorio, mín. 50 caracteres |
| **category** | String | Categoría (Appetizer, Main, Dessert, etc) | Enum: múltiples opciones |
| **preparationTime** | Number | Tiempo en minutos | Obligatorio, **1-1000 minutos** |
| **difficulty** | String | Nivel (Easy/Medium/Hard) | Default: "medium" |
| **rating** | Number | Calificación de usuario | **0-5 puntos** |
| **isVegan** | Boolean | ¿Es vegana? | Default: false |
| **imageUrl** | String | URL de imagen (Unsplash) | Obligatorio para visualización |
| **createdAt** | Date | Fecha de creación | Auto-generada por MongoDB |
| **updatedAt** | Date | Fecha de última actualización | Auto-actualizada por MongoDB |

**Base de datos poblada con 22 recetas reales**, cada una con imágenes de Unsplash, listos para pruebas.

---

## 🔧 Reglas de Negocio

El sistema implementa 3 reglas de negocio críticas que se validan tanto en backend como en frontend:

### 1. **No Permitir Títulos Duplicados** ⛔
- **Descripción:** No se puede crear una receta con un título que ya existe en la base de datos
- **Validación:** Se ejecuta al crear o actualizar una receta
- **Enforcement:** En backend (controlador) y frontend (formulario reactivo)
- **Código backend:**
  ```javascript
  const existingRecipe = await Recipe.findOne({ title: recipe.title });
  if (existingRecipe) {
    throw new Error("A recipe with this title already exists");
  }
  ```
- **Respuesta HTTP:** 400 Bad Request con mensaje descriptivo

### 2. **Rango de Tiempo de Preparación (1-1000 minutos)** ⏱️
- **Descripción:** El tiempo de preparación debe estar entre 1 y 1000 minutos (mínimo 1 min, máximo ~16 horas)
- **Validación:** En el esquema Mongoose y en el controlador
- **Enforcement:** Validadores en Angular y React (maxlength, pattern)
- **Código backend:**
  ```javascript
  preparationTime: {
    type: Number,
    required: true,
    min: [1, "Preparation time must be at least 1 minute"],
    max: [1000, "Preparation time cannot exceed 1000 minutes"]
  }
  ```
- **Respuesta HTTP:** 400 Bad Request si viola el rango

### 3. **Rango de Calificación (0-5)** ⭐
- **Descripción:** La calificación (rating) debe estar entre 0 y 5 puntos
- **Validación:** En el esquema Mongoose y validadores HTML5
- **Enforcement:** Input type="number" con min/max en formularios
- **Código backend:**
  ```javascript
  rating: {
    type: Number,
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot be more than 5"],
    default: 0
  }
  ```
- **Respuesta HTTP:** 400 Bad Request si viola el rango

---

## 🏗️ Arquitectura del Proyecto

```
ProyectoFinalIntegrador/
├── backend/                          # API REST Node.js + Express
│   ├── src/
│   │   ├── models/
│   │   │   └── Recipe.js             # Esquema Mongoose
│   │   ├── controllers/
│   │   │   └── recipeController.js   # Lógica de negocio
│   │   ├── routes/
│   │   │   └── recipeRoutes.js       # Definición de endpoints
│   │   └── middlewares/
│   │       └── database.js           # Conexión MongoDB
│   ├── api/
│   │   └── index.js                  # Serverless entry (Vercel)
│   ├── index.js                      # Configuración Express principal
│   ├── seed.js                       # Script para poblar BD (22 recetas)
│   └── package.json
│
├── frontend-angular/                 # Cliente Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── listado-recetas/   # Lista y tabla de recetas
│   │   │   │   ├── detalle-receta/    # Modal con detalles
│   │   │   │   ├── formulario-receta/ # Formulario reactivo
│   │   │   │   └── navbar/            # Navegación
│   │   │   ├── models/
│   │   │   │   └── recipe.model.ts    # Interfaces TypeScript
│   │   │   ├── services/
│   │   │   │   └── recipe.service.ts  # Comunicación API
│   │   │   ├── app.component.ts       # Componente raíz
│   │   │   └── app.routes.ts          # Configuración de rutas
│   │   ├── styles.css                 # Estilos globales
│   │   └── main.ts                    # Punto de entrada
│   └── package.json
│
├── frontend-react/                   # Cliente React
│   ├── src/
│   │   ├── layout/
│   │   │   └── Navbar.tsx             # Navegación
│   │   ├── pages/
│   │   │   └── RecetasPage.tsx        # Página principal CRUD
│   │   ├── components/
│   │   │   ├── DetalleReceta.tsx      # Modal con detalles
│   │   │   └── FormularioReceta.tsx   # Formulario controlado
│   │   ├── common/
│   │   │   └── Interfaces.ts          # Tipos TypeScript
│   │   ├── services/
│   │   │   └── recipeService.ts       # Comunicación API (Fetch)
│   │   ├── App.tsx                    # Componente raíz con Routes
│   │   ├── main.tsx                   # Punto de entrada
│   │   └── index.html                 # Bootstrap CDN
│   └── package.json
│
└── README.md                         # Esta documentación
```

---

## 🔌 API REST - Endpoints Detallados

### Base URL
```
http://localhost:3000/api/v1
```

### Tabla de Endpoints Resumen

| Método | Endpoint | Descripción | Status |
|--------|----------|-------------|--------|
| **GET** | `/recipes/get/all` | Obtener todas las recetas (paginado) |  |
| **GET** | `/recipes/get/:id` | Obtener receta por ID  
| **POST** | `/recipes/post` | Crear nueva receta   
| **PATCH** | `/recipes/update/:id` | Actualizar receta   
| **DELETE** | `/recipes/delete/:id` | Eliminar receta   
| **GET** | `/recipes/category/:category` | Filtrar por categoría | 
| **GET** | `/recipes/filter/vegan` | Obtener recetas veganas  

### Documentación Detallada

#### 1️⃣ Obtener Todas las Recetas (Paginado)
```
GET /recipes/get/all?page=1&limit=10

Parámetros Query:
- page: Número de página (default: 1)
- limit: Registros por página (default: 10)

Response 200 OK:
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Pasta Carbonara",
      "description": "Classic Italian pasta dish...",
      "category": "main",
      "preparationTime": 20,
      "difficulty": "medium",
      "rating": 5,
      "isVegan": false,
      "imageUrl": "https://images.unsplash.com/...",
      "createdAt": "2026-02-13T10:30:00.000Z",
      "updatedAt": "2026-02-13T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 22,
    "pages": 3
  }
}
```

#### 2️⃣ Obtener Receta por ID

GET /recipes/get/507f1f77bcf86cd799439011

Response 200 OK:
{
  "success": true,
  "data": { recipe object }
}

Response 404 Not Found:
{
  "success": false,
  "message": "Recipe not found"
}


#### 3️⃣ Crear Nueva Receta

POST /recipes/post
Content-Type: application/json

Request Body:
{
  "title": "Margherita Pizza",
  "description": "Traditional Italian pizza with fresh basil, mozzarella, and tomato sauce",
  "category": "main",
  "preparationTime": 30,
  "difficulty": "easy",
  "rating": 4,
  "isVegan": false,
  "imageUrl": "https://images.unsplash.com/photo-..."
}

Response 201 Created:
{
  "success": true,
  "message": "Recipe created successfully",
  "data": { recipe object with _id }
}

Response 400 Bad Request:
{
  "success": false,
  "message": "Recipe with title 'Margherita Pizza' already exists" 
    // o mensaje de otro error de validación
}
```

#### 4️⃣ Actualizar Receta
```
PATCH /recipes/update/507f1f77bcf86cd799439011
Content-Type: application/json

Request Body (solo los campos a actualizar):
{
  "rating": 4.5,
  "preparationTime": 25
}

Response 200 OK:
{
  "success": true,
  "message": "Recipe updated successfully",
  "data": { updated recipe object }
}

Response 400 Bad Request (violación de reglas):
{
  "success": false,
  "message": "Preparation time must be between 1 and 1000 minutes"
}

Response 404 Not Found:
{
  "success": false,
  "message": "Recipe not found"
}
```

#### 5️⃣ Eliminar Receta
```
DELETE /recipes/delete/507f1f77bcf86cd799439011

Response 200 OK:
{
  "success": true,
  "message": "Recipe deleted successfully",
  "data": { deleted recipe object }
}

Response 404 Not Found:
{
  "success": false,
  "message": "Recipe not found"
}
```

#### 6️⃣ Obtener Recetas por Categoría (Paginado)
```
GET /recipes/category/main?page=1&limit=10

Categorías válidas: appetizer, main, dessert, beverage, snack

Response 200 OK:
{
  "success": true,
  "data": [{ recipe objects }],
  "pagination": { page, limit, total, pages }
}

Response 404 Not Found:
{
  "success": false,
  "message": "No recipes found in this category"
}
```

#### 7️⃣ Obtener Recetas Veganas (Paginado)
```
GET /recipes/filter/vegan?page=1&limit=10

Response 200 OK:
{
  "success": true,
  "data": [{ recipe objects with isVegan: true }],
  "pagination": { page, limit, total, pages }
}
```

---

## � Tecnologías Utilizadas

### Backend
- **Node.js** v18+ - Runtime JavaScript
- **Express** v4.18+ - Framework HTTP
- **MongoDB** - Base de datos NoSQL
- **Mongoose** v7+ - ODM para MongoDB
- **CORS** - Permitir peticiones cross-origin
- **Dotenv** - Variables de ambiente

### Frontend Angular
- **Angular** v17+ - Framework SPA
- **TypeScript** v5+ - Lenguaje tipado
- **RxJS** v7+ - Programación reactiva
- **Bootstrap** v5+ - Framework CSS
- **Angular Router** - Sistema de rutas
- **Reactive Forms** - Formularios avanzados

### Frontend React
- **React** v18+ - Librería UI
- **TypeScript** v5+ - Lenguaje tipado
- **React Router** v7+ - Sistema de rutas
- **Vite** - Bundler rápido
- **Bootstrap** v5+ (CDN) - Framework CSS
- **Fetch API** - Comunicación HTTP

---

## 🚀 Instalación y Ejecución

### 🔧 Backend (Node.js + Express + MongoDB)

**1. Instalar dependencias:**

cd backend
npm install
```

**2. Configurar base de datos:**

 La BD se configura en src/config/database.js
 Por defecto: MongoDB local en mongodb://localhost:27017/recipes


**3. Poblar datos de prueba (22 recetas):**

npm run seed
# Ejecuta backend/seed.js y carga 22 recetas con imágenes


**4. Iniciar el servidor:**

npm run dev    # Con nodemon (recargas automáticas)
o
npm start      # Modo producción


✅ Backend corriendo en: `http://localhost:3000`

---

### 🎨 Frontend Angular

**1. Instalar dependencias:**

cd ../frontend-angular
npm install


**2. Iniciar servidor de desarrollo:**

ng serve --open
o
npm start


**✅ Angular corriendo en:** `http://localhost:4200`

**Características:**
- ✅ Lista de recetas con tabla (Bootstrap)
- ✅ Formulario reactivo para crear/editar
- ✅ Modal para ver detalles
- ✅ Filtros por categoría y veganas
- ✅ Paginación
- ✅ Loaders y spinners
- ✅ Mensajes de éxito/error
- ✅ Validaciones en formulario

---

### ⚛️ Frontend React

**1. Instalar dependencias:**

cd ../frontend-react
npm install


**2. Iniciar servidor de desarrollo:**

npm run dev
o
npm start
```

**✅ React corriendo en:** `http://localhost:5174`

**Características:**
- ✅ Listado de recetas con tabla (Bootstrap)
- ✅ Formulario controlado para crear/editar
- ✅ Modal overlay para ver detalles
- ✅ Filtros por categoría y veganas
- ✅ Paginación programática
- ✅ Loaders y spinners
- ✅ Mensajes de éxito/error
- ✅ Validaciones en formulario

---

## 📦 Datos de Prueba

La base de datos se puebla con **22 recetas reales** 

**Ejemplos de recetas incluidas:**
- Pasta Carbonara (Italian)
- Chocolate Cake (Dessert)
- Caesar Salad (Appetizer)
- Grilled Salmon (Main)
- Vegan Buddha Bowl (Vegan Main)
- Margarita Pizza (Main)
- Tiramisu (Dessert)
...y 15 más

Cada receta incluye:
- Título único
- Descripción completa
- Categoría
- Tiempo de preparación (1-1000 min)
- Dificultad (easy/medium/hard)
- Rating (0-5)
- Indicador vegano
- Imagen real de Unsplash

---

## 🧪 Validación y Testing

### Con Postman
Importar y probar todos los endpoints:
1. Obtener todas las recetas (GET)
2. Obtener receta por ID (GET)
3. Crear nueva receta (POST) - Probar duplicados
4. Actualizar receta (PATCH) - Probar rangos
5. Eliminar receta (DELETE)
6. Filtrar por categoría (GET)
7. Filtrar veganas (GET)

### Con Angular
- Navegar a http://localhost:4200
- Probar crear, editar, eliminar recetas
- Verificar validaciones en formulario
- Verificar filtros y paginación

### Con React
- Navegar a http://localhost:5174
- Probar crear, editar, eliminar recetas
- Verificar validaciones en formulario
- Verificar filtros y paginación

---

## 📋 Checklist del Proyecto

**FASE 1 - Backend**
- [x] Setup Node.js + Express
- [x] Conexión MongoDB (local/Atlas)
- [x] Modelo Mongoose con validaciones
- [x] Controladores con lógica de negocio
- [x] Rutas CRUD completas
- [x] Paginación implementada
- [x] Filtros (categoría, veganas)
- [x] Validaciones y manejo de errores
- [x] Base de datos poblada (22 registros)
- [x] Endpoints testeados con Postman

**FASE 2 - Frontend Angular**
- [x] Setup Angular v17+ con TypeScript
- [x] Servicios para comunicación API
- [x] Componentes separados (list, detail, form, navbar)
- [x] Formularios reactivos con validaciones
- [x] Consumo completo de API (CRUD)
- [x] Sistema de rutas
- [x] Interfaz Bootstrap bien estructurada
- [x] Filtros y paginación funcionales
- [x] Loaders y spinners
- [x] Mensajes de éxito/error

**FASE 3 - Frontend React**
- [x] Setup React v18+ con TypeScript + Vite
- [x] Servicios con Fetch API
- [x] Componentes funcionales con Hooks
- [x] Formularios controlados con validaciones
- [x] Consumo completo de API (CRUD)
- [x] React Router v7 para navegación
- [x] Interfaz Bootstrap (CDN)
- [x] Filtros y paginación funcionales
- [x] Loaders y spinners
- [x] Mensajes de éxito/error

**EXTRA**
- [x] Estilos personalizados mínimos
- [x] Diseño consistente entre Angular y React
- [x] TypeScript en todo el stack

---

## 🌐 URLs de Ejecución

### 🏠 Local Development
| Aplicación | URL |
|------------|-----|
| **API REST Backend** | `http://localhost:3000` |
| **API Documentation** | `http://localhost:3000/api/v1/recipes/documentation` |
| **Frontend Angular** | `http://localhost:4200` |
| **Frontend React** | `http://localhost:5174` |

### 🚀 Producción - Vercel Deployment
| Aplicación | URL |
|------------|-----|
| **API REST Backend** | https://proyectofinalintegradorbackend.vercel.app/ |
| **Frontend Angular** | https://proyectofinalintegradorangular.vercel.app/recetas |
| **Frontend React** | https://proyecto-final-integradorreact.vercel.app/ |

**Nota:** Todos los servicios están completamente funcionales en producción con:
- ✅ Backend conectado a MongoDB Atlas
- ✅ Angular y React consumiendo la API remota
- ✅ CRUD, filtros y paginación operacionales
- ✅ Validaciones de reglas de negocio aplicadas

