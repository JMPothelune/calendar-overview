import path from "path";
import serve from "electron-serve";
import { exec } from "child_process";

export interface DeveloperOptions {
    isInProduction: boolean;
    serveSvelteDev: boolean;
    buildSvelteDev: boolean;
    watchSvelteBuild: boolean;
}

class ConfigureDev {
    isInProduction: boolean;
    serveSvelteDev: boolean;
    buildSvelteDev: boolean;
    watchSvelteBuild: boolean;
    loader:any;

    constructor(settings: DeveloperOptions) {
        this.isInProduction = settings.isInProduction
        this.serveSvelteDev = settings.serveSvelteDev
        this.buildSvelteDev = settings.buildSvelteDev
        this.watchSvelteBuild = settings.watchSvelteBuild
    }

    async init() {
        this._check_isInProduction();

        if (!this.isInProduction && this.serveSvelteDev) this._dev_Svelte();
        if (!this.isInProduction && this.buildSvelteDev) this._build_Dist();
        if (!this.isInProduction && this.watchSvelteBuild) this._watch_Dist();
        if (this.isInProduction || !this.serveSvelteDev) this._serve_Dist();
    }

    _check_isInProduction() {
        if (! this.isInProduction){
            this.isInProduction = process.env.NODE_ENV === "production" || !/[\\/]electron/.exec(process.execPath); // !process.execPath.match(/[\\/]electron/);
        };
    }

    async _dev_Svelte() { 
        exec("npm run svelte:dev");
        require("electron-reload")(path.join(__dirname, "..", "svelte"));

    }
    
    async _build_Dist() { 
        exec("npm run svelte:build"); 
    }
    
    async _watch_Dist() { 
        require("electron-reload")(path.join(__dirname, "www")); 
    }

    async _serve_Dist() {
        // nothing to do
        this.loader = serve({ directory: "dist/www"})
    }

    async loadURL(window: any, page: string){

        if (this.isLocalHost()) {
            try {
              await window.loadURL("http://localhost:5173/" + page);
            } catch (error) {
              console.log(`ERROR: window.loadURL("http://localhost:5173/");`);
              console.log(error);
            }
          } else if (this.isElectronServe()) {
            try {

                // await this.loader(window);
                await window.loadURL('app://-/' + page);
            } catch (error) {
              console.log(`this.configDev.loadURL(window);`);
              console.log(error);
            }
          }    
    }
    

    isLocalHost() { return this.serveSvelteDev; }
    isElectronServe() { return !this.serveSvelteDev; }

}

export default ConfigureDev;