import Components from "../Components";
import Router from "../Router";
import Tags from "../Tags";
import Utils from "../Utils";

class Layouts {
    constructor () {
        if (!Layouts.instance) {
            this._layouts = {};
            this._layoutTo = {};
            this._layoutFrom = {};

            this._childNodes = {};

            this._setRefs();

            Layouts.instance = this;
        }

        return Layouts.instance;
    }

    _reset () {
        this._childNodes = {};
    }

    add (name, layout) {
        this._layouts[name] = layout;
    };

    use (name) {
        return this._layouts[name];
    };

    _setRefs () {
        this._refs = Array.from(document.querySelectorAll('[data-noderef]'));
    }

    _findElement (targetRef) {
        let targetElement;

        this._refs.forEach(element => {
            if (element.dataset.noderef == targetRef) {
                targetElement = element;
            }
        });

        return targetElement;
    }

    _removeOldElements (refToRemoveBy) {
        this._findElement(refToRemoveBy)
            .remove();
    }

    _initRemoveOldElements () {
        const removedNodes = [];

        for (const key in this._layoutFrom) {
            if (!this._layoutFrom.hasOwnProperty(key))
                continue;

            if (this._layoutFrom[key].childOf && removedNodes.includes(this._layoutFrom[key].childOf))
                continue;

            if (!this._layoutTo.hasOwnProperty(key)) {
                removedNodes.push(key);

                this._removeOldElements(key);
            };
        }
    }

    _addComponentElement (newElem, nodeName) {
        newElem.className = 'wyser-container__component-wrap';

        const component = Components.exists(nodeName) ?
            Components.use(nodeName) :
            Components.use(Tags.use(nodeName).getComponent(Router.currentRoute.uri))

        newElem.innerHTML = component.load();

        return newElem;
    }

    _addHTMLElement (newElem, classList) {
        newElem.className = Array.isArray(classList) ?
            classList.join(' ') :
            classList;

        return newElem;
    }

    _addNewElement (nodeName) {
        const node = this._layoutTo[nodeName];

        let newElem = document.createElement(node.node || 'div');

        if (node.type == 'component') 
            newElem = this._addComponentElement(newElem, nodeName);
        
        else
            newElem = this._addHTMLElement(newElem, node.classList)

        newElem.dataset.noderef = nodeName;

        const priorSibling = this._findPriorSibling(node.childOf, nodeName);

        if (priorSibling)
            return this._appendElementToSibling(priorSibling, newElem, nodeName);

        return this._appendElementToParent(node.childOf, newElem);
    };

    _updateElement (name) {
        if (Components.exists(name))
            return;

        const component = Components.use(Tags.use(name).getComponent(Router.currentRoute.uri));
            
        this._findElement(name)
            .innerHTML = component.load();
    }

    _appendElementToParent (parentRef, newElement) {
        const parent = this._findElement(parentRef);

        parent.append(newElement);

        this._setRefs();
    }

    _appendElementToSibling (siblingRef, newElement, nodeName) {
        const node = this._layoutTo[nodeName];

        const parent = this._findElement(node.childOf);

        const sibling = this._findElement(siblingRef)

        parent.insertBefore(newElement, sibling.nextSibling);
    }

    _findPriorSibling (parent, child) {
        let priorSibling = null;

        for (let i = 0; i < this._childNodes[parent].length; i++) {
            if (child == this._childNodes[parent][i])
                break;   

            priorSibling = this._childNodes[parent][i];
        }

        return priorSibling;
    }

    _rememberChildNodes () {
        Utils.iterate(this._layoutTo, (key) => {
            this._childNodes[this._layoutTo[key].childOf] =
                Array.isArray(this._childNodes[this._layoutTo[key].childOf]) ?
                    this._childNodes[this._layoutTo[key].childOf] :
                    [];

            if (this._layoutTo[key].childOf)
                this._childNodes[this._layoutTo[key].childOf].push(key);
        });
    }

    _initAddNewElements () {
        this._rememberChildNodes();

        Utils.iterate(this._layoutTo, (key) => {
            if (this._layoutFrom.hasOwnProperty(key) && this._layoutTo[key].type == 'component')
                this._updateElement(key);

            if (!this._layoutFrom.hasOwnProperty(key))
                this._addNewElement(key);
        });
    };

    switch (layoutFromName, layoutToName) {
        this._reset();
        this._setRefs();

        this._layoutFrom = this._layouts[layoutFromName].config;
        this._layoutTo = this._layouts[layoutToName].config;

        this._initRemoveOldElements();

        this._initAddNewElements();
    };
};

export default new Layouts()