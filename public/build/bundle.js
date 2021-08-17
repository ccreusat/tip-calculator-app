
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.40.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Logo.svelte generated by Svelte v3.40.2 */

    const file$4 = "src/Logo.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let a;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*name*/ ctx[1]);
    			add_location(img, file$4, 7, 41, 165);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "aria-label", "Splitter Logo");
    			add_location(a, file$4, 7, 2, 126);
    			attr_dev(div, "class", "logo svelte-1q8cmdr");
    			add_location(div, file$4, 6, 0, 105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*src*/ 1 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*name*/ 2) {
    				attr_dev(img, "alt", /*name*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	let { src = './images/logo.svg' } = $$props;
    	let { name = 'Splitter' } = $$props;
    	const writable_props = ['src', 'name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ src, name });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, name];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { src: 0, name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get src() {
    		throw new Error("<Logo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Logo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Logo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Logo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    // store.js

    // Basic
    const bill = writable("");
    const people = writable("");
    const selectedTip = writable(5);
    const customTip = writable("");

    // Derived Store
    const getTotal = derived(
    	[bill, people, selectedTip],
    	([$bill, $people, $selectedTip]) =>
    		parseFloat(($bill + $bill * ($selectedTip / 100)) / $people).toFixed(2)
    );
    const getTotalAmount = derived(
    	[bill, people, selectedTip],
    	([$bill, $people, $selectedTip]) =>
    		parseFloat(($bill * ($selectedTip / 100)) / $people).toFixed(2)
    );

    /* src/Input.svelte generated by Svelte v3.40.2 */
    const file$3 = "src/Input.svelte";

    function create_fragment$3(ctx) {
    	let fieldset;
    	let div;
    	let label;
    	let t0;
    	let span;
    	let t2;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			div = element("div");
    			label = element("label");
    			t0 = text(/*text*/ ctx[2]);
    			span = element("span");
    			span.textContent = "Can't be zero";
    			t2 = space();
    			input = element("input");
    			attr_dev(span, "class", "error-message");
    			add_location(span, file$3, 49, 48, 821);
    			attr_dev(label, "class", "legend flex");
    			attr_dev(label, "for", /*id*/ ctx[1]);
    			add_location(label, file$3, 49, 4, 777);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", /*id*/ ctx[1]);
    			attr_dev(input, "class", /*id*/ ctx[1]);
    			attr_dev(input, "name", /*id*/ ctx[1]);
    			attr_dev(input, "placeholder", "0");
    			attr_dev(input, "pattern", "\\d*");
    			add_location(input, file$3, 50, 4, 882);
    			toggle_class(div, "error", /*error*/ ctx[3]);
    			add_location(div, file$3, 48, 2, 755);
    			attr_dev(fieldset, "class", "fieldset");
    			add_location(fieldset, file$3, 47, 0, 725);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, div);
    			append_dev(div, label);
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(div, t2);
    			append_dev(div, input);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(
    						input,
    						"input",
    						function () {
    							if (is_function(/*onChange*/ ctx[4](/*value*/ ctx[0]))) /*onChange*/ ctx[4](/*value*/ ctx[0]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*text*/ 4) set_data_dev(t0, /*text*/ ctx[2]);

    			if (dirty & /*id*/ 2) {
    				attr_dev(label, "for", /*id*/ ctx[1]);
    			}

    			if (dirty & /*id*/ 2) {
    				attr_dev(input, "id", /*id*/ ctx[1]);
    			}

    			if (dirty & /*id*/ 2) {
    				attr_dev(input, "class", /*id*/ ctx[1]);
    			}

    			if (dirty & /*id*/ 2) {
    				attr_dev(input, "name", /*id*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			if (dirty & /*error*/ 8) {
    				toggle_class(div, "error", /*error*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let { id } = $$props;
    	let { text } = $$props;
    	let { value = "" } = $$props;
    	let error = false;

    	// Methods
    	const onChange = val => {
    		if (id === "bill") {
    			if (val !== "") {
    				bill.set(parseFloat(val));
    			} else {
    				bill.set("");
    			}
    		}

    		if (id === "number-of-people") {
    			if (val !== "") {
    				people.set(parseFloat(val));
    			} else {
    				people.set("");
    			}
    		}
    	};

    	const writable_props = ['id', 'text', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		id,
    		text,
    		value,
    		error,
    		bill,
    		people,
    		onChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('error' in $$props) $$invalidate(3, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 1) {
    			if (isNaN(value)) {
    				$$invalidate(0, value = "");
    				$$invalidate(3, error = true);
    			} else {
    				$$invalidate(3, error = false);
    			}
    		}

    		if ($$self.$$.dirty & /*value*/ 1) {
    			// Listeners
    			if (value === "" || value === 0) {
    				$$invalidate(3, error = true);
    			} else {
    				$$invalidate(3, error = false);
    			}
    		}
    	};

    	return [value, id, text, error, onChange, input_input_handler];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { id: 1, text: 2, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[1] === undefined && !('id' in props)) {
    			console.warn("<Input> was created without expected prop 'id'");
    		}

    		if (/*text*/ ctx[2] === undefined && !('text' in props)) {
    			console.warn("<Input> was created without expected prop 'text'");
    		}
    	}

    	get id() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Tips.svelte generated by Svelte v3.40.2 */
    const file$2 = "src/Tips.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (36:4) {#each tips as tip (tip)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let input;
    	let t0;
    	let label;
    	let t1_value = /*tip*/ ctx[9] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			t2 = text(" %");
    			attr_dev(input, "class", "tips__radio");
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "tips");
    			input.__value = /*tip*/ ctx[9];
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[7][0].push(input);
    			add_location(input, file$2, 37, 8, 693);
    			attr_dev(label, "class", "tips__label");
    			attr_dev(label, "for", "tip-" + /*tip*/ ctx[9]);
    			add_location(label, file$2, 44, 8, 879);
    			attr_dev(div, "class", "tips__control");
    			add_location(div, file$2, 36, 6, 657);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			input.checked = input.__value === /*selected*/ ctx[1];
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[6]),
    					listen_dev(
    						input,
    						"change",
    						function () {
    							if (is_function(/*onChange*/ ctx[3](/*selected*/ ctx[1]))) /*onChange*/ ctx[3](/*selected*/ ctx[1]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*selected*/ 2) {
    				input.checked = input.__value === /*selected*/ ctx[1];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input), 1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(36:4) {#each tips as tip (tip)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let fieldset;
    	let label;
    	let t1;
    	let div1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t2;
    	let div0;
    	let input;
    	let mounted;
    	let dispose;
    	let each_value = /*tips*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*tip*/ ctx[9];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			label = element("label");
    			label.textContent = "Select Tip %";
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div0 = element("div");
    			input = element("input");
    			attr_dev(label, "for", "tips");
    			attr_dev(label, "class", "legend");
    			add_location(label, file$2, 33, 2, 546);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "tips__custom");
    			attr_dev(input, "name", "tip");
    			attr_dev(input, "id", "tip-custom");
    			attr_dev(input, "placeholder", "Custom");
    			add_location(input, file$2, 48, 6, 1001);
    			attr_dev(div0, "class", "tips__control");
    			add_location(div0, file$2, 47, 4, 967);
    			attr_dev(div1, "class", "tips");
    			add_location(div1, file$2, 34, 2, 602);
    			attr_dev(fieldset, "class", "fieldset");
    			add_location(fieldset, file$2, 32, 0, 516);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, label);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(
    						input,
    						"input",
    						function () {
    							if (is_function(/*onCustomValue*/ ctx[4](/*value*/ ctx[0]))) /*onCustomValue*/ ctx[4](/*value*/ ctx[0]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*tips, selected, onChange*/ 14) {
    				each_value = /*tips*/ ctx[2];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div1, destroy_block, create_each_block, t2, get_each_context);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $selectedTip;
    	validate_store(selectedTip, 'selectedTip');
    	component_subscribe($$self, selectedTip, $$value => $$invalidate(5, $selectedTip = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tips', slots, []);
    	let selected = $selectedTip;
    	let value = "";

    	// Methods
    	const tips = [5, 10, 15, 25, 50];

    	const onChange = () => {
    		$$invalidate(0, value = "");
    		customTip.set(value);
    		selectedTip.set(selected);
    	};

    	const onCustomValue = val => {
    		$$invalidate(1, selected = val);
    		customTip.set(selected);
    		selectedTip.set(selected);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tips> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		selected = this.__value;
    		($$invalidate(1, selected), $$invalidate(5, $selectedTip));
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$capture_state = () => ({
    		selectedTip,
    		customTip,
    		selected,
    		value,
    		tips,
    		onChange,
    		onCustomValue,
    		$selectedTip
    	});

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selectedTip*/ 32) {
    			// Listeners
    			$$invalidate(1, selected = $selectedTip);
    		}

    		if ($$self.$$.dirty & /*value*/ 1) {
    			if (isNaN(value)) $$invalidate(0, value = "");
    		}
    	};

    	return [
    		value,
    		selected,
    		tips,
    		onChange,
    		onCustomValue,
    		$selectedTip,
    		input_change_handler,
    		$$binding_groups,
    		input_input_handler
    	];
    }

    class Tips extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tips",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Result.svelte generated by Svelte v3.40.2 */

    const file$1 = "src/Result.svelte";

    function create_fragment$1(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let label0;
    	let t0;
    	let span0;
    	let t2;
    	let strong0;
    	let t3;
    	let span1;
    	let t4;
    	let t5;
    	let div1;
    	let label1;
    	let t6;
    	let span2;
    	let t8;
    	let strong1;
    	let t9;
    	let span3;
    	let t10;
    	let t11;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			t0 = text("Tip Amount\n        ");
    			span0 = element("span");
    			span0.textContent = "/ person";
    			t2 = space();
    			strong0 = element("strong");
    			t3 = text("$");
    			span1 = element("span");
    			t4 = text(/*amount*/ ctx[1]);
    			t5 = space();
    			div1 = element("div");
    			label1 = element("label");
    			t6 = text("Total\n        ");
    			span2 = element("span");
    			span2.textContent = "/ person";
    			t8 = space();
    			strong1 = element("strong");
    			t9 = text("$");
    			span3 = element("span");
    			t10 = text(/*total*/ ctx[0]);
    			t11 = space();
    			button = element("button");
    			button.textContent = "Reset";
    			add_location(span0, file$1, 42, 8, 712);
    			attr_dev(label0, "for", "amount");
    			attr_dev(label0, "class", "legend");
    			add_location(label0, file$1, 41, 6, 658);
    			attr_dev(span1, "id", "amount");
    			add_location(span1, file$1, 44, 9, 780);
    			attr_dev(strong0, "class", "price");
    			add_location(strong0, file$1, 43, 6, 748);
    			attr_dev(div0, "class", "control flex");
    			add_location(div0, file$1, 40, 4, 625);
    			add_location(span2, file$1, 50, 8, 927);
    			attr_dev(label1, "for", "total");
    			attr_dev(label1, "class", "legend");
    			add_location(label1, file$1, 49, 6, 879);
    			attr_dev(span3, "id", "total");
    			add_location(span3, file$1, 51, 29, 986);
    			attr_dev(strong1, "class", "price");
    			add_location(strong1, file$1, 51, 6, 963);
    			attr_dev(div1, "class", "control flex");
    			add_location(div1, file$1, 48, 4, 846);
    			add_location(div2, file$1, 39, 2, 615);
    			attr_dev(button, "id", "reset");
    			add_location(button, file$1, 55, 2, 1050);
    			attr_dev(div3, "class", "splitter__result");
    			add_location(div3, file$1, 38, 0, 582);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, label0);
    			append_dev(label0, t0);
    			append_dev(label0, span0);
    			append_dev(div0, t2);
    			append_dev(div0, strong0);
    			append_dev(strong0, t3);
    			append_dev(strong0, span1);
    			append_dev(span1, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, label1);
    			append_dev(label1, t6);
    			append_dev(label1, span2);
    			append_dev(div1, t8);
    			append_dev(div1, strong1);
    			append_dev(strong1, t9);
    			append_dev(strong1, span3);
    			append_dev(span3, t10);
    			append_dev(div3, t11);
    			append_dev(div3, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*reset*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*amount*/ 2) set_data_dev(t4, /*amount*/ ctx[1]);
    			if (dirty & /*total*/ 1) set_data_dev(t10, /*total*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $getTotalAmount;
    	let $getTotal;
    	let $bill;
    	let $people;
    	validate_store(getTotalAmount, 'getTotalAmount');
    	component_subscribe($$self, getTotalAmount, $$value => $$invalidate(3, $getTotalAmount = $$value));
    	validate_store(getTotal, 'getTotal');
    	component_subscribe($$self, getTotal, $$value => $$invalidate(4, $getTotal = $$value));
    	validate_store(bill, 'bill');
    	component_subscribe($$self, bill, $$value => $$invalidate(5, $bill = $$value));
    	validate_store(people, 'people');
    	component_subscribe($$self, people, $$value => $$invalidate(6, $people = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Result', slots, []);
    	const dispatch = createEventDispatcher();

    	// Variables
    	let total = "0.00";

    	let amount = "0.00";

    	// Methods
    	const reset = () => dispatch('reset');

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Result> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		bill,
    		people,
    		getTotal,
    		getTotalAmount,
    		createEventDispatcher,
    		dispatch,
    		total,
    		amount,
    		reset,
    		$getTotalAmount,
    		$getTotal,
    		$bill,
    		$people
    	});

    	$$self.$inject_state = $$props => {
    		if ('total' in $$props) $$invalidate(0, total = $$props.total);
    		if ('amount' in $$props) $$invalidate(1, amount = $$props.amount);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$people, $bill, $getTotal, $getTotalAmount*/ 120) {
    			// Listeners
    			if ($people !== "" && $bill !== "" && $people !== 0 && $bill !== 0) {
    				$$invalidate(0, total = $getTotal);
    				$$invalidate(1, amount = $getTotalAmount);
    			} else {
    				$$invalidate(0, total = "0.00");
    				$$invalidate(1, amount = "0.00");
    			}
    		}
    	};

    	return [total, amount, reset, $getTotalAmount, $getTotal, $bill, $people];
    }

    class Result extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Result",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.40.2 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let logo;
    	let t0;
    	let form;
    	let div;
    	let input0;
    	let t1;
    	let tips;
    	let t2;
    	let input1;
    	let t3;
    	let result;
    	let current;
    	let mounted;
    	let dispose;
    	logo = new Logo({ $$inline: true });

    	input0 = new Input({
    			props: {
    				id: "bill",
    				text: "Bill",
    				value: /*$bill*/ ctx[0]
    			},
    			$$inline: true
    		});

    	tips = new Tips({ $$inline: true });

    	input1 = new Input({
    			props: {
    				id: "number-of-people",
    				text: "Number of people",
    				value: /*$people*/ ctx[1]
    			},
    			$$inline: true
    		});

    	result = new Result({ $$inline: true });
    	result.$on("reset", /*handleResetForm*/ ctx[3]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(logo.$$.fragment);
    			t0 = space();
    			form = element("form");
    			div = element("div");
    			create_component(input0.$$.fragment);
    			t1 = space();
    			create_component(tips.$$.fragment);
    			t2 = space();
    			create_component(input1.$$.fragment);
    			t3 = space();
    			create_component(result.$$.fragment);
    			attr_dev(div, "class", "splitter__calculator");
    			add_location(div, file, 30, 4, 581);
    			attr_dev(form, "autocomplete", "off");
    			attr_dev(form, "class", "splitter__container");
    			add_location(form, file, 29, 2, 496);
    			add_location(main, file, 26, 0, 475);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(logo, main, null);
    			append_dev(main, t0);
    			append_dev(main, form);
    			append_dev(form, div);
    			mount_component(input0, div, null);
    			append_dev(div, t1);
    			mount_component(tips, div, null);
    			append_dev(div, t2);
    			mount_component(input1, div, null);
    			append_dev(form, t3);
    			mount_component(result, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", /*handleOnSubmit*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const input0_changes = {};
    			if (dirty & /*$bill*/ 1) input0_changes.value = /*$bill*/ ctx[0];
    			input0.$set(input0_changes);
    			const input1_changes = {};
    			if (dirty & /*$people*/ 2) input1_changes.value = /*$people*/ ctx[1];
    			input1.$set(input1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(input0.$$.fragment, local);
    			transition_in(tips.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(result.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(input0.$$.fragment, local);
    			transition_out(tips.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(result.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(logo);
    			destroy_component(input0);
    			destroy_component(tips);
    			destroy_component(input1);
    			destroy_component(result);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $bill;
    	let $people;
    	validate_store(bill, 'bill');
    	component_subscribe($$self, bill, $$value => $$invalidate(0, $bill = $$value));
    	validate_store(people, 'people');
    	component_subscribe($$self, people, $$value => $$invalidate(1, $people = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const handleOnSubmit = e => e.preventDefault();

    	const handleResetForm = () => {
    		bill.set("");
    		people.set("");
    		selectedTip.set(5);
    		customTip.set("");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Logo,
    		Input,
    		Tips,
    		Result,
    		bill,
    		people,
    		selectedTip,
    		customTip,
    		handleOnSubmit,
    		handleResetForm,
    		$bill,
    		$people
    	});

    	return [$bill, $people, handleOnSubmit, handleResetForm];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
