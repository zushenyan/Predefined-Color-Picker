export class PCP{
	_domId;
	_listenerList;
	_paletteColors;
	_selectorColors;

	constructor(domId, paletteColors, selectorColors){
		this._listenerList = {};

		this._setDomId(domId);
		this.setPalette(paletteColors);
		this.setSelector(selectorColors);
	}

	create(){
		let uiPalette = document.createElement("ul");
		let uiSelector = document.createElement("ul");
		let uiMain = document.getElementById(this.getDomId());

		this._paletteColors.forEach((colorObj) => {
			let li = makeColorEle(colorObj);
			li.addEventListener("click", paletteEvent.bind(this));
			uiPalette.appendChild(li);
		});

		this._selectorColors.forEach((colorObj) => {
			let li = makeColorEle(colorObj);
			li.addEventListener("click", selectorEvent.bind(this));
			uiSelector.appendChild(li);
		});

		uiPalette.classList.add("pcp-palette");
		uiSelector.classList.add("pcp-selector");

		uiMain.appendChild(uiPalette);
		uiMain.appendChild(uiSelector);

		function makeColorEle(colorObj){
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

		function paletteEvent(e){
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

		function selectorEvent(e){
			let currentSelectionColor = document.querySelector("#" + this.getDomId() + " .pcp-palette .current-selection");
			currentSelectionColor.className = e.currentTarget.className;
			currentSelectionColor.classList.add("current-selection");
			currentSelectionColor.style.backgroundColor = e.currentTarget.style.backgroundColor;
		}
	}

	_setDomId(domId){
		if(domId === "undefined" || domId === null || (typeof domId !== "string")){
			throw new TypeError("parameter domId should be type of string: " + domId);
		}
		this._domId = domId;
	}

	getDomId(){
		return this._domId;
	}

	/*
		@color - receives an array of objects with properties of "color" and "name".
		The array format shuold be like this:
		[{color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}, {color: "#ffffff", name: "Foobar"}...]
	*/
	setPalette(colors){
		if(colors === "undefined" || colors === null || !(colors instanceof Array)){
			throw new TypeError("parameter colors should be type of array: " + colors);
		}
		this._paletteColors = colors;
	}

	setSelector(colors){
		if(colors === "undefined" || colors === null || !(colors instanceof Array)){
			throw new TypeError("parameter colors should be type of array: " + colors);
		}
		this._selectorColors = colors;
	}

	addListener(listener, name){

	}

	removeListener(name){

	}

	notifyListener(){

	}

	static get COLOR_NONE(){ return "color-none"; }
}
