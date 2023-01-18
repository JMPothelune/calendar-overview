import { app, Menu, nativeImage, Tray } from "electron";
import ConfigureDev from "./configureDev";
import WindowController, { WindowSettings } from "./windows/windowController";
import { calendarSettingsStore } from "./stores/sharedStore";
import path from "path";
import CalendarManager from "./managers/calendarManager";

const settingsWindowSettings:Partial<WindowSettings> = {
  title: "Settings",
  width: 480,
  height: 800,
  page: "settings",
  show: false,
};

const calendarWindowSettings:Partial<WindowSettings> = {
  title: "Calendar",
  width: 400,
  height: 600,
  maximise: true,
  page: "calendar",
  show: true,
  frame: false,
};

class App{
  configDev: ConfigureDev;
  settingsWindow: WindowController | null = null;
  calendarWindow: WindowController | null = null;
  calendarManager: CalendarManager;
  tray: Tray | null = null;

  constructor(configDev: ConfigureDev){
    this.configDev = configDev;
    this.calendarManager = new CalendarManager();
    this.calendarManager.start();
  }

  start(){    
    // Prevent multiple instances of the app
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      app.quit()
      return;
    } 

    app.on('second-instance', () => {
      this.createCalendarWindow();
    })

    app.on("ready", ()=>this.onReady());
    app.on("window-all-closed", ()=>this.onWindowAllClosed());
    app.on("activate", ()=>this.onActivate());

    if(this.configDev.isInProduction){
      Menu.setApplicationMenu(null)
    }

    calendarSettingsStore.subscribe((state, previousState)=>{
      const { showWindow, alwaysVisible } = state;

      if(showWindow !== previousState?.showWindow){
        if(showWindow){
          if(this.settingsWindow?.isDestroyed()){
            this.createSettingsWindow();
          }
          this.settingsWindow?.show();
        }else{
          if(!this.settingsWindow?.isDestroyed()){
            this.settingsWindow?.hide();
          }
        }
      }

      if(alwaysVisible !== previousState?.alwaysVisible){
        if(this.calendarWindow){
          if(alwaysVisible){
            this.calendarWindow.setAlwaysOnTop(true);
          }else{
            this.calendarWindow.setAlwaysOnTop(false);
          }
        }
      }
    });

    console.log("App started");
  }


  async createSettingsWindow() {
    console.log("Creating settings window");

    if(this.settingsWindow?.isDestroyed()){
      this.settingsWindow = null;
    }
    if(this.settingsWindow) return;
    this.settingsWindow = new WindowController(settingsWindowSettings, this.configDev);
    this.settingsWindow.start();
    this.createCalendarWindow();
  }

  async createCalendarWindow() {
    if(this.calendarWindow?.isDestroyed()){
      this.calendarWindow = null;
    }
    if(this.calendarWindow) return;
    console.log("Creating calendar window");
    this.calendarWindow = new WindowController(calendarWindowSettings, this.configDev);
    this.calendarWindow.start().then((window)=>{
      window.on("close", (e)=>{
        e.preventDefault();
        window.hide();
        calendarSettingsStore.update((state)=>{
          return {
            ...state,
            showWindow: false,
          }
        });
      });
    });
  }

  async closeCalendarWindow() {
    if(!this.calendarWindow) return;
    this.calendarWindow.close();
    this.calendarWindow = null;
  }



  onWindowAllClosed() {
    console.log("All windows closed");
  }

  onActivate() {
    console.log("App activated");
    this.createCalendarWindow();
    
  }

  onReady() {
    console.log("App ready");
    this.createCalendarWindow();
    this.createTray();
  }

  createTray(){
    console.log("Creating tray");
    const trayIcon = nativeImage.createFromPath(path.join(__dirname, "..", "assets", "cal.png"));
    const tray = new Tray(trayIcon);
    tray.setToolTip("Calendar");
    tray.setContextMenu(Menu.buildFromTemplate([
      {label: "Settings", click: ()=>this.openSettings()},
      {label: "Exit", click: ()=>this.exit()},
    ]));
    tray.on("click", ()=>this.openSettings());
  }

  openSettings(){
    this.createSettingsWindow();
    this.settingsWindow?.show();
  }

  exit(){
    app.quit();
  }


}

export default App;