# SugarCube Starter

The easiest starter kit for building SugarCube stories.

## Features

- Automatic Tweego & SugarCube Install ✅
- Fully Configurable ✅
- Automatic Builds ✅
- Local server with Live Reload ✅
- Directory for custom fonts ✅
- Directory for third-party scripts ✅
- Up to date packages and frameworks ✅

## Tech Stack

Built in to this template are a number of frameworks to get you going.

- [Webpack v5](https://webpack.js.org/)
- [Babel](https://babeljs.io/) with [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
- [Sass](https://sass-lang.com/) with [Modern CSS Support](https://github.com/csstools/postcss-preset-env#readme) and [Font Magician Support](https://github.com/csstools/postcss-font-magician)

## Requirements

- Node.js 14+

## Getting Started

1. Clone this repository: `npx degit nijikokun/sugarcube-starter <project-name>`
2. Run using `npm start`

## Commands

- `npm start` - Alias for `npm run dev`
- `npm run dev` - Starts development server and watches `src` directory.
- `npm run build` - Compiles and bundles the story in the `dist` directory.

## Directory Structure

- [`.build`](.build) — Webpack configuration and Build scripts
- [`.tweego`](.tweego) — [Tweego](https://www.motoslave.net/tweego/) files go here
- [`src`](./src) — Story and Story Assets directory
- [`src/assets`](./src/assets) — Story Assets (Scripts, Styles, Media, Fonts)
- [`src/assets/app`](./src/assets/app) — Story JavaScripts and Stylesheets
- [`src/assets/app/styles`](./src/assets/app/styles) — Story Stylesheets (SASS)
- [`src/assets/fonts`](./src/assets/fonts) — Static Fonts to be hosted / distributed
- [`src/assets/media`](./src/assets/media) — Images and Videos
- [`src/assets/vendor`](./src/assets/vendor) — Third-Party Scripts and Modules
- [`src/story`](./src/story) — SugarCube / Twine `.twee` files
- [`config.json`](./config.json) — Webpack, Tweego, Babel and Build Configuration.

### Auto-Generated Directories

- `.prebuilt` — Staging directory, files are processed and moved to `dist`
- `dist` — Compiled output directory

## How To

### How do I install macros?

Extract / place them into `src/assets/vendor`

### How do I link to media files?

Images and videos stored under `src/assets/media` get moved to the root directory under `media` which means that `favicon.png` ends up going from:

- `src/assets/media/favicon.png` → `media/favicon.png`

So to link to `favicon.png` you'd do ([`example`](./src/head-content.html)):

```html
<link rel="icon" type="image/png" href="media/favicon.png" />
```

### How do I add Google Analytics?

Paste the following snippet into [`src/head-content.html`](./src/head-content.html):

```html
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=YOUR_TAG_HERE"
></script>
```

and replace `YOUR_TAG_HERE` with your Google Analytics ID (`UA-########`).

## Roadmap

- [ ] Add configuration, commands and build process for production.
- [ ] Automatically install tweego for users so they don't have to.
- [ ] Add support for compiling to Electron application.
