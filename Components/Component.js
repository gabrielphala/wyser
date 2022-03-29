import Singleton from "../Singleton";
import Components from "./index";

class Component {
    constructor (name, { html, nav, scope, ref } = null) {
        this._name = name;
        this._html = html;
        this._nav = nav;
        this._scope = scope;
        this._ref = ref;

        this._events = {};

        Components.add(name, this);
    }

    get name () {
        return this._name;
    }

    get events () {
        return this._events;
    };

    get nav () {
        return this._nav;
    }

    get scope () {
        return this._scope;
    }

    set html (html) {
        this._html = html;
    };

    load () {
        return this._html;
    };

    onBeforeLoad (callback) {
        Components.beforeLoad(this._name);

        this._events.beforeLoad = callback;

        return this;
    }

    onLoaded (callback) {
        Components.loaded(this._name);

        this._events.loaded = callback;

        return this;
    }
};

export default (name, attr) => new Component(name, attr);