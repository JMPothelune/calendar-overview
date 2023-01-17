import { app, Menu, nativeImage, Tray } from "electron";
import ConfigureDev from "./configureDev";
import WindowController, { WindowSettings } from "./windows/windowController";
import sharedStore from "./store/sharedStore";
import path from "path";

const mainWindowSettings:Partial<WindowSettings> = {
  title: "Settings",
  width: 480,
  height: 800,
  page: "settings",
};

const calendarWindowSettings:Partial<WindowSettings> = {
  title: "Calendar",
  maximise: true,
  page: "calendar",
  show: false,
  secondaryScreen: true,
};

class App{
  configDev: ConfigureDev;
  mainWindow: WindowController | null = null;
  calendarWindow: WindowController | null = null;
  tray: Tray | null = null;

  constructor(configDev: ConfigureDev){
    this.configDev = configDev;
  }

  start(){
    
    // Prevent multiple instances of the app
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      app.quit()
      return;
    } 

    app.on('second-instance', () => {
      this.createMainWindow();
    })

    app.on("ready", ()=>this.onReady());
    app.on("window-all-closed", ()=>this.onWindowAllClosed());
    app.on("activate", ()=>this.onActivate());

    if(this.configDev.isInProduction){
      Menu.setApplicationMenu(null)
    }
    
    sharedStore.subscribe((state, description)=>{
      console.log("State changed", description);

      if(this.calendarWindow){

        if(state.calendarSettings.showWindow){
          if(this.calendarWindow?.isDestroyed()){
            this.createCalendarWindow();
          }
          this.calendarWindow.show();
        }else{
          if(!this.calendarWindow?.isDestroyed()){
            this.calendarWindow.hide();
          }
        }

        if(state.calendarSettings.alwaysVisible){
          this.calendarWindow.setAlwaysOnTop(true);
        }else{
          this.calendarWindow.setAlwaysOnTop(false);
        }
      }
    });

    console.log("App started");
  }


  async createMainWindow() {
    console.log("Creating main window");

    if(this.mainWindow?.isDestroyed()){
      this.mainWindow = null;
    }
    if(this.mainWindow) return;
    this.mainWindow = new WindowController(mainWindowSettings, this.configDev);
    this.mainWindow.start();
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
      console.log("Calendar window created");
      window.on("close", (e)=>{
        console.log("Calendar window closed");
        sharedStore.setState((state)=>{
          return {
            ...state,
            calendarSettings: {
              ...state.calendarSettings,
              showWindow: false,
            }
          }
        }
        )
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
    // if (process.platform !== "darwin") {
    //   app.quit();
    // }
  }

  onActivate() {
    console.log("App activated");
    this.createMainWindow();
    
  }

  onReady() {
    console.log("App ready");
    this.createMainWindow();
    this.createTray();
  }

  createTray(){
    const trayIcon = nativeImage.createFromPath(path.join(__dirname, "..", "assets", "calendar.png"));
    const tray = new Tray(trayIcon);
    tray.setToolTip("Calendar");
    tray.setContextMenu(Menu.buildFromTemplate([
      {label: "Settings", click: ()=>this.openSettings()},
      {label: "Exit", click: ()=>this.exit()},
    ]));
    tray.on("click", ()=>this.openSettings());
  }

  openSettings(){
    this.createMainWindow();
    this.mainWindow?.show();
  }

  exit(){
    app.quit();
  }


}

export default App;