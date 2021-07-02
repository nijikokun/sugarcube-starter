<img src="src/assets/media/favicon.png" width="120" align="right" />

# SugarCube Starter

The easiest starter kit for building SugarCube stories with Twine / Tweego.

## 🎨 Features

- Automatic Tweego & SugarCube Install ✅
- Fully Configurable ✅
- Automatic Builds ✅
- Local server with Live Reload ✅
- Directory for custom fonts ✅
- Directory for third-party scripts ✅
- Up to date packages and frameworks ✅

## 🗃 Tech Stack

Built in to this template are a number of frameworks to get you going.

- [Webpack v5](https://webpack.js.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Babel](https://babeljs.io/) with [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) for vendor scripts
- [Sass](https://sass-lang.com/) with [Modern CSS Support](https://github.com/csstools/postcss-preset-env#readme)

## ℹ Requirements

- [Node.js](https://nodejs.org/en/) 14+

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

- `npm start` - Alias for `npm run dev`
- `npm run dev` - Starts development server and watches `src` directory.
- `npm run dev:prod` - Starts development server and watches `src` directory in production mode (`NODE_ENV=production`).
- `npm run build` - Compiles and bundles the story in the `dist` directory.
- `npm run build:prod` - Compiles and bundles the story in the `dist` directory for production.

## 📁 Directory Structure

- [`.build`](.build) — Webpack configuration and Build scripts
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

- `.tweego` — [Tweego](https://www.motoslave.net/tweego/) installation and story formats are installed here
- `.prebuilt` — Staging directory, files are processed and moved to `dist`
- `dist` — Compiled output directory

## 🙋‍♂️ How To

<details>
<summary>How do I update?</summary>
<p>

**Before continuing make sure you back up your existing code!**

1. Download the latest [release](https://github.com/nijikokun/sugarcube-starter/archive/refs/heads/main.zip)
1. Copy over the `package.json`, `config.json`, `tsconfig.json` files and the `.build` directory.
1. Run `npm start`

And that's it!

**Note** You might want to use something like [jsondiff](http://www.jsondiff.com/) for the `config.json` if you have made changes.

</p>
</details>

---

<details>
<summary>How do I disable Debug View?</summary>
<p>

Debug View looks like this:

![](https://i.imgur.com/titQhIR.png)

**Option One** (Production Mode)

Run development in `production` mode:

```
npm run dev:prod
```

**Option Two**

Create `src/story/PassageReady.twee` and put the following code inside:

```js
:: PassageReady
<<run DebugView.disable()>>
```

**Option Three**

Open `src/story/Start.twee` and add the following code:

```js
::StoryJavaScript[script];
predisplay["debug-disable"] = function (taskName) {
  DebugView.disable();
};
```

**Option Four**

Open `src/story/Start.twee` and add the following code:

```js
::StoryJavaScript[script](function () {
  Setting.addHeader("Debug Settings");

  function initSettingDebug() {
    Config.debug = settings.debug;
  }
  Setting.addToggle("debug", {
    label: "Enable test/debug mode?",
    default: false,
    onInit: initSettingDebug,
    onChange: function () {
      initSettingDebug();
      window.location.reload();
    },
  });
})();
```

</p>
</details>

---

<details>
<summary>How should I initialize variables?</summary>
<p>

You should initialize your story variables using the [`StoryInit`](https://www.motoslave.net/sugarcube/2/docs/#special-passage-storyinit) passage.

A good place to start is in `src/story/Start.twee`:

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

To reference images and media at `src/assets/media/<asset_path>` you'll use `media/<asset_path>`. For eample:

- `src/assets/media/favicon.png` → `media/favicon.png`

Here is an example in html ([`example`](./src/head-content.html)):

```html
<link rel="icon" type="image/png" href="media/favicon.png" />
```

</p>
</details>

---

<details>
<summary>How do I add Google Analytics?</summary>
<p>

Paste the following snippet into [`src/head-content.html`](./src/head-content.html):

```html
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=YOUR_TAG_HERE"
></script>
```

and replace `YOUR_TAG_HERE` with your Google Analytics ID (`UA-########`).

</p>
</details>

---

<details>
<summary>How do I change the app directory name?</summary>
<p>

I don't suggest doing this, but if you really want to... You need to modify all instances of `src/assets/app` in two locations:

- `config.json`
- `tsconfig.json`

Good luck!

</p>
</details>

## 🛣 Roadmap

- [x] Automatically install tweego for users so they don't have to.
- [x] Add typescript support out of the box.
- [x] Add configuration, commands and build process for production.
- [ ] Add command for testing build before distribution.
- [ ] Add support for packaging `dist` directory.
- [ ] Add support for compiling to Electron application.

## 🤝 Helpful Resources

Starter Kit Resources

- [Niji's SugarCube Basics](https://github.com/nijikokun/sugarcube-starter/wiki/SugarCube-Basics)

Official Resources

- [SugarCube Docs](https://www.motoslave.net/sugarcube/2/docs/)

Third-Party Resources

- [Chapel's Custom Macro Collection](https://github.com/ChapelR/custom-macros-for-sugarcube-2)
- [Hogart's SugarCube Macros and Goodies](https://github.com/hogart/sugar-cube-utils)
- [SjoerdHekking's Custom Macros](https://github.com/SjoerdHekking/custom-macros-sugarcube2)
- [GwenTastic's Custom Macros](https://github.com/GwenTastic/Custom-Macros-for-Sugarcube)
- [Cycy Custom Macros](https://github.com/cyrusfirheir/cycy-wrote-custom-macros)
- [HiEv SugarCube Sample Code](https://qjzhvmqlzvoo5lqnrvuhmg-on.drv.tw/UInv/Sample_Code.html#Main%20Menu)
- [Akjosch SugarCube Resources](https://github.com/Akjosch/sugarcube-modules)
- [Mike Westhad SugarCube Resources](https://github.com/mikewesthad/twine-resources)
- [HiEv Universal Inventory](https://github.com/HiEv/UInv)

## 💜 Acknowledgements

We are grateful to these individuals for their ideas and contributions.

- [@ryceg](https://github.com/ryceg)
- [@cyrusfirheir](https://github.com/cyrusfirheir)

## 📝 License

Licensed under the MIT License.
