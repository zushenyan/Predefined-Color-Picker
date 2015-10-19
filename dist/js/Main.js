(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pcp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var _PCP = require("./PCP");

var _PCP2 = _interopRequireDefault(_PCP);

exports.ColorUtil = _modelColorUtil2["default"];
exports.Color = _modelColor2["default"];
exports.Palette = _modelPalette2["default"];
exports.Model = _modelModel2["default"];
exports.Controller = _controllerController2["default"];
exports.View = _viewView2["default"];
exports.PCP = _PCP2["default"];

},{"./PCP":2,"./controller/Controller":3,"./model/Color":4,"./model/ColorUtil":5,"./model/Model":6,"./model/Palette":7,"./view/View":8}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

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

var PCP = function PCP() {
	_classCallCheck(this, PCP);

	this.model = null;
	this.controller = null;
	this.view = null;

	this.domId = "pcp";
	this.palette = [new _modelColor2["default"]("", "A"), new _modelColor2["default"]("#eeeeee", "B"), new _modelColor2["default"]("", "C"), new _modelColor2["default"]("", "D"), new _modelColor2["default"]("", "E"), new _modelColor2["default"]("", "F")];

	this.selector = [new _modelColor2["default"]("#ff0000", "A"), new _modelColor2["default"]("#e3ff00", "B"), new _modelColor2["default"]("", "C"), new _modelColor2["default"]("#00baff", ""), new _modelColor2["default"]("#0021ff", ""), new _modelColor2["default"]("#c000c4", "")];

	this.model = new _modelModel2["default"]();
	this.controller = new _controllerController2["default"](this.model);
	this.view = new _viewView2["default"](this.domId, this.controller);

	this.controller.exec("setPaletteColors", this.palette, this.view.paletteColorsChanged.bind(this.view));
	this.controller.exec("setSelectorColors", this.selector, this.view.selectorColorsChanged.bind(this.view));
};

exports["default"] = PCP;
module.exports = exports["default"];

},{"./controller/Controller":3,"./model/Color":4,"./model/ColorUtil":5,"./model/Model":6,"./model/Palette":7,"./view/View":8}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = (function () {
	function Controller(model) {
		_classCallCheck(this, Controller);

		this.model = model;
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

},{}],4:[function(require,module,exports){
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

},{"./ColorUtil":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
	function Model(paletteColors, selectorColors) {
		_classCallCheck(this, Model);

		this.palette = new _Palette2["default"](paletteColors);
		this.selector = new _Palette2["default"](selectorColors);
	}

	_createClass(Model, [{
		key: "setPaletteColors",
		value: function setPaletteColors(colors, callback) {
			this.palette.colors = colors;
			if (callback) {
				callback(this.palette);
			}
		}
	}, {
		key: "setSelectorColors",
		value: function setSelectorColors(colors, callback) {
			this.selector.colors = colors;
			if (callback) {
				callback(this.selector);
			}
		}
	}, {
		key: "changePaletteColor",
		value: function changePaletteColor(index, newColor, callback) {
			this.palette.changeColor(index, newColor);
			if (callback) {
				callback(this.palette, index, newColor);
			}
		}
	}]);

	return Model;
})();

exports["default"] = Model;
module.exports = exports["default"];

},{"./Palette":7}],7:[function(require,module,exports){
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
			this._colors[index] = newColor;
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

},{"./Color":4}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _modelColorUtil = require("../model/ColorUtil");

var _modelColorUtil2 = _interopRequireDefault(_modelColorUtil);

var View = (function () {
	function View(id, controller) {
		_classCallCheck(this, View);

		this.domId = id;
		this.controller = controller;

		this.uiMainContainer = null;
		this.uiPaletteContainer = null;
		this.uiSelectorContainer = null;

		this.uiMainContainer = document.getElementById(this.domId);
		this.uiPaletteContainer = document.createElement("div");
		this.uiSelectorContainer = document.createElement("div");

		this.uiMainContainer.classList.add("pcp");
		this.uiPaletteContainer.classList.add("palette");
		this.uiSelectorContainer.classList.add("selector");

		this.uiMainContainer.appendChild(this.uiPaletteContainer);
		this.uiMainContainer.appendChild(this.uiSelectorContainer);
	}

	_createClass(View, [{
		key: "paletteColorsChanged",
		value: function paletteColorsChanged(palette) {
			this.uiPaletteContainer.innerHTML = "";
			var colors = palette.colors;
			for (var i = 0; i < colors.length; i++) {
				var ele = this._makeColorEle(colors[i]);
				ele.addEventListener("click", this.paletteMouseEvent.bind(this));
				this.uiPaletteContainer.appendChild(ele);
			}
		}
	}, {
		key: "selectorColorsChanged",
		value: function selectorColorsChanged(selector) {
			this.uiSelectorContainer.innerHTML = "";
			var colors = selector.colors;
			for (var i = 0; i < colors.length; i++) {
				var ele = this._makeColorEle(colors[i]);
				ele.addEventListener("click", this.selectorMouseEvent.bind(this));
				this.uiSelectorContainer.appendChild(ele);
			}
		}
	}, {
		key: "paletteColorChanged",
		value: function paletteColorChanged(palette, index, newColor) {
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
			var newColor = this.controller.query("selector").colors[selectorIndex];
			this.controller.exec("changePaletteColor", paletteIndex, newColor, this.paletteColorChanged.bind(this));
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

	return View;
})();

exports["default"] = View;
module.exports = exports["default"];

},{"../model/ColorUtil":5}]},{},[1])(1)
});


//# sourceMappingURL=Main.js.map