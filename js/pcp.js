(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _pcpClass = require("./pcpClass");

(function (window) {
	"use strict";

	window.PCP = _pcpClass.PCP;
})(window);

},{"./pcpClass":2}],2:[function(require,module,exports){
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
		this.setPalette(paletteColors);
		this.setSelector(selectorColors);
	}

	_createClass(PCP, [{
		key: "create",
		value: function create() {
			var _this = this;

			var uiPalette = document.createElement("ul");
			var uiSelector = document.createElement("ul");
			var uiMain = document.getElementById(this.getDomId());

			this._paletteColors.forEach(function (colorObj) {
				var li = makeColorEle(colorObj);
				li.addEventListener("click", paletteEvent.bind(_this));
				uiPalette.appendChild(li);
			});

			this._selectorColors.forEach(function (colorObj) {
				var li = makeColorEle(colorObj);
				li.addEventListener("click", selectorEvent.bind(_this));
				uiSelector.appendChild(li);
			});

			uiPalette.classList.add("pcp-palette");
			uiSelector.classList.add("pcp-selector");

			uiMain.appendChild(uiPalette);
			uiMain.appendChild(uiSelector);

			function makeColorEle(colorObj) {
				var uiLi = document.createElement("li");
				var uiSpan = document.createElement("span");
				if (colorObj.color === PCP.COLOR_NONE) {
					uiLi.classList.toggle(PCP.COLOR_NONE);
				} else {
					uiLi.style.backgroundColor = colorObj.color;
				}
				uiSpan.innerText = colorObj.name;
				uiLi.appendChild(uiSpan);
				return uiLi;
			}

			function paletteEvent(e) {
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

			function selectorEvent(e) {
				var currentSelectionColor = document.querySelector("#" + this.getDomId() + " .pcp-palette .current-selection");
				currentSelectionColor.className = e.currentTarget.className;
				currentSelectionColor.classList.add("current-selection");
				currentSelectionColor.style.backgroundColor = e.currentTarget.style.backgroundColor;
			}
		}
	}, {
		key: "_setDomId",
		value: function _setDomId(domId) {
			if (domId === "undefined" || domId === null || typeof domId !== "string") {
				throw new TypeError("parameter domId should be type of string: " + domId);
			}
			this._domId = domId;
		}
	}, {
		key: "getDomId",
		value: function getDomId() {
			return this._domId;
		}

		/*
  	@color - receives an array of objects with properties of "color" and "name".
  	The array format shuold be like this:
  	[{color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}...]
  */
	}, {
		key: "setPalette",
		value: function setPalette(colors) {
			if (colors === "undefined" || colors === null || !(colors instanceof Array)) {
				throw new TypeError("parameter colors should be type of array: " + colors);
			}
			this._paletteColors = colors;
		}
	}, {
		key: "setSelector",
		value: function setSelector(colors) {
			if (colors === "undefined" || colors === null || !(colors instanceof Array)) {
				throw new TypeError("parameter colors should be type of array: " + colors);
			}
			this._selectorColors = colors;
		}
	}, {
		key: "addListener",
		value: function addListener(listener, name) {}
	}, {
		key: "removeListener",
		value: function removeListener(name) {}
	}, {
		key: "notifyListener",
		value: function notifyListener() {}
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvenVzaGVueWFuL0RvY3VtZW50cy9HaXRodWIvUHJlZGVmaW5lZC1Db2xvci1QaWNrZXIvYmFiZWwvcGNwLmpzIiwiL1VzZXJzL3p1c2hlbnlhbi9Eb2N1bWVudHMvR2l0aHViL1ByZWRlZmluZWQtQ29sb3ItUGlja2VyL2JhYmVsL3BjcENsYXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7d0JDQWtCLFlBQVk7O0FBRTlCLENBQUMsVUFBUyxNQUFNLEVBQUM7QUFDaEIsYUFBWSxDQUFDOztBQUViLE9BQU0sQ0FBQyxHQUFHLGdCQUFNLENBQUM7Q0FDakIsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O0lDTkUsR0FBRztBQU1KLFVBTkMsR0FBRyxDQU1ILEtBQUssRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFDO3dCQU5yQyxHQUFHOztBQU9kLE1BQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDOztBQUV4QixNQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RCLE1BQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDL0IsTUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUNqQzs7Y0FaVyxHQUFHOztTQWNULGtCQUFFOzs7QUFDUCxPQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdDLE9BQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsT0FBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzs7QUFFdEQsT0FBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFD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dCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtQQ1B9IGZyb20gXCIuL3BjcENsYXNzXCI7XG5cbihmdW5jdGlvbih3aW5kb3cpe1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR3aW5kb3cuUENQID0gUENQO1xufSkod2luZG93KTtcbiIsImV4cG9ydCBjbGFzcyBQQ1B7XG5cdF9kb21JZDtcblx0X2xpc3RlbmVyTGlzdDtcblx0X3BhbGV0dGVDb2xvcnM7XG5cdF9zZWxlY3RvckNvbG9ycztcblxuXHRjb25zdHJ1Y3Rvcihkb21JZCwgcGFsZXR0ZUNvbG9ycywgc2VsZWN0b3JDb2xvcnMpe1xuXHRcdHRoaXMuX2xpc3RlbmVyTGlzdCA9IHt9O1xuXG5cdFx0dGhpcy5fc2V0RG9tSWQoZG9tSWQpO1xuXHRcdHRoaXMuc2V0UGFsZXR0ZShwYWxldHRlQ29sb3JzKTtcblx0XHR0aGlzLnNldFNlbGVjdG9yKHNlbGVjdG9yQ29sb3JzKTtcblx0fVxuXG5cdGNyZWF0ZSgpe1xuXHRcdGxldCB1aVBhbGV0dGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG5cdFx0bGV0IHVpU2VsZWN0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG5cdFx0bGV0IHVpTWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZ2V0RG9tSWQoKSk7XG5cblx0XHR0aGlzLl9wYWxldHRlQ29sb3JzLmZvckVhY2goKGNvbG9yT2JqKSA9PiB7XG5cdFx0XHRsZXQgbGkgPSBtYWtlQ29sb3JFbGUoY29sb3JPYmopO1xuXHRcdFx0bGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBhbGV0dGVFdmVudC5iaW5kKHRoaXMpKTtcblx0XHRcdHVpUGFsZXR0ZS5hcHBlbmRDaGlsZChsaSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9zZWxlY3RvckNvbG9ycy5mb3JFYWNoKChjb2xvck9iaikgPT4ge1xuXHRcdFx0bGV0IGxpID0gbWFrZUNvbG9yRWxlKGNvbG9yT2JqKTtcblx0XHRcdGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZWxlY3RvckV2ZW50LmJpbmQodGhpcykpO1xuXHRcdFx0dWlTZWxlY3Rvci5hcHBlbmRDaGlsZChsaSk7XG5cdFx0fSk7XG5cblx0XHR1aVBhbGV0dGUuY2xhc3NMaXN0LmFkZChcInBjcC1wYWxldHRlXCIpO1xuXHRcdHVpU2VsZWN0b3IuY2xhc3NMaXN0LmFkZChcInBjcC1zZWxlY3RvclwiKTtcblxuXHRcdHVpTWFpbi5hcHBlbmRDaGlsZCh1aVBhbGV0dGUpO1xuXHRcdHVpTWFpbi5hcHBlbmRDaGlsZCh1aVNlbGVjdG9yKTtcblxuXHRcdGZ1bmN0aW9uIG1ha2VDb2xvckVsZShjb2xvck9iail7XG5cdFx0XHRsZXQgdWlMaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcblx0XHRcdGxldCB1aVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0XHRcdGlmKGNvbG9yT2JqLmNvbG9yID09PSBQQ1AuQ09MT1JfTk9ORSl7XG5cdFx0XHRcdHVpTGkuY2xhc3NMaXN0LnRvZ2dsZShQQ1AuQ09MT1JfTk9ORSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHR1aUxpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yT2JqLmNvbG9yO1xuXHRcdFx0fVxuXHRcdFx0dWlTcGFuLmlubmVyVGV4dCA9IGNvbG9yT2JqLm5hbWU7XG5cdFx0XHR1aUxpLmFwcGVuZENoaWxkKHVpU3Bhbik7XG5cdFx0XHRyZXR1cm4gdWlMaTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBwYWxldHRlRXZlbnQoZSl7XG5cdFx0XHRsZXQgYWxsUGFsZXR0ZUNvbG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNcIiArIHRoaXMuZ2V0RG9tSWQoKSArIFwiIC5wY3AtcGFsZXR0ZSBsaVwiKTtcblx0XHRcdGxldCBpc1NlbGVjdGVkID0gZS5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImN1cnJlbnQtc2VsZWN0aW9uXCIpO1xuXHRcdFx0QXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChhbGxQYWxldHRlQ29sb3IsICh2YWwpID0+IHtcblx0XHRcdFx0dmFsLmNsYXNzTGlzdC5yZW1vdmUoXCJjdXJyZW50LXNlbGVjdGlvblwiKTtcblx0XHRcdH0pO1xuXHRcdFx0aWYoaXNTZWxlY3RlZCl7XG5cdFx0XHRcdGUuY3VycmVudFRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zZWxlY3Rpb25cIik7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZS5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50LXNlbGVjdGlvblwiKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZWxlY3RvckV2ZW50KGUpe1xuXHRcdFx0bGV0IGN1cnJlbnRTZWxlY3Rpb25Db2xvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyB0aGlzLmdldERvbUlkKCkgKyBcIiAucGNwLXBhbGV0dGUgLmN1cnJlbnQtc2VsZWN0aW9uXCIpO1xuXHRcdFx0Y3VycmVudFNlbGVjdGlvbkNvbG9yLmNsYXNzTmFtZSA9IGUuY3VycmVudFRhcmdldC5jbGFzc05hbWU7XG5cdFx0XHRjdXJyZW50U2VsZWN0aW9uQ29sb3IuY2xhc3NMaXN0LmFkZChcImN1cnJlbnQtc2VsZWN0aW9uXCIpO1xuXHRcdFx0Y3VycmVudFNlbGVjdGlvbkNvbG9yLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG5cdFx0fVxuXHR9XG5cblx0X3NldERvbUlkKGRvbUlkKXtcblx0XHRpZihkb21JZCA9PT0gXCJ1bmRlZmluZWRcIiB8fCBkb21JZCA9PT0gbnVsbCB8fCAodHlwZW9mIGRvbUlkICE9PSBcInN0cmluZ1wiKSl7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwicGFyYW1ldGVyIGRvbUlkIHNob3VsZCBiZSB0eXBlIG9mIHN0cmluZzogXCIgKyBkb21JZCk7XG5cdFx0fVxuXHRcdHRoaXMuX2RvbUlkID0gZG9tSWQ7XG5cdH1cblxuXHRnZXREb21JZCgpe1xuXHRcdHJldHVybiB0aGlzLl9kb21JZDtcblx0fVxuXG5cdC8qXG5cdFx0QGNvbG9yIC0gcmVjZWl2ZXMgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIHByb3BlcnRpZXMgb2YgXCJjb2xvclwiIGFuZCBcIm5hbWVcIi5cblx0XHRUaGUgYXJyYXkgZm9ybWF0IHNodW9sZCBiZSBsaWtlIHRoaXM6XG5cdFx0W3tjb2xvcjogXCIjZmZmZmZmXCIsIG5hbWU6IFwiRm9vYmFyXCJ9LCB7Y29sb3I6IFwiI2ZmZmZmZlwiLCBuYW1lOiBcIkZvb2JhclwifSwge2NvbG9yOiBcIiNmZmZmZmZcIiwgbmFtZTogXCJGb29iYXJcIn0uLi5dXG5cdCovXG5cdHNldFBhbGV0dGUoY29sb3JzKXtcblx0XHRpZihjb2xvcnMgPT09IFwidW5kZWZpbmVkXCIgfHwgY29sb3JzID09PSBudWxsIHx8ICEoY29sb3JzIGluc3RhbmNlb2YgQXJyYXkpKXtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJwYXJhbWV0ZXIgY29sb3JzIHNob3VsZCBiZSB0eXBlIG9mIGFycmF5OiBcIiArIGNvbG9ycyk7XG5cdFx0fVxuXHRcdHRoaXMuX3BhbGV0dGVDb2xvcnMgPSBjb2xvcnM7XG5cdH1cblxuXHRzZXRTZWxlY3Rvcihjb2xvcnMpe1xuXHRcdGlmKGNvbG9ycyA9PT0gXCJ1bmRlZmluZWRcIiB8fCBjb2xvcnMgPT09IG51bGwgfHwgIShjb2xvcnMgaW5zdGFuY2VvZiBBcnJheSkpe1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcInBhcmFtZXRlciBjb2xvcnMgc2hvdWxkIGJlIHR5cGUgb2YgYXJyYXk6IFwiICsgY29sb3JzKTtcblx0XHR9XG5cdFx0dGhpcy5fc2VsZWN0b3JDb2xvcnMgPSBjb2xvcnM7XG5cdH1cblxuXHRhZGRMaXN0ZW5lcihsaXN0ZW5lciwgbmFtZSl7XG5cblx0fVxuXG5cdHJlbW92ZUxpc3RlbmVyKG5hbWUpe1xuXG5cdH1cblxuXHRub3RpZnlMaXN0ZW5lcigpe1xuXG5cdH1cblxuXHRzdGF0aWMgZ2V0IENPTE9SX05PTkUoKXsgcmV0dXJuIFwiY29sb3Itbm9uZVwiOyB9XG59XG4iXX0=
