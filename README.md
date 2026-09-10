# BloodyUseful

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
