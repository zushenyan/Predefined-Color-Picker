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
  	[{color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}...]
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvenVzaGVueWFuL0RvY3VtZW50cy9HaXRodWIvUHJlZGVmaW5lZC1Db2xvci1QaWNrZXIvc3JjL2JhYmVsL01haW4uanMiLCIvVXNlcnMvenVzaGVueWFuL0RvY3VtZW50cy9HaXRodWIvUHJlZGVmaW5lZC1Db2xvci1QaWNrZXIvc3JjL2JhYmVsL1BDUC5qcyIsIi9Vc2Vycy96dXNoZW55YW4vRG9jdW1lbnRzL0dpdGh1Yi9QcmVkZWZpbmVkLUNvbG9yLVBpY2tlci9zcmMvYmFiZWwvUHViU3ViLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7c0JDQXFCLFVBQVU7O21CQUNiLE9BQU87O0FBRXpCLENBQUMsVUFBUyxNQUFNLEVBQUM7QUFDaEIsYUFBWSxDQUFDOztBQUViLEtBQUksR0FBRyxHQUFHO0FBQ1QsS0FBRyxVQUFLO0FBQ1IsUUFBTSxnQkFBUTtFQUNkLENBQUE7O0FBRUQsT0FBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7Q0FDakIsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O3NCQ1pVLFVBQVU7O0lBRWxCLEdBQUc7QUFDSixVQURDLEdBQUcsR0FDRjt3QkFERCxHQUFHOztBQUVkLE1BQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLE1BQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7QUFDOUIsTUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUMvQixNQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFZLENBQUM7O0FBRTVCLE1BQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFDaEMsTUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNqQyxNQUFJLENBQUMsZ0JBQWdC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ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7UHViU3VifSBmcm9tIFwiLi9QdWJTdWJcIjtcbmltcG9ydCB7UENQfSBmcm9tIFwiLi9QQ1BcIjtcblxuKGZ1bmN0aW9uKHdpbmRvdyl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGxldCBwa2cgPSB7XG5cdFx0UENQOiBQQ1AsXG5cdFx0UHViU3ViOiBQdWJTdWJcblx0fVxuXG5cdHdpbmRvdy5wY3AgPSBwa2c7XG59KSh3aW5kb3cpO1xuIiwiaW1wb3J0IHtQdWJTdWJ9IGZyb20gXCIuL1B1YlN1YlwiO1xuXG5leHBvcnQgY2xhc3MgUENQe1xuXHRjb25zdHJ1Y3Rvcigpe1xuXHRcdHRoaXMuX21haW5FbGVJRCA9IFwiXCI7XG5cdFx0dGhpcy5fbGlzdGVuZXJMaXN0ID0ge307XG5cdFx0dGhpcy5fcGFsZXR0ZUNvbG9yTGlzdCA9IG51bGw7XG5cdFx0dGhpcy5fc2VsZWN0b3JDb2xvckxpc3QgPSBudWxsO1xuXHRcdHRoaXMuX3B1YnN1YiA9IG5ldyBQdWJTdWIoKTtcblxuXHRcdHRoaXMuX3VpUGFsZXR0ZUNvbnRhaW5lciA9IG51bGw7XG5cdFx0dGhpcy5fdWlTZWxlY3RvckNvbnRhaW5lciA9IG51bGw7XG5cdFx0dGhpcy5fdWlNYWluQ29udGFpbmVyID0gbnVsbDtcblx0fVxuXG5cdGluaXQoZG9tSWQsIHBhbGV0dGUsIHNlbGVjdG9yKXtcblx0XHR0aGlzLl9tYWluRWxlSUQgPSBkb21JZDtcblx0XHRpbml0VUkuY2FsbCh0aGlzKTtcblx0XHR0aGlzLnNldFBhbGV0dGUocGFsZXR0ZSk7XG5cdFx0dGhpcy5zZXRTZWxlY3RvcihzZWxlY3Rvcik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0XHRmdW5jdGlvbiBpbml0VUkoKXtcblx0XHRcdHRoaXMuX3VpUGFsZXR0ZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcblx0XHRcdHRoaXMuX3VpU2VsZWN0b3JDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG5cdFx0XHR0aGlzLl91aU1haW5Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmdldE1haW5FbGVJZCgpKTtcblxuXHRcdFx0dGhpcy5fdWlQYWxldHRlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJwY3AtcGFsZXR0ZVwiKTtcblx0XHRcdHRoaXMuX3VpU2VsZWN0b3JDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInBjcC1zZWxlY3RvclwiKTtcblx0XHRcdHRoaXMuX3VpTWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl91aVBhbGV0dGVDb250YWluZXIpO1xuXHRcdFx0dGhpcy5fdWlNYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX3VpU2VsZWN0b3JDb250YWluZXIpO1xuXHRcdH1cblx0fVxuXG5cdGdldE1haW5FbGVJZCgpe1xuXHRcdHJldHVybiB0aGlzLl9tYWluRWxlSUQ7XG5cdH1cblxuXHQvKipcblx0XHRAcGFyYW0ge2FycmF5fSBjb2xvcnMgLSByZWNlaXZlcyBhbiBhcnJheSBvZiBvYmplY3RzIHdpdGggcHJvcGVydGllcyBvZiBcImNvbG9yXCIgYW5kIFwibmFtZVwiLlxuXHRcdFRoZSBhcnJheSBmb3JtYXQgc2h1b2xkIGJlIGxpa2UgdGhpczpcblx0XHRbe2xhYmVsOiBcIkZvb2JhclwiLCBjb2xvcjogXCIjZmZmZmZmXCJ9LFxuXHRcdCB7bGFiZWw6IFwiRm9vYmFyXCIsIGNvbG9yOiBcIiNmZmZmZmZcIn0sXG5cdFx0IHtsYWJlbDogXCJGb29iYXJcIiwgY29sb3I6IFwiI2ZmZmZmZlwifS4uLl1cblx0Ki9cblx0c2V0UGFsZXR0ZShjb2xvcnMpe1xuXHRcdGxldCBwYWxldHRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIiArIHRoaXMuZ2V0TWFpbkVsZUlkKCkgKyBcIiAucGNwLXBhbGV0dGVcIik7XG5cdFx0dGhpcy5fdWlQYWxldHRlQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cdFx0dGhpcy5fcGFsZXR0ZUNvbG9yTGlzdCA9IGNvbG9ycztcblxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBjb2xvcnMubGVuZ3RoOyBpKyspe1xuXHRcdFx0bGV0IGxpID0gdGhpcy5fbWFrZUNvbG9yRWxlKGNvbG9yc1tpXSk7XG5cdFx0XHRsaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGFsZXR0ZUV2ZW50LmJpbmQodGhpcykpO1xuXHRcdFx0dGhpcy5fdWlQYWxldHRlQ29udGFpbmVyLmFwcGVuZENoaWxkKGxpKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBwYWxldHRlRXZlbnQoZSl7XG5cdFx0XHRsZXQgYWxsUGFsZXR0ZUNvbG9ycyA9IHRoaXMuX3VpUGFsZXR0ZUNvbnRhaW5lci5jaGlsZHJlbjtcblx0XHRcdGxldCBpc1NlbGVjdGVkID0gZS5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImN1cnJlbnQtc2VsZWN0aW9uXCIpO1xuXHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IGFsbFBhbGV0dGVDb2xvcnMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRhbGxQYWxldHRlQ29sb3JzW2ldLmNsYXNzTGlzdC5yZW1vdmUoXCJjdXJyZW50LXNlbGVjdGlvblwiKTtcblx0XHRcdH1cblx0XHRcdGlmKGlzU2VsZWN0ZWQpe1xuXHRcdFx0XHRlLmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnQtc2VsZWN0aW9uXCIpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGUuY3VycmVudFRhcmdldC5jbGFzc0xpc3QuYWRkKFwiY3VycmVudC1zZWxlY3Rpb25cIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Z2V0UGFsZXR0ZSgpe1xuXHRcdHJldHVybiB0aGlzLl9wYWxldHRlQ29sb3JMaXN0O1xuXHR9XG5cblx0LyoqXG5cdFx0QHBhcmFtIHtzdHJpbmd9IGNvbG9ycyAtIHJlY2VpdmVzIGFuIGFycmF5IG9mIG9iamVjdHMgd2l0aCBwcm9wZXJ0aWVzIG9mIFwiY29sb3JcIiBhbmQgXCJuYW1lXCIuXG5cdFx0VGhlIGFycmF5IGZvcm1hdCBzaHVvbGQgYmUgbGlrZSB0aGlzOlxuXHRcdFt7Y29sb3I6IFwiI2ZmZmZmZlwiLCBuYW1lOiBcIkZvb2JhclwifSwge2NvbG9yOiBcIiNmZmZmZmZcIiwgbmFtZTogXCJGb29iYXJcIn0sIHtjb2xvcjogXCIjZmZmZmZmXCIsIG5hbWU6IFwiRm9vYmFyXCJ9Li4uXVxuXHQqL1xuXHRzZXRTZWxlY3Rvcihjb2xvcnMpe1xuXHRcdHRoaXMuX3VpU2VsZWN0b3JDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblx0XHR0aGlzLl9zZWxlY3RvckNvbG9yTGlzdCA9IGNvbG9ycztcblxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBjb2xvcnMubGVuZ3RoOyBpKyspe1xuXHRcdFx0bGV0IGxpID0gdGhpcy5fbWFrZUNvbG9yRWxlKGNvbG9yc1tpXSk7XG5cdFx0XHRsaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2VsZWN0b3JFdmVudC5iaW5kKHRoaXMpKTtcblx0XHRcdHRoaXMuX3VpU2VsZWN0b3JDb250YWluZXIuYXBwZW5kQ2hpbGQobGkpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNlbGVjdG9yRXZlbnQoZSl7XG5cdFx0XHRsZXQgY3VycmVudFNlbGVjdGlvbkNvbG9yID0gc2VsZWN0ZWRFbGVtZW50KHRoaXMuX3VpUGFsZXR0ZUNvbnRhaW5lcik7XG5cdFx0XHRsZXQgYmdDb2xvciA9IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG5cdFx0XHRpZighY3VycmVudFNlbGVjdGlvbkNvbG9yKXtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y3VycmVudFNlbGVjdGlvbkNvbG9yLmNsYXNzTmFtZSA9IGUuY3VycmVudFRhcmdldC5jbGFzc05hbWU7XG5cdFx0XHRjdXJyZW50U2VsZWN0aW9uQ29sb3IuY2xhc3NMaXN0LmFkZChcImN1cnJlbnQtc2VsZWN0aW9uXCIpO1xuXHRcdFx0Y3VycmVudFNlbGVjdGlvbkNvbG9yLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGJnQ29sb3I7XG5cdFx0XHRsZXQgaW5kZXggID0gaW5kZXhPZkVsZSh0aGlzLl91aVBhbGV0dGVDb250YWluZXIsIGN1cnJlbnRTZWxlY3Rpb25Db2xvcik7XG5cdFx0XHRiZ0NvbG9yID0gZS5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhQQ1AuQ09MT1JfTk9ORSkgPyBQQ1AuQ09MT1JfTk9ORSA6IGJnQ29sb3I7XG5cdFx0XHR0aGlzLl9wYWxldHRlQ29sb3JMaXN0ID0gdGhpcy5fcGFyc2VDb2xvclVpKHRoaXMuX3VpUGFsZXR0ZUNvbnRhaW5lcik7XG5cdFx0XHR0aGlzLl9ub3RpZnlMaXN0ZW5lcih7XG5cdFx0XHRcdGluZGV4OiBpbmRleCxcblx0XHRcdFx0Y29sb3I6IGJnQ29sb3IsXG5cdFx0XHRcdGNvbG9yU2V0OiB0aGlzLmdldFBhbGV0dGUoKSxcblx0XHRcdFx0dGFyZXQ6IGN1cnJlbnRTZWxlY3Rpb25Db2xvclxuXHRcdFx0fSk7XG5cblx0XHRcdGZ1bmN0aW9uIHNlbGVjdGVkRWxlbWVudChwYXJlbnRFbGUpe1xuXHRcdFx0XHRsZXQgc2VsZWN0ZWRFbGUgPSBudWxsO1xuXHRcdFx0XHRsZXQgY2hpbGRyZW4gPSBwYXJlbnRFbGUuY2hpbGRyZW47XG5cdFx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0aWYoY2hpbGRyZW5baV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiY3VycmVudC1zZWxlY3Rpb25cIikpe1xuXHRcdFx0XHRcdFx0c2VsZWN0ZWRFbGUgPSBjaGlsZHJlbltpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkRWxlO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBpbmRleE9mRWxlKHBhcmVudCwgY2hpbGQpe1xuXHRcdFx0XHRsZXQgY2hpbGRyZW4gPSBwYXJlbnQuY2hpbGRyZW47XG5cdFx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdFx0aWYoY2hpbGRyZW5baV0gPT09IGNoaWxkKXtcblx0XHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Z2V0U2VsZWN0b3IoKXtcblx0XHRyZXR1cm4gdGhpcy5fc2VsZWN0b3JDb2xvckxpc3Q7XG5cdH1cblxuXHRhZGRFdmVudExpc3RlbmVyKGxpc3RlbmVyKXtcblx0XHRpZihuYW1lID09PSBcInVuZGVmaW5lZFwiIHx8IG5hbWUgPT09IG51bGwgfHwgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSl7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwicGFyYW1ldGVyIG5hbWUgc2hvdWxkIGJlIHR5cGUgb2Ygc3RyaW5nOiBcIiArIG5hbWUpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fcHVic3ViLnN1YnNjcmliZShcImV2ZW50XCIsIGxpc3RlbmVyKTtcblx0fVxuXG5cdHJlbW92ZUV2ZW50TGlzdGVuZXIodG9rZW4pe1xuXHRcdGxldCByZXN1bHQgPSB0aGlzLl9wdWJzdWIudW5zdWJzY3JpYmUoXCJldmVudFwiLCB0b2tlbik7XG5cdFx0aWYoIXJlc3VsdCl7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJyZW1vdmUgZXZlbnQgZmFpbGVkXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdFx0QHByaXZhdGVcblx0XHRAcGFyYW0ge29iamVjdH0gZXZlbnQgY29udGFpbnMgcHJvcGVydGllcyBiZWxvdzpcblx0XHR7bnVtYmVyfSBpbmRleCAtIHRoZSBpbmRleCBvZiB0aGUgY3VycmVudCBzZWxlY3Rpb24gY29sb3IgZWxlbWVudCBpbiBfcGFsZXR0ZUNvbG9yTGlzdC5cblx0XHR7c3RyaW5nfSBjb2xvciAtIHdoYXQgY29sb3IgaXMgZm9yIHRoZSBjdXJyZW50IHRhcmdldC5cblx0Ki9cblx0X25vdGlmeUxpc3RlbmVyKGV2ZW50KXtcblx0XHRyZXR1cm4gdGhpcy5fcHVic3ViLnB1Ymxpc2goXCJldmVudFwiLCBldmVudCk7XG5cdH1cblxuXHQvKipcblx0XHRAcHJpdmF0ZVxuXHQqL1xuXHRfbWFrZUNvbG9yRWxlKGNvbG9yT2JqKXtcblx0XHRsZXQgdWlMaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcblx0XHRsZXQgdWlTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cdFx0aWYoY29sb3JPYmouY29sb3IgPT09IFBDUC5DT0xPUl9OT05FKXtcblx0XHRcdHVpTGkuY2xhc3NMaXN0LnRvZ2dsZShQQ1AuQ09MT1JfTk9ORSk7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHR1aUxpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yT2JqLmNvbG9yO1xuXHRcdH1cblx0XHR1aVNwYW4uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY29sb3JPYmoubmFtZSkpO1xuXHRcdHVpTGkuYXBwZW5kQ2hpbGQodWlTcGFuKTtcblx0XHRyZXR1cm4gdWlMaTtcblx0fVxuXG5cdC8qKlxuXHRcdEBwcml2YXRlXG5cdFx0QHBhcmFtIHtodG1sRWxlbWVudH0gY29udGFpbmVyIC0gc2hvdWxkIGVpdGhlciBiZSBwY3AtcGFsZXR0ZSBvciBwY3Atc2VsZWN0b3IuXG5cdCovXG5cdF9wYXJzZUNvbG9yVWkocGFyZW50RWxlKXtcblx0XHRsZXQgY29sb3JMaXN0ID0gW107XG5cdFx0bGV0IGNoaWxkcmVuID0gcGFyZW50RWxlLmNoaWxkcmVuO1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKyl7XG5cdFx0XHRsZXQgY29sb3JPYmogPSB7fTtcblx0XHRcdGxldCBjb2xvciA9IGNoaWxkcmVuW2ldLmNsYXNzTGlzdC5jb250YWlucyhQQ1AuQ09MT1JfTk9ORSkgPyBQQ1AuQ09MT1JfTk9ORSA6IGNoaWxkcmVuW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvcjtcblx0XHRcdGxldCBsYWJlbCA9IGNoaWxkcmVuW2ldLmNoaWxkTm9kZXNbMF0uaW5uZXJUZXh0IHx8IGNoaWxkcmVuW2ldLmNoaWxkTm9kZXNbMF0udGV4dENvbnRlbnQ7XG5cdFx0XHRjb2xvck9ialtcImxhYmVsXCJdID0gIGxhYmVsO1xuXHRcdFx0Y29sb3JPYmpbXCJjb2xvclwiXSA9ICBjb2xvcjtcblx0XHRcdGNvbG9yTGlzdC5wdXNoKGNvbG9yT2JqKTtcblx0XHR9XG5cdFx0cmV0dXJuIGNvbG9yTGlzdDtcblx0fVxuXG5cdHN0YXRpYyBnZXQgQ09MT1JfTk9ORSgpeyByZXR1cm4gXCJjb2xvci1ub25lXCI7IH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0IGNsYXNzIFB1YlN1Yntcblx0Y29uc3RydWN0b3IoKXtcblx0XHR0aGlzLl90b3BpY3MgPSB7fTtcblx0fVxuXG5cdC8qKlxuXHRcdEBwYXJhbSB7c3RyaW5nfSB0b3BpYyAtIHRoZSB0b3BpYyBjaGFubmVsIHlvdSB3YW50IHRvIG5vdGlmeS5cblx0XHRAcGFyYW0ge29iamVjdH0gbXNnIC0gdGhlIG1lc3NhZ2UgeW91IHdhbnQgdG8gc2VuZCBpbiBvYmplY3QgZm9ybWF0LlxuXHRcdEByZXR1cm4ge2Jvb2xlYW59IC0gcmV0dXJuIHRydWUgaWYgcHVibGlzaCBzdWNjZXNzZnVsbHkgZWxzZSBmYWxzZS5cblx0Ki9cblx0cHVibGlzaCh0b3BpYywgbXNnKXtcblx0XHRpZighdGhpcy5fdG9waWNzW3RvcGljXSl7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGxldCBzdWJzY3JpYmVycyA9IHRoaXMuX3RvcGljc1t0b3BpY107XG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHN1YnNjcmliZXJzW2ldLmRvU29tZXRoaW5nKG1zZyk7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdFx0QHBhcmFtIHtzdGlybmd9IHRvcGljIC0gdGhlIHRvcGljIGNoYW5uZWwgeW91IGFyZSBpbnRlcmVzdGVkIHdpdGguXG5cdFx0QHBhcmFtIHtmdW5jdGlvbiwgb2JqZWN0fSBkb1NvbWV0aGluZyAtIGRvIHNvbWV0aGluZyB3aGVuIHlvdSBnb3Qgbm90aWZpZWQuXG5cdFx0QHJldHVybiB7c3ltYm9sfSAtIGEgdW5pcXVlIHRva2VuIGZvciBldmVyeSBzdWJzY3JpYmVycy4gVXNlZCBmb3IgdW5zdWJzY3JpYmluZy5cblx0Ki9cblx0c3Vic2NyaWJlKHRvcGljLCBkb1NvbWV0aGluZyl7XG5cdFx0aWYoIXRoaXMuX3RvcGljc1t0b3BpY10pe1xuXHRcdFx0dGhpcy5fdG9waWNzW3RvcGljXSA9IFtdO1xuXHRcdH1cblxuXHRcdGxldCB0b2tlbiA9IFN5bWJvbCgpO1xuXHRcdGxldCBzdWJzY3JpYmVyID0ge1xuXHRcdFx0dG9rZW46IHRva2VuLFxuXHRcdFx0ZG9Tb21ldGhpbmc6IGRvU29tZXRoaW5nXG5cdFx0fTtcblxuXHRcdHRoaXMuX3RvcGljc1t0b3BpY10ucHVzaChzdWJzY3JpYmVyKTtcblx0XHRyZXR1cm4gdG9rZW47XG5cdH1cblxuXHQvKipcblx0XHRAcGFyYW0ge3N0cmluZ30gdG9waWMgLSB0aGUgdG9waWMgY2hhbm5lbCB5b3Ugd2FudCB0byB1bnN1YnNjaWJlLlxuXHRcdEBwYXJhbSB7c3ltYm9sfSB0b2tlbiAtIGEgdW5pcXVlIHRva2VuIGZvciB1bnN1YnNjcmliaW5nLiBTaG91bGQgZ2V0IG9uZSBmcm9tIHN1YnNjcmliZSBmdW5jdGlvbi5cblx0XHRAcmV0dXJuIHtvYmplY3QsIGJvb2xlYW59IC0gd2lsbCByZXR1cm4gcmVtb3ZlZCBvYmplY3QgaWYgc3VjY2Vzc2VkIG9yIGZhbHNlIGlmIGZhaWxlZC5cblx0Ki9cblx0dW5zdWJzY3JpYmUodG9waWMsIHRva2VuKXtcblx0XHRpZighdGhpcy5fdG9waWNzW3RvcGljXSl7IHJldHVybiBmYWxzZTsgfVxuXHRcdGlmKHRoaXMuX3RvcGljc1t0b3BpY10ubGVuZ3RoID09PSAwKXsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHRsZXQgc3Vic2NyaWJlcnMgPSB0aGlzLl90b3BpY3NbdG9waWNdO1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRpZihzdWJzY3JpYmVyc1tpXS50b2tlbiA9PT0gdG9rZW4pe1xuXHRcdFx0XHRyZXR1cm4gc3Vic2NyaWJlcnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRoYXNUb3BpYyh0b3BpYyl7XG5cdFx0cmV0dXJuIHRoaXMuX3RvcGljc1t0b3BpY10gPyB0cnVlIDogZmFsc2U7XG5cdH1cblxuXHRhdmFpbGFibGVUb3BpY3MoKXtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpcy5fdG9waWNzKTtcblx0fVxuXG5cdHN1YnNjcmliZXJzKCl7XG5cdFx0bGV0IHJlc3VsdCA9IFtdO1xuXHRcdGZvcihsZXQgdG9waWMgaW4gdGhpcy5fdG9waWNzKXtcblx0XHRcdGlmKHRoaXMuX3RvcGljc1t0b3BpY10pe1xuXHRcdFx0XHRsZXQgY2hhbm5lbCA9IHtcblx0XHRcdFx0XHR0b3BpYzogdG9waWMsXG5cdFx0XHRcdFx0c3Vic2NyaWJlcnM6IHRoaXMuX3RvcGljc1t0b3BpY10ubGVuZ3RoXG5cdFx0XHRcdH1cblx0XHRcdFx0cmVzdWx0LnB1c2goY2hhbm5lbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxufVxuIl19
