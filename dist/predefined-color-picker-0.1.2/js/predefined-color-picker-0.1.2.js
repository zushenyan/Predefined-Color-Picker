(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _PubSub = require("./PubSub");

var _PCP = require("./PCP");

(function (window) {
	"use strict";

	var pkg = {
		PCP: _PCP.PCP,
		PubSub: _PubSub.PubSub
	};

	window.pcp = pkg;
})(window);

},{"./PCP":2,"./PubSub":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _PubSub = require("./PubSub");

var PCP = (function () {
	function PCP() {
		_classCallCheck(this, PCP);

		this._mainEleID = "";
		this._listenerList = {};
		this._paletteColorList = null;
		this._selectorColorList = null;
		this._pubsub = new _PubSub.PubSub();

		this._uiPaletteContainer = null;
		this._uiSelectorContainer = null;
		this._uiMainContainer = null;
	}

	_createClass(PCP, [{
		key: "init",
		value: function init(domId, palette, selector) {
			this._mainEleID = domId;
			initUI.call(this);
			this.setPalette(palette);
			this.setSelector(selector);
			return this;

			function initUI() {
				this._uiPaletteContainer = document.createElement("ul");
				this._uiSelectorContainer = document.createElement("ul");
				this._uiMainContainer = document.getElementById(this.getMainEleId());

				this._uiPaletteContainer.classList.add("pcp-palette");
				this._uiSelectorContainer.classList.add("pcp-selector");
				this._uiMainContainer.appendChild(this._uiPaletteContainer);
				this._uiMainContainer.appendChild(this._uiSelectorContainer);
			}
		}
	}, {
		key: "getMainEleId",
		value: function getMainEleId() {
			return this._mainEleID;
		}

		/**
  	@param {array} colors - receives an array of objects with properties of "color" and "name".
  	The array format shuold be like this:
  	[{label: "Foobar", color: "#ffffff"},
  	 {label: "Foobar", color: "#ffffff"},
  	 {label: "Foobar", color: "#ffffff"}...]
  */
	}, {
		key: "setPalette",
		value: function setPalette(colors) {
			var palette = document.querySelector("#" + this.getMainEleId() + " .pcp-palette");
			this._uiPaletteContainer.innerHTML = "";
			this._paletteColorList = colors;

			for (var i = 0; i < colors.length; i++) {
				var li = this._makeColorEle(colors[i]);
				li.addEventListener("click", paletteEvent.bind(this));
				this._uiPaletteContainer.appendChild(li);
			}
			this._notifyListener({
				type: "setPalette",
				colorSet: this.getPalette()
			});

			function paletteEvent(e) {
				var allPaletteColors = this._uiPaletteContainer.children;
				var isSelected = e.currentTarget.classList.contains("current-selection");
				for (var i = 0; i < allPaletteColors.length; i++) {
					allPaletteColors[i].classList.remove("current-selection");
				}
				if (isSelected) {
					e.currentTarget.classList.remove("current-selection");
				} else {
					e.currentTarget.classList.add("current-selection");
				}
			}
		}
	}, {
		key: "getPalette",
		value: function getPalette() {
			return this._paletteColorList;
		}

		/**
  	@param {string} colors - receives an array of objects with properties of "color" and "name".
  	The array format shuold be like this:
  	[{color: "#ffffff", name: "Foobar"},
  	{color: "#ffffff", name: "Foobar"},
  	{color: "#ffffff", name: "Foobar"}...]
  */
	}, {
		key: "setSelector",
		value: function setSelector(colors) {
			this._uiSelectorContainer.innerHTML = "";
			this._selectorColorList = colors;

			for (var i = 0; i < colors.length; i++) {
				var li = this._makeColorEle(colors[i]);
				li.addEventListener("click", selectorEvent.bind(this));
				this._uiSelectorContainer.appendChild(li);
			}
			this._notifyListener({
				type: "setSelector",
				colorSet: this.getSelector()
			});

			function selectorEvent(e) {
				var currentSelectionColor = selectedElement(this._uiPaletteContainer);
				var bgColor = e.currentTarget.style.backgroundColor;
				if (!currentSelectionColor) {
					return;
				}
				currentSelectionColor.className = e.currentTarget.className;
				currentSelectionColor.classList.add("current-selection");
				currentSelectionColor.style.backgroundColor = bgColor;
				var index = indexOfEle(this._uiPaletteContainer, currentSelectionColor);
				bgColor = e.currentTarget.classList.contains(PCP.COLOR_NONE) ? PCP.COLOR_NONE : bgColor;
				this._paletteColorList = this._parseColorUi(this._uiPaletteContainer);
				this._notifyListener({
					type: "selection",
					index: index,
					color: bgColor,
					colorSet: this.getPalette(),
					taret: currentSelectionColor
				});

				function selectedElement(parentEle) {
					var selectedEle = null;
					var children = parentEle.children;
					for (var i = 0; i < children.length; i++) {
						if (children[i].classList.contains("current-selection")) {
							selectedEle = children[i];
						}
					}
					return selectedEle;
				}

				function indexOfEle(parent, child) {
					var children = parent.children;
					for (var i = 0; i < children.length; i++) {
						if (children[i] === child) {
							return i;
						}
					}
					return -1;
				}
			}
		}
	}, {
		key: "getSelector",
		value: function getSelector() {
			return this._selectorColorList;
		}
	}, {
		key: "addEventListener",
		value: function addEventListener(listener) {
			if (name === "undefined" || name === null || typeof name !== "string") {
				throw new TypeError("parameter name should be type of string: " + name);
			}
			return this._pubsub.subscribe("event", listener);
		}
	}, {
		key: "removeEventListener",
		value: function removeEventListener(token) {
			var result = this._pubsub.unsubscribe("event", token);
			if (!result) {
				throw new Error("remove event failed");
			}
			return result;
		}

		/**
  	@private
  	@param {object} event contains properties below:
  	{number} index - the index of the current selection color element in _paletteColorList.
  	{string} color - what color is for the current target.
  */
	}, {
		key: "_notifyListener",
		value: function _notifyListener(event) {
			return this._pubsub.publish("event", event);
		}

		/**
  	@private
  */
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

		/**
  	@private
  	@param {htmlElement} container - should either be pcp-palette or pcp-selector.
  */
	}, {
		key: "_parseColorUi",
		value: function _parseColorUi(parentEle) {
			var colorList = [];
			var children = parentEle.children;
			for (var i = 0; i < children.length; i++) {
				var colorObj = {};
				var color = children[i].classList.contains(PCP.COLOR_NONE) ? PCP.COLOR_NONE : children[i].style.backgroundColor;
				var label = children[i].childNodes[0].innerText || children[i].childNodes[0].textContent;
				colorObj["label"] = label;
				colorObj["color"] = color;
				colorList.push(colorObj);
			}
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

},{"./PubSub":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PubSub = (function () {
	function PubSub() {
		_classCallCheck(this, PubSub);

		this._topics = {};
	}

	/**
 	@param {string} topic - the topic channel you want to notify.
 	@param {object} msg - the message you want to send in object format.
 	@return {boolean} - return true if publish successfully else false.
 */

	_createClass(PubSub, [{
		key: "publish",
		value: function publish(topic, msg) {
			if (!this._topics[topic]) {
				return false;
			}
			var subscribers = this._topics[topic];
			for (var i = 0; i < subscribers.length; i++) {
				subscribers[i].doSomething(msg);
			}
			return true;
		}

		/**
  	@param {stirng} topic - the topic channel you are interested with.
  	@param {function, object} doSomething - do something when you got notified.
  	@return {symbol} - a unique token for every subscribers. Used for unsubscribing.
  */
	}, {
		key: "subscribe",
		value: function subscribe(topic, doSomething) {
			if (!this._topics[topic]) {
				this._topics[topic] = [];
			}

			var token = Symbol();
			var subscriber = {
				token: token,
				doSomething: doSomething
			};

			this._topics[topic].push(subscriber);
			return token;
		}

		/**
  	@param {string} topic - the topic channel you want to unsubscibe.
  	@param {symbol} token - a unique token for unsubscribing. Should get one from subscribe function.
  	@return {object, boolean} - will return removed object if successed or false if failed.
  */
	}, {
		key: "unsubscribe",
		value: function unsubscribe(topic, token) {
			if (!this._topics[topic]) {
				return false;
			}
			if (this._topics[topic].length === 0) {
				return false;
			}

			var subscribers = this._topics[topic];
			for (var i = 0; i < subscribers.length; i++) {
				if (subscribers[i].token === token) {
					return subscribers.splice(i, 1);
				}
			}
			return false;
		}
	}, {
		key: "hasTopic",
		value: function hasTopic(topic) {
			return this._topics[topic] ? true : false;
		}
	}, {
		key: "availableTopics",
		value: function availableTopics() {
			return Object.keys(this._topics);
		}
	}, {
		key: "subscribers",
		value: function subscribers() {
			var result = [];
			for (var topic in this._topics) {
				if (this._topics[topic]) {
					var channel = {
						topic: topic,
						subscribers: this._topics[topic].length
					};
					result.push(channel);
				}
			}
			return result;
		}
	}]);

	return PubSub;
})();

exports.PubSub = PubSub;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvenVzaGVueWFuL0RvY3VtZW50cy9HaXRodWIvUHJlZGVmaW5lZC1Db2xvci1QaWNrZXIvc3JjL2JhYmVsL01haW4uanMiLCIvVXNlcnMvenVzaGVueWFuL0RvY3VtZW50cy9HaXRodWIvUHJlZGVmaW5lZC1Db2xvci1QaWNrZXIvc3JjL2JhYmVsL1BDUC5qcyIsIi9Vc2Vycy96dXNoZW55YW4vRG9jdW1lbnRzL0dpdGh1Yi9QcmVkZWZpbmVkLUNvbG9yLVBpY2tlci9zcmMvYmFiZWwvUHViU3ViLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7c0JDQXFCLFVBQVU7O21CQUNiLE9BQU87O0FBRXpCLENBQUMsVUFBUyxNQUFNLEVBQUM7QUFDaEIsYUFBWSxDQUFDOztBQUViLEtBQUksR0FBRyxHQUFHO0FBQ1QsS0FBRyxVQUFLO0FBQ1IsUUFBTSxnQkFBUTtFQUNkLENBQUE7O0FBRUQsT0FBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7Q0FDakIsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O3NCQ1pVLFVBQVU7O0lBRWxCLEdBQUc7QUFDSixVQURDLEdBQUcsR0FDRjt3QkFERCxHQUFHOztBQUVkLE1BQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLE1BQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7QUFDOUIsTUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUMvQixNQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFZLENBQUM7O0FBRTVCLE1BQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFDaEMsTUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNqQyxNQUFJLENBQUMsZ0JBQWdC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RUFBQztBQUN0QixTQUFJLE9BQU8sR0FBRztBQUNiLFdBQUssRUFBRSxLQUFLO0FBQ1osaUJBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU07TUFDdkMsQ0FBQTtBQUNELFdBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDckI7SUFDRDtBQUNELFVBQU8sTUFBTSxDQUFDO0dBQ2Q7OztRQS9FVyxNQUFNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7UHViU3VifSBmcm9tIFwiLi9QdWJTdWJcIjtcbmltcG9ydCB7UENQfSBmcm9tIFwiLi9QQ1BcIjtcblxuKGZ1bmN0aW9uKHdpbmRvdyl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGxldCBwa2cgPSB7XG5cdFx0UENQOiBQQ1AsXG5cdFx0UHViU3ViOiBQdWJTdWJcblx0fVxuXG5cdHdpbmRvdy5wY3AgPSBwa2c7XG59KSh3aW5kb3cpO1xuIiwiaW1wb3J0IHtQdWJTdWJ9IGZyb20gXCIuL1B1YlN1YlwiO1xuXG5leHBvcnQgY2xhc3MgUENQe1xuXHRjb25zdHJ1Y3Rvcigpe1xuXHRcdHRoaXMuX21haW5FbGVJRCA9IFwiXCI7XG5cdFx0dGhpcy5fbGlzdGVuZXJMaXN0ID0ge307XG5cdFx0dGhpcy5fcGFsZXR0ZUNvbG9yTGlzdCA9IG51bGw7XG5cdFx0dGhpcy5fc2VsZWN0b3JDb2xvckxpc3QgPSBudWxsO1xuXHRcdHRoaXMuX3B1YnN1YiA9IG5ldyBQdWJTdWIoKTtcblxuXHRcdHRoaXMuX3VpUGFsZXR0ZUNvbnRhaW5lciA9IG51bGw7XG5cdFx0dGhpcy5fdWlTZWxlY3RvckNvbnRhaW5lciA9IG51bGw7XG5cdFx0dGhpcy5fdWlNYWluQ29udGFpbmVyID0gbnVsbDtcblx0fVxuXG5cdGluaXQoZG9tSWQsIHBhbGV0dGUsIHNlbGVjdG9yKXtcblx0XHR0aGlzLl9tYWluRWxlSUQgPSBkb21JZDtcblx0XHRpbml0VUkuY2FsbCh0aGlzKTtcblx0XHR0aGlzLnNldFBhbGV0dGUocGFsZXR0ZSk7XG5cdFx0dGhpcy5zZXRTZWxlY3RvcihzZWxlY3Rvcik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0XHRmdW5jdGlvbiBpbml0VUkoKXtcblx0XHRcdHRoaXMuX3VpUGFsZXR0ZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcblx0XHRcdHRoaXMuX3VpU2VsZWN0b3JDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG5cdFx0XHR0aGlzLl91aU1haW5Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmdldE1haW5FbGVJZCgpKTtcblxuXHRcdFx0dGhpcy5fdWlQYWxldHRlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJwY3AtcGFsZXR0ZVwiKTtcblx0XHRcdHRoaXMuX3VpU2VsZWN0b3JDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInBjcC1zZWxlY3RvclwiKTtcblx0XHRcdHRoaXMuX3VpTWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl91aVBhbGV0dGVDb250YWluZXIpO1xuXHRcdFx0dGhpcy5fdWlNYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX3VpU2VsZWN0b3JDb250YWluZXIpO1xuXHRcdH1cblx0fVxuXG5cdGdldE1haW5FbGVJZCgpe1xuXHRcdHJldHVybiB0aGlzLl9tYWluRWxlSUQ7XG5cdH1cblxuXHQvKipcblx0XHRAcGFyYW0ge2FycmF5fSBjb2xvcnMgLSByZWNlaXZlcyBhbiBhcnJheSBvZiBvYmplY3RzIHdpdGggcHJvcGVydGllcyBvZiBcImNvbG9yXCIgYW5kIFwibmFtZVwiLlxuXHRcdFRoZSBhcnJheSBmb3JtYXQgc2h1b2xkIGJlIGxpa2UgdGhpczpcblx0XHRbe2xhYmVsOiBcIkZvb2JhclwiLCBjb2xvcjogXCIjZmZmZmZmXCJ9LFxuXHRcdCB7bGFiZWw6IFwiRm9vYmFyXCIsIGNvbG9yOiBcIiNmZmZmZmZcIn0sXG5cdFx0IHtsYWJlbDogXCJGb29iYXJcIiwgY29sb3I6IFwiI2ZmZmZmZlwifS4uLl1cblx0Ki9cblx0c2V0UGFsZXR0ZShjb2xvcnMpe1xuXHRcdGxldCBwYWxldHRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIiArIHRoaXMuZ2V0TWFpbkVsZUlkKCkgKyBcIiAucGNwLXBhbGV0dGVcIik7XG5cdFx0dGhpcy5fdWlQYWxldHRlQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cdFx0dGhpcy5fcGFsZXR0ZUNvbG9yTGlzdCA9IGNvbG9ycztcblxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBjb2xvcnMubGVuZ3RoOyBpKyspe1xuXHRcdFx0bGV0IGxpID0gdGhpcy5fbWFrZUNvbG9yRWxlKGNvbG9yc1tpXSk7XG5cdFx0XHRsaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGFsZXR0ZUV2ZW50LmJpbmQodGhpcykpO1xuXHRcdFx0dGhpcy5fdWlQYWxldHRlQ29udGFpbmVyLmFwcGVuZENoaWxkKGxpKTtcblx0XHR9XG5cdFx0dGhpcy5fbm90aWZ5TGlzdGVuZXIoe1xuXHRcdFx0dHlwZTogXCJzZXRQYWxldHRlXCIsXG5cdFx0XHRjb2xvclNldDogdGhpcy5nZXRQYWxldHRlKClcblx0XHR9KTtcblxuXHRcdGZ1bmN0aW9uIHBhbGV0dGVFdmVudChlKXtcblx0XHRcdGxldCBhbGxQYWxldHRlQ29sb3JzID0gdGhpcy5fdWlQYWxldHRlQ29udGFpbmVyLmNoaWxkcmVuO1xuXHRcdFx0bGV0IGlzU2VsZWN0ZWQgPSBlLmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY3VycmVudC1zZWxlY3Rpb25cIik7XG5cdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgYWxsUGFsZXR0ZUNvbG9ycy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdGFsbFBhbGV0dGVDb2xvcnNbaV0uY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnQtc2VsZWN0aW9uXCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYoaXNTZWxlY3RlZCl7XG5cdFx0XHRcdGUuY3VycmVudFRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zZWxlY3Rpb25cIik7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZS5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50LXNlbGVjdGlvblwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRnZXRQYWxldHRlKCl7XG5cdFx0cmV0dXJuIHRoaXMuX3BhbGV0dGVDb2xvckxpc3Q7XG5cdH1cblxuXHQvKipcblx0XHRAcGFyYW0ge3N0cmluZ30gY29sb3JzIC0gcmVjZWl2ZXMgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIHByb3BlcnRpZXMgb2YgXCJjb2xvclwiIGFuZCBcIm5hbWVcIi5cblx0XHRUaGUgYXJyYXkgZm9ybWF0IHNodW9sZCBiZSBsaWtlIHRoaXM6XG5cdFx0W3tjb2xvcjogXCIjZmZmZmZmXCIsIG5hbWU6IFwiRm9vYmFyXCJ9LFxuXHRcdHtjb2xvcjogXCIjZmZmZmZmXCIsIG5hbWU6IFwiRm9vYmFyXCJ9LFxuXHRcdHtjb2xvcjogXCIjZmZmZmZmXCIsIG5hbWU6IFwiRm9vYmFyXCJ9Li4uXVxuXHQqL1xuXHRzZXRTZWxlY3Rvcihjb2xvcnMpe1xuXHRcdHRoaXMuX3VpU2VsZWN0b3JDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblx0XHR0aGlzLl9zZWxlY3RvckNvbG9yTGlzdCA9IGNvbG9ycztcblxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBjb2xvcnMubGVuZ3RoOyBpKyspe1xuXHRcdFx0bGV0IGxpID0gdGhpcy5fbWFrZUNvbG9yRWxlKGNvbG9yc1tpXSk7XG5cdFx0XHRsaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2VsZWN0b3JFdmVudC5iaW5kKHRoaXMpKTtcblx0XHRcdHRoaXMuX3VpU2VsZWN0b3JDb250YWluZXIuYXBwZW5kQ2hpbGQobGkpO1xuXHRcdH1cblx0XHR0aGlzLl9ub3RpZnlMaXN0ZW5lcih7XG5cdFx0XHR0eXBlOiBcInNldFNlbGVjdG9yXCIsXG5cdFx0XHRjb2xvclNldDogdGhpcy5nZXRTZWxlY3RvcigpXG5cdFx0fSk7XG5cblx0XHRmdW5jdGlvbiBzZWxlY3RvckV2ZW50KGUpe1xuXHRcdFx0bGV0IGN1cnJlbnRTZWxlY3Rpb25Db2xvciA9IHNlbGVjdGVkRWxlbWVudCh0aGlzLl91aVBhbGV0dGVDb250YWluZXIpO1xuXHRcdFx0bGV0IGJnQ29sb3IgPSBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuXHRcdFx0aWYoIWN1cnJlbnRTZWxlY3Rpb25Db2xvcil7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGN1cnJlbnRTZWxlY3Rpb25Db2xvci5jbGFzc05hbWUgPSBlLmN1cnJlbnRUYXJnZXQuY2xhc3NOYW1lO1xuXHRcdFx0Y3VycmVudFNlbGVjdGlvbkNvbG9yLmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50LXNlbGVjdGlvblwiKTtcblx0XHRcdGN1cnJlbnRTZWxlY3Rpb25Db2xvci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yO1xuXHRcdFx0bGV0IGluZGV4ICA9IGluZGV4T2ZFbGUodGhpcy5fdWlQYWxldHRlQ29udGFpbmVyLCBjdXJyZW50U2VsZWN0aW9uQ29sb3IpO1xuXHRcdFx0YmdDb2xvciA9IGUuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoUENQLkNPTE9SX05PTkUpID8gUENQLkNPTE9SX05PTkUgOiBiZ0NvbG9yO1xuXHRcdFx0dGhpcy5fcGFsZXR0ZUNvbG9yTGlzdCA9IHRoaXMuX3BhcnNlQ29sb3JVaSh0aGlzLl91aVBhbGV0dGVDb250YWluZXIpO1xuXHRcdFx0dGhpcy5fbm90aWZ5TGlzdGVuZXIoe1xuXHRcdFx0XHR0eXBlOiBcInNlbGVjdGlvblwiLFxuXHRcdFx0XHRpbmRleDogaW5kZXgsXG5cdFx0XHRcdGNvbG9yOiBiZ0NvbG9yLFxuXHRcdFx0XHRjb2xvclNldDogdGhpcy5nZXRQYWxldHRlKCksXG5cdFx0XHRcdHRhcmV0OiBjdXJyZW50U2VsZWN0aW9uQ29sb3Jcblx0XHRcdH0pO1xuXG5cdFx0XHRmdW5jdGlvbiBzZWxlY3RlZEVsZW1lbnQocGFyZW50RWxlKXtcblx0XHRcdFx0bGV0IHNlbGVjdGVkRWxlID0gbnVsbDtcblx0XHRcdFx0bGV0IGNoaWxkcmVuID0gcGFyZW50RWxlLmNoaWxkcmVuO1xuXHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdGlmKGNoaWxkcmVuW2ldLmNsYXNzTGlzdC5jb250YWlucyhcImN1cnJlbnQtc2VsZWN0aW9uXCIpKXtcblx0XHRcdFx0XHRcdHNlbGVjdGVkRWxlID0gY2hpbGRyZW5baV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBzZWxlY3RlZEVsZTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gaW5kZXhPZkVsZShwYXJlbnQsIGNoaWxkKXtcblx0XHRcdFx0bGV0IGNoaWxkcmVuID0gcGFyZW50LmNoaWxkcmVuO1xuXHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdGlmKGNoaWxkcmVuW2ldID09PSBjaGlsZCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGdldFNlbGVjdG9yKCl7XG5cdFx0cmV0dXJuIHRoaXMuX3NlbGVjdG9yQ29sb3JMaXN0O1xuXHR9XG5cblx0YWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lcil7XG5cdFx0aWYobmFtZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBuYW1lID09PSBudWxsIHx8ICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikpe1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcInBhcmFtZXRlciBuYW1lIHNob3VsZCBiZSB0eXBlIG9mIHN0cmluZzogXCIgKyBuYW1lKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX3B1YnN1Yi5zdWJzY3JpYmUoXCJldmVudFwiLCBsaXN0ZW5lcik7XG5cdH1cblxuXHRyZW1vdmVFdmVudExpc3RlbmVyKHRva2VuKXtcblx0XHRsZXQgcmVzdWx0ID0gdGhpcy5fcHVic3ViLnVuc3Vic2NyaWJlKFwiZXZlbnRcIiwgdG9rZW4pO1xuXHRcdGlmKCFyZXN1bHQpe1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwicmVtb3ZlIGV2ZW50IGZhaWxlZFwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdC8qKlxuXHRcdEBwcml2YXRlXG5cdFx0QHBhcmFtIHtvYmplY3R9IGV2ZW50IGNvbnRhaW5zIHByb3BlcnRpZXMgYmVsb3c6XG5cdFx0e251bWJlcn0gaW5kZXggLSB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGNvbG9yIGVsZW1lbnQgaW4gX3BhbGV0dGVDb2xvckxpc3QuXG5cdFx0e3N0cmluZ30gY29sb3IgLSB3aGF0IGNvbG9yIGlzIGZvciB0aGUgY3VycmVudCB0YXJnZXQuXG5cdCovXG5cdF9ub3RpZnlMaXN0ZW5lcihldmVudCl7XG5cdFx0cmV0dXJuIHRoaXMuX3B1YnN1Yi5wdWJsaXNoKFwiZXZlbnRcIiwgZXZlbnQpO1xuXHR9XG5cblx0LyoqXG5cdFx0QHByaXZhdGVcblx0Ki9cblx0X21ha2VDb2xvckVsZShjb2xvck9iail7XG5cdFx0bGV0IHVpTGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG5cdFx0bGV0IHVpU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuXHRcdGlmKGNvbG9yT2JqLmNvbG9yID09PSBQQ1AuQ09MT1JfTk9ORSl7XG5cdFx0XHR1aUxpLmNsYXNzTGlzdC50b2dnbGUoUENQLkNPTE9SX05PTkUpO1xuXHRcdH1cblx0XHRlbHNle1xuXHRcdFx0dWlMaS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvck9iai5jb2xvcjtcblx0XHR9XG5cdFx0dWlTcGFuLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvbG9yT2JqLm5hbWUpKTtcblx0XHR1aUxpLmFwcGVuZENoaWxkKHVpU3Bhbik7XG5cdFx0cmV0dXJuIHVpTGk7XG5cdH1cblxuXHQvKipcblx0XHRAcHJpdmF0ZVxuXHRcdEBwYXJhbSB7aHRtbEVsZW1lbnR9IGNvbnRhaW5lciAtIHNob3VsZCBlaXRoZXIgYmUgcGNwLXBhbGV0dGUgb3IgcGNwLXNlbGVjdG9yLlxuXHQqL1xuXHRfcGFyc2VDb2xvclVpKHBhcmVudEVsZSl7XG5cdFx0bGV0IGNvbG9yTGlzdCA9IFtdO1xuXHRcdGxldCBjaGlsZHJlbiA9IHBhcmVudEVsZS5jaGlsZHJlbjtcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspe1xuXHRcdFx0bGV0IGNvbG9yT2JqID0ge307XG5cdFx0XHRsZXQgY29sb3IgPSBjaGlsZHJlbltpXS5jbGFzc0xpc3QuY29udGFpbnMoUENQLkNPTE9SX05PTkUpID8gUENQLkNPTE9SX05PTkUgOiBjaGlsZHJlbltpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG5cdFx0XHRsZXQgbGFiZWwgPSBjaGlsZHJlbltpXS5jaGlsZE5vZGVzWzBdLmlubmVyVGV4dCB8fCBjaGlsZHJlbltpXS5jaGlsZE5vZGVzWzBdLnRleHRDb250ZW50O1xuXHRcdFx0Y29sb3JPYmpbXCJsYWJlbFwiXSA9ICBsYWJlbDtcblx0XHRcdGNvbG9yT2JqW1wiY29sb3JcIl0gPSAgY29sb3I7XG5cdFx0XHRjb2xvckxpc3QucHVzaChjb2xvck9iaik7XG5cdFx0fVxuXHRcdHJldHVybiBjb2xvckxpc3Q7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IENPTE9SX05PTkUoKXsgcmV0dXJuIFwiY29sb3Itbm9uZVwiOyB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydCBjbGFzcyBQdWJTdWJ7XG5cdGNvbnN0cnVjdG9yKCl7XG5cdFx0dGhpcy5fdG9waWNzID0ge307XG5cdH1cblxuXHQvKipcblx0XHRAcGFyYW0ge3N0cmluZ30gdG9waWMgLSB0aGUgdG9waWMgY2hhbm5lbCB5b3Ugd2FudCB0byBub3RpZnkuXG5cdFx0QHBhcmFtIHtvYmplY3R9IG1zZyAtIHRoZSBtZXNzYWdlIHlvdSB3YW50IHRvIHNlbmQgaW4gb2JqZWN0IGZvcm1hdC5cblx0XHRAcmV0dXJuIHtib29sZWFufSAtIHJldHVybiB0cnVlIGlmIHB1Ymxpc2ggc3VjY2Vzc2Z1bGx5IGVsc2UgZmFsc2UuXG5cdCovXG5cdHB1Ymxpc2godG9waWMsIG1zZyl7XG5cdFx0aWYoIXRoaXMuX3RvcGljc1t0b3BpY10pe1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRsZXQgc3Vic2NyaWJlcnMgPSB0aGlzLl90b3BpY3NbdG9waWNdO1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRzdWJzY3JpYmVyc1tpXS5kb1NvbWV0aGluZyhtc2cpO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHRcdEBwYXJhbSB7c3Rpcm5nfSB0b3BpYyAtIHRoZSB0b3BpYyBjaGFubmVsIHlvdSBhcmUgaW50ZXJlc3RlZCB3aXRoLlxuXHRcdEBwYXJhbSB7ZnVuY3Rpb24sIG9iamVjdH0gZG9Tb21ldGhpbmcgLSBkbyBzb21ldGhpbmcgd2hlbiB5b3UgZ290IG5vdGlmaWVkLlxuXHRcdEByZXR1cm4ge3N5bWJvbH0gLSBhIHVuaXF1ZSB0b2tlbiBmb3IgZXZlcnkgc3Vic2NyaWJlcnMuIFVzZWQgZm9yIHVuc3Vic2NyaWJpbmcuXG5cdCovXG5cdHN1YnNjcmliZSh0b3BpYywgZG9Tb21ldGhpbmcpe1xuXHRcdGlmKCF0aGlzLl90b3BpY3NbdG9waWNdKXtcblx0XHRcdHRoaXMuX3RvcGljc1t0b3BpY10gPSBbXTtcblx0XHR9XG5cblx0XHRsZXQgdG9rZW4gPSBTeW1ib2woKTtcblx0XHRsZXQgc3Vic2NyaWJlciA9IHtcblx0XHRcdHRva2VuOiB0b2tlbixcblx0XHRcdGRvU29tZXRoaW5nOiBkb1NvbWV0aGluZ1xuXHRcdH07XG5cblx0XHR0aGlzLl90b3BpY3NbdG9waWNdLnB1c2goc3Vic2NyaWJlcik7XG5cdFx0cmV0dXJuIHRva2VuO1xuXHR9XG5cblx0LyoqXG5cdFx0QHBhcmFtIHtzdHJpbmd9IHRvcGljIC0gdGhlIHRvcGljIGNoYW5uZWwgeW91IHdhbnQgdG8gdW5zdWJzY2liZS5cblx0XHRAcGFyYW0ge3N5bWJvbH0gdG9rZW4gLSBhIHVuaXF1ZSB0b2tlbiBmb3IgdW5zdWJzY3JpYmluZy4gU2hvdWxkIGdldCBvbmUgZnJvbSBzdWJzY3JpYmUgZnVuY3Rpb24uXG5cdFx0QHJldHVybiB7b2JqZWN0LCBib29sZWFufSAtIHdpbGwgcmV0dXJuIHJlbW92ZWQgb2JqZWN0IGlmIHN1Y2Nlc3NlZCBvciBmYWxzZSBpZiBmYWlsZWQuXG5cdCovXG5cdHVuc3Vic2NyaWJlKHRvcGljLCB0b2tlbil7XG5cdFx0aWYoIXRoaXMuX3RvcGljc1t0b3BpY10peyByZXR1cm4gZmFsc2U7IH1cblx0XHRpZih0aGlzLl90b3BpY3NbdG9waWNdLmxlbmd0aCA9PT0gMCl7IHJldHVybiBmYWxzZTsgfVxuXG5cdFx0bGV0IHN1YnNjcmliZXJzID0gdGhpcy5fdG9waWNzW3RvcGljXTtcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpKyspe1xuXHRcdFx0aWYoc3Vic2NyaWJlcnNbaV0udG9rZW4gPT09IHRva2VuKXtcblx0XHRcdFx0cmV0dXJuIHN1YnNjcmliZXJzLnNwbGljZShpLCAxKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aGFzVG9waWModG9waWMpe1xuXHRcdHJldHVybiB0aGlzLl90b3BpY3NbdG9waWNdID8gdHJ1ZSA6IGZhbHNlO1xuXHR9XG5cblx0YXZhaWxhYmxlVG9waWNzKCl7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX3RvcGljcyk7XG5cdH1cblxuXHRzdWJzY3JpYmVycygpe1xuXHRcdGxldCByZXN1bHQgPSBbXTtcblx0XHRmb3IobGV0IHRvcGljIGluIHRoaXMuX3RvcGljcyl7XG5cdFx0XHRpZih0aGlzLl90b3BpY3NbdG9waWNdKXtcblx0XHRcdFx0bGV0IGNoYW5uZWwgPSB7XG5cdFx0XHRcdFx0dG9waWM6IHRvcGljLFxuXHRcdFx0XHRcdHN1YnNjcmliZXJzOiB0aGlzLl90b3BpY3NbdG9waWNdLmxlbmd0aFxuXHRcdFx0XHR9XG5cdFx0XHRcdHJlc3VsdC5wdXNoKGNoYW5uZWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cbn1cbiJdfQ==
