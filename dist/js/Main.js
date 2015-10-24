(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pcp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher');

},{"./lib/Dispatcher":4}],4:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * 
 * @preventMunge
 */

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = require('fbjs/lib/invariant');

var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *         case 'city-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

var Dispatcher = (function () {
  function Dispatcher() {
    _classCallCheck(this, Dispatcher);

    this._callbacks = {};
    this._isDispatching = false;
    this._isHandled = {};
    this._isPending = {};
    this._lastID = 1;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   */

  Dispatcher.prototype.register = function register(callback) {
    var id = _prefix + this._lastID++;
    this._callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   */

  Dispatcher.prototype.unregister = function unregister(id) {
    !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
    delete this._callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   */

  Dispatcher.prototype.waitFor = function waitFor(ids) {
    !this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this._isPending[id]) {
        !this._isHandled[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
        continue;
      }
      !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
      this._invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   */

  Dispatcher.prototype.dispatch = function dispatch(payload) {
    !!this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
    this._startDispatching(payload);
    try {
      for (var id in this._callbacks) {
        if (this._isPending[id]) {
          continue;
        }
        this._invokeCallback(id);
      }
    } finally {
      this._stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   */

  Dispatcher.prototype.isDispatching = function isDispatching() {
    return this._isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @internal
   */

  Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
    this._isPending[id] = true;
    this._callbacks[id](this._pendingPayload);
    this._isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @internal
   */

  Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
    for (var id in this._callbacks) {
      this._isPending[id] = false;
      this._isHandled[id] = false;
    }
    this._pendingPayload = payload;
    this._isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */

  Dispatcher.prototype._stopDispatching = function _stopDispatching() {
    delete this._pendingPayload;
    this._isDispatching = false;
  };

  return Dispatcher;
})();

module.exports = Dispatcher;
}).call(this,require('_process'))

},{"_process":2,"fbjs/lib/invariant":5}],5:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;
}).call(this,require('_process'))

},{"_process":2}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _viewTemplateNativeNativeTemplate = require("./view/template/native/NativeTemplate");

var _viewTemplateNativeNativeTemplate2 = _interopRequireDefault(_viewTemplateNativeNativeTemplate);

var DEFAULT_CONFIG = {
	id: "pcp",
	palette: [{ color: "", name: "A" }, { color: "", name: "B" }, { color: "", name: "C" }, { color: "", name: "D" }, { color: "", name: "E" }],
	selector: [{ color: "", name: "" }, { color: "#ff0000", name: "" }, { color: "#e3ff00", name: "" }, { color: "#00baff", name: "" }, { color: "#0021ff", name: "" }],
	template: _viewTemplateNativeNativeTemplate2["default"]
};

exports["default"] = DEFAULT_CONFIG;
module.exports = exports["default"];

},{"./view/template/native/NativeTemplate":18}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _storeModelColor = require("./store/model/Color");

var _storeModelColor2 = _interopRequireDefault(_storeModelColor);

var _storeModelColorUtil = require("./store/model/ColorUtil");

var _storeModelColorUtil2 = _interopRequireDefault(_storeModelColorUtil);

var _storeModelPalette = require("./store/model/Palette");

var _storeModelPalette2 = _interopRequireDefault(_storeModelPalette);

var _storeStore = require("./store/Store");

var _storeStore2 = _interopRequireDefault(_storeStore);

var _dispatcherDispatcher = require("./dispatcher/Dispatcher");

var _dispatcherDispatcher2 = _interopRequireDefault(_dispatcherDispatcher);

var _actionActionCreator = require("./action/ActionCreator");

var _actionActionCreator2 = _interopRequireDefault(_actionActionCreator);

var _actionActionConstants = require("./action/ActionConstants");

var _actionActionConstants2 = _interopRequireDefault(_actionActionConstants);

var _viewTemplateNativeSimpleTemplate = require("./view/template/native/SimpleTemplate");

var _viewTemplateNativeSimpleTemplate2 = _interopRequireDefault(_viewTemplateNativeSimpleTemplate);

var _viewTemplateNativeNativeTemplate = require("./view/template/native/NativeTemplate");

var _viewTemplateNativeNativeTemplate2 = _interopRequireDefault(_viewTemplateNativeNativeTemplate);

var _PCP = require("./PCP");

var _PCP2 = _interopRequireDefault(_PCP);

exports.Color = _storeModelColor2["default"];
exports.ColorUtil = _storeModelColorUtil2["default"];
exports.Palette = _storeModelPalette2["default"];
exports.Store = _storeStore2["default"];
exports.Dispatcher = _dispatcherDispatcher2["default"];
exports.ActionCreator = _actionActionCreator2["default"];
exports.ActionConstants = _actionActionConstants2["default"];
exports.SimpleTemplate = _viewTemplateNativeSimpleTemplate2["default"];
exports.NativeTemplate = _viewTemplateNativeNativeTemplate2["default"];
exports.PCP = _PCP2["default"];

},{"./PCP":8,"./action/ActionConstants":9,"./action/ActionCreator":10,"./dispatcher/Dispatcher":11,"./store/Store":12,"./store/model/Color":13,"./store/model/ColorUtil":14,"./store/model/Palette":15,"./view/template/native/NativeTemplate":18,"./view/template/native/SimpleTemplate":19}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _storeStore = require("./store/Store");

var _storeStore2 = _interopRequireDefault(_storeStore);

var _dispatcherDispatcher = require("./dispatcher/Dispatcher");

var _dispatcherDispatcher2 = _interopRequireDefault(_dispatcherDispatcher);

var _actionActionCreator = require("./action/ActionCreator");

var _actionActionCreator2 = _interopRequireDefault(_actionActionCreator);

var _actionActionConstants = require("./action/ActionConstants");

var _actionActionConstants2 = _interopRequireDefault(_actionActionConstants);

var _viewView = require("./view/View");

var _viewView2 = _interopRequireDefault(_viewView);

var _DefaultConfig = require("./DefaultConfig");

var _DefaultConfig2 = _interopRequireDefault(_DefaultConfig);

var PCP = (function () {
	function PCP(config) {
		_classCallCheck(this, PCP);

		this._config = this._createConfig();

		this._dispatcher = new _dispatcherDispatcher2["default"]();
		this._store = new _storeStore2["default"](this._dispatcher);
		this._actionCreator = new _actionActionCreator2["default"](this._dispatcher);
		this._view = new _viewView2["default"](this._actionCreator, this._store);

		this.set(_DefaultConfig2["default"]);
	}

	_createClass(PCP, [{
		key: "set",
		value: function set() {
			var _this = this;

			var newConfig = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			Object.keys(newConfig).forEach(function (key) {
				_this._config[key].update(newConfig[key]);
			});
		}
	}, {
		key: "get",
		value: function get(key) {
			return this._config[key].query();
		}
	}, {
		key: "subscribe",
		value: function subscribe(onPaletteColorsSet, onSelectorColorsSet) {
			this._store.addListener(_actionActionConstants2["default"].SET_PALETTE_COLORS, onPaletteColorsSet);
			this._store.addListener(_actionActionConstants2["default"].SET_SELECTOR_COLORS, onSelectorColorsSet);
		}
	}, {
		key: "unsubscribe",
		value: function unsubscribe(onPaletteColorsSet, onSelectorColorsSet) {
			this._store.removeListener(_actionActionConstants2["default"].SET_PALETTE_COLORS, onPaletteColorsSet);
			this._store.removeListener(_actionActionConstants2["default"].SET_SELECTOR_COLORS, onSelectorColorsSet);
		}
	}, {
		key: "_createConfig",
		value: function _createConfig() {
			var _this2 = this;

			var c = {
				id: {
					query: function query() {
						return _this2._store.getDomId();
					},
					update: function update(id) {
						_this2._actionCreator[_actionActionConstants2["default"].SET_DOM_ID](id);
					}
				},
				palette: {
					query: function query() {
						return _this2._store.getPaletteColors();
					},
					update: function update(palette) {
						_this2._actionCreator[_actionActionConstants2["default"].SET_PALETTE_COLORS](palette);
					}
				},
				selector: {
					query: function query() {
						return _this2._store.getSelectorColors();
					},
					update: function update(palette) {
						_this2._actionCreator[_actionActionConstants2["default"].SET_SELECTOR_COLORS](palette);
					}
				},
				template: {
					query: function query() {
						return _this2._store.getTemplate();
					},
					update: function update(template) {
						_this2._actionCreator[_actionActionConstants2["default"].SET_TEMPLATE](template);
					}
				}
			};
			return c;
		}
	}]);

	return PCP;
})();

exports["default"] = PCP;
module.exports = exports["default"];

},{"./DefaultConfig":6,"./action/ActionConstants":9,"./action/ActionCreator":10,"./dispatcher/Dispatcher":11,"./store/Store":12,"./view/View":16}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var ActionConstants = {
	SET_PALETTE_COLORS: "setPaletteColors",
	SET_SELECTOR_COLORS: "setSelectorColors",
	CHANGE_PALETTE_COLOR: "changePaletteColor",

	SET_DOM_ID: "setDomId",
	SET_TEMPLATE: "setTemplate"
};

exports["default"] = ActionConstants;
module.exports = exports["default"];

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ActionConstants = require("./ActionConstants");

var _ActionConstants2 = _interopRequireDefault(_ActionConstants);

var ActionCreator = function ActionCreator(dispatcher) {
	var _this = this;

	_classCallCheck(this, ActionCreator);

	this._dispatcher = dispatcher;
	Object.keys(_ActionConstants2["default"]).forEach(function (key) {
		_this[_ActionConstants2["default"][key]] = function (data) {
			_this._dispatcher.dispatch({
				type: _ActionConstants2["default"][key],
				data: data
			});
		};
	});
};

exports["default"] = ActionCreator;
module.exports = exports["default"];

},{"./ActionConstants":9}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _flux = require("flux");

var _flux2 = _interopRequireDefault(_flux);

exports["default"] = _flux2["default"].Dispatcher;
module.exports = exports["default"];

},{"flux":3}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _actionActionConstants = require("../action/ActionConstants");

var _actionActionConstants2 = _interopRequireDefault(_actionActionConstants);

var _modelPalette = require("./model/Palette");

var _modelPalette2 = _interopRequireDefault(_modelPalette);

var Store = (function (_events$EventEmitter) {
	_inherits(Store, _events$EventEmitter);

	function Store(dispatcher) {
		_classCallCheck(this, Store);

		_get(Object.getPrototypeOf(Store.prototype), "constructor", this).call(this);
		this._dispatcher = dispatcher;

		this._palette = new _modelPalette2["default"]();
		this._selector = new _modelPalette2["default"]();
		this._domId = "";
		this._template = "";

		this._register();
	}

	_createClass(Store, [{
		key: "getPaletteColors",
		value: function getPaletteColors() {
			return this._palette.colors;
		}
	}, {
		key: "getSelectorColors",
		value: function getSelectorColors() {
			return this._selector.colors;
		}
	}, {
		key: "getDomId",
		value: function getDomId() {
			return this._domId;
		}
	}, {
		key: "getTemplate",
		value: function getTemplate() {
			return this._template;
		}
	}, {
		key: "_register",
		value: function _register() {
			var _this = this;

			this._dispatcher.register(function (payload) {
				switch (payload.type) {
					case _actionActionConstants2["default"].SET_PALETTE_COLORS:
						_this._palette.colors = payload.data;
						_this.emit(_actionActionConstants2["default"].SET_PALETTE_COLORS);
						break;
					case _actionActionConstants2["default"].SET_SELECTOR_COLORS:
						_this._selector.colors = payload.data;
						_this.emit(_actionActionConstants2["default"].SET_SELECTOR_COLORS);
						break;
					case _actionActionConstants2["default"].CHANGE_PALETTE_COLOR:
						_this._palette.changeColor(payload.data.index, payload.data.newColor);
						_this.emit(_actionActionConstants2["default"].CHANGE_PALETTE_COLOR);
						break;
					case _actionActionConstants2["default"].SET_DOM_ID:
						_this._domId = payload.data;
						_this.emit(_actionActionConstants2["default"].SET_DOM_ID);
						break;
					case _actionActionConstants2["default"].SET_TEMPLATE:
						_this._template = payload.data;
						_this.emit(_actionActionConstants2["default"].SET_TEMPLATE);
						break;
				}
			});
		}
	}]);

	return Store;
})(_events2["default"].EventEmitter);

exports["default"] = Store;
module.exports = exports["default"];

},{"../action/ActionConstants":9,"./model/Palette":15,"events":1}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ColorUtil = require("./ColorUtil");

var _ColorUtil2 = _interopRequireDefault(_ColorUtil);

var Color = (function () {
	function Color(color, name) {
		_classCallCheck(this, Color);

		this._color = "";

		this.color = color || "";
		this.name = name || "";
	}

	_createClass(Color, [{
		key: "color",
		set: function set(color) {
			if (!_ColorUtil2["default"].isHexColors(color)) {
				throw new Error(color + " contains invalid hex color code");
			}
			this._color = color;
		},
		get: function get() {
			return this._color;
		}

		/**
  	Accepts object or list of objects containing format like below and transform it to array of Color
  	{
  		color: "#123456",
  		name: "ggyy"
  	}
  */
	}], [{
		key: "transform",
		value: function transform(colors) {
			if (colors instanceof Array) {
				var list = [];
				for (var i = 0; i < colors.length; i++) {
					if (colors[i] instanceof Color) {
						list.push(colors[i]);
					} else {
						list.push(new Color(colors[i].color, colors[i].name));
					}
				}
				return list;
			} else if (colors instanceof Color) {
				return colors;
			} else if (colors instanceof Object) {
				return new Color(colors.color, colors.name);
			} else {
				throw new Error(colors + " is neither array or object");
			}
		}
	}]);

	return Color;
})();

exports["default"] = Color;
module.exports = exports["default"];

},{"./ColorUtil":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColorUtil = (function () {
	function ColorUtil() {
		_classCallCheck(this, ColorUtil);
	}

	_createClass(ColorUtil, null, [{
		key: "isHexColors",
		value: function isHexColors(colors) {
			if (typeof colors === "string" || colors instanceof String) {
				return isValid(colors);
			} else if (colors instanceof Array) {
				for (var i = 0; i < colors.length; i++) {
					if (!isValid(colors[i])) {
						return false;
					}
				}
				return true;
			} else {
				throw new Error(colors + " is not a string or array");
			}

			function isValid(hexCode) {
				if (!ColorUtil.HEXCOLOR_REGEXP.test(hexCode) && hexCode !== ColorUtil.COLOR_NONE) {
					return false;
				}
				return true;
			}
		}
	}, {
		key: "colorsToSerial",
		value: function colorsToSerial(colors) {
			var serial = "";
			for (var i = 0; i < colors.length; i++) {
				serial += colors[i].color.slice(1);
				if (i + 1 < colors.length) {
					serial += "+";
				}
			}
			return serial;
		}
	}, {
		key: "serialToColors",
		value: function serialToColors(serial) {
			var rawColors = serial.split("+");
			var colors = rawColors.map(function (hexCode) {
				if (hexCode === ColorUtil.COLOR_NONE) {
					return hexCode;
				} else {
					return "#" + hexCode;
				}
			});
			return colors;
		}
	}, {
		key: "HEXCOLOR_REGEXP",
		get: function get() {
			return (/^#[0-9|a-f]{6}$/i
			);
		}
	}, {
		key: "COLOR_NONE",
		get: function get() {
			return "";
		}
	}]);

	return ColorUtil;
})();

exports["default"] = ColorUtil;
module.exports = exports["default"];

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Color = require("./Color");

var _Color2 = _interopRequireDefault(_Color);

var Palette = (function () {
	function Palette(colors) {
		_classCallCheck(this, Palette);

		this._colors = null;
		this.colors = colors || [];
	}

	_createClass(Palette, [{
		key: "changeColor",
		value: function changeColor(index, newColor) {
			if (this._colors[index] === undefined) {
				throw new Error("target index " + index + " is not exist.");
			}
			if (!(newColor instanceof _Color2["default"])) {
				newColor = _Color2["default"].transform(newColor);
			}
			return this._colors[index] = newColor;
		}
	}, {
		key: "colors",
		set: function set(colors) {
			this._colors = _Color2["default"].transform(colors);
		},
		get: function get() {
			return this._colors;
		}
	}]);

	return Palette;
})();

exports["default"] = Palette;
module.exports = exports["default"];

},{"./Color":13}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _actionActionConstants = require("../action/ActionConstants");

var _actionActionConstants2 = _interopRequireDefault(_actionActionConstants);

var View = (function () {
	function View(actionCreator, store) {
		_classCallCheck(this, View);

		this._actionCreator = actionCreator;
		this._store = store;

		this._templateInstance = null;

		this._store.addListener(_actionActionConstants2["default"].SET_DOM_ID, this._onDomIdSet.bind(this));
		this._store.addListener(_actionActionConstants2["default"].SET_TEMPLATE, this._onTemplateSet.bind(this));
	}

	_createClass(View, [{
		key: "_onDomIdSet",
		value: function _onDomIdSet() {
			this._onTemplateSet();
		}
	}, {
		key: "_onTemplateSet",
		value: function _onTemplateSet() {
			var templatePrototype = this._store.getTemplate();
			var domId = this._store.getDomId();

			if (!templatePrototype || !domId || domId === "") {
				return;
			}
			if (this._templateInstance) {
				this._templateInstance.clear();
			};
			this._templateInstance = new templatePrototype(domId, this._actionCreator, this._store);
			this._templateInstance.start();
		}
	}]);

	return View;
})();

exports["default"] = View;
module.exports = exports["default"];

},{"../action/ActionConstants":9}],17:[function(require,module,exports){
/**
	@abstract
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Template = (function () {
	function Template(domId, actionCreator, store) {
		_classCallCheck(this, Template);

		if (this.constructor === "Template") {
			throw new Error("Template is an abstract class!");
		}
		this._domId = domId || null;
		this._actionCreator = actionCreator || null;
		this._store = store || null;
		return this;
	}

	_createClass(Template, [{
		key: "clear",
		value: function clear() {
			throw new Error("Needs to be implemented.");
		}
	}, {
		key: "start",
		value: function start() {
			throw new Error("Needs to be implemented.");
		}
	}]);

	return Template;
})();

exports["default"] = Template;
module.exports = exports["default"];

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _actionActionConstants = require("../../../action/ActionConstants");

var _actionActionConstants2 = _interopRequireDefault(_actionActionConstants);

var _Template2 = require("../Template");

var _Template3 = _interopRequireDefault(_Template2);

var _storeModelColorUtil = require("../../../store/model/ColorUtil");

var _storeModelColorUtil2 = _interopRequireDefault(_storeModelColorUtil);

var NativeTemplate = (function (_Template) {
	_inherits(NativeTemplate, _Template);

	function NativeTemplate(domId, actionCreator, store) {
		_classCallCheck(this, NativeTemplate);

		_get(Object.getPrototypeOf(NativeTemplate.prototype), "constructor", this).call(this, domId, actionCreator, store);
		this.uiPaletteContainer = null;
		this.uiSelectorContainer = null;
		this.uiMainContainer = null;

		this.paletteStoreToken = null;
		this.selectorStoreToken = null;
	}

	_createClass(NativeTemplate, [{
		key: "start",
		value: function start() {
			this.uiMainContainer = document.getElementById(this._domId);
			this.uiPaletteContainer = document.createElement("div");
			this.uiSelectorContainer = document.createElement("div");

			this.uiMainContainer.classList.add("pcp");
			this.uiPaletteContainer.classList.add("palette");
			this.uiSelectorContainer.classList.add("selector");

			this.uiMainContainer.appendChild(this.uiPaletteContainer);
			this.uiMainContainer.appendChild(this.uiSelectorContainer);

			this.onPaletteColorsSet();
			this.onSelectorColorsSet();

			this._store.addListener(_actionActionConstants2["default"].SET_PALETTE_COLORS, this.onPaletteColorsSet.bind(this));
			this._store.addListener(_actionActionConstants2["default"].SET_SELECTOR_COLORS, this.onSelectorColorsSet.bind(this));
			this._store.addListener(_actionActionConstants2["default"].CHANGE_PALETTE_COLOR, this.onPaletteColorsSet.bind(this));
		}
	}, {
		key: "clear",
		value: function clear() {
			this.uiMainContainer.innerHTML = "";
			this.uiMainContainer.className = "";
			this._store.removeListener(_actionActionConstants2["default"].SET_PALETTE_COLORS, this.onPaletteColorsSet);
			this._store.removeListener(_actionActionConstants2["default"].SET_SELECTOR_COLORS, this.onSelectorColorsSet);
		}
	}, {
		key: "onPaletteColorsSet",
		value: function onPaletteColorsSet() {
			var lastSelectedColorIndex = this._getSelectedColorIndex(this.uiPaletteContainer);
			var colors = this._store.getPaletteColors();
			this.uiPaletteContainer.innerHTML = "";
			for (var i = 0; i < colors.length; i++) {
				var ele = this._makeColorEle(colors[i]);
				ele.addEventListener("click", this._paletteMouseEvent.bind(this));
				this.uiPaletteContainer.appendChild(ele);
			}
			if (lastSelectedColorIndex !== -1 && lastSelectedColorIndex < colors.length) {
				this.uiPaletteContainer.children[lastSelectedColorIndex].classList.add("selected");
			}
		}
	}, {
		key: "onSelectorColorsSet",
		value: function onSelectorColorsSet() {
			var colors = this._store.getSelectorColors();
			this.uiSelectorContainer.innerHTML = "";
			for (var i = 0; i < colors.length; i++) {
				var ele = this._makeColorEle(colors[i]);
				ele.addEventListener("click", this._selectorMouseEvent.bind(this));
				this.uiSelectorContainer.appendChild(ele);
			}
		}
	}, {
		key: "_paletteMouseEvent",
		value: function _paletteMouseEvent(e) {
			var lastSelectedColor = this._queryByClass(this.uiPaletteContainer, "selected");
			if (lastSelectedColor) {
				lastSelectedColor.classList.remove("selected");
			}
			if (e.currentTarget !== lastSelectedColor) {
				e.currentTarget.classList.add("selected");
			}
		}
	}, {
		key: "_selectorMouseEvent",
		value: function _selectorMouseEvent(e) {
			var paletteIndex = this._getSelectedColorIndex(this.uiPaletteContainer);
			var selectorIndex = this._getSelectedColorIndex(this.uiSelectorContainer, e);
			if (selectorIndex < 0 || paletteIndex < 0) {
				return;
			}
			var color = this._store.getSelectorColors()[selectorIndex].color;
			var name = this._store.getPaletteColors()[paletteIndex].name;
			var newColor = {
				color: color,
				name: name
			};
			this._actionCreator[_actionActionConstants2["default"].CHANGE_PALETTE_COLOR]({ index: paletteIndex, newColor: newColor });
		}
	}, {
		key: "_getSelectedColorIndex",
		value: function _getSelectedColorIndex(parent, e) {
			if (parent === this.uiPaletteContainer) {
				var selectedColor = this._queryByClass(parent, "selected");
				return this._indexInParent(parent, selectedColor);
			} else if (parent === this.uiSelectorContainer) {
				return this._indexInParent(parent, e.currentTarget);
			}
			throw new Error("wat?");
		}
	}, {
		key: "_indexInParent",
		value: function _indexInParent(parent, element) {
			var array = Object.keys(parent.children).map(function (key) {
				return parent.children[key];
			});
			return array.indexOf(element);
		}
	}, {
		key: "_makeColorEle",
		value: function _makeColorEle(color) {
			var colorEle = document.createElement("div");
			var labelEle = document.createElement("div");
			var bg = color.color === _storeModelColorUtil2["default"].COLOR_NONE ? "transparent" : color.color;

			colorEle.classList.add("color");
			labelEle.classList.add("label");

			if (color.color === _storeModelColorUtil2["default"].COLOR_NONE) {
				colorEle.classList.add("bg-none");
			}

			colorEle.style.backgroundColor = bg;

			labelEle.appendChild(document.createTextNode(color.name));
			colorEle.appendChild(labelEle);
			return colorEle;
		}
	}, {
		key: "_queryByClass",
		value: function _queryByClass(parentEle, className) {
			var targetEle = null;
			var children = parentEle.children;
			for (var i = 0; i < children.length; i++) {
				if (children[i].classList.contains(className)) {
					targetEle = children[i];
				}
			}
			return targetEle;
		}
	}]);

	return NativeTemplate;
})(_Template3["default"]);

exports["default"] = NativeTemplate;
module.exports = exports["default"];

},{"../../../action/ActionConstants":9,"../../../store/model/ColorUtil":14,"../Template":17}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _actionActionConstants = require("../../../action/ActionConstants");

var _actionActionConstants2 = _interopRequireDefault(_actionActionConstants);

var _Template2 = require("../Template");

var _Template3 = _interopRequireDefault(_Template2);

var SimpleTemplate = (function (_Template) {
	_inherits(SimpleTemplate, _Template);

	function SimpleTemplate(domId, actionCreator, store) {
		_classCallCheck(this, SimpleTemplate);

		_get(Object.getPrototypeOf(SimpleTemplate.prototype), "constructor", this).call(this, domId, actionCreator, store);
		this.uiButton = null;
		this.uiMainContainer = null;
	}

	_createClass(SimpleTemplate, [{
		key: "start",
		value: function start() {
			this.uiMainContainer = document.getElementById(this._domId);
			this.uiButton = document.createElement("button");
			this.uiButton.innerHTML = "click me";
			this.uiButton.addEventListener("click", this.buttonClickedEvent.bind(this));

			this.uiMainContainer.classList.add("pcp");
			this.uiMainContainer.appendChild(this.uiButton);

			this._store.addListener(_actionActionConstants2["default"].SET_PALETTE_COLORS, this.onPaletteColorsSet.bind(this));
			this._store.addListener(_actionActionConstants2["default"].SET_SELECTOR_COLORS, this.onSelectorColorsSet.bind(this));
			this._store.addListener(_actionActionConstants2["default"].CHANGE_PALETTE_COLOR, this.onPaletteColorsSet.bind(this));
		}
	}, {
		key: "onPaletteColorsSet",
		value: function onPaletteColorsSet() {
			console.log("onPaletteColorsSet: ");
			console.log(this._store.getPaletteColors());
		}
	}, {
		key: "onSelectorColorsSet",
		value: function onSelectorColorsSet() {
			console.log("onSelectorColorsSet:");
			console.log(this._store.getSelectorColors());
		}
	}, {
		key: "buttonClickedEvent",
		value: function buttonClickedEvent(e) {
			var newPalette = [{ color: "#adadad", name: "meow" }, { color: "#dadada", name: "meow" }, { color: "#fedcba", name: "meow" }];
			this._actionCreator[_actionActionConstants2["default"].SET_PALETTE_COLORS](newPalette);
		}
	}]);

	return SimpleTemplate;
})(_Template3["default"]);

exports["default"] = SimpleTemplate;
module.exports = exports["default"];

},{"../../../action/ActionConstants":9,"../Template":17}]},{},[7])(7)
});


//# sourceMappingURL=Main.js.map
