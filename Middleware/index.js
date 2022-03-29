import Router from "../Router";

class Middleware {
    constructor () {
        if (!Middleware.instance) {
            this._middleware = [];

            this.reset();

            Middleware.instance = this;
        }

        return Middleware.instance;
    };

    get index () {
        return this._index++;
    }

    add (scope, callback) {
        scope = Array.isArray(scope) ? scope : [scope];

        this._middleware.push({
            scope,
            callback
        });
    };

    pop () {
        this._middleware.pop();
    }

    reset () {
        this._index = 0;
        this._readyMiddleware = [];
    }

    exec () {
        const { callback } = this._readyMiddleware[this.index];

        callback(() => this.exec());
    }

    run () {
        this.reset();

        this._middleware.forEach(({ scope, callback }) => {
            if (!(scope[0]) || (scope.includes(Router.currentRoute.name)))
                this._readyMiddleware.push({scope, callback});
        });

        this.exec();
    };
};

export default new Middleware;