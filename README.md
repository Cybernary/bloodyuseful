# BloodyUseful

**English** · [Castellano](#bloodyuseful-castellano)

A small, private period tracker. Log your bleeding on a calendar and it works out your
average cycle, period length, fertile window and the likely date of your next period.

Everything stays on your device — data lives in `localStorage` and never touches a server.
The same code runs as a web app and as an Android app (via Capacitor).

You can check it working on https://bloody-useful.sanchezdelrio.dev/

## Features

- Tap a day to cycle its flow: none → light → medium → heavy.
- Swipe between months, use the arrows, or jump straight to a month and year.
- Cycle stats and next-period / ovulation estimates from the days you log.
- Light and dark themes (follows the system, with a manual toggle).
- Adjustable text size and English/Spanish, detected from the browser/device.
- Week starts on the right day for each locale (Monday, Sunday…).
- Export and import your data as a `bloody-useful.json` file, or wipe it.
- Installable as a PWA and usable offline once loaded.

## Stack

Vue 3 + Vite for the app, Capacitor for the Android wrapper, Atkinson Hyperlegible as the
typeface. No backend.

## Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static build in dist/
npm run preview   # serve the build locally
```

The web version is just the contents of `dist/`; drop them on any static host.

## Android

The `android/` folder is a Capacitor project. Building it needs Android Studio (or the SDK)
and a JDK 21.

```bash
npm run android:sync   # build the web app and copy it into android/
npm run android:open   # …and open the project in Android Studio
npm run android:run    # …and run it on a connected device or emulator
```

App icons and splash screens are generated from the SVGs in `assets/source/` with
`node assets/render.mjs` followed by `npx @capacitor/assets generate --android`.

## Privacy

There is no account and no analytics. Your logs are stored only in the browser or WebView
on the device you use, and are lost if you clear the site data or uninstall the app —
export a backup if you want to keep them.

## License

MIT — see [LICENSE](LICENSE).

---

# BloodyUseful (Castellano)

[English](#bloodyuseful) · **Castellano**

Un pequeño calendario de ciclo menstrual y privado. Registra tu sangrado en un calendario y
calcula tu ciclo medio, la duración del periodo, la ventana fértil y la fecha probable de tu
próximo periodo.

Todo se queda en tu dispositivo: los datos viven en `localStorage` y nunca pasan por un
servidor. El mismo código funciona como aplicación web y como aplicación Android (vía
Capacitor).

## Funciones

- Toca un día para cambiar su flujo: sin flujo → ligero → medio → abundante.
- Desliza entre meses, usa las flechas o salta directamente a un mes y año concretos.
- Estadísticas de ciclo y estimaciones de próximo periodo / ovulación a partir de los días
  que registras.
- Temas claro y oscuro (sigue al sistema, con conmutador manual).
- Tamaño de texto ajustable e inglés/español, detectados desde el navegador o dispositivo.
- La semana empieza el día correcto según el idioma (lunes, domingo…).
- Exporta e importa tus datos como archivo `bloody-useful.json`, o bórralos.
- Instalable como PWA y utilizable sin conexión una vez cargada.

## Tecnología

Vue 3 + Vite para la aplicación, Capacitor para el envoltorio Android y Atkinson Hyperlegible
como tipografía. Sin backend.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build estática en dist/
npm run preview   # sirve la build en local
```

La versión web es simplemente el contenido de `dist/`; súbelo a cualquier hosting estático.

## Android

La carpeta `android/` es un proyecto Capacitor. Para compilarlo hacen falta Android Studio
(o el SDK) y un JDK 21.

```bash
npm run android:sync   # compila la web y la copia en android/
npm run android:open   # …y abre el proyecto en Android Studio
npm run android:run    # …y lo ejecuta en un dispositivo o emulador conectado
```

Los iconos y las splash screens se generan a partir de los SVG de `assets/source/` con
`node assets/render.mjs` seguido de `npx @capacitor/assets generate --android`.

## Privacidad

No hay cuenta ni analíticas. Tus registros se guardan solo en el navegador o el WebView del
dispositivo que uses, y se pierden si borras los datos del sitio o desinstalas la app —
exporta una copia si quieres conservarlos.

## Licencia

MIT — consulta [la LICENCIA](LICENSE).
