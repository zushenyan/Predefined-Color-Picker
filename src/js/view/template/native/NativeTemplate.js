import ActionConstants from "../../../action/ActionConstants";
import Template from "../Template";
import ColorUtil from "../../../store/model/ColorUtil";

export default class NativeTemplate extends Template{
	constructor(domId, actionCreator, store){
		super(domId, actionCreator, store);
		this.uiPaletteContainer = null;
		this.uiSelectorContainer = null;
		this.uiMainContainer = null;

		this.paletteStoreToken = null;
		this.selectorStoreToken = null;

		this._onPaletteColorsSetToken = this.onPaletteColorsSet.bind(this);
		this._onSelectorColorsSetToken = this.onSelectorColorsSet.bind(this);
	}

	mount(){
		this.uiMainContainer = document.getElementById(this._domId);
		this.uiPaletteContainer = document.createElement("div");
		this.uiSelectorContainer = document.createElement("div");

		this.uiMainContainer.classList.add("pcp");
		this.uiPaletteContainer.classList.add("pcp-palette");
		this.uiSelectorContainer.classList.add("pcp-selector");

		this.uiMainContainer.appendChild(this.uiPaletteContainer);
		this.uiMainContainer.appendChild(this.uiSelectorContainer);

		this.onPaletteColorsSet();
		this.onSelectorColorsSet();

		this._store.addListener(ActionConstants.SET_PALETTE_COLORS , this._onPaletteColorsSetToken);
		this._store.addListener(ActionConstants.SET_SELECTOR_COLORS, this._onSelectorColorsSetToken);
		this._store.addListener(ActionConstants.CHANGE_PALETTE_COLOR, this._onPaletteColorsSetToken);
	}

	unmount(){
		this.uiMainContainer.innerHTML = "";
		this.uiMainContainer.className = "";
		this._store.removeListener(ActionConstants.SET_PALETTE_COLORS , this._onPaletteColorsSetToken);
		this._store.removeListener(ActionConstants.SET_SELECTOR_COLORS, this._onSelectorColorsSetToken);
		this._store.removeListener(ActionConstants.CHANGE_PALETTE_COLOR, this._onPaletteColorsSetToken);
	}

	onPaletteColorsSet(){
		let lastSelectedColorIndex = this._getSelectedColorIndex(this.uiPaletteContainer);
		let colors = this._store.getPaletteColors();
		this.uiPaletteContainer.innerHTML = "";
		for(let i = 0; i < colors.length; i++){
			let ele = this._makeColorEle(colors[i]);
			ele.addEventListener("click", this._paletteMouseEvent.bind(this));
			this.uiPaletteContainer.appendChild(ele);
		}
		if(lastSelectedColorIndex !== -1 && lastSelectedColorIndex < colors.length){
			this.uiPaletteContainer.children[lastSelectedColorIndex].classList.add("pcp-selected");
		}
	}

	onSelectorColorsSet(){
		let colors = this._store.getSelectorColors();
		this.uiSelectorContainer.innerHTML = "";
		for(let i = 0; i < colors.length; i++){
			let ele = this._makeColorEle(colors[i]);
			ele.addEventListener("click", this._selectorMouseEvent.bind(this));
			this.uiSelectorContainer.appendChild(ele);
		}
	}

	_paletteMouseEvent(e){
		let lastSelectedColor = this._queryByClass(this.uiPaletteContainer, "pcp-selected");
		if(lastSelectedColor){
			lastSelectedColor.classList.remove("pcp-selected");
		}
		if(e.currentTarget !== lastSelectedColor){
			e.currentTarget.classList.add("pcp-selected");
		}
	}

	_selectorMouseEvent(e){
		let paletteIndex = this._getSelectedColorIndex(this.uiPaletteContainer);
		let selectorIndex = this._getSelectedColorIndex(this.uiSelectorContainer, e);
		if(selectorIndex < 0 || paletteIndex < 0){
			return;
		}
		let color = this._store.getSelectorColors()[selectorIndex].color;
		let name = this._store.getPaletteColors()[paletteIndex].name;
		let newColor = {
			color: color,
			name: name
		};
		this._actionCreator[ActionConstants.CHANGE_PALETTE_COLOR]({index: paletteIndex, newColor});
	}

	_getSelectedColorIndex(parent, e){
		if(parent === this.uiPaletteContainer){
			let selectedColor = this._queryByClass(parent, "pcp-selected");
			return this._indexInParent(parent, selectedColor);
		}
		else if(parent === this.uiSelectorContainer){
			return this._indexInParent(parent, e.currentTarget);
		}
		throw new Error("wat?");
	}

	_indexInParent(parent, element){
		let array = Object.keys(parent.children).map((key) => { return parent.children[key] });
		return array.indexOf(element);
	}

	_makeColorEle(color){
		let colorEle = document.createElement("div");
		let labelEle = document.createElement("div");
		let bg = color.color === ColorUtil.COLOR_NONE ? "transparent" : color.color;

		colorEle.classList.add("pcp-color");
		labelEle.classList.add("pcp-label");

		if(color.color === ColorUtil.COLOR_NONE){
			colorEle.classList.add("pcp-bg-none");
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
