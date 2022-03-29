class Dom {
    constructor () {
        if(!Dom.instance) {
            this.reset();

            Dom.instance = this;
        }

        return Dom.instance;
    };

    reset () {
        this._usedElements = [];
        this._layout = {};
        this._elements = [];
    };

    addElement (name) {
        this._usedElements.push(name);
    };

    isAdded (name) {
        return this._usedElements.includes(name);
    }

    removeElement (name) {
        delete this._layout[name]
    }

    get layout () {
        return this._layout;
    }

    get elements () {
        return this._elements;
    }

    get usedElements () {
        return this._usedElements;
    }

    addToLayout (name, options) {
        if (options.name)
            delete options.name;

        // console.log(name, options);
        this._layout[name] = options;
    }

    get parent () {
        return this._parent;
    }
};

export const create = () => {
    const dom = new Dom();

    const layout = {};

    dom.elements.forEach(element => {
        layout[element] = dom.layout[element];
    });

    dom.reset();

    return layout;
}

export const element = ({ name, type, node, classList } = {}, children = []) => {
    const dom = new Dom();

    dom.addElement(name);

    dom.addToLayout(name, {
        classList,
        type,
        node
    });

    children.forEach(child => {
        child.childOf = name;

        if (dom.isAdded(child.name))
            dom.removeElement(child.name);

        dom.addToLayout(child.name, child);
    });

    return {
        name,
        type,
        node,
        classList,
    }
};

export const div = (name, classList = null) => {
    const dom = new Dom();

    dom.elements.push(name);

    return { name, type: 'html-node', node: 'div', classList };
};

export const component = (name) => {
    const dom = new Dom();

    dom.elements.push(name);

    return { name, type: 'component' };
};