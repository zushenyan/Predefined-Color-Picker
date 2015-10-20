(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pcp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = (function () {
	function Config() {
		_classCallCheck(this, Config);

		this.values = {};
		this.actions = {};
	}

	_createClass(Config, [{
		key: "append",
		value: function append(key, value, action) {
			this.values[key] = value;
			this.actions[key] = action;
		}
	}, {
		key: "update",
		value: function update(key, value) {
			var action = arguments.length <= 2 || arguments[2] === undefined ? this.actions[key] : arguments[2];
			return (function () {
				if (this.values.hasOwnProperty(key) && this.actions.hasOwnProperty(key)) {
					this.values[key] = value;
					this.actions[key] = action;
					return true;
				}
				return false;
			}).apply(this, arguments);
		}
	}, {
		key: "query",
		value: function query(key) {
			return this.values[key];
		}
	}, {
		key: "exec",
		value: function exec(key) {
			var _actions;

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			return this.actions[key] ? (_actions = this.actions)[key].apply(_actions, args) : null;
		}
	}]);

	return Config;
})();

exports["default"] = Config;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _modelColorUtil = require("./model/ColorUtil");

var _modelColorUtil2 = _interopRequireDefault(_modelColorUtil);

var _modelColor = require("./model/Color");

var _modelColor2 = _interopRequireDefault(_modelColor);

var _modelPalette = require("./model/Palette");

var _modelPalette2 = _interopRequireDefault(_modelPalette);

var _modelModel = require("./model/Model");

var _modelModel2 = _interopRequireDefault(_modelModel);

var _controllerController = require("./controller/Controller");

var _controllerController2 = _interopRequireDefault(_controllerController);

var _viewView = require("./view/View");

var _viewView2 = _interopRequireDefault(_viewView);

var _Config = require("./Config");

var _Config2 = _interopRequireDefault(_Config);

var _PCP = require("./PCP");

var _PCP2 = _interopRequireDefault(_PCP);

var _viewDefaultTemplate = require("./view/DefaultTemplate");

var _viewDefaultTemplate2 = _interopRequireDefault(_viewDefaultTemplate);

var _viewDummyTemplate = require("./view/DummyTemplate");

var _viewDummyTemplate2 = _interopRequireDefault(_viewDummyTemplate);

var _Util = require("./Util");

var _Util2 = _interopRequireDefault(_Util);

exports.ColorUtil = _modelColorUtil2["default"];
exports.Color = _modelColor2["default"];
exports.Palette = _modelPalette2["default"];
exports.Model = _modelModel2["default"];
exports.Controller = _controllerController2["default"];
exports.View = _viewView2["default"];
exports.PCP = _PCP2["default"];
exports.Config = _Config2["default"];
exports.DefaultTemplate = _viewDefaultTemplate2["default"];
exports.DummyTemplate = _viewDummyTemplate2["default"];
exports.Util = _Util2["default"];

},{"./Config":1,"./PCP":3,"./Util":4,"./controller/Controller":5,"./model/Color":6,"./model/ColorUtil":7,"./model/Model":8,"./model/Palette":10,"./view/DefaultTemplate":11,"./view/DummyTemplate":12,"./view/View":14}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _modelColorUtil = require("./model/ColorUtil");

var _modelColorUtil2 = _interopRequireDefault(_modelColorUtil);

var _modelColor = require("./model/Color");

var _modelColor2 = _interopRequireDefault(_modelColor);

var _modelPalette = require("./model/Palette");

var _modelPalette2 = _interopRequireDefault(_modelPalette);

var _modelModel = require("./model/Model");

var _modelModel2 = _interopRequireDefault(_modelModel);

var _controllerController = require("./controller/Controller");

var _controllerController2 = _interopRequireDefault(_controllerController);

var _viewView = require("./view/View");

var _viewView2 = _interopRequireDefault(_viewView);

var _viewDefaultTemplate = require("./view/DefaultTemplate");

var _viewDefaultTemplate2 = _interopRequireDefault(_viewDefaultTemplate);

var _viewDummyTemplate = require("./view/DummyTemplate");

var _viewDummyTemplate2 = _interopRequireDefault(_viewDummyTemplate);

var _Config = require("./Config");

var _Config2 = _interopRequireDefault(_Config);

var PCP = (function () {
	function PCP(config) {
		_classCallCheck(this, PCP);

		this.model = null;
		this.controller = null;
		this.view = null;

		this._config = this._createConfig();

		this.model = new _modelModel2["default"]();
		this.controller = new _controllerController2["default"](this.model);
		this.view = new _viewView2["default"](this._config.query("id"), this.controller, this._config.query("template"));
		this.model.listener = this.view;

		this.set(config);
	}

	_createClass(PCP, [{
		key: "set",
		value: function set() {
			var _this = this;

			var newConfig = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			Object.keys(newConfig).forEach(function (key) {
				var newValue = newConfig[key];
				_this._config.update(key, newValue);
				_this._config.exec(key);
			});
		}
	}, {
		key: "run",
		value: function run() {
			this.controller.exec("setPaletteColors", this._config.query("palette"));
			this.controller.exec("setSelectorColors", this._config.query("selector"));
		}
	}, {
		key: "_createConfig",
		value: function _createConfig() {
			var _this2 = this;

			var dc = PCP.DEFAULT_CONFIG;
			var c = new _Config2["default"]();
			c.append("id", dc["id"], function () {
				_this2.view.domId = _this2._config.query("id");
			});
			c.append("palette", dc["palette"], function () {
				_this2.controller.exec("setPaletteColors", _this2._config.query("palette"));
			});
			c.append("selector", dc["selector"], function () {
				_this2.controller.exec("setSelectorColors", _this2._config.query("selector"));
			});
			c.append("template", dc["template"], function () {
				_this2.view.template = _this2._config.query("template");
			});
			return c;
		}
	}], [{
		key: "DEFAULT_CONFIG",
		get: function get() {
			return {
				id: "pcp",
				palette: [{ color: "", name: "A" }, { color: "", name: "B" }, { color: "", name: "C" }, { color: "", name: "D" }, { color: "", name: "E" }],
				selector: [{ color: "", name: "" }, { color: "#ff0000", name: "" }, { color: "#e3ff00", name: "" }, { color: "#00baff", name: "" }, { color: "#0021ff", name: "" }],
				template: _viewDefaultTemplate2["default"]
			};
		}
	}]);

	return PCP;
})();

exports["default"] = PCP;
module.exports = exports["default"];

},{"./Config":1,"./controller/Controller":5,"./model/Color":6,"./model/ColorUtil":7,"./model/Model":8,"./model/Palette":10,"./view/DefaultTemplate":11,"./view/DummyTemplate":12,"./view/View":14}],4:[function(require,module,exports){
"use strict";

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = (function () {
	function Controller(model) {
		_classCallCheck(this, Controller);

		this.model = model || null;
	}

	_createClass(Controller, [{
		key: "exec",
		value: function exec(command) {
			if (this.model[command] instanceof Function) {
				var _model;

				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					args[_key - 1] = arguments[_key];
				}

				return (_model = this.model)[command].apply(_model, args);
			} else if (this.model[command]) {
				return this.model[command];
			} else {
				throw new Error("No such command: " + command);
			}
		}

		/**
  	Just a wrapper for semantic-comfort purpose.
  	Let you feels like you really want to look up something intead of executing something.
  */
	}, {
		key: "query",
		value: function query(command) {
			return this.exec(command);
		}
	}]);

	return Controller;
})();

exports["default"] = Controller;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
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

},{"./ColorUtil":7}],7:[function(require,module,exports){
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
				serial += colors[i].slice(1);
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

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Palette = require("./Palette");

var _Palette2 = _interopRequireDefault(_Palette);

var Model = (function () {
	function Model(paletteColors, selectorColors, listener) {
		_classCallCheck(this, Model);

		this.palette = new _Palette2["default"](paletteColors);
		this.selector = new _Palette2["default"](selectorColors);
		this.listener = listener;
	}

	_createClass(Model, [{
		key: "setPaletteColors",
		value: function setPaletteColors(colors) {
			this.palette.colors = colors;
			if (this.listener) {
				this.listener.onPaletteColorsSet(this.palette);
			}
		}
	}, {
		key: "setSelectorColors",
		value: function setSelectorColors(colors) {
			this.selector.colors = colors;
			if (this.listener) {
				this.listener.onSelectorColorsSet(this.selector);
			}
		}
	}, {
		key: "changePaletteColor",
		value: function changePaletteColor(index, newColor) {
			newColor = this.palette.changeColor(index, newColor);
			if (this.listener) {
				this.listener.onPaletteColorChanged(this.palette, index, newColor);
			}
		}
	}]);

	return Model;
})();

exports["default"] = Model;
module.exports = exports["default"];

},{"./Palette":10}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelEventListener = (function () {
	function ModelEventListener() {
		_classCallCheck(this, ModelEventListener);

		if (this.constructor === "ModelEventListener") {
			throw new Error("This class is an interface! Shouldn't be instantiated!");
		}
		return this;
	}

	_createClass(ModelEventListener, [{
		key: "onPaletteColorsSet",
		value: function onPaletteColorsSet(palette) {
			throw new Error("Needs to be implemented.");
		}
	}, {
		key: "onSelectorColorsSet",
		value: function onSelectorColorsSet(selector) {
			throw new Error("Needs to be implemented.");
		}
	}, {
		key: "onPaletteColorChanged",
		value: function onPaletteColorChanged(palette, index, newColor) {
			throw new Error("Needs to be implemented.");
		}
	}]);

	return ModelEventListener;
})();

exports["default"] = ModelEventListener;
module.exports = exports["default"];

},{}],10:[function(require,module,exports){
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

},{"./Color":6}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Template2 = require("./Template");

var _Template3 = _interopRequireDefault(_Template2);

var _modelColorUtil = require("../model/ColorUtil");

var _modelColorUtil2 = _interopRequireDefault(_modelColorUtil);

var DefaultTemplate = (function (_Template) {
	_inherits(DefaultTemplate, _Template);

	function DefaultTemplate(domId, controller) {
		_classCallCheck(this, DefaultTemplate);

		_get(Object.getPrototypeOf(DefaultTemplate.prototype), "constructor", this).call(this, domId, controller);
		this.uiPaletteContainer = null;
		this.uiSelectorContainer = null;
	}

	_createClass(DefaultTemplate, [{
		key: "start",
		value: function start() {
			this.uiPaletteContainer = document.createElement("div");
			this.uiSelectorContainer = document.createElement("div");

			this.uiMainContainer.classList.add("pcp");
			this.uiPaletteContainer.classList.add("palette");
			this.uiSelectorContainer.classList.add("selector");

			this.uiMainContainer.appendChild(this.uiPaletteContainer);
			this.uiMainContainer.appendChild(this.uiSelectorContainer);

			var palette = this.controller.query("palette");
			var selector = this.controller.query("selector");
			this.onPaletteColorsSet(palette);
			this.onSelectorColorsSet(selector);
		}
	}, {
		key: "clear",
		value: function clear() {
			_get(Object.getPrototypeOf(DefaultTemplate.prototype), "clear", this).call(this);
			this.uiMainContainer.className = "";
		}
	}, {
		key: "onPaletteColorsSet",
		value: function onPaletteColorsSet(palette) {
			this.uiPaletteContainer.innerHTML = "";
			var colors = palette.colors;
			for (var i = 0; i < colors.length; i++) {
				var ele = this._makeColorEle(colors[i]);
				ele.addEventListener("click", this.paletteMouseEvent.bind(this));
				this.uiPaletteContainer.appendChild(ele);
			}
		}
	}, {
		key: "onSelectorColorsSet",
		value: function onSelectorColorsSet(selector) {
			this.uiSelectorContainer.innerHTML = "";
			var colors = selector.colors;
			for (var i = 0; i < colors.length; i++) {
				var ele = this._makeColorEle(colors[i]);
				ele.addEventListener("click", this.selectorMouseEvent.bind(this));
				this.uiSelectorContainer.appendChild(ele);
			}
		}
	}, {
		key: "onPaletteColorChanged",
		value: function onPaletteColorChanged(palette, index, newColor) {
			var childEle = this.uiPaletteContainer.children[index];
			var bgColor = newColor.color;
			if (bgColor === "") {
				bgColor = "transparent";
				childEle.classList.add("bg-none");
			} else {
				childEle.classList.remove("bg-none");
			}
			childEle.style.backgroundColor = bgColor;
		}
	}, {
		key: "paletteMouseEvent",
		value: function paletteMouseEvent(e) {
			var lastSelectedColor = this._queryByClass(this.uiPaletteContainer, "selected");
			if (lastSelectedColor) {
				lastSelectedColor.classList.remove("selected");
			}
			if (e.currentTarget !== lastSelectedColor) {
				e.currentTarget.classList.add("selected");
			}
		}
	}, {
		key: "selectorMouseEvent",
		value: function selectorMouseEvent(e) {
			var _this = this;

			var selectedColor = this._queryByClass(this.uiPaletteContainer, "selected");
			var paletteArray = Object.keys(this.uiPaletteContainer.children).map(function (i) {
				return _this.uiPaletteContainer.children[i];
			});
			var selectorArray = Object.keys(this.uiSelectorContainer.children).map(function (i) {
				return _this.uiSelectorContainer.children[i];
			});
			var selectorIndex = selectorArray.indexOf(e.currentTarget);
			var paletteIndex = paletteArray.indexOf(selectedColor);
			if (selectorIndex < 0 || paletteIndex < 0) {
				return;
			}
			var newColor = this.controller.query("selector").colors[selectorIndex].color;
			var name = this.controller.query("palette").colors[paletteIndex].name;
			var copyColor = {
				color: newColor,
				name: name
			};
			this.controller.exec("changePaletteColor", paletteIndex, copyColor);
		}
	}, {
		key: "_makeColorEle",
		value: function _makeColorEle(color) {
			var colorEle = document.createElement("div");
			var labelEle = document.createElement("div");
			var bg = color.color === _modelColorUtil2["default"].COLOR_NONE ? "transparent" : color.color;

			colorEle.classList.add("color");
			labelEle.classList.add("label");

			if (color.color === _modelColorUtil2["default"].COLOR_NONE) {
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

	return DefaultTemplate;
})(_Template3["default"]);

exports["default"] = DefaultTemplate;
module.exports = exports["default"];

},{"../model/ColorUtil":7,"./Template":13}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Template2 = require("./Template");

var _Template3 = _interopRequireDefault(_Template2);

var DummyTemplate = (function (_Template) {
	_inherits(DummyTemplate, _Template);

	function DummyTemplate(domId, controller) {
		_classCallCheck(this, DummyTemplate);

		_get(Object.getPrototypeOf(DummyTemplate.prototype), "constructor", this).call(this, domId, controller);
		this.uiButton = null;
	}

	_createClass(DummyTemplate, [{
		key: "start",
		value: function start() {
			this.uiButton = document.createElement("button");
			this.uiButton.innerHTML = "click me";
			this.uiButton.addEventListener("click", this.buttonClickedEvent.bind(this));

			this.uiMainContainer.classList.add("pcp");
			this.uiMainContainer.appendChild(this.uiButton);
		}
	}, {
		key: "onPaletteColorsSet",
		value: function onPaletteColorsSet(palette) {
			console.log("onPaletteColorsSet: ");
			console.log(palette);
		}
	}, {
		key: "onSelectorColorsSet",
		value: function onSelectorColorsSet(selector) {
			console.log("onSelectorColorsSet:");
			console.log(selector);
		}
	}, {
		key: "onPaletteColorChanged",
		value: function onPaletteColorChanged(palette, index, newColor) {
			console.log("onPaletteColorChanged:");
			console.log("palette: ");
			console.log(palette);
			console.log("index: ");
			console.log(index);
			console.log("newColor: ");
			console.log(newColor);
		}
	}, {
		key: "buttonClickedEvent",
		value: function buttonClickedEvent(e) {
			var newPalette = [{ color: "#adadad", name: "meow" }, { color: "#dadada", name: "meow" }, { color: "#fedcba", name: "meow" }];
			this.controller.exec("setPaletteColors", newPalette);
		}
	}]);

	return DummyTemplate;
})(_Template3["default"]);

exports["default"] = DummyTemplate;
module.exports = exports["default"];

},{"./Template":13}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _modelModelEventListener = require("../model/ModelEventListener");

var _modelModelEventListener2 = _interopRequireDefault(_modelModelEventListener);

/**
	@abstract
*/

var Template = (function (_ModelEventListener) {
	_inherits(Template, _ModelEventListener);

	function Template(domId, controller) {
		_classCallCheck(this, Template);

		_get(Object.getPrototypeOf(Template.prototype), "constructor", this).call(this);
		if (this.constructor === "Template") {
			throw new Error("Template is an abstract class!");
		}
		this.domId = domId || null;
		this.controller = controller || null;
		this.uiMainContainer = document.getElementById(this.domId) || null;
		return this;
	}

	_createClass(Template, [{
		key: "clear",
		value: function clear() {
			this.uiMainContainer.innerHTML = "";
		}
	}, {
		key: "start",
		value: function start() {
			throw new Error("Need to be implemented.");
		}
	}]);

	return Template;
})(_modelModelEventListener2["default"]);

exports["default"] = Template;
module.exports = exports["default"];

},{"../model/ModelEventListener":9}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _modelModelEventListener = require("../model/ModelEventListener");

var _modelModelEventListener2 = _interopRequireDefault(_modelModelEventListener);

var View = (function (_ModelEventListener) {
	_inherits(View, _ModelEventListener);

	function View(domId, controller, template) {
		_classCallCheck(this, View);

		_get(Object.getPrototypeOf(View.prototype), "constructor", this).call(this);
		this._templatePrototype = null;
		this._template = null;
		this._domId = null;

		this.controller = controller;
		this.domId = domId;
		this.template = template;
	}

	_createClass(View, [{
		key: "domId",
		set: function set(id) {
			this._domId = id;
			if (this._templatePrototype) {
				this.template = this._templatePrototype;
			}
		},
		get: function get() {
			return this._domId;
		}

		/**
  	@arg {Template} template - only accepts the NAME of the object, for example:
  	right way
  	view.template = DefaultTemplate;
  	wrong way
  	view.template = new DefaultTemplate();
  */
	}, {
		key: "template",
		set: function set(template) {
			if (!template) {
				return;
			}
			if (this.template) {
				this._template.clear();
			}
			this._templatePrototype = template;
			this._template = new this._templatePrototype(this.domId, this.controller);
			this.onPaletteColorsSet = this._template.onPaletteColorsSet.bind(this._template);
			this.onSelectorColorsSet = this._template.onSelectorColorsSet.bind(this._template);
			this.onPaletteColorChanged = this._template.onPaletteColorChanged.bind(this._template);

			this._template.start();
		},
		get: function get() {
			return this._templatePrototype;
		}
	}]);

	return View;
})(_modelModelEventListener2["default"]);

exports["default"] = View;
module.exports = exports["default"];

},{"../model/ModelEventListener":9}]},{},[2])(2)
});


//# sourceMappingURL=Main.js.map