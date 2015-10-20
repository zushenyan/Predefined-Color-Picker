import Template from "./Template";
import ColorUtil from "../model/ColorUtil";

export default class DefaultTemplate extends Template{
	constructor(domId, controller){
		super(domId, controller);
		this.uiPaletteContainer = null;
		this.uiSelectorContainer = null;
	}

	start(){
		this.uiPaletteContainer = document.createElement("div");
		this.uiSelectorContainer = document.createElement("div");

		this.uiMainContainer.classList.add("pcp");
		this.uiPaletteContainer.classList.add("palette");
		this.uiSelectorContainer.classList.add("selector");

		this.uiMainContainer.appendChild(this.uiPaletteContainer);
		this.uiMainContainer.appendChild(this.uiSelectorContainer);

		let palette = this.controller.query("palette");
		let selector = this.controller.query("selector");
		this.onPaletteColorsSet(palette);
		this.onSelectorColorsSet(selector);
	}

	clear(){
		super.clear();
		this.uiMainContainer.className = "";
	}

	onPaletteColorsSet(palette){
		this.uiPaletteContainer.innerHTML = "";
		let colors = palette.colors;
		for(let i = 0; i < colors.length; i++){
			let ele = this._makeColorEle(colors[i]);
			ele.addEventListener("click", this.paletteMouseEvent.bind(this));
			this.uiPaletteContainer.appendChild(ele);
		}
	}

	onSelectorColorsSet(selector){
		this.uiSelectorContainer.innerHTML = "";
		let colors = selector.colors;
		for(let i = 0; i < colors.length; i++){
			let ele = this._makeColorEle(colors[i]);
			ele.addEventListener("click", this.selectorMouseEvent.bind(this));
			this.uiSelectorContainer.appendChild(ele);
		}
	}

	onPaletteColorChanged(palette, index, newColor){
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
		let newColor = this.controller.query("selector").colors[selectorIndex].color;
		let name = this.controller.query("palette").colors[paletteIndex].name;
		let copyColor = {
			color: newColor,
			name: name
		};
		this.controller.exec("changePaletteColor", paletteIndex, copyColor);
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
