import ColorUtil from "../model/ColorUtil";

export default class View{
	constructor(id, controller){
		this.domId = id;
		this.controller = controller;

		this.uiMainContainer = null;
		this.uiPaletteContainer = null;
		this.uiSelectorContainer = null;

		this.uiMainContainer = document.getElementById(this.domId);
		this.uiPaletteContainer = document.createElement("div");
		this.uiSelectorContainer = document.createElement("div");

		this.uiMainContainer.classList.add("pcp");
		this.uiPaletteContainer.classList.add("palette");
		this.uiSelectorContainer.classList.add("selector");


		this.uiMainContainer.appendChild(this.uiPaletteContainer);
		this.uiMainContainer.appendChild(this.uiSelectorContainer);
	}

	paletteColorsChanged(palette){
		this.uiPaletteContainer.innerHTML = "";
		let colors = palette.colors;
		for(let i = 0; i < colors.length; i++){
			let ele = this._makeColorEle(colors[i]);
			ele.addEventListener("click", this.paletteMouseEvent.bind(this));
			this.uiPaletteContainer.appendChild(ele);
		}
	}

	selectorColorsChanged(selector){
		this.uiSelectorContainer.innerHTML = "";
		let colors = selector.colors;
		for(let i = 0; i < colors.length; i++){
			let ele = this._makeColorEle(colors[i]);
			ele.addEventListener("click", this.selectorMouseEvent.bind(this));
			this.uiSelectorContainer.appendChild(ele);
		}
	}

	paletteColorChanged(palette, index, newColor){
		let childEle = this.uiPaletteContainer.children[index];
		let bgColor = newColor.color;
		if(bgColor === ""){
			bgColor = "transparent";
			childEle.classList.add("bg-none");
		}
		else{
			childEle.classList.remove("bg-none");
		}
		childEle.style.backgroundColor = bgColor;
	}

	paletteMouseEvent(e){
		let lastSelectedColor = this._queryByClass(this.uiPaletteContainer, "selected");
		if(lastSelectedColor){
			lastSelectedColor.classList.remove("selected");
		}
		if(e.currentTarget !== lastSelectedColor){
			e.currentTarget.classList.add("selected");
		}
	}

	selectorMouseEvent(e){
		let selectedColor = this._queryByClass(this.uiPaletteContainer, "selected");
		let paletteArray = Object.keys(this.uiPaletteContainer.children).map((i) => { return this.uiPaletteContainer.children[i]; });
		let selectorArray = Object.keys(this.uiSelectorContainer.children).map((i) => { return this.uiSelectorContainer.children[i]; });
		let selectorIndex = selectorArray.indexOf(e.currentTarget);
		let paletteIndex = paletteArray.indexOf(selectedColor);
		if(selectorIndex < 0 || paletteIndex < 0){
			return;
		}
		let newColor = this.controller.query("selector").colors[selectorIndex];
		this.controller.exec("changePaletteColor", paletteIndex, newColor, this.paletteColorChanged.bind(this));
	}

	_makeColorEle(color){
		let colorEle = document.createElement("div");
		let labelEle = document.createElement("div");
		let bg = color.color === ColorUtil.COLOR_NONE ? "transparent" : color.color;

		colorEle.classList.add("color");
		labelEle.classList.add("label");

		if(color.color === ColorUtil.COLOR_NONE){
			colorEle.classList.add("bg-none");
		}

		colorEle.style.backgroundColor = bg;

		labelEle.appendChild(document.createTextNode(color.name));
		colorEle.appendChild(labelEle);
		return colorEle;
	}

	_queryByClass(parentEle, className){
		let targetEle = null;
		let children = parentEle.children;
		for(let i = 0; i < children.length; i++){
			if(children[i].classList.contains(className)){
				targetEle = children[i];
			}
		}
		return targetEle;
	}
}
