import { Next } from "../App";
import Router from "../Router";

class Components {
    constructor () {
        if (!Components.instance) {
            this._components = {};
            this._navComponents = {};
            this._oldNavItems = {};

            this._events = {
                beforeLoad: [],
                loaded: []
            }

            Components.instance = this;
        }

        return Components.instance;
    }

    add (name, component) {
        if (component.nav)
            this._navComponents[name] = component;

        this._components[name] = component;
    };

    exists (name) {
        return this._components[name] ? true : false;
    }

    use (name) {
        if (!this._components[name])
            throw `Could not find component (${name})`;
            
        return this._components[name];
    }

    isInScope (scope, routeName) {
        if (scope && scope.includes(routeName) || scope == 'all')
            return true;

        return false;
    };

    iterateOverComponents (callback) {
        for (const component in this._navComponents) {
            if (!this._navComponents.hasOwnProperty(component))
                continue;

            if (!this.isInScope(this._navComponents[component].scope, Router.currentRoute.name))
                continue;

            callback(this._navComponents[component]);
        }
    };

    iterateOverNavItems (component, callback) {
        let { parent, targets } = component.nav;

        const parents = document.getElementsByClassName(parent);

        Array.from(parents).forEach(parent => {
            const _targets = Array.isArray(targets) ? targets : [targets];

            _targets.forEach(target => {
                const targetElements = parent.getElementsByClassName(target);

                Array.from(targetElements).forEach(targetElement => {
                    callback(targetElement);
                });
            });
        });
    };

    initHighlight (navItem, component) {
        if (!navItem.dataset.linkaddress || !navItem.dataset.linkactive)
            return;

        // if current path matches nav item, activate the item, remember it and return;
        if (navItem.dataset.linkaddress == location.pathname) {
            this._oldNavItems[component.name] = navItem;

            return navItem.classList.add(navItem.dataset.linkactive);
        }

        if (navItem.dataset.linkmultiple && component.nav && component.nav.linkmultiple) {
            // Grouped routes, essentially same page with multiple tabs
            const tabs = component.nav.linkmultiple[navItem.dataset.linkmultiple];

            // if page (route) to render is a tab within @var tabs, make it active
            if (this.isInScope(tabs, Router.currentRoute.name)) {
                navItem.classList.add(navItem.dataset.linkactive);

                this._oldNavItems[component.name] = navItem;
            }
        }
    }

    highlightNavs () {
        this.iterateOverComponents((component) => {
            this.iterateOverNavItems(component, (navItem) => {
                this.initHighlight(navItem, component);
            });
        });
    }

    onClick () {
        this.iterateOverComponents((component) => {
            this.iterateOverNavItems(component, (navItem) => {
                if (!navItem.dataset.linkaddress || !navItem.dataset.linkactive)
                    return;

                // the cloning and replacing process, removes old events and prevents
                // the same event being fired multiple times
                const navItemClone = navItem.cloneNode(true);

                navItem.replaceWith(navItemClone);

                navItemClone.addEventListener('click', async (e) => {
                    // replace components with new ones, corresponding to the new page
                    Next(e.currentTarget.dataset.linkaddress);

                    // de-activate previosly activated navItems
                    if (this._oldNavItems[component.name])
                        this._oldNavItems[component.name].classList.remove(e.currentTarget.dataset.linkactive);

                    // if some nav components have been modified, re-set events
                    this.onClick();

                    // if there are new components that need highlighting, highlight them
                    this.highlightNavs();
                });
            });
        });
    }

    initNavEvents () {
        this.onClick();
    };

    initEvents (type) {
        this._events[type].forEach(componentName => {
            const component = this._components[componentName];

            if (!this.isInScope(component.scope, Router.currentRoute.name))
                return;

            component.events[type](this._components[componentName]);
        });
    }

    beforeLoad (name) {
        this._events.beforeLoad.push(name);
    }

    loaded (name) {
        this._events.loaded.push(name);
    }
};

export default new Components;