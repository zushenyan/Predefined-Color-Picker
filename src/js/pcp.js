(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _pcpClass = require("./pcpClass");

(function (window) {
	"use strict";

	window.PCP = _pcpClass.PCP;
})(window);

},{"./pcpClass":2}],2:[function(require,module,exports){
/*
	Anything starting with underscore means that its a private member.
	Don't try to call them outside or may make unexpected result.
*/

"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PCP = (function () {
	function PCP(domId, paletteColors, selectorColors) {
		_classCallCheck(this, PCP);

		this._listenerList = {};
		this._setDomId(domId);
		this._initUI(paletteColors, selectorColors);
	}

	_createClass(PCP, [{
		key: "_initUI",
		value: function _initUI(paletteColors, selectorColors) {
			var uiPalette = document.createElement("ul");
			var uiSelector = document.createElement("ul");
			var uiMain = document.getElementById(this.getDomId());

			uiPalette.classList.add("pcp-palette");
			uiSelector.classList.add("pcp-selector");
			uiMain.appendChild(uiPalette);
			uiMain.appendChild(uiSelector);
			this.setPaletteColors(paletteColors);
			this.setSelectorColors(selectorColors);
		}
	}, {
		key: "_setDomId",
		value: function _setDomId(domId) {
			if (typeof domId !== "string") {
				throw new TypeError("parameter domId should be type of string: " + domId);
			}
			this._domIdString = domId;
		}
	}, {
		key: "getDomId",
		value: function getDomId() {
			return this._domIdString;
		}

		/*
  	@color - receives an array of objects with properties of "color" and "name".
  	The array format shuold be like this:
  	[{color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}...]
  */
	}, {
		key: "setPaletteColors",
		value: function setPaletteColors(colors) {
			var _this = this;

			if (!(colors instanceof Array)) {
				throw new TypeError("parameter colors should be type of array: " + colors);
			}

			var palette = document.querySelector("#" + this.getDomId() + " .pcp-palette");
			palette.innerHTML = "";
			this._paletteColorList = [];

			colors.forEach(function (value) {
				var li = _this._makeColorEle(value);
				li.addEventListener("click", _this._paletteEvent.bind(_this));
				_this._paletteColorList.push(li);
				palette.appendChild(li);
			});
		}
	}, {
		key: "getPaletteColors",
		value: function getPaletteColors() {
			return this._parseColorUi(this._paletteColorList);
		}

		/*
  	@color - receives an array of objects with properties of "color" and "name".
  	The array format shuold be like this:
  	[{color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}...]
  */
	}, {
		key: "setSelectorColors",
		value: function setSelectorColors(colors) {
			var _this2 = this;

			if (!(colors instanceof Array)) {
				throw new TypeError("parameter colors should be type of array: " + colors);
			}

			var selector = document.querySelector("#" + this.getDomId() + " .pcp-selector");
			selector.innerHTML = "";
			this._selectorColorList = [];

			colors.forEach(function (value) {
				var li = _this2._makeColorEle(value);
				li.addEventListener("click", _this2._selectorEvent.bind(_this2));
				_this2._selectorColorList.push(li);
				selector.appendChild(li);
			});
		}
	}, {
		key: "getSelectorColors",
		value: function getSelectorColors() {
			return this._parseColorUi(this._selectorColorList);
		}
	}, {
		key: "addEventListener",
		value: function addEventListener(listener, name) {
			if (name === "undefined" || name === null || typeof name !== "string") {
				throw new TypeError("parameter name should be type of string: " + name);
			}
			this._listenerList[name] = listener;
		}
	}, {
		key: "removeEventListener",
		value: function removeEventListener(name) {
			delete this._listenerList[name];
		}

		/*
  	event contains properties below:
  	@index - the index of the current selection color element in _paletteColorList.
  	@color - what color is for the current target.
  */
	}, {
		key: "_notifyListener",
		value: function _notifyListener(event) {
			for (var key in this._listenerList) {
				this._listenerList[key](event);
			}
		}
	}, {
		key: "_makeColorEle",
		value: function _makeColorEle(colorObj) {
			var uiLi = document.createElement("li");
			var uiSpan = document.createElement("span");
			if (colorObj.color === PCP.COLOR_NONE) {
				uiLi.classList.toggle(PCP.COLOR_NONE);
			} else {
				uiLi.style.backgroundColor = colorObj.color;
			}
			uiSpan.appendChild(document.createTextNode(colorObj.name));
			uiLi.appendChild(uiSpan);
			return uiLi;
		}
	}, {
		key: "_paletteEvent",
		value: function _paletteEvent(e) {
			var allPaletteColor = document.querySelectorAll("#" + this.getDomId() + " .pcp-palette li");
			var isSelected = e.currentTarget.classList.contains("current-selection");
			Array.prototype.forEach.call(allPaletteColor, function (val) {
				val.classList.remove("current-selection");
			});
			if (isSelected) {
				e.currentTarget.classList.remove("current-selection");
			} else {
				e.currentTarget.classList.add("current-selection");
			}
		}
	}, {
		key: "_selectorEvent",
		value: function _selectorEvent(e) {
			var currentSelectionColor = document.querySelector("#" + this.getDomId() + " .pcp-palette .current-selection");
			var bgColor = e.currentTarget.style.backgroundColor;
			if (!currentSelectionColor) {
				return;
			}
			currentSelectionColor.className = e.currentTarget.className;
			currentSelectionColor.classList.add("current-selection");
			currentSelectionColor.style.backgroundColor = bgColor;
			bgColor = e.currentTarget.classList.contains(PCP.COLOR_NONE) ? PCP.COLOR_NONE : bgColor;
			var index = this._paletteColorList.indexOf(currentSelectionColor);
			this._notifyListener({
				index: index,
				color: bgColor
			});
		}

		/*
  	@container - should either be pcp-palette or pcp-selector
  */
	}, {
		key: "_parseColorUi",
		value: function _parseColorUi(container) {
			var colorList = [];
			container.forEach(function (val) {
				var colorObj = {};
				var color = val.classList.contains(PCP.COLOR_NONE) ? PCP.COLOR_NONE : val.style.backgroundColor;
				var name = val.childNodes[0].innerText || val.childNodes[0].textContent;
				colorObj["color"] = color;
				colorObj["name"] = name;
				colorList.push(colorObj);
			});
			return colorList;
		}
	}], [{
		key: "COLOR_NONE",
		get: function get() {
			return "color-none";
		}
	}]);

	return PCP;
})();

exports.PCP = PCP;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvenVzaGVueWFuL0RvY3VtZW50cy9HaXRodWIvUHJlZGVmaW5lZC1Db2xvci1QaWNrZXIvYmFiZWwvcGNwLmpzIiwiL1VzZXJzL3p1c2hlbnlhbi9Eb2N1bWVudHMvR2l0aHViL1ByZWRlZmluZWQtQ29sb3ItUGlja2VyL2JhYmVsL3BjcENsYXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7d0JDQWtCLFlBQVk7O0FBRTlCLENBQUMsVUFBUyxNQUFNLEVBQUM7QUFDaEIsYUFBWSxDQUFDOztBQUViLE9BQU0sQ0FBQyxHQUFHLGdCQUFNLENBQUM7Q0FDakIsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNERSxHQUFHO0FBT0osVUFQQyxHQUFHLENBT0gsS0FBSyxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUM7d0JBUHJDLEdBQUc7O0FBUWQsTUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDeEIsTUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QixNQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztFQUM1Qzs7Y0FYVyxHQUFHOztTQWFSLGlCQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUM7QUFDckMsT0FBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxPQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLE9BQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7O0FBRXRELFlBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3ZDLGFBQVUs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LEdBQUcsR0FBRyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFDeEYsT0FBSSxLQUFLLEdBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ25FLE9BQUksQ0FBQyxlQUFlLENBQUM7QUFDcEIsU0FBSyxFQUFFLEtBQUs7QUFDWixTQUFLLEVBQUUsT0FBTztJQUNkLENBQUMsQ0FBQztHQUNIOzs7Ozs7O1NBS1ksdUJBQUMsU0FBUyxFQUFDO0FBQ3ZCLE9BQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNuQixZQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQzFCLFFBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztBQUNoRyxRQUFJLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUN4RSxZQUFRLENBQUMsT0FBTyxDQUFDLEdBQUksS0FBSyxDQUFDO0FBQzNCLFlBQVEsQ0FBQyxNQUFNLENBQUMsR0FBSSxJQUFJLENBQUM7QUFDekIsYUFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUM7QUFDSCxVQUFPLFNBQVMsQ0FBQztHQUNqQjs7O09BRW9CLGVBQUU7QUFBRSxVQUFPLFlBQVksQ0FBQztHQUFFOzs7UUE1S25DLEdBQUciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtQQ1B9IGZyb20gXCIuL3BjcENsYXNzXCI7XG5cbihmdW5jdGlvbih3aW5kb3cpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR3aW5kb3cuUENQID0gUENQO1xufSkod2luZG93KTtcbiIsIi8qXG5cdEFueXRoaW5nIHN0YXJ0aW5nIHdpdGggdW5kZXJzY29yZSBtZWFucyB0aGF0IGl0cyBhIHByaXZhdGUgbWVtYmVyLlxuXHREb24ndCB0cnkgdG8gY2FsbCB0aGVtIG91dHNpZGUgb3IgbWF5IG1ha2UgdW5leHBlY3RlZCByZXN1bHQuXG4qL1xuXG5leHBvcnQgY2xhc3MgUENQe1xuXHRfZG9tSWRTdHJpbmc7XG5cdF9saXN0ZW5lckxpc3Q7XG5cblx0X3BhbGV0dGVDb2xvckxpc3Q7XG5cdF9zZWxlY3RvckNvbG9yTGlzdDtcblxuXHRjb25zdHJ1Y3Rvcihkb21JZCwgcGFsZXR0ZUNvbG9ycywgc2VsZWN0b3JDb2xvcnMpe1xuXHRcdHRoaXMuX2xpc3RlbmVyTGlzdCA9IHt9O1xuXHRcdHRoaXMuX3NldERvbUlkKGRvbUlkKTtcblx0XHR0aGlzLl9pbml0VUkocGFsZXR0ZUNvbG9ycywgc2VsZWN0b3JDb2xvcnMpO1xuXHR9XG5cblx0X2luaXRVSShwYWxldHRlQ29sb3JzLCBzZWxlY3RvckNvbG9ycyl7XG5cdFx0bGV0IHVpUGFsZXR0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcblx0XHRsZXQgdWlTZWxlY3RvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcblx0XHRsZXQgdWlNYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5nZXREb21JZCgpKTtcblxuXHRcdHVpUGFsZXR0ZS5jbGFzc0xpc3QuYWRkKFwicGNwLXBhbGV0dGVcIik7XG5cdFx0dWlTZWxlY3Rvci5jbGFzc0xpc3QuYWRkKFwicGNwLXNlbGVjdG9yXCIpO1xuXHRcdHVpTWFpbi5hcHBlbmRDaGlsZCh1aVBhbGV0dGUpO1xuXHRcdHVpTWFpbi5hcHBlbmRDaGlsZCh1aVNlbGVjdG9yKTtcblx0XHR0aGlzLnNldFBhbGV0dGVDb2xvcnMocGFsZXR0ZUNvbG9ycyk7XG5cdFx0dGhpcy5zZXRTZWxlY3RvckNvbG9ycyhzZWxlY3RvckNvbG9ycyk7XG5cdH1cblxuXHRfc2V0RG9tSWQoZG9tSWQpe1xuXHRcdGlmKHR5cGVvZiBkb21JZCAhPT0gXCJzdHJpbmdcIil7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwicGFyYW1ldGVyIGRvbUlkIHNob3VsZCBiZSB0eXBlIG9mIHN0cmluZzogXCIgKyBkb21JZCk7XG5cdFx0fVxuXHRcdHRoaXMuX2RvbUlkU3RyaW5nID0gZG9tSWQ7XG5cdH1cblxuXHRnZXREb21JZCgpe1xuXHRcdHJldHVybiB0aGlzLl9kb21JZFN0cmluZztcblx0fVxuXG5cdC8qXG5cdFx0QGNvbG9yIC0gcmVjZWl2ZXMgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIHByb3BlcnRpZXMgb2YgXCJjb2xvclwiIGFuZCBcIm5hbWVcIi5cblx0XHRUaGUgYXJyYXkgZm9ybWF0IHNodW9sZCBiZSBsaWtlIHRoaXM6XG5cdFx0W3tjb2xvcjogXCIjZmZmZmZmXCIsIG5hbWU6IFwiRm9vYmFyXCJ9LCB7Y29sb3I6IFwiI2ZmZmZmZlwiLCBuYW1lOiBcIkZvb2JhclwifSwge2NvbG9yOiBcIiNmZmZmZmZcIiwgbmFtZTogXCJGb29iYXJcIn0uLi5dXG5cdCovXG5cdHNldFBhbGV0dGVDb2xvcnMoY29sb3JzKXtcblx0XHRpZighKGNvbG9ycyBpbnN0YW5jZW9mIEFycmF5KSl7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwicGFyYW1ldGVyIGNvbG9ycyBzaG91bGQgYmUgdHlwZSBvZiBhcnJheTogXCIgKyBjb2xvcnMpO1xuXHRcdH1cblxuXHRcdGxldCBwYWxldHRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIiArIHRoaXMuZ2V0RG9tSWQoKSArIFwiIC5wY3AtcGFsZXR0ZVwiKTtcblx0XHRwYWxldHRlLmlubmVySFRNTCA9IFwiXCI7XG5cdFx0dGhpcy5fcGFsZXR0ZUNvbG9yTGlzdCA9IFtdO1xuXG5cdFx0Y29sb3JzLmZvckVhY2goKHZhbHVlKSA9PiB7XG5cdFx0XHRsZXQgbGkgPSB0aGlzLl9tYWtlQ29sb3JFbGUodmFsdWUpO1xuXHRcdFx0bGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuX3BhbGV0dGVFdmVudC5iaW5kKHRoaXMpKTtcblx0XHRcdHRoaXMuX3BhbGV0dGVDb2xvckxpc3QucHVzaChsaSk7XG5cdFx0XHRwYWxldHRlLmFwcGVuZENoaWxkKGxpKTtcblx0XHR9KTtcblx0fVxuXG5cdGdldFBhbGV0dGVDb2xvcnMoKXtcblx0XHRyZXR1cm4gdGhpcy5fcGFyc2VDb2xvclVpKHRoaXMuX3BhbGV0dGVDb2xvckxpc3QpO1xuXHR9XG5cblx0Lypcblx0XHRAY29sb3IgLSByZWNlaXZlcyBhbiBhcnJheSBvZiBvYmplY3RzIHdpdGggcHJvcGVydGllcyBvZiBcImNvbG9yXCIgYW5kIFwibmFtZVwiLlxuXHRcdFRoZSBhcnJheSBmb3JtYXQgc2h1b2xkIGJlIGxpa2UgdGhpczpcblx0XHRbe2NvbG9yOiBcIiNmZmZmZmZcIiwgbmFtZTogXCJGb29iYXJcIn0sIHtjb2xvcjogXCIjZmZmZmZmXCIsIG5hbWU6IFwiRm9vYmFyXCJ9LCB7Y29sb3I6IFwiI2ZmZmZmZlwiLCBuYW1lOiBcIkZvb2JhclwifS4uLl1cblx0Ki9cblx0c2V0U2VsZWN0b3JDb2xvcnMoY29sb3JzKXtcblx0XHRpZighKGNvbG9ycyBpbnN0YW5jZW9mIEFycmF5KSl7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwicGFyYW1ldGVyIGNvbG9ycyBzaG91bGQgYmUgdHlwZSBvZiBhcnJheTogXCIgKyBjb2xvcnMpO1xuXHRcdH1cblxuXHRcdGxldCBzZWxlY3RvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyB0aGlzLmdldERvbUlkKCkgKyBcIiAucGNwLXNlbGVjdG9yXCIpO1xuXHRcdHNlbGVjdG9yLmlubmVySFRNTCA9IFwiXCI7XG5cdFx0dGhpcy5fc2VsZWN0b3JDb2xvckxpc3QgPSBbXTtcblxuXHRcdGNvbG9ycy5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuXHRcdFx0bGV0IGxpID0gdGhpcy5fbWFrZUNvbG9yRWxlKHZhbHVlKTtcblx0XHRcdGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLl9zZWxlY3RvckV2ZW50LmJpbmQodGhpcykpO1xuXHRcdFx0dGhpcy5fc2VsZWN0b3JDb2xvckxpc3QucHVzaChsaSk7XG5cdFx0XHRzZWxlY3Rvci5hcHBlbmRDaGlsZChsaSk7XG5cdFx0fSk7XG5cdH1cblxuXHRnZXRTZWxlY3RvckNvbG9ycygpe1xuXHRcdHJldHVybiB0aGlzLl9wYXJzZUNvbG9yVWkodGhpcy5fc2VsZWN0b3JDb2xvckxpc3QpO1xuXHR9XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lciwgbmFtZSl7XG5cdFx0aWYobmFtZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBuYW1lID09PSBudWxsIHx8ICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikpe1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcInBhcmFtZXRlciBuYW1lIHNob3VsZCBiZSB0eXBlIG9mIHN0cmluZzogXCIgKyBuYW1lKTtcblx0XHR9XG5cdFx0dGhpcy5fbGlzdGVuZXJMaXN0W25hbWVdID0gbGlzdGVuZXI7XG5cdH1cblxuXHRyZW1vdmVFdmVudExpc3RlbmVyKG5hbWUpe1xuXHRcdGRlbGV0ZSB0aGlzLl9saXN0ZW5lckxpc3RbbmFtZV07XG5cdH1cblxuXHQvKlxuXHRcdGV2ZW50IGNvbnRhaW5zIHByb3BlcnRpZXMgYmVsb3c6XG5cdFx0QGluZGV4IC0gdGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBjb2xvciBlbGVtZW50IGluIF9wYWxldHRlQ29sb3JMaXN0LlxuXHRcdEBjb2xvciAtIHdoYXQgY29sb3IgaXMgZm9yIHRoZSBjdXJyZW50IHRhcmdldC5cblx0Ki9cblx0X25vdGlmeUxpc3RlbmVyKGV2ZW50KXtcblx0XHRmb3IobGV0IGtleSBpbiB0aGlzLl9saXN0ZW5lckxpc3Qpe1xuXHRcdFx0dGhpcy5fbGlzdGVuZXJMaXN0W2tleV0oZXZlbnQpO1xuXHRcdH1cblx0fVxuXG5cdF9tYWtlQ29sb3JFbGUoY29sb3JPYmope1xuXHRcdGxldCB1aUxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuXHRcdGxldCB1aVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0XHRpZihjb2xvck9iai5jb2xvciA9PT0gUENQLkNPTE9SX05PTkUpe1xuXHRcdFx0dWlMaS5jbGFzc0xpc3QudG9nZ2xlKFBDUC5DT0xPUl9OT05FKTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdHVpTGkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3JPYmouY29sb3I7XG5cdFx0fVxuXHRcdHVpU3Bhbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb2xvck9iai5uYW1lKSk7XG5cdFx0dWlMaS5hcHBlbmRDaGlsZCh1aVNwYW4pO1xuXHRcdHJldHVybiB1aUxpO1xuXHR9XG5cblx0X3BhbGV0dGVFdmVudChlKXtcblx0XHRsZXQgYWxsUGFsZXR0ZUNvbG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNcIiArIHRoaXMuZ2V0RG9tSWQoKSArIFwiIC5wY3AtcGFsZXR0ZSBsaVwiKTtcblx0XHRsZXQgaXNTZWxlY3RlZCA9IGUuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJjdXJyZW50LXNlbGVjdGlvblwiKTtcblx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGFsbFBhbGV0dGVDb2xvciwgKHZhbCkgPT4ge1xuXHRcdFx0dmFsLmNsYXNzTGlzdC5yZW1vdmUoXCJjdXJyZW50LXNlbGVjdGlvblwiKTtcblx0XHR9KTtcblx0XHRpZihpc1NlbGVjdGVkKXtcblx0XHRcdGUuY3VycmVudFRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zZWxlY3Rpb25cIik7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZS5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50LXNlbGVjdGlvblwiKTtcblx0XHR9XG5cdH1cblxuXHRfc2VsZWN0b3JFdmVudChlKXtcblx0XHRsZXQgY3VycmVudFNlbGVjdGlvbkNvbG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIiArIHRoaXMuZ2V0RG9tSWQoKSArIFwiIC5wY3AtcGFsZXR0ZSAuY3VycmVudC1zZWxlY3Rpb25cIik7XG5cdFx0bGV0IGJnQ29sb3IgPSBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuXHRcdGlmKCFjdXJyZW50U2VsZWN0aW9uQ29sb3Ipe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjdXJyZW50U2VsZWN0aW9uQ29sb3IuY2xhc3NOYW1lID0gZS5jdXJyZW50VGFyZ2V0LmNsYXNzTmFtZTtcblx0XHRjdXJyZW50U2VsZWN0aW9uQ29sb3IuY2xhc3NMaXN0LmFkZChcImN1cnJlbnQtc2VsZWN0aW9uXCIpO1xuXHRcdGN1cnJlbnRTZWxlY3Rpb25Db2xvci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yO1xuXHRcdGJnQ29sb3IgPSBlLmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFBDUC5DT0xPUl9OT05FKSA/IFBDUC5DT0xPUl9OT05FIDogYmdDb2xvcjtcblx0XHRsZXQgaW5kZXggID0gdGhpcy5fcGFsZXR0ZUNvbG9yTGlzdC5pbmRleE9mKGN1cnJlbnRTZWxlY3Rpb25Db2xvcik7XG5cdFx0dGhpcy5fbm90aWZ5TGlzdGVuZXIoe1xuXHRcdFx0aW5kZXg6IGluZGV4LFxuXHRcdFx0Y29sb3I6IGJnQ29sb3Jcblx0XHR9KTtcblx0fVxuXG5cdC8qXG5cdFx0QGNvbnRhaW5lciAtIHNob3VsZCBlaXRoZXIgYmUgcGNwLXBhbGV0dGUgb3IgcGNwLXNlbGVjdG9yXG5cdCovXG5cdF9wYXJzZUNvbG9yVWkoY29udGFpbmVyKXtcblx0XHRsZXQgY29sb3JMaXN0ID0gW107XG5cdFx0Y29udGFpbmVyLmZvckVhY2goKHZhbCkgPT4ge1xuXHRcdFx0bGV0IGNvbG9yT2JqID0ge307XG5cdFx0XHRsZXQgY29sb3IgPSB2YWwuY2xhc3NMaXN0LmNvbnRhaW5zKFBDUC5DT0xPUl9OT05FKSA/IFBDUC5DT0xPUl9OT05FIDogdmFsLnN0eWxlLmJhY2tncm91bmRDb2xvcjtcblx0XHRcdGxldCBuYW1lID0gdmFsLmNoaWxkTm9kZXNbMF0uaW5uZXJUZXh0IHx8IHZhbC5jaGlsZE5vZGVzWzBdLnRleHRDb250ZW50O1xuXHRcdFx0Y29sb3JPYmpbXCJjb2xvclwiXSA9ICBjb2xvcjtcblx0XHRcdGNvbG9yT2JqW1wibmFtZVwiXSA9ICBuYW1lO1xuXHRcdFx0Y29sb3JMaXN0LnB1c2goY29sb3JPYmopO1xuXHRcdH0pO1xuXHRcdHJldHVybiBjb2xvckxpc3Q7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IENPTE9SX05PTkUoKXsgcmV0dXJuIFwiY29sb3Itbm9uZVwiOyB9XG59XG4iXX0=
