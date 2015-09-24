import {PubSub} from "./PubSub";

export class PCP{
	constructor(){
		this._mainEleID = "";
		this._listenerList = {};
		this._paletteColorList = null;
		this._selectorColorList = null;
		this._pubsub = new PubSub();

		this._uiPaletteContainer = null;
		this._uiSelectorContainer = null;
		this._uiMainContainer = null;
	}

	init(domId, palette, selector){
		this._mainEleID = domId;
		initUI.call(this);
		this.setPalette(palette);
		this.setSelector(selector);
		return this;

		function initUI(){
			this._uiPaletteContainer = document.createElement("ul");
			this._uiSelectorContainer = document.createElement("ul");
			this._uiMainContainer = document.getElementById(this.getMainEleId());

			this._uiPaletteContainer.classList.add("pcp-palette");
			this._uiSelectorContainer.classList.add("pcp-selector");
			this._uiMainContainer.appendChild(this._uiPaletteContainer);
			this._uiMainContainer.appendChild(this._uiSelectorContainer);
		}
	}

	getMainEleId(){
		return this._mainEleID;
	}

	/**
		@param {array} colors - receives an array of objects with properties of "color" and "name".
		The array format shuold be like this:
		[{label: "Foobar", color: "#ffffff"},
		 {label: "Foobar", color: "#ffffff"},
		 {label: "Foobar", color: "#ffffff"}...]
	*/
	setPalette(colors){
		let palette = document.querySelector("#" + this.getMainEleId() + " .pcp-palette");
		this._uiPaletteContainer.innerHTML = "";
		this._paletteColorList = colors;

		for(let i = 0; i < colors.length; i++){
			let li = this._makeColorEle(colors[i]);
			li.addEventListener("click", paletteEvent.bind(this));
			this._uiPaletteContainer.appendChild(li);
		}

		function paletteEvent(e){
			let allPaletteColors = this._uiPaletteContainer.children;
			let isSelected = e.currentTarget.classList.contains("current-selection");
			for(let i = 0; i < allPaletteColors.length; i++){
				allPaletteColors[i].classList.remove("current-selection");
			}
			if(isSelected){
				e.currentTarget.classList.remove("current-selection");
			}
			else {
				e.currentTarget.classList.add("current-selection");
			}
		}
	}

	getPalette(){
		return this._paletteColorList;
	}

	/**
		@param {string} colors - receives an array of objects with properties of "color" and "name".
		The array format shuold be like this:
		[{color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}...]
	*/
	setSelector(colors){
		this._uiSelectorContainer.innerHTML = "";
		this._selectorColorList = colors;

		for(let i = 0; i < colors.length; i++){
			let li = this._makeColorEle(colors[i]);
			li.addEventListener("click", selectorEvent.bind(this));
			this._uiSelectorContainer.appendChild(li);
		}

		function selectorEvent(e){
			let currentSelectionColor = selectedElement(this._uiPaletteContainer);
			let bgColor = e.currentTarget.style.backgroundColor;
			if(!currentSelectionColor){
				return;
			}
			currentSelectionColor.className = e.currentTarget.className;
			currentSelectionColor.classList.add("current-selection");
			currentSelectionColor.style.backgroundColor = bgColor;
			let index  = indexOfEle(this._uiPaletteContainer, currentSelectionColor);
			bgColor = e.currentTarget.classList.contains(PCP.COLOR_NONE) ? PCP.COLOR_NONE : bgColor;
			this._paletteColorList = this._parseColorUi(this._uiPaletteContainer);
			this._notifyListener({
				index: index,
				color: bgColor,
				colorSet: this.getPalette(),
				taret: currentSelectionColor
			});

			function selectedElement(parentEle){
				let selectedEle = null;
				let children = parentEle.children;
				for(let i = 0; i < children.length; i++){
					if(children[i].classList.contains("current-selection")){
						selectedEle = children[i];
					}
				}
				return selectedEle;
			}

			function indexOfEle(parent, child){
				let children = parent.children;
				for(let i = 0; i < children.length; i++){
					if(children[i] === child){
						return i;
					}
				}
				return -1;
			}
		}
	}

	getSelector(){
		return this._selectorColorList;
	}

	addEventListener(listener){
		if(name === "undefined" || name === null || (typeof name !== "string")){
			throw new TypeError("parameter name should be type of string: " + name);
		}
		return this._pubsub.subscribe("event", listener);
	}

	removeEventListener(token){
		let result = this._pubsub.unsubscribe("event", token);
		if(!result){
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
	_notifyListener(event){
		return this._pubsub.publish("event", event);
	}

	/**
		@private
	*/
	_makeColorEle(colorObj){
		let uiLi = document.createElement("li");
		let uiSpan = document.createElement("span");
		if(colorObj.color === PCP.COLOR_NONE){
			uiLi.classList.toggle(PCP.COLOR_NONE);
		}
		else{
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
	_parseColorUi(parentEle){
		let colorList = [];
		let children = parentEle.children;
		for(let i = 0; i < children.length; i++){
			let colorObj = {};
			let color = children[i].classList.contains(PCP.COLOR_NONE) ? PCP.COLOR_NONE : children[i].style.backgroundColor;
			let label = children[i].childNodes[0].innerText || children[i].childNodes[0].textContent;
			colorObj["label"] =  label;
			colorObj["color"] =  color;
			colorList.push(colorObj);
		}
		return colorList;
	}

	static get COLOR_NONE(){ return "color-none"; }
}
