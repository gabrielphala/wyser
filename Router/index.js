import Uri from "../Uri";
import Utils from "../Utils";

class Router {
    constructor () {
        if (!Router.instance) {
            this._routes = {};
            this._currentRoute = {};

            Router.instance = this;
        }

        return Router.instance;
    };

    get currentRoute () {
        return this._currentRoute;
    }

    set currentRoute (currentRoute) {
        this._currentRoute = currentRoute;
    }

    get currentParams () {
        return this._currentRoute.params;
    }

    add (name, route) {
        this._routes[name] = route;
    };

    use (name) {
        if (!this._routes[name])
            throw `Non-existant route: trying to use route (${name}) that doesn't exist!`;

        return this._routes[name];
    };

    getRoutesByTag (tag, attr = 'name') {
        const routesToReturn = [];

        Utils.iterate(this._routes, (routeName) => {
            if (this._routes[routeName].tags && this._routes[routeName].tags.includes(tag))
                routesToReturn.push(this._routes[routeName][attr]);
        });

        return routesToReturn;
    };

    getRoute (uri = location.pathname) {
        let route;

        Utils.iterate(this._routes, (routeName) => {
            if (Uri.checkUris(this._routes[routeName].uri, uri))
                route = this._routes[routeName];
        });

        if (!route)
            throw `No corresponding route: there is no pre-defined route that matches the path: (${uri})`;

        route.params = Uri.getParams(route.uri, uri);

        return route;
    }
}

export default new Router;