(() => {
    var Z = Object.create,
        L = Object.defineProperty,
        ee = Object.getPrototypeOf,
        te = Object.prototype.hasOwnProperty,
        re = Object.getOwnPropertyNames,
        ne = Object.getOwnPropertyDescriptor,
        ae = (s) => L(s, "__esModule", { value: !0 }),
        ie = (s, n) => () => (n || ((n = { exports: {} }), s(n.exports, n)), n.exports),
        oe = (s, n, p) => {
            if ((n && typeof n == "object") || typeof n == "function")
                for (let d of re(n))
                    !te.call(s, d) &&
                        d !== "default" &&
                        L(s, d, { get: () => n[d], enumerable: !(p = ne(n, d)) || p.enumerable });
            return s;
        },
        se = (s) =>
            oe(
                ae(
                    L(
                        s != null ? Z(ee(s)) : {},
                        "default",
                        s && s.__esModule && "default" in s
                            ? { get: () => s.default, enumerable: !0 }
                            : { value: s, enumerable: !0 },
                    ),
                ),
                s,
            ),
        fe = ie((s, n) => {
            (function (p, d, M) {
                if (!p) return;
                for (
                    var h = {
                            8: "backspace",
                            9: "tab",
                            13: "enter",
                            16: "shift",
                            17: "ctrl",
                            18: "alt",
                            20: "capslock",
                            27: "esc",
                            32: "space",
                            33: "pageup",
                            34: "pagedown",
                            35: "end",
                            36: "home",
                            37: "left",
                            38: "up",
                            39: "right",
                            40: "down",
                            45: "ins",
                            46: "del",
                            91: "meta",
                            93: "meta",
                            224: "meta",
                        },
                        g = {
                            106: "*",
                            107: "+",
                            109: "-",
                            110: ".",
                            111: "/",
                            186: ";",
                            187: "=",
                            188: ",",
                            189: "-",
                            190: ".",
                            191: "/",
                            192: "`",
                            219: "[",
                            220: "\\",
                            221: "]",
                            222: "'",
                        },
                        y = {
                            "~": "`",
                            "!": "1",
                            "@": "2",
                            "#": "3",
                            $: "4",
                            "%": "5",
                            "^": "6",
                            "&": "7",
                            "*": "8",
                            "(": "9",
                            ")": "0",
                            _: "-",
                            "+": "=",
                            ":": ";",
                            '"': "'",
                            "<": ",",
                            ">": ".",
                            "?": "/",
                            "|": "\\",
                        },
                        q = {
                            option: "alt",
                            command: "meta",
                            return: "enter",
                            escape: "esc",
                            plus: "+",
                            mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl",
                        },
                        S,
                        w = 1;
                    w < 20;
                    ++w
                )
                    h[111 + w] = "f" + w;
                for (w = 0; w <= 9; ++w) h[w + 96] = w.toString();
                function C(e, t, a) {
                    if (e.addEventListener) {
                        e.addEventListener(t, a, !1);
                        return;
                    }
                    e.attachEvent("on" + t, a);
                }
                function T(e) {
                    if (e.type == "keypress") {
                        var t = String.fromCharCode(e.which);
                        return (e.shiftKey || (t = t.toLowerCase()), t);
                    }
                    return h[e.which]
                        ? h[e.which]
                        : g[e.which]
                          ? g[e.which]
                          : String.fromCharCode(e.which).toLowerCase();
                }
                function V(e, t) {
                    return e.sort().join(",") === t.sort().join(",");
                }
                function $(e) {
                    var t = [];
                    return (
                        e.shiftKey && t.push("shift"),
                        e.altKey && t.push("alt"),
                        e.ctrlKey && t.push("ctrl"),
                        e.metaKey && t.push("meta"),
                        t
                    );
                }
                function B(e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                        return;
                    }
                    e.returnValue = !1;
                }
                function H(e) {
                    if (e.stopPropagation) {
                        e.stopPropagation();
                        return;
                    }
                    e.cancelBubble = !0;
                }
                function O(e) {
                    return e == "shift" || e == "ctrl" || e == "alt" || e == "meta";
                }
                function J() {
                    if (!S) {
                        S = {};
                        for (var e in h) (e > 95 && e < 112) || (h.hasOwnProperty(e) && (S[h[e]] = e));
                    }
                    return S;
                }
                function U(e, t, a) {
                    return (
                        a || (a = J()[e] ? "keydown" : "keypress"),
                        a == "keypress" && t.length && (a = "keydown"),
                        a
                    );
                }
                function X(e) {
                    return e === "+" ? ["+"] : ((e = e.replace(/\+{2}/g, "+plus")), e.split("+"));
                }
                function I(e, t) {
                    var a,
                        c,
                        b,
                        P = [];
                    for (a = X(e), b = 0; b < a.length; ++b)
                        ((c = a[b]),
                            q[c] && (c = q[c]),
                            t && t != "keypress" && y[c] && ((c = y[c]), P.push("shift")),
                            O(c) && P.push(c));
                    return ((t = U(c, P, t)), { key: c, modifiers: P, action: t });
                }
                function D(e, t) {
                    return e === null || e === d ? !1 : e === t ? !0 : D(e.parentNode, t);
                }
                function v(e) {
                    var t = this;
                    if (((e = e || d), !(t instanceof v))) return new v(e);
                    ((t.target = e), (t._callbacks = {}), (t._directMap = {}));
                    var a = {},
                        c,
                        b = !1,
                        P = !1,
                        E = !1;
                    function K(r) {
                        r = r || {};
                        var o = !1,
                            l;
                        for (l in a) {
                            if (r[l]) {
                                o = !0;
                                continue;
                            }
                            a[l] = 0;
                        }
                        o || (E = !1);
                    }
                    function j(r, o, l, i, u, m) {
                        var f,
                            _,
                            A = [],
                            k = l.type;
                        if (!t._callbacks[r]) return [];
                        for (k == "keyup" && O(r) && (o = [r]), f = 0; f < t._callbacks[r].length; ++f)
                            if (
                                ((_ = t._callbacks[r][f]),
                                !(!i && _.seq && a[_.seq] != _.level) &&
                                    k == _.action &&
                                    ((k == "keypress" && !l.metaKey && !l.ctrlKey) || V(o, _.modifiers)))
                            ) {
                                var Q = !i && _.combo == u,
                                    W = i && _.seq == i && _.level == m;
                                ((Q || W) && t._callbacks[r].splice(f, 1), A.push(_));
                            }
                        return A;
                    }
                    function x(r, o, l, i) {
                        t.stopCallback(o, o.target || o.srcElement, l, i) || (r(o, l) === !1 && (B(o), H(o)));
                    }
                    t._handleKey = function (r, o, l) {
                        var i = j(r, o, l),
                            u,
                            m = {},
                            f = 0,
                            _ = !1;
                        for (u = 0; u < i.length; ++u) i[u].seq && (f = Math.max(f, i[u].level));
                        for (u = 0; u < i.length; ++u) {
                            if (i[u].seq) {
                                if (i[u].level != f) continue;
                                ((_ = !0), (m[i[u].seq] = 1), x(i[u].callback, l, i[u].combo, i[u].seq));
                                continue;
                            }
                            _ || x(i[u].callback, l, i[u].combo);
                        }
                        var A = l.type == "keypress" && P;
                        (l.type == E && !O(r) && !A && K(m), (P = _ && l.type == "keydown"));
                    };
                    function G(r) {
                        typeof r.which != "number" && (r.which = r.keyCode);
                        var o = T(r);
                        if (o) {
                            if (r.type == "keyup" && b === o) {
                                b = !1;
                                return;
                            }
                            t.handleKey(o, $(r), r);
                        }
                    }
                    function Y() {
                        (clearTimeout(c), (c = setTimeout(K, 1e3)));
                    }
                    function z(r, o, l, i) {
                        a[r] = 0;
                        function u(k) {
                            return function () {
                                ((E = k), ++a[r], Y());
                            };
                        }
                        function m(k) {
                            (x(l, k, r), i !== "keyup" && (b = T(k)), setTimeout(K, 10));
                        }
                        for (var f = 0; f < o.length; ++f) {
                            var _ = f + 1 === o.length,
                                A = _ ? m : u(i || I(o[f + 1]).action);
                            N(o[f], A, i, r, f);
                        }
                    }
                    function N(r, o, l, i, u) {
                        ((t._directMap[r + ":" + l] = o), (r = r.replace(/\s+/g, " ")));
                        var m = r.split(" "),
                            f;
                        if (m.length > 1) {
                            z(r, m, o, l);
                            return;
                        }
                        ((f = I(r, l)),
                            (t._callbacks[f.key] = t._callbacks[f.key] || []),
                            j(f.key, f.modifiers, { type: f.action }, i, r, u),
                            t._callbacks[f.key][i ? "unshift" : "push"]({
                                callback: o,
                                modifiers: f.modifiers,
                                action: f.action,
                                seq: i,
                                level: u,
                                combo: r,
                            }));
                    }
                    ((t._bindMultiple = function (r, o, l) {
                        for (var i = 0; i < r.length; ++i) N(r[i], o, l);
                    }),
                        C(e, "keypress", G),
                        C(e, "keydown", G),
                        C(e, "keyup", G));
                }
                ((v.prototype.bind = function (e, t, a) {
                    var c = this;
                    return ((e = e instanceof Array ? e : [e]), c._bindMultiple.call(c, e, t, a), c);
                }),
                    (v.prototype.unbind = function (e, t) {
                        var a = this;
                        return a.bind.call(a, e, function () {}, t);
                    }),
                    (v.prototype.trigger = function (e, t) {
                        var a = this;
                        return (a._directMap[e + ":" + t] && a._directMap[e + ":" + t]({}, e), a);
                    }),
                    (v.prototype.reset = function () {
                        var e = this;
                        return ((e._callbacks = {}), (e._directMap = {}), e);
                    }),
                    (v.prototype.stopCallback = function (e, t) {
                        var a = this;
                        if ((" " + t.className + " ").indexOf(" mousetrap ") > -1 || D(t, a.target)) return !1;
                        if ("composedPath" in e && typeof e.composedPath == "function") {
                            var c = e.composedPath()[0];
                            c !== e.target && (t = c);
                        }
                        return (
                            t.tagName == "INPUT" ||
                            t.tagName == "SELECT" ||
                            t.tagName == "TEXTAREA" ||
                            t.isContentEditable
                        );
                    }),
                    (v.prototype.handleKey = function () {
                        var e = this;
                        return e._handleKey.apply(e, arguments);
                    }),
                    (v.addKeycodes = function (e) {
                        for (var t in e) e.hasOwnProperty(t) && (h[t] = e[t]);
                        S = null;
                    }),
                    (v.init = function () {
                        var e = v(d);
                        for (var t in e)
                            t.charAt(0) !== "_" &&
                                (v[t] = (function (a) {
                                    return function () {
                                        return e[a].apply(e, arguments);
                                    };
                                })(t));
                    }),
                    v.init(),
                    (p.Mousetrap = v),
                    typeof n < "u" && n.exports && (n.exports = v),
                    typeof define == "function" &&
                        define.amd &&
                        define(function () {
                            return v;
                        }));
            })(typeof window < "u" ? window : null, typeof window < "u" ? document : null);
        }),
        R = se(fe());
    (function (s) {
        if (s) {
            var n = {},
                p = s.prototype.stopCallback;
            ((s.prototype.stopCallback = function (d, M, h, g) {
                var y = this;
                return y.paused ? !0 : n[h] || n[g] ? !1 : p.call(y, d, M, h);
            }),
                (s.prototype.bindGlobal = function (d, M, h) {
                    var g = this;
                    if ((g.bind(d, M, h), d instanceof Array)) {
                        for (var y = 0; y < d.length; y++) n[d[y]] = !0;
                        return;
                    }
                    n[d] = !0;
                }),
                s.init());
        }
    })(typeof Mousetrap < "u" ? Mousetrap : void 0);
    var le = (s) => {
            s.directive("mousetrap", (n, { modifiers: p, expression: d }, { evaluate: M }) => {
                let h = () => (d ? M(d) : n.click());
                ((p = p.map((g) =>
                    g
                        .replace(/--/g, " ")
                        .replace(/-/g, "+")
                        .replace(/\bslash\b/g, "/"),
                )),
                    p.includes("global") &&
                        ((p = p.filter((g) => g !== "global")),
                        R.default.bindGlobal(p, (g) => {
                            (g.preventDefault(), h());
                        })),
                    R.default.bind(p, (g) => {
                        (g.preventDefault(), h());
                    }));
            });
        },
        F = le;
    document.addEventListener("alpine:init", () => {
        (window.Alpine.plugin(F),
            window.Alpine.store("sidebar", {
                isOpen: window.Alpine.$persist(!0).as("isOpen"),
                collapsedGroups: window.Alpine.$persist(null).as("collapsedGroups"),
                groupIsCollapsed: function (n) {
                    return this.collapsedGroups.includes(n);
                },
                collapseGroup: function (n) {
                    this.collapsedGroups.includes(n) || (this.collapsedGroups = this.collapsedGroups.concat(n));
                },
                toggleCollapsedGroup: function (n) {
                    this.collapsedGroups = this.collapsedGroups.includes(n)
                        ? this.collapsedGroups.filter((p) => p !== n)
                        : this.collapsedGroups.concat(n);
                },
                close: function () {
                    this.isOpen = !1;
                },
                open: function () {
                    this.isOpen = !0;
                },
            }));
        let s =
            localStorage.getItem("theme") ??
            getComputedStyle(document.documentElement).getPropertyValue("--default-theme-mode");
        (window.Alpine.store(
            "theme",
            s === "dark" || (s === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
                ? "dark"
                : "light",
        ),
            window.addEventListener("theme-changed", (n) => {
                let p = n.detail;
                (localStorage.setItem("theme", p),
                    p === "system" &&
                        (p = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
                    window.Alpine.store("theme", p));
            }),
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (n) => {
                localStorage.getItem("theme") === "system" &&
                    window.Alpine.store("theme", n.matches ? "dark" : "light");
            }),
            window.Alpine.effect(() => {
                window.Alpine.store("theme") === "dark"
                    ? document.documentElement.classList.add("dark")
                    : document.documentElement.classList.remove("dark");
            }));
    });
})();
