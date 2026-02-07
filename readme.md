<img src="src/assets/media/favicon.png" width="120" align="right" />

# SugarCube Starter

The easiest starter kit for building SugarCube stories with Twine / Tweego.

## 🎨 Features

- Automatic Tweego & SugarCube Install ✅
- Fully Configurable ✅
- Automatic Builds ✅
- Live Reload with Browser-Sync ✅
- CSS Injection (no full reload) ✅
- Directory for custom fonts ✅
- Directory for third-party scripts ✅
- Up to date packages and frameworks ✅

## 🗃 Tech Stack

Built in to this template are a number of frameworks to get you going.

- [Vite](https://vitejs.dev/) — Fast build tooling
- [TypeScript](https://www.typescriptlang.org/)
- [Sass](https://sass-lang.com/) with [Modern CSS Support](https://github.com/csstools/postcss-preset-env#readme)
- [Browser-Sync](https://browsersync.io/) — Live reloading

## ℹ Requirements

- [Node.js](https://nodejs.org/en/) 18+

## 🚀 Getting Started

1. Clone the repository
   ```
   npx degit nijikokun/sugarcube-starter <project-name>
   ```
2. Install modules
   ```
   npm install
   ```
3. Start developing
   ```
   npm start
   ```

**New to SugarCube?**

- Check out our [SugarCube Basics](https://github.com/nijikokun/sugarcube-starter/wiki/SugarCube-Basics)

## 👩‍💻 Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with live reload |
| `npm run dev` | Same as `npm start` |
| `npm run build` | Production build to `dist/` |
| `npm run tweego` | Run tweego manually |
| `npm run tweego:install` | Install/reinstall tweego |

## 📁 Directory Structure

```
.build/              # Build scripts
├── dev.ts           # Development server
└── tweego.ts        # Tweego installer & runner

src/                 # Source files
├── assets/
│   ├── app/         # Your JS/TS and SCSS
│   │   ├── index.ts
│   │   └── styles/
│   ├── fonts/       # Custom fonts
│   ├── media/       # Images and videos
│   └── vendor/      # Third-party scripts
├── story/           # Twine .twee files
└── head-content.html

dist/                # Compiled output (auto-generated)
.tweego/             # Tweego installation (auto-generated)
```

## 🙋‍♂️ How To

<details>
<summary>How do I disable Debug View?</summary>
<p>

Debug View is automatically enabled in development and disabled in production builds (`npm run build`).

To disable it in development, create `src/story/PassageReady.twee`:

```js
:: PassageReady
<<run DebugView.disable()>>
```

</p>
</details>

---

<details>
<summary>How should I initialize variables?</summary>
<p>

Use the [`StoryInit`](https://www.motoslave.net/sugarcube/2/docs/#special-passage-storyinit) passage in `src/story/Start.twee`:

```ejs
:: StoryInit
<<set $health = 100>>
<<set $maxHealth = 100>>

:: Start

HP: <<= $health>> / <<= $maxHealth>>
```

</p>
</details>

---

<details>
<summary>How do I install macros?</summary>
<p>

Macros scripts and styles go into `src/assets/vendor`

</p>
</details>

---

<details>
<summary>How do I link to media files?</summary>
<p>

To reference images at `src/assets/media/<asset_path>`:

- `src/assets/media/favicon.png` → `media/favicon.png`

Example in HTML:

```html
<link rel="icon" type="image/png" href="media/favicon.png" />
```

</p>
</details>

---

<details>
<summary>How do I add Google Analytics?</summary>
<p>

Paste into [`src/head-content.html`](./src/head-content.html):

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_TAG_HERE"></script>
```

Replace `YOUR_TAG_HERE` with your Google Analytics ID.

</p>
</details>

## 🤝 Helpful Resources

**Official Resources**
- [SugarCube Docs](https://www.motoslave.net/sugarcube/2/docs/)
- [Niji's SugarCube Basics](https://github.com/nijikokun/sugarcube-starter/wiki/SugarCube-Basics)

**Third-Party Macros**
- [Chapel's Custom Macro Collection](https://github.com/ChapelR/custom-macros-for-sugarcube-2)
- [Hogart's SugarCube Macros and Goodies](https://github.com/hogart/sugar-cube-utils)
- [SjoerdHekking's Custom Macros](https://github.com/SjoerdHekking/custom-macros-sugarcube2)
- [GwenTastic's Custom Macros](https://github.com/GwenTastic/Custom-Macros-for-Sugarcube)
- [Cycy Custom Macros](https://github.com/cyrusfirheir/cycy-wrote-custom-macros)
- [Hituro's Macro Repository](https://github.com/hituro/hituro-makes-macros)
- [HiEv SugarCube Sample Code](https://twine.hiev-heavy-ind.com/)
- [Akjosch SugarCube Resources](https://github.com/Akjosch/sugarcube-modules)
- [Mike Westhad SugarCube Resources](https://github.com/mikewesthad/twine-resources)
- [HiEv Universal Inventory](https://github.com/HiEv/UInv)

## 💜 Acknowledgements

We are grateful to these individuals for their ideas and contributions.

- [@ryceg](https://github.com/ryceg)
- [@cyrusfirheir](https://github.com/cyrusfirheir)

## 📝 License

Licensed under the MIT License.