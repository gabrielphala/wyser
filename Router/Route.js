import Router from "./index";
import Layouts from "../Layouts";
import Config from "../Config";

class Route {
    constructor (name, { title, subTitle, uri, tags, layout }) {
        this._name = name;
        this._title = title;
        this._subTitle = subTitle;
        this._uri = uri;
        this._tags = tags;
        this._layout = layout;

        Router.add(name, this);
    }

    get name () {
        return this._name;
    }

    get uri () {
        return this._uri;
    }

    get tags () {
        return this._tags;
    }

    get title () {
        return this._title;
    } 

    get subTitle () {
        return this._subTitle;
    }

    get layout () {
        return this._layout;
    }

    updateHistory (uri) {
        const pageTitle = Config.pageTitle + ' | ' + this._title;

        document.title = pageTitle;

        history.pushState(
            Layouts.use(this._layout).contents,
            pageTitle,
            uri
        );
    }

    render () {
        Layouts.use(this._layout).build();
    }
};

export default (name, attr) => new Route(name, attr);