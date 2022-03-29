class Singleton {
    constructor () {
        if (!Singleton.instance) {
            this._container = {};

            Singleton.instance = this;
        }

        return Singleton.instance;
    }

    get (name) {
        return this._container[name];
    }

    save (name, value) {
        this._container[name] = value;
    }
};

export default new Singleton()