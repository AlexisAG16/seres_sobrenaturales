# Archivo Sobrenatural

Aplicación unificada en Next.js para administrar y explorar personajes sobrenaturales.

## Configuración

1. Copiar `.env.example` como `.env.local`.
2. Completar `MONGO_URI`, `MONGO_DB_NAME` y `JWT_SECRET`.
3. Ejecutar `npm run dev`.

La aplicación reutiliza la colección `seres` y la colección `usuarios` del backend anterior.

## Rutas

- `/`: presentación del universo.
- `/seres`: catálogo con búsqueda, filtros y paginación.
- `/seres/[id]`: ficha y biografía para usuarios autenticados.
- `/login`, `/registro` y `/cuenta`: acceso y administración de la sesión.
- `/seres/nuevo` y `/seres/[id]/editar`: formularios restringidos a administradores.
- `/historia`: historia general.
- `/api/downloads/[file]`: descarga protegida de documentos Word.
- `/api/seres`: API CRUD; escritura restringida a administradores.
- `/api/auth/register`, `/api/auth/login`, `/api/auth/me`: autenticación mediante cookie segura.

## Seguridad

No guardar credenciales reales en Git. La contraseña de MongoDB presente en el proyecto backend anterior debe rotarse antes de desplegar.

Las cuentas nuevas siempre reciben `rol: "user"`. El único administrador debe asignarse manualmente en MongoDB cambiando su campo `rol` a `"admin"`.
