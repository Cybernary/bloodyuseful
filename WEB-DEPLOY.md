# BloodyUseful — web deployment (standalone)

**English** · [Castellano](#bloodyuseful--despliegue-web-standalone)

The web version is a static application (SPA). It needs no Node, PHP or database on the
server: it is just files served as-is. All of the user's data is stored in their own browser
(localStorage), never on the server.

## What to upload
The contents of the `dist/` folder (generated with `npm run build`):

```
dist/
├── index.html
├── favicon.svg
├── manifest.webmanifest      (PWA: name, icons, colors)
├── sw.js + workbox-*.js      (service worker for offline support)
├── pwa-192.png / pwa-512.png / pwa-maskable-512.png
├── .htaccess                 (compression, caching and SPA fallback for Apache/LiteSpeed)
└── assets/                   (hashed JS, CSS and fonts)
```

## Steps (subdomain, e.g. bloody.sanchezdelrio.dev)
1. Create the subdomain in your panel (cPanel/Plesk) pointing to its own folder,
   e.g. `/home/USER/bloody.sanchezdelrio.dev/`.
2. Upload **the contents** of `dist/` (not the `dist` folder itself) to the root of that
   folder, so you end up with `.../bloody.sanchezdelrio.dev/index.html`.
   - Include the hidden `.htaccess` file (enable "show hidden files" in the file manager or
     FTP client).
3. Make sure the subdomain uses **HTTPS** (needed for the browser to allow `localStorage`
   reliably and for the padlock).
4. Done: open `https://bloody.sanchezdelrio.dev`.

## Notes
- The app is built with `base: '/'`, so it must be served at the **root of the subdomain**
  (not in a subfolder).
- **HTTPS is mandatory**: without it the service worker will not register, and it cannot be
  installed as a PWA or work offline.
- It is installable as a PWA (Chrome/Edge: "Install app"; iOS Safari: "Add to Home Screen").
  The service worker caches the app so it works offline once loaded; with
  `registerType: 'autoUpdate'` it updates itself when you publish a new version.
- There are no client routes, so the SPA fallback in `.htaccess` is just a safety net.
- The animated splash is shown **only once per browser** (`splashSeen` key in
  `localStorage`). To see it again: clear the site data.
- To regenerate after changes: `npm run build` and re-upload `dist/`.

---

# BloodyUseful — despliegue web (standalone)

[English](#bloodyuseful--web-deployment-standalone) · **Castellano**

La versión web es una aplicación estática (SPA). No necesita Node, PHP ni base de datos
en el servidor: son solo archivos que se sirven tal cual. Todos los datos de la usuaria se
guardan en su propio navegador (localStorage), nunca en el servidor.

## Qué subir
El contenido de la carpeta `dist/` (generada con `npm run build`):

```
dist/
├── index.html
├── favicon.svg
├── manifest.webmanifest      (PWA: nombre, iconos, colores)
├── sw.js + workbox-*.js      (service worker para funcionar offline)
├── pwa-192.png / pwa-512.png / pwa-maskable-512.png
├── .htaccess                 (compresión, caché y fallback SPA para Apache/LiteSpeed)
└── assets/                   (JS, CSS y fuentes con hash)
```

## Pasos (subdominio, p. ej. bloody.sanchezdelrio.dev)
1. Crea el subdominio en tu panel (cPanel/Plesk) apuntando a una carpeta propia,
   p. ej. `/home/USUARIO/bloody.sanchezdelrio.dev/`.
2. Sube **el contenido** de `dist/` (no la carpeta `dist` en sí) a la raíz de esa carpeta,
   de modo que quede `.../bloody.sanchezdelrio.dev/index.html`.
   - Incluye el archivo oculto `.htaccess` (activa "mostrar archivos ocultos" en el gestor
     de archivos o el cliente FTP).
3. Asegúrate de que el subdominio use **HTTPS** (necesario para que el navegador permita
   `localStorage` de forma fiable y para el candado).
4. Listo: abre `https://bloody.sanchezdelrio.dev`.

## Notas
- La app se construye con `base: '/'`, así que debe servirse en la **raíz del subdominio**
  (no en una subcarpeta).
- **HTTPS es obligatorio**: sin él el service worker no se registra y no podrá instalarse
  como PWA ni funcionar offline.
- Es instalable como PWA (Chrome/Edge: "Instalar app"; iOS Safari: "Añadir a pantalla de
  inicio"). El service worker cachea la app para que funcione sin conexión una vez cargada;
  con `registerType: 'autoUpdate'` se actualiza sola al publicar una versión nueva.
- No hay rutas de cliente, así que el fallback SPA del `.htaccess` es solo por seguridad.
- La splash animada se muestra **una sola vez por navegador** (clave `splashSeen` en
  `localStorage`). Para volver a verla: borrar los datos del sitio.
- Para regenerar tras cambios: `npm run build` y vuelve a subir `dist/`.
