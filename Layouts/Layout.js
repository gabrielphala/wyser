import Layouts from "./index";
import Router from "../Router";
import Components from "../Components";
import Tags from "../Tags";
import Utils from "../Utils";

class Layout {
    constructor (name, config) {
        this._config = config;
        this._contents = '';

        this._currentRoute = null;

        Layouts.add(name, this);
    }

    get contents () {
        return this._contents;
    }

    get config () {
        return this._config;
    }

    createNode (nodeName, node) {
        if (node.type == 'html-node') return this.createHTMLNode(nodeName, node)
        else if (node.type == 'component') return this.createComponentNode(nodeName);
    };

    createComponentNode (nodeName) {
        const componentName = Components.exists(nodeName) ? 
            nodeName :
            Tags.use(nodeName).getComponent(Router.currentRoute.uri);

        const component = Components.use(componentName);

        return `<div class="wyser-container__component-wrap" data-noderef="${nodeName}">${component.load()}</div>`
    };

    createHTMLNode (nodeName, node) {
        const classList = Array.isArray(node.classList) ? node.classList.join(' ') : node.classList;

        return `
            <${node.node} class="${classList}" data-noderef="${nodeName}">
                    -- ${nodeName}-child --
            </${node.node}>
        `;
    };

    appendChild (childOf, nodeContents) {
        const searchValue = `-- ${childOf}-child --`;

        this._contents = this._contents.replace(searchValue, nodeContents + searchValue);
    };

    removeChildComments () {
        for (const nodeName in this._config) {
            if (!this._config.hasOwnProperty(nodeName))
                continue;

            this._contents = this._contents.replace(`-- ${nodeName}-child --`, '');
        }
    }

    afterBuild () {
        Components.initNavEvents();
        Components.highlightNavs();
    }

    build () {
        for (const nodeName in this._config) {
            if (!this._config.hasOwnProperty(nodeName))
                continue;

            const nodeContents = this.createNode(nodeName, this._config[nodeName]);

            if (!this._config[nodeName].childOf)
                this._contents += nodeContents;

            else
                this.appendChild(this._config[nodeName].childOf, nodeContents);
        }

        this.removeChildComments();

        Utils.prependToBody(this._contents);

        this.afterBuild();
    };
};

export default (name, config) => new Layout(name, config);