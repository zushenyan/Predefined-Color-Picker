// function MyTemplate(domId, controller){
// 	pcp.Template.apply(this, domId, controller);
// 	this.uiHelloWorld = null;
// }
//
// MyTemplate.prototype = Object.create(pcp.Template);
// MyTemplate.prototype.constructor = MyTemplate;
//
// MyTemplate.prototype.start = function(){
// 	this.uiHelloWorld = document.createElement("div");
// 	this.uiHelloWorld.appendChild(document.createTextNode("Hello World!"));
// 	this.uiMainContainer.appendChild(this.uiHelloWorld);
// };
//
// MyTemplate.prototype.clear = function(){
// 		pcp.Template.prototype.clear.apply(this);
// };
//
// MyTemplate.prototype.onPaletteColorsSet = function(palette){
//
// };
// MyTemplate.prototype.onSelectorColorsSet = function(selctor){
//
// };
// MyTemplate.prototype.onPaletteColorChanged = function(palette, index, newColor){
//
// };

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MyTemplate = (function (_pcp$Template) {
	_inherits(MyTemplate, _pcp$Template);

	function MyTemplate(domId, controller) {
		_classCallCheck(this, MyTemplate);

		_get(Object.getPrototypeOf(MyTemplate.prototype), "constructor", this).call(this, domId, controller);
		this.uiHelloWorld = null;
	}

	_createClass(MyTemplate, [{
		key: "start",
		value: function start() {
			this.uiHelloWorld = document.createElement("div");
			this.uiHelloWorld.appendChild(document.createTextNode("Hello World!"));
			this.uiMainContainer.appendChild(this.uiHelloWorld);
		}
	}, {
		key: "clear",
		value: function clear() {
			_get(Object.getPrototypeOf(MyTemplate.prototype), "clear", this).call(this);
		}
	}, {
		key: "onPaletteColorsSet",
		value: function onPaletteColorsSet(palette) {}
	}, {
		key: "onSelectorColorsSet",
		value: function onSelectorColorsSet(selector) {}
	}, {
		key: "onPaletteColorChanged",
		value: function onPaletteColorChanged(palette, index, newColor) {}
	}]);

	return MyTemplate;
})(pcp.Template);
