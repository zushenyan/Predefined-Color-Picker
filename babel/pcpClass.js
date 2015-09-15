/*
	Anything starting with underscore means that its a private member.
	Don't try to call them outside or may make unexpected result.
*/

export class PCP{
	_domIdString;
	_listenerList;

	_paletteColorList;
	_selectorColorList;

	constructor(domId, paletteColors, selectorColors){
		this._listenerList = {};
		this._setDomId(domId);
		this._initUI(paletteColors, selectorColors);
	}

	_initUI(paletteColors, selectorColors){
		let uiPalette = document.createElement("ul");
		let uiSelector = document.createElement("ul");
		let uiMain = document.getElementById(this.getDomId());

		uiPalette.classList.add("pcp-palette");
		uiSelector.classList.add("pcp-selector");
		uiMain.appendChild(uiPalette);
		uiMain.appendChild(uiSelector);
		this.setPaletteColors(paletteColors);
		this.setSelectorColors(selectorColors);
	}

	_setDomId(domId){
		if(typeof domId !== "string"){
			throw new TypeError("parameter domId should be type of string: " + domId);
		}
		this._domIdString = domId;
	}

	getDomId(){
		return this._domIdString;
	}

	/*
		@color - receives an array of objects with properties of "color" and "name".
		The array format shuold be like this:
		[{color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}...]
	*/
	setPaletteColors(colors){
		if(!(colors instanceof Array)){
			throw new TypeError("parameter colors should be type of array: " + colors);
		}

		let palette = document.querySelector("#" + this.getDomId() + " .pcp-palette");
		palette.innerHTML = "";
		this._paletteColorList = [];

		colors.forEach((value) => {
			let li = this._makeColorEle(value);
			li.addEventListener("click", this._paletteEvent.bind(this));
			this._paletteColorList.push(li);
			palette.appendChild(li);
		});
	}

	getPaletteColors(){
		return this._parseColorUi(this._paletteColorList);
	}

	/*
		@color - receives an array of objects with properties of "color" and "name".
		The array format shuold be like this:
		[{color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}...]
	*/
	setSelectorColors(colors){
		if(!(colors instanceof Array)){
			throw new TypeError("parameter colors should be type of array: " + colors);
		}

		let selector = document.querySelector("#" + this.getDomId() + " .pcp-selector");
		selector.innerHTML = "";
		this._selectorColorList = [];

		colors.forEach((value) => {
			let li = this._makeColorEle(value);
			li.addEventListener("click", this._selectorEvent.bind(this));
			this._selectorColorList.push(li);
			selector.appendChild(li);
		});
	}

	getSelectorColors(){
		return this._parseColorUi(this._selectorColorList);
	}

	addEventListener(listener, name){
		if(name === "undefined" || name === null || (typeof name !== "string")){
			throw new TypeError("parameter name should be type of string: " + name);
		}
		this._listenerList[name] = listener;
	}

	removeEventListener(name){
		delete this._listenerList[name];
	}

	/*
		event contains properties below:
		@index - the index of the current selection color element in _paletteColorList.
		@color - what color is for the current target.
	*/
	_notifyListener(event){
		for(let key in this._listenerList){
			this._listenerList[key](event);
		}
	}

	_makeColorEle(colorObj){
		let uiLi = document.createElement("li");
		let uiSpan = document.createElement("span");
		if(colorObj.color === PCP.COLOR_NONE){
			uiLi.classList.toggle(PCP.COLOR_NONE);
		}
		else{
			uiLi.style.backgroundColor = colorObj.color;
		}
		uiSpan.innerText = colorObj.name;
		uiLi.appendChild(uiSpan);
		return uiLi;
	}

	_paletteEvent(e){
		let allPaletteColor = document.querySelectorAll("#" + this.getDomId() + " .pcp-palette li");
		let isSelected = e.currentTarget.classList.contains("current-selection");
		Array.prototype.forEach.call(allPaletteColor, (val) => {
			val.classList.remove("current-selection");
		});
		if(isSelected){
			e.currentTarget.classList.remove("current-selection");
		}
		else {
			e.currentTarget.classList.add("current-selection");
		}
	}

	_selectorEvent(e){
		let currentSelectionColor = document.querySelector("#" + this.getDomId() + " .pcp-palette .current-selection");
		let bgColor = e.currentTarget.style.backgroundColor;
		if(!currentSelectionColor){
			return;
		}
		currentSelectionColor.className = e.currentTarget.className;
		currentSelectionColor.classList.add("current-selection");
		currentSelectionColor.style.backgroundColor = bgColor;
		bgColor = e.currentTarget.classList.contains(PCP.COLOR_NONE) ? PCP.COLOR_NONE : bgColor;
		let index  = this._paletteColorList.indexOf(currentSelectionColor);
		this._notifyListener({
			index: index,
			color: bgColor
		});
	}

	/*
		@container - should either be pcp-palette or pcp-selector
	*/
	_parseColorUi(container){
		let colorList = [];
		container.forEach((val) => {
			let colorObj = {};
			let color = val.classList.contains(PCP.COLOR_NONE) ? PCP.COLOR_NONE : val.style.backgroundColor;
			let name = val.childNodes[0].innerText;
			colorObj["color"] =  color;
			colorObj["name"] =  name;
			colorList.push(colorObj);
		});
		return colorList;
	}

	static get COLOR_NONE(){ return "color-none"; }
}
