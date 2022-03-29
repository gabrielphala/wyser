import Tags from "./index";

class Tag {
    constructor (name, routes) {
        this._name = name;
        this._routes = routes;

        Tags.add(name, this);
    }

    getComponent (uri) {
        let componentName;

        this._routes.forEach(route => {
            if ((route.uris && route.uris == uri) ||
                (route.uris && route.uris.includes(uri)) ||
                (route.uri == uri))
                componentName = route.name;
        });

        if (!componentName)
            throw `Component not found: tag group (${this._name}) does not have component with URI (${uri})`;

        return componentName;
    }
};


export default (name, routes) => new Tag(name, routes);