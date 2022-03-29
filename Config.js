import Singleton from "./Singleton";
import Utils from "./Utils";

class Config {
    constructor () {
        if (Config.instance == null) {
            this._options = {
                logs: {
                    warn: true,
                    info: false
                },
                page: {
                    title: 'Made with Wyser'
                }
            };

            Config.instance = this;
        }

        return Config.instance;
    };

    set (options) {
        this._options = Utils.merge({ refObj: this._options, mainObj: options });
    }

    get showWarning () {
        return this._options.logs.warn;
    }

    get showInfo () {
        return this._options.logs.info;
    }

    get pageTitle () {
        return this._options.page.title;
    }
};

export default new Config();