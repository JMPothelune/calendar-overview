# Calendar Overview

This is a simple calendar app to help you to manage your time.

## Get Started

Clone the project:

```bash
git clone
```

Then install the dependencies with

```bash
npm install
cd svelte
npm install
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

## Command

For development purpose:

- `npm run nodemon`: auto restart Electron on change
- `npm run svelte:build`: build Svelte code (and copy in `dist/www`

You can configure settings in `index.ts`. Change `developerOptions`:

- `isInProduction`: true if is in production
- `serveSvelteDev`: true when you want to watch svelte
- `buildSvelteDiv`: true when you want to build svelte
- `watchSvelteBuild`: true when you want to watch build svelte

For publish purpose:

- `npm run out:win`: create an exe file for Windows
- `npm run publish:win`: publish the app on GitHub
