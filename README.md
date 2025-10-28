## 🚀 Plataforma de Cursos en Línea (ADWEB)

### 📚 Descripción General del Proyecto

Este repositorio contiene el código fuente de una **Plataforma Web para Cursos en Línea**, desarrollada como proyecto principal de la asignatura **Aplicaciones para el Desarrollo Web (ADWEB)**.

El objetivo central de la aplicación es proporcionar un **entorno robusto y escalable** que facilite la **gestión de contenido educativo**, la inscripción de usuarios y el **seguimiento del progreso** de los estudiantes en diversos cursos.

La plataforma está diseñada sobre una **arquitectura de múltiples roles** para asegurar una separación clara de responsabilidades y funcionalidades entre sus usuarios.

-----

### ✨ Características Principales

La aplicación ofrece las siguientes funcionalidades clave:

  * **Gestión de Cursos:** Implementación completa de operaciones **CRUD** (Creación, Edición, Eliminación) para cursos, módulos y lecciones.
  * **Múltiples Roles de Usuario:** Diferenciación de permisos entre **Administradores** (gestión del sitio) y **Usuarios Estándar** (Estudiantes).
  * **Panel de Administración:** Una interfaz **dedicada** para la gestión del sitio, control de usuarios y administración de contenido.
  * **Autenticación Segura:** Sistema de **Registro** e **Inicio de Sesión** seguro para todos los usuarios.
  * **Inscripción a Cursos:** Los usuarios tienen la capacidad de **matricularse** en cualquier curso disponible.
  * **Seguimiento de Progreso:** Funcionalidad para **marcar lecciones como completadas** y registrar el avance del estudiante.

-----

### 🔑 Roles y Credenciales de Acceso

Para el correcto funcionamiento y las pruebas en la plataforma, existen dos roles principales con diferentes niveles de acceso:

| Rol | Funcionalidad Principal | Acciones Permitidas |
| :--- | :--- | :--- |
| **ADMINISTRADOR** | **Gestión total de la plataforma y el contenido.** | Crear, editar, eliminar cursos y lecciones; gestionar usuarios; acceder a métricas y estadísticas. |
| **USUARIO ESTÁNDAR** | **Consumo del contenido educativo.** | Registrarse, iniciar sesión, inscribirse a cursos, visualizar lecciones, marcar progreso. |

-----

### 💻 Tecnologías Utilizadas

*Este proyecto fue desarrollado utilizando el framework Vue.js 3 y se apoya en una arquitectura Serverless con la plataforma de Google Firebase.*


| Categoría              | Tecnología              | Uso Principal                                                                 |
|------------------------|-------------------------|-------------------------------------------------------------------------------|
| Framework Frontend     | Vue.js 3 (CLI)          | Desarrollo de la Interfaz de Usuario (SPA).                                  |
| Manejo de Estados      | Pinia                   | Gestión centralizada y reactiva del estado global (cursos, usuario activo).  |
| Rutas y Navegación     | Vue Router              | Control y protección de rutas (requerimiento de autenticación).              |
| Base de Datos          | Cloud Firestore         | Almacenamiento en tiempo real y persistente de los datos de los cursos.      |
| Autenticación          | Firebase Authentication | Gestión de usuarios (Registro, Login, Logout) con correo y clave.            |
| Puesta en Producción   | Firebase Hosting        | Despliegue final de la aplicación web.                                       |
| Estilos                | Vuetify & Bootstrap (para Vue)    | Diseño responsivo y rápido de las interfaces de usuario (Modals, Cards, etc.).|
| Consumo API            | Axios                   | Librería HTTP para consumo de datos desde una API REST.                      |


-----

### ⚙️ Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/odettegallo/adweb-online-cursos.git
    cd adweb-online-cursos
    ```
2.  **Instalar dependencias:**
    ```bash
    # Si usas npm
    npm install

    # O si usas composer
    composer install
    ```
3.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en http://localhost:5173/ (o el puerto que indique la terminal).


## ✍️ Contribución

¡Gracias por tu interés en contribuir! Para hacerlo, sigue estos pasos:

1. Haz un Fork del repositorio.
2. Crea una rama:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y haz un commit:
   ```bash
   git commit -m 'feat: Añadir X'
   ```
4. Sube tus cambios:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un Pull Request desde tu rama hacia la rama principal del proyecto.

---

## 🤝 Contribuyentes

Agradecemos a las siguientes personas por su valiosa participación en el desarrollo de este proyecto:

- **Antonio Eliash** — Rol: *Vistas de Bootstrap / Vistas de VUE / Tests*
- **José Huerta** — Rol: *Lógica de Pinia / Router / Configuración de Stores / Vuetify / Vistas de VUE*
- **Odette Gallo** — Rol: *Componentes / Configuración de Firebase & Firestore / Deploy*


---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.
Puedes usar, modificar y distribuir el código libremente, siempre que mantengas el aviso de copyright.

---

## 📧 Contacto

**Bootcamp Aplicaciones Front End Trainee 2025: Proyecto Final Módulo 7**  
📬 odettegallo@outlook.es

