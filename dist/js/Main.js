(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pcp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _modelColorUtil = require("./model/ColorUtil");

var _modelPalette = require("./model/Palette");

var _modelModel = require("./model/Model");

exports.ColorUtil = _modelColorUtil.ColorUtil;
exports.Palette = _modelPalette.Palette;
exports.Model = _modelModel.Model;

},{"./model/ColorUtil":2,"./model/Model":3,"./model/Palette":4}],2:[function(require,module,exports){
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
			for (var i = 0; i < colors.length; i++) {
				if (!ColorUtil.HEXCOLOR_REGEXP.test(colors[i])) {
					return false;
				}
			}
			return true;
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
				return "#" + hexCode;
			});
			return colors;
		}
	}, {
		key: "HEXCOLOR_REGEXP",
		get: function get() {
			return (/^#[0-9|a-f]{6}$/i
			);
		}
	}]);

	return ColorUtil;
})();

exports.ColorUtil = ColorUtil;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Palette = require("./Palette");

var Model = (function () {
	function Model(paletteColors, selectorColors) {
		_classCallCheck(this, Model);

		this.palette = new _Palette.Palette();
		this.setPaletteColors(paletteColors);
		this.setSelectorColors(selectorColors);
	}

	_createClass(Model, [{
		key: "setPaletteColors",
		value: function setPaletteColors(colors, callback) {
			this.palette.paletteColors = colors;
			if (callback) {
				callback(this.palette);
			}
		}
	}, {
		key: "setSelectorColors",
		value: function setSelectorColors(colors, callback) {
			this.palette.selectorColors = colors;
			if (callback) {
				callback(this.palette);
			}
		}
	}, {
		key: "changePaletteColor",
		value: function changePaletteColor(index, newColor, callback) {
			this.palette.changePaletteColor(index, newColor);
			if (callback) {
				callback(this.palette);
			}
		}
	}]);

	return Model;
})();

exports.Model = Model;

},{"./Palette":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ColorUtil = require("./ColorUtil");

var Palette = (function () {
	function Palette(paletteColors, selectorColors) {
		_classCallCheck(this, Palette);

		this._paletteColors = paletteColors || [];
		this._selectorColors = selectorColors || [];
	}

	_createClass(Palette, [{
		key: "changePaletteColor",
		value: function changePaletteColor(index, newColor) {
			if (!this._paletteColors[index]) {
				throw new Error("target is not exist.");
			}
			if (!_ColorUtil.ColorUtil.isHexColors([newColor])) {
				throw new Error(newColor + " is not an invalid hex color code");
			}
			this._paletteColors[index] = newColor;
		}
	}, {
		key: "paletteColors",
		set: function set(colors) {
			if (!_ColorUtil.ColorUtil.isHexColors(colors)) {
				throw new Error(colors + " contains invalid hex color code");
			}
			this._paletteColors = colors;
		},
		get: function get() {
			return this._paletteColors;
		}
	}, {
		key: "selectorColors",
		set: function set(colors) {
			if (!_ColorUtil.ColorUtil.isHexColors(colors)) {
				throw new Error(colors + " contains invalid hex color code");
			}
			this._selectorColors = colors;
		},
		get: function get() {
			return this._selectorColors;
		}
	}]);

	return Palette;
})();

exports.Palette = Palette;

},{"./ColorUtil":2}]},{},[1])(1)
});


//# sourceMappingURL=Main.js.map