// ===== JavaScript library =====
// A small, reusable toolbox. It knows nothing about books or loans,
// so it could be used in any other project. The app (app.js) is built on top of it.
//
// Contents:
//   Lib.uid()                   -> unique id string
//   Lib.today()                 -> today as YYYY-MM-DD (same format as <input type="date">)
//   Lib.isBlank(value)          -> true if the value is empty or only spaces
//   Lib.validate(values, rules) -> { field: message } for every required field that is blank
//   Lib.createStore(key)        -> saved list in localStorage: all(), add(), update(), remove()
//   Lib.el(tag, options, kids)  -> creates a DOM element safely (text is never parsed as HTML)

const Lib = {

    // ----- ids and dates -----

    uid: function () {
        return Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    },

    today: function () {
        let now = new Date();
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let day = String(now.getDate()).padStart(2, '0');
        return now.getFullYear() + '-' + month + '-' + day;
    },

    // ----- validation -----

    isBlank: function (value) {
        return value === undefined || value === null || String(value).trim() === '';
    },

    // rules is an object like { title: 'Please enter the title.' }
    // returns an object with a message for each blank field (empty object = all valid)
    validate: function (values, rules) {
        let errors = {};
        Object.keys(rules).forEach((field) => {
            if (Lib.isBlank(values[field])) {
                errors[field] = rules[field];
            }
        });
        return errors;
    },

    // ----- storage -----

    // a list of items saved in localStorage under one key; every item gets a unique id
    createStore: function (key) {

        function read() {
            let items = [];
            try {
                let saved = localStorage.getItem(key);
                if (saved !== null) {
                    items = JSON.parse(saved);
                }
            } catch (error) {
                return [];
            }
            return Array.isArray(items) ? items : [];
        }

        function write(items) {
            localStorage.setItem(key, JSON.stringify(items));
        }

        return {
            all: function () {
                let items = read();
                // items saved before ids existed get one
                let changed = false;
                items.forEach((item) => {
                    if (item.id === undefined) {
                        item.id = Lib.uid();
                        changed = true;
                    }
                });
                if (changed) {
                    write(items);
                }
                return items;
            },

            add: function (item) {
                let items = this.all();
                item.id = Lib.uid();
                items.push(item);
                write(items);
                return item;
            },

            update: function (id, changes) {
                let items = this.all();
                items.forEach((item) => {
                    if (item.id === id) {
                        Object.assign(item, changes);
                    }
                });
                write(items);
            },

            remove: function (id) {
                write(this.all().filter((item) => item.id !== id));
            },
        };
    },

    // ----- DOM -----

    // options: { className, text, onClick }, kids: array of elements
    el: function (tag, options, kids) {
        let node = document.createElement(tag);
        options = options || {};
        if (options.className) {
            node.className = options.className;
        }
        if (options.text !== undefined) {
            node.textContent = options.text;
        }
        if (options.onClick) {
            node.addEventListener('click', options.onClick);
        }
        (kids || []).forEach((kid) => {
            node.appendChild(kid);
        });
        return node;
    },
};