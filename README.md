# Wyser.js
A JavaScript Single Page Application (SPA) Framework

## Installation
Intall using npm package manager
```
npm i wyser
```

## Usage
___

Src\app.js
```JavaScript
import middleware from "./middleware";
import components from "./components";
import tags from "./tags";
import layouts from "./layouts";
import routes from "./routes";
import events from "./events";

export default () => {
    routes();

    components();

    events();

    tags();

    layouts();

    middleware();
};
```

Src\index.js
```JavaScript
import Wyser from 'wyser';
import app from './app.js';

app();

Wyser.load();

```

## Layouts
Define the layout of components to use on page load
___

Src\layouts.js

```JavaScript
import { Layout } from 'wyser';
import { create, div, component, element } from 'wyser/Dom';

export default () => {
    Layout('page.one.layout', create(element(div('root', 'container'), [
        element(component('sidenav')),
        element(div('main', 'container__main'), [
            element(component('header')),
            element(component('page.title')),
            element(component('profile.navigation')),
            element(div('container-main-center', 'container__main__center profile'), [
                element(div('profile-main', 'profile__main'), [
                    element(component('profile.details'))
                ])
            ])
        ])
    ])));

    Layout('page.two.layout', create(element(div('root', 'container'), [
        element(component('sidenav')),
        element(div('main', 'container__main'), [
            element(component('header')),
            element(component('page.title')),
            element(div('container-main-center', 'container__main__center'), [
                element(component('page.stuff'))
            ])
        ])
    ])));
};
```

## Tags
Used for changing content dynamically on page reload
___

Src\tags.js

```javascript
import { Tag } from "wyser";

export default () => {
    /**
        tag 'profile.title' will be switched out for 
        component 'author.profile.title' or 'reader.profile.title'
        depending on the URI
    */
    Tag('profile.title', [
        { name: 'author.profile.title', uri: '/a/johndoe/profile' }, // uri (string) | uris (array)
        { name: 'reader.profile.title', uri: '/r/janedoe/profile' } // uri (string) | uris (array)
    ]);
};
```

## Components
Building blocks of the application, they are loaded individually and cached and re-used where necessary
___
Src\components.js

Creating a standard component

```JavaScript
import { Component } from "wyser";

export default () => {
    Component('sidenav', {
        html: '<div>I am sidenav.</div>',
        scope: 'all' // string | array
    });
}
```

Creating a components with navigation

```JavaScript
Components.create('sidenav', {
    html: '<div>I am sidenav.</div>',
    nav: {
        parent: 'sidenav',

        /**
            classes or class that can be clicked | Array | String
        */
        targets: 'sidenav__item',

        /**
            Highlights the main page on a navigation element like a header or sidebar while the current page is within a sub directory
        */
        linkmultiple: {

            /**
                can be named anything really
            */
            mainPage: ['page.main.tab.one', 'page.main.tab.two']
        }
    },

    /**
        The navigation is limited to routes within the scope
    */
    scope: [
        'page.one',
        'page.two'
    ]
});
```

Properties to take note of

* __nav__ (Optional) 
Indicates that a component is of type navigation, makes things easier for the developer in such a way that the Framework detects an active page, adds event listeners, highlights active pages and sub-pages / sub-directories (linkmultiple is required for sub-pages / sub-directories)

* __linkmultiple__ (Optional)
Each sub property like `mainPage` defined above correspondes to `data-linkmultiple` on the HTML side of things. The array elements represent sub-pages or sub-directories 

* __scope__ (Optional but required for nav)
Navigation is limited to pages defined in the scope

HTML example of a nav component

```HTML
    <div class="sidenav">
        <div class="sidenav__item" data-linkmultiple="mainPage" data-linkaddress='/u/johndoe/page-one' data-linkactive='sidenav__item--active'>
            <p>Page one</p>
        </div>
        <div class="sidenav__item" data-linkaddress='/u/johndoe/page-two' data-linkactive='sidenav__item--active'>
            <p>Page two</p>
        </div>
    </div>
```

## Routes
Routes are paths where a layout has to be rendered
___
Src\routes.js
```JavaScript
import { Route } from 'wyser';

export default () => {
    Route('page.one', {
        title: 'Page one',
        uri: '/u/:user/page-one',
        tags: ['type.of.tag.one', 'page.name', 'another.tag'],
        layout: 'page.one.layout'
    });

    Route('page.two', {
        title: 'Page two',
        uri: '/u/:user/page-two',
        tags: ['type.of.tag.two', 'page.name', 'another.tag'],
        layout: 'page.two.layput'
    });
};
```

Route Params. Params can be defined in a route URI and resolved when that route is loaded by the brower

```JavaScript
import { Router } from "wyser";

console.log(Router.currentParams); // returns params of the current route

console.log(Router.use('route.name').params) // returns params
```

Route Tags. Group routes into multiple categories and return their names when they are used

```JavaScript
import { Router } from "wyser";
 
export default () => {
    const allRoutes = Router.getRoutesByTag('another.tag');

    console.log(allRoutes[0], allRoutes[1]) // [page.one], [page.two]

    // tags can used to limit components to certain routes effeciently
    Components.create('sidenav', {
        html: '<div>I am sidenav.</div>',

        // attaches on-click events to links
        nav: {
            // highlights relevent icon when on a sub-page
            linkmultiple: {
                links: Router.getRoutesByTag('links'),
                linksTwo: Router.getRoutesByTag('linksTwo')
            }
        },

        // limits 'sidenav' to specified routes
        scope: Router.getRoutesByTag('page.name')
    });
};
```

### Middleware 
___
Middleware functions are run every time before components and routes are loaded

Src\middleware.js

```JavaScript
import { Middleware, Singleton } from "wyser";

module.exports = () => {
    // string | array
    Middleware('page.one', async (next) => {
        const response = await fetch('/some-data');

        if (response.data) {
            Singleton.save(
                'someData',
                response.data
            );
        }

        next();
    });
};
```

### Events
___
Component events, will be fired when something happens to the component, like when it is loaded

Src\events.js

```JavaScript
import { Components, Singleton } from 'wyser';

const getSideNav = (someData) => {
    return `<div>Name: ${someData.name}</div>`;
};

export default () => {
    // runs every time before the component has loaded
    Components.use('sidenav').onBeforeLoad((component) => {
        const sidenav =  Singleton.get('someData');

        component.html = sidenav;
    });

    // runs every time after the component has loaded
    Components.use('sidenav').onLoaded((component) => {
        // do stuff
    });
};
```