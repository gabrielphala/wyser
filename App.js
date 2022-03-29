import Components from "./Components";
import Configuration from "./Config";
import Middlewares from "./Middleware";
import Middleware from "./Middleware/Middleware";
import Router from "./Router";
import Layouts from "./Layouts";

export const Config = (options) => {
    Configuration.set(options);
};

/**
 * Loads in a new layout
 */
export const Load = () => {
    const route = Router.getRoute();

    Router.currentRoute = route;

    /** 
     * Wrapping this in a middleware ensures that it runs after 
     * all user (programmer) defined middleware have run
    */
    Middleware(() => {
        Components.initEvents('beforeLoad');

        route.render();

        Components.initEvents('loaded');
    });
    
    route.updateHistory(location.pathname);

    Middlewares.run();
};

/**
 * Changes the layout and components of the current page (route)
 * @param {string} uri 
 */
export const Next = (uri) => {
    const currentRoute = Router.currentRoute;
    const nextRoute = Router.getRoute(uri);
    Router.currentRoute = nextRoute;

    // Removes the middleware added by the load function
    Middlewares.pop();

    /**
     * Wrapping this in a middleware ensures that it runs after 
     * all user (programmer) defined middleware have run
    */
    Middleware(() => {
        // Initiates the onBeforeLoad events of components
        Components.initEvents('beforeLoad');

        Layouts.switch(currentRoute.layout, nextRoute.layout);

        // re-sets event listeners and highlights nav elements
        Layouts.use(nextRoute.layout).afterBuild();

        // Initiates the onLoaded events of components
        Components.initEvents('loaded');
    });

    nextRoute.updateHistory(uri);

    Middlewares.run();
};