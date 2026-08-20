# MaxFactu React

Migración del ERP MaxFactu a una interfaz full-stack con React, Vite, Express y Firebird.

## Requisitos

- Node.js
- Servidor Firebird accesible
- Base de datos Firebird configurada por variables de entorno

## Configuración

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia `.env.example` a `.env.local` o `.env`.
3. Configura las variables `FIREBIRD_*`.

## Desarrollo

```bash
npm run dev
```

La aplicación arranca en `http://localhost:3000` salvo que definas otro `PORT`.

## Producción

```bash
npm run build
npm start
```
