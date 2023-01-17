import { app, BrowserWindow } from "electron";
import path from "path";
import EventEmitter from "events";
import ConfigureDev from "../configureDev";
import { DeveloperOptions } from "../configureDev";

const defaultSettings = {
  title: app.name,
  width: 854,
  height: 480,
  page:"",
  show: true,
  menu: true,
  maximise: false,
  secondaryScreen: false,
};

export type WindowSettings = typeof defaultSettings

class WindowController {
  window!: BrowserWindow;
  onEvent: EventEmitter = new EventEmitter();
  configDev: ConfigureDev;
  settings: { [key: string]: any };

  constructor(
    settings: Partial<WindowSettings> | {},
    configDev: ConfigureDev,
  ) {
    this.settings = {
      ...defaultSettings,
      ...settings 
    };
    this.configDev = configDev;

  }

  async start(){
    this.window = await this.createWindow();
    return this.window;
  
  }

  async createWindow() {
    let settings = { ...this.settings };
    let window = new BrowserWindow({
      ...settings,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        sandbox: false,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    if(!settings.menu){
      window.removeMenu();
    }
    
    if(settings.secondaryScreen){
      const screen = require("electron").screen;
      const displays = screen.getAllDisplays();
      const externalDisplay = displays.find((display: any) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0;
      });
      if (externalDisplay) {
        window.setBounds(externalDisplay.bounds);
        window.maximize();
      }
    }
    if(settings.show){
      window.show();
    }
    this.configDev.loadURL(window, settings.page);

    return window;
  }

  hide(){
    if(!this.window) return;
    if(this.window.isDestroyed()) return;
    if(!this.window.isVisible()) return;
    this.window.hide();
  }

  show(){
    if(!this.window) return;
    if(this.window.isDestroyed()) return;
    if(this.window.isVisible()) return;
    if(this.window.isMinimized()){
      this.window.restore();
    }

    this.window?.show();
  }

  setAlwaysOnTop(value: boolean){
    if(!this.window) return;
    if(this.window.isDestroyed()) return;
    if(this.window.isAlwaysOnTop() === value) return;
    console.log("Setting always on top", value)
    console.log(this.window.isDestroyed())
    this.window.setAlwaysOnTop(value);
  }

  isDestroyed(){
    return this.window.isDestroyed();
  }

  close() {
    this.window.close();
  }

}

export default WindowController;
