
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
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
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
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

    /* src/ReactivityChild.svelte generated by Svelte v3.44.1 */

    const file$7 = "src/ReactivityChild.svelte";

    function create_fragment$7(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Wow spread props: Name: ");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = text(" - Version: ");
    			t3 = text(/*version*/ ctx[1]);
    			t4 = text(" - age: ");
    			t5 = text(/*age*/ ctx[2]);
    			add_location(p, file$7, 6, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(p, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    			if (dirty & /*version*/ 2) set_data_dev(t3, /*version*/ ctx[1]);
    			if (dirty & /*age*/ 4) set_data_dev(t5, /*age*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReactivityChild', slots, []);
    	let { name = "" } = $$props;
    	let { version = "" } = $$props;
    	let { age = 0 } = $$props;
    	const writable_props = ['name', 'version', 'age'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReactivityChild> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('version' in $$props) $$invalidate(1, version = $$props.version);
    		if ('age' in $$props) $$invalidate(2, age = $$props.age);
    	};

    	$$self.$capture_state = () => ({ name, version, age });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('version' in $$props) $$invalidate(1, version = $$props.version);
    		if ('age' in $$props) $$invalidate(2, age = $$props.age);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, version, age];
    }

    class ReactivityChild extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { name: 0, version: 1, age: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReactivityChild",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get name() {
    		throw new Error("<ReactivityChild>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<ReactivityChild>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get version() {
    		throw new Error("<ReactivityChild>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set version(value) {
    		throw new Error("<ReactivityChild>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get age() {
    		throw new Error("<ReactivityChild>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set age(value) {
    		throw new Error("<ReactivityChild>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Reactivity.svelte generated by Svelte v3.44.1 */

    const { console: console_1 } = globals;
    const file$6 = "src/Reactivity.svelte";

    function create_fragment$6(ctx) {
    	let article;
    	let h2;
    	let t1;
    	let p0;
    	let t2;
    	let b;
    	let t4;
    	let t5;
    	let h3;
    	let t7;
    	let ul;
    	let li0;
    	let p1;
    	let t9;
    	let li1;
    	let p2;
    	let t11;
    	let reactivitychild;
    	let t12;
    	let input0;
    	let t13;
    	let input1;
    	let t14;
    	let p3;
    	let t15;
    	let current;
    	let mounted;
    	let dispose;
    	const reactivitychild_spread_levels = [/*reactivityChild*/ ctx[3]];
    	let reactivitychild_props = {};

    	for (let i = 0; i < reactivitychild_spread_levels.length; i += 1) {
    		reactivitychild_props = assign(reactivitychild_props, reactivitychild_spread_levels[i]);
    	}

    	reactivitychild = new ReactivityChild({
    			props: reactivitychild_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article = element("article");
    			h2 = element("h2");
    			h2.textContent = "Arrays";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("In ");
    			b = element("b");
    			b.textContent = "Svelte";
    			t4 = text(" reactivity is triggered by assignments. Array/List methods\n        like push, pop, slice does not rerender the component. You need to reassign\n        the value. The best way to do it is through the spread syntax. The name of\n        the updated value must appear on the left hand side of the assignment.");
    			t5 = space();
    			h3 = element("h3");
    			h3.textContent = "For example";
    			t7 = space();
    			ul = element("ul");
    			li0 = element("li");
    			p1 = element("p");
    			p1.textContent = "valueList = [...valueList, newValue] // push";
    			t9 = space();
    			li1 = element("li");
    			p2 = element("p");
    			p2.textContent = "valueList = valueList.filter((item) => item != compareItem) //\n                pop";
    			t11 = space();
    			create_component(reactivitychild.$$.fragment);
    			t12 = space();
    			input0 = element("input");
    			t13 = space();
    			input1 = element("input");
    			t14 = space();
    			p3 = element("p");
    			t15 = text(/*fullName*/ ctx[2]);
    			add_location(h2, file$6, 19, 4, 456);
    			add_location(b, file$6, 21, 11, 491);
    			add_location(p0, file$6, 20, 4, 476);
    			add_location(h3, file$6, 26, 4, 823);
    			add_location(p1, file$6, 29, 12, 878);
    			attr_dev(li0, "class", "svelte-lzo93t");
    			add_location(li0, file$6, 28, 8, 861);
    			add_location(p2, file$6, 32, 12, 969);
    			attr_dev(li1, "class", "svelte-lzo93t");
    			add_location(li1, file$6, 31, 8, 952);
    			add_location(ul, file$6, 27, 4, 848);
    			add_location(article, file$6, 18, 0, 442);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Firstname");
    			add_location(input0, file$6, 40, 0, 1169);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Lastname");
    			add_location(input1, file$6, 41, 0, 1238);
    			add_location(p3, file$6, 42, 0, 1305);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, h2);
    			append_dev(article, t1);
    			append_dev(article, p0);
    			append_dev(p0, t2);
    			append_dev(p0, b);
    			append_dev(p0, t4);
    			append_dev(article, t5);
    			append_dev(article, h3);
    			append_dev(article, t7);
    			append_dev(article, ul);
    			append_dev(ul, li0);
    			append_dev(li0, p1);
    			append_dev(ul, t9);
    			append_dev(ul, li1);
    			append_dev(li1, p2);
    			append_dev(article, t11);
    			mount_component(reactivitychild, article, null);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*firstName*/ ctx[0]);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*lastName*/ ctx[1]);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t15);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const reactivitychild_changes = (dirty & /*reactivityChild*/ 8)
    			? get_spread_update(reactivitychild_spread_levels, [get_spread_object(/*reactivityChild*/ ctx[3])])
    			: {};

    			reactivitychild.$set(reactivitychild_changes);

    			if (dirty & /*firstName*/ 1 && input0.value !== /*firstName*/ ctx[0]) {
    				set_input_value(input0, /*firstName*/ ctx[0]);
    			}

    			if (dirty & /*lastName*/ 2 && input1.value !== /*lastName*/ ctx[1]) {
    				set_input_value(input1, /*lastName*/ ctx[1]);
    			}

    			if (!current || dirty & /*fullName*/ 4) set_data_dev(t15, /*fullName*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(reactivitychild.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(reactivitychild.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_component(reactivitychild);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(p3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let fullName;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Reactivity', slots, []);
    	let firstName = "";
    	let lastName = "";
    	let reactivityChild = { name: "Svelte", version: "3.0", age: 2 };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Reactivity> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		firstName = this.value;
    		$$invalidate(0, firstName);
    	}

    	function input1_input_handler() {
    		lastName = this.value;
    		$$invalidate(1, lastName);
    	}

    	$$self.$capture_state = () => ({
    		ReactivityChild,
    		firstName,
    		lastName,
    		reactivityChild,
    		fullName
    	});

    	$$self.$inject_state = $$props => {
    		if ('firstName' in $$props) $$invalidate(0, firstName = $$props.firstName);
    		if ('lastName' in $$props) $$invalidate(1, lastName = $$props.lastName);
    		if ('reactivityChild' in $$props) $$invalidate(3, reactivityChild = $$props.reactivityChild);
    		if ('fullName' in $$props) $$invalidate(2, fullName = $$props.fullName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*firstName, lastName*/ 3) {
    			$$invalidate(2, fullName = `${firstName} ${lastName}`);
    		}

    		if ($$self.$$.dirty & /*fullName*/ 4) {
    			// run function if some value has changed
    			{
    				console.log(`${fullName} has changed`);
    			}
    		}

    		if ($$self.$$.dirty & /*fullName*/ 4) {
    			if (fullName.length > 16) {
    				console.log("$$$$$$ Fullname has reached maximal limit $$$$$$$$");
    			}
    		}
    	};

    	return [
    		firstName,
    		lastName,
    		fullName,
    		reactivityChild,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Reactivity extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Reactivity",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Todo/TodoItem.svelte generated by Svelte v3.44.1 */

    const file$5 = "src/Todo/TodoItem.svelte";

    function create_fragment$5(ctx) {
    	let li;
    	let div;
    	let p;
    	let t0;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			p = element("p");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			button = element("button");
    			button.textContent = "X";
    			attr_dev(p, "class", "svelte-1d7w8s2");
    			add_location(p, file$5, 6, 8, 112);
    			attr_dev(button, "class", "svelte-1d7w8s2");
    			add_location(button, file$5, 7, 8, 134);
    			attr_dev(div, "class", "item svelte-1d7w8s2");
    			add_location(div, file$5, 5, 4, 85);
    			add_location(li, file$5, 4, 0, 76);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TodoItem', slots, []);
    	let { name = "" } = $$props;
    	let { handleRemove } = $$props;
    	const writable_props = ['name', 'handleRemove'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TodoItem> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleRemove(name);

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('handleRemove' in $$props) $$invalidate(1, handleRemove = $$props.handleRemove);
    	};

    	$$self.$capture_state = () => ({ name, handleRemove });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('handleRemove' in $$props) $$invalidate(1, handleRemove = $$props.handleRemove);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, handleRemove, click_handler];
    }

    class TodoItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { name: 0, handleRemove: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TodoItem",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*handleRemove*/ ctx[1] === undefined && !('handleRemove' in props)) {
    			console.warn("<TodoItem> was created without expected prop 'handleRemove'");
    		}
    	}

    	get name() {
    		throw new Error("<TodoItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TodoItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleRemove() {
    		throw new Error("<TodoItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleRemove(value) {
    		throw new Error("<TodoItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Todo/TodoList.svelte generated by Svelte v3.44.1 */
    const file$4 = "src/Todo/TodoList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (28:4) {#each todos as todo}
    function create_each_block(ctx) {
    	let todoitem;
    	let current;

    	todoitem = new TodoItem({
    			props: {
    				name: /*todo*/ ctx[5],
    				handleRemove: /*removeTodo*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(todoitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(todoitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const todoitem_changes = {};
    			if (dirty & /*todos*/ 1) todoitem_changes.name = /*todo*/ ctx[5];
    			todoitem.$set(todoitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(todoitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(todoitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(todoitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(28:4) {#each todos as todo}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let form;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let ul;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*todos*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			form = element("form");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input0, "placeholder", "Insert todo");
    			add_location(input0, file$4, 22, 4, 626);
    			attr_dev(input1, "type", "submit");
    			input1.value = "Add";
    			attr_dev(input1, "class", "svelte-1nm7und");
    			add_location(input1, file$4, 23, 4, 688);
    			add_location(form, file$4, 21, 0, 580);
    			attr_dev(ul, "class", "svelte-1nm7und");
    			add_location(ul, file$4, 26, 0, 733);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input0);
    			set_input_value(input0, /*todoName*/ ctx[1]);
    			append_dev(form, t0);
    			append_dev(form, input1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(form, "submit", prevent_default(/*addTodo*/ ctx[2]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*todoName*/ 2 && input0.value !== /*todoName*/ ctx[1]) {
    				set_input_value(input0, /*todoName*/ ctx[1]);
    			}

    			if (dirty & /*todos, removeTodo*/ 9) {
    				each_value = /*todos*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('TodoList', slots, []);
    	let todos = [];
    	let todoName = "";

    	onMount(() => {
    		const existingTodos = localStorage.getItem("todos");
    		$$invalidate(0, todos = JSON.parse(existingTodos) || []);
    	});

    	const addTodo = () => {
    		if (todoName) {
    			$$invalidate(0, todos = [...todos, todoName]);
    			localStorage.setItem("todos", JSON.stringify(todos));
    			$$invalidate(1, todoName = "");
    		}
    	};

    	const removeTodo = todo => {
    		$$invalidate(0, todos = todos.filter(item => item != todo));
    		localStorage.setItem("todos", JSON.stringify(todos));
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TodoList> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		todoName = this.value;
    		$$invalidate(1, todoName);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		TodoItem,
    		todos,
    		todoName,
    		addTodo,
    		removeTodo
    	});

    	$$self.$inject_state = $$props => {
    		if ('todos' in $$props) $$invalidate(0, todos = $$props.todos);
    		if ('todoName' in $$props) $$invalidate(1, todoName = $$props.todoName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [todos, todoName, addTodo, removeTodo, input0_input_handler];
    }

    class TodoList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TodoList",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/EventListener.svelte generated by Svelte v3.44.1 */

    const file$3 = "src/EventListener.svelte";

    function create_fragment$3(ctx) {
    	let h2;
    	let t1;
    	let ul;
    	let li0;
    	let t3;
    	let li1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "How to define event listener in Svelte";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "svelte:window on:keydown";
    			t3 = space();
    			li1 = element("li");
    			li1.textContent = "other events";
    			add_location(h2, file$3, 2, 0, 29);
    			attr_dev(li0, "class", "svelte-lzo93t");
    			add_location(li0, file$3, 4, 4, 86);
    			attr_dev(li1, "class", "svelte-lzo93t");
    			add_location(li1, file$3, 5, 4, 124);
    			add_location(ul, file$3, 3, 0, 77);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
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

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EventListener', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EventListener> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class EventListener extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EventListener",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Directives.svelte generated by Svelte v3.44.1 */

    const file$2 = "src/Directives.svelte";

    function create_fragment$2(ctx) {
    	let h2;
    	let t1;
    	let a;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Use Directives";
    			t1 = space();
    			a = element("a");
    			a.textContent = "Link to directives";
    			add_location(h2, file$2, 0, 0, 0);
    			attr_dev(a, "href", "https://svelte.dev/docs#use_action");
    			add_location(a, file$2, 1, 0, 24);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Directives', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Directives> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Directives extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Directives",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Transitions.svelte generated by Svelte v3.44.1 */

    const file$1 = "src/Transitions.svelte";

    function create_fragment$1(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "How to use svelte transitions";
    			add_location(h2, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
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

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Transitions', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Transitions> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Transitions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Transitions",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let h10;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let p;
    	let t4;
    	let a;
    	let t6;
    	let t7;
    	let section0;
    	let h11;
    	let t9;
    	let section1;
    	let h12;
    	let t11;
    	let todolist;
    	let t12;
    	let section2;
    	let h13;
    	let t14;
    	let reactivity;
    	let t15;
    	let section3;
    	let h14;
    	let t17;
    	let eventlistener;
    	let t18;
    	let section4;
    	let h15;
    	let t20;
    	let directives;
    	let t21;
    	let section5;
    	let h16;
    	let t23;
    	let transitions;
    	let current;
    	todolist = new TodoList({ $$inline: true });
    	reactivity = new Reactivity({ $$inline: true });
    	eventlistener = new EventListener({ $$inline: true });
    	directives = new Directives({ $$inline: true });
    	transitions = new Transitions({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			h10 = element("h1");
    			t0 = text("Hello ");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = text("!");
    			t3 = space();
    			p = element("p");
    			t4 = text("Visit the ");
    			a = element("a");
    			a.textContent = "Svelte tutorial";
    			t6 = text(" to learn\n        how to build Svelte apps.");
    			t7 = space();
    			section0 = element("section");
    			h11 = element("h1");
    			h11.textContent = "Introduction";
    			t9 = space();
    			section1 = element("section");
    			h12 = element("h1");
    			h12.textContent = "Todo application";
    			t11 = space();
    			create_component(todolist.$$.fragment);
    			t12 = space();
    			section2 = element("section");
    			h13 = element("h1");
    			h13.textContent = "Reactivity";
    			t14 = space();
    			create_component(reactivity.$$.fragment);
    			t15 = space();
    			section3 = element("section");
    			h14 = element("h1");
    			h14.textContent = "Event Listener";
    			t17 = space();
    			create_component(eventlistener.$$.fragment);
    			t18 = space();
    			section4 = element("section");
    			h15 = element("h1");
    			h15.textContent = "Directives";
    			t20 = space();
    			create_component(directives.$$.fragment);
    			t21 = space();
    			section5 = element("section");
    			h16 = element("h1");
    			h16.textContent = "Transitions";
    			t23 = space();
    			create_component(transitions.$$.fragment);
    			attr_dev(h10, "class", "svelte-4565la");
    			add_location(h10, file, 9, 4, 296);
    			attr_dev(a, "href", "https://svelte.dev/tutorial");
    			add_location(a, file, 11, 18, 345);
    			add_location(p, file, 10, 4, 323);
    			attr_dev(h11, "class", "svelte-4565la");
    			add_location(h11, file, 16, 8, 544);
    			attr_dev(section0, "class", "svelte-4565la");
    			add_location(section0, file, 15, 4, 526);
    			attr_dev(h12, "class", "svelte-4565la");
    			add_location(h12, file, 19, 8, 603);
    			attr_dev(section1, "class", "svelte-4565la");
    			add_location(section1, file, 18, 4, 585);
    			attr_dev(h13, "class", "svelte-4565la");
    			add_location(h13, file, 23, 8, 687);
    			attr_dev(section2, "class", "svelte-4565la");
    			add_location(section2, file, 22, 4, 669);
    			attr_dev(h14, "class", "svelte-4565la");
    			add_location(h14, file, 27, 8, 767);
    			attr_dev(section3, "class", "svelte-4565la");
    			add_location(section3, file, 26, 4, 749);
    			attr_dev(h15, "class", "svelte-4565la");
    			add_location(h15, file, 31, 8, 854);
    			attr_dev(section4, "class", "svelte-4565la");
    			add_location(section4, file, 30, 4, 836);
    			attr_dev(h16, "class", "svelte-4565la");
    			add_location(h16, file, 35, 8, 934);
    			attr_dev(section5, "class", "svelte-4565la");
    			add_location(section5, file, 34, 4, 916);
    			attr_dev(main, "class", "svelte-4565la");
    			add_location(main, file, 8, 0, 285);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h10);
    			append_dev(h10, t0);
    			append_dev(h10, t1);
    			append_dev(h10, t2);
    			append_dev(main, t3);
    			append_dev(main, p);
    			append_dev(p, t4);
    			append_dev(p, a);
    			append_dev(p, t6);
    			append_dev(main, t7);
    			append_dev(main, section0);
    			append_dev(section0, h11);
    			append_dev(main, t9);
    			append_dev(main, section1);
    			append_dev(section1, h12);
    			append_dev(section1, t11);
    			mount_component(todolist, section1, null);
    			append_dev(main, t12);
    			append_dev(main, section2);
    			append_dev(section2, h13);
    			append_dev(section2, t14);
    			mount_component(reactivity, section2, null);
    			append_dev(main, t15);
    			append_dev(main, section3);
    			append_dev(section3, h14);
    			append_dev(section3, t17);
    			mount_component(eventlistener, section3, null);
    			append_dev(main, t18);
    			append_dev(main, section4);
    			append_dev(section4, h15);
    			append_dev(section4, t20);
    			mount_component(directives, section4, null);
    			append_dev(main, t21);
    			append_dev(main, section5);
    			append_dev(section5, h16);
    			append_dev(section5, t23);
    			mount_component(transitions, section5, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(todolist.$$.fragment, local);
    			transition_in(reactivity.$$.fragment, local);
    			transition_in(eventlistener.$$.fragment, local);
    			transition_in(directives.$$.fragment, local);
    			transition_in(transitions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(todolist.$$.fragment, local);
    			transition_out(reactivity.$$.fragment, local);
    			transition_out(eventlistener.$$.fragment, local);
    			transition_out(directives.$$.fragment, local);
    			transition_out(transitions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(todolist);
    			destroy_component(reactivity);
    			destroy_component(eventlistener);
    			destroy_component(directives);
    			destroy_component(transitions);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		Reactivity,
    		TodoList,
    		EventListener,
    		Directives,
    		Transitions,
    		name
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
