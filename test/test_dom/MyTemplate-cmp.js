"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MyTemplate = (function (_pcp$Template) {
	_inherits(MyTemplate, _pcp$Template);

	function MyTemplate(domId, actionCreator, store) {
		_classCallCheck(this, MyTemplate);

		_get(Object.getPrototypeOf(MyTemplate.prototype), "constructor", this).call(this, domId, actionCreator, store);
		this.uiButton = null;
		this.uiMainContainer = null;

		this._reportToken = this._report.bind(this);
	}

	_createClass(MyTemplate, [{
		key: "mount",
		value: function mount() {
			var _this = this;

			this.uiButton = document.createElement("button");
			this.uiButton.addEventListener("click", function (e) {
				var palette = [{ color: "", name: "C" }, { color: "", name: "A" }, { color: "", name: "T" }];
				_this._actionCreator[pcp.ActionConstants.SET_PALETTE_COLORS](palette);
			});
			// this.uiButton.appendChild(document.createTextNode("press me to modify color(see console)"));
			this.uiButton.innerHTML = "press me to modify color(see console)";
			this.uiMainContainer = document.getElementById(this._domId);
			this.uiMainContainer.appendChild(this.uiButton);

			this._store.addListener(pcp.ActionConstants.SET_PALETTE_COLORS, this._reportToken);
			this._store.addListener(pcp.ActionConstants.SET_SELECTOR_COLORS, this._reportToken);
			this._store.addListener(pcp.ActionConstants.CHANGE_PALETTE_COLOR, this._reportToken);
		}
	}, {
		key: "unmount",
		value: function unmount() {
			this._store.removeListener(pcp.ActionConstants.SET_PALETTE_COLORS, this._reportToken);
			this._store.removeListener(pcp.ActionConstants.SET_SELECTOR_COLORS, this._reportToken);
			this._store.removeListener(pcp.ActionConstants.CHANGE_PALETTE_COLOR, this._reportToken);
		}
	}, {
		key: "_report",
		value: function _report() {
			console.log(this._store.getPaletteColors());
			console.log(this._store.getSelectorColors());
		}
	}]);

	return MyTemplate;
})(pcp.Template);
