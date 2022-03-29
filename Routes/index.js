import Uri from '../Uri';

class Routes {
    constructor () {
        if (!Routes.instance) {
            this._routes = {};
            this._currentRoute = {};

            Routes.instance = this;
        }

        return Routes.instance;
    }

    get currentRoute () {
        return this._currentRoute;
    }

    set currentRoute (currentRoute) {
        this._currentRoute = currentRoute;
    }

    get currentParams () {
        return this._currentRoute.params;
    }

    getRoutesByTag (tag, attr = 'name') {
        const routesToReturn = [];

        for (const routeName in this._routes) {
            if (!this._routes.hasOwnProperty(routeName))
                continue;

            if (this._routes[routeName].tags && this._routes[routeName].tags.includes(tag))
                routesToReturn.push(this._routes[routeName][attr]);
        }

        return routesToReturn;
    }

    add (name, route) {
        this._routes[name] = route;
    };

    use (name) {
        if (!this._routes[name])
            throw `Non-existant route: trying to use route (${name}) that doesn't exist!`;

        return this._routes[name];
    }

    getRoute (uri = location.pathname) {
        let route;

        for (const name in this._routes) {
            if (Uri.checkUris(this._routes[name].uri, uri)) {
                route = this._routes[name];
            }
        }

        if (!route)
            throw `No corresponding route: there is no pre-defined route that matches the path: (${uri})`;

        route.params = Uri.getParams(route.uri, uri);

        return route;
    }
};

export default new Routes;