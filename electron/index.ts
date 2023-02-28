import { app } from "electron";
import App from "./app";
import ConfigureDev from "./configureDev";

const buildMode = {
  isInProduction: true, // true if is in production
  serveSvelteDev: false, // true when you want to watch svelte
  buildSvelteDev: false, // true when you want to build svelte
  watchSvelteBuild: false, // true when you want to watch build svelte
};

const devMode = {
  isInProduction: false, // true if is in production
  serveSvelteDev: true, // true when you want to watch svelte
  buildSvelteDev: false, // true when you want to build svelte
  watchSvelteBuild: false, // true when you want to watch build svelte
};

const developerOptions = buildMode

app.commandLine.appendSwitch("enable-experimental-web-platform-features");

const configDev = new ConfigureDev(developerOptions);
configDev.init();

let webApp = new App(configDev);
webApp.start();