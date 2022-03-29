import Middleware from "./index";

export default (scope, callback = null) => {
    const tempScope = scope;

    scope = callback ? scope : null;
    callback = callback ? callback : tempScope;

    Middleware.add(scope, callback);
};