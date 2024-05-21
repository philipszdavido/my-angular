// const defaultAdapter = require('parse5/dist/tree-adapters/default');

import { defaultTreeAdapter, Parser, parse} from 'parse5'

const customTreeAdapter = {
    ...defaultTreeAdapter,

    createElement(tagName, namespaceURI, attrs) {
        const element = defaultTreeAdapter.createElement(tagName, namespaceURI, attrs);

        // Capture custom attributes like interpolations and event bindings
        element.custom = {
            interpolations: [],
            eventBindings: [],
        };

        attrs.forEach(attr => {
            if (attr.name.startsWith('on')) {
                element.custom.eventBindings.push(attr);
            } else if (/\{\{.*\}\}/.test(attr.value)) {
                element.custom.interpolations.push(attr);
            }
        });

        return element;
    },

    setAttribute(element, name, value) {
        defaultTreeAdapter.setAttribute(element, name, value);

        if (name.startsWith('on')) {
            element.custom.eventBindings.push({ name, value });
        } else if (/\{\{.*\}\}/.test(value)) {
            element.custom.interpolations.push({ name, value });
        }
    },
};

// module.exports = customTreeAdapter;

// const customTreeAdapter = require('./customTreeAdapter');

const html = `
    <div id="app">
        <button onclick="handleClick()">Click me</button>
        <p>{{ message }}</p>
    </div>
`;

const _document = parse(html, { treeAdapter: customTreeAdapter });

function traverse(node) {
    if (node.tagName) {
        console.log(`Tag: ${node.tagName}`);
        if (node.custom) {
            console.log(`Interpolations: ${JSON.stringify(node.custom.interpolations)}`);
            console.log(`Event Bindings: ${JSON.stringify(node.custom.eventBindings)}`);
        }
    }

    if (node.childNodes) {
        node.childNodes.forEach(child => traverse(child));
    }
}

traverse(_document);
