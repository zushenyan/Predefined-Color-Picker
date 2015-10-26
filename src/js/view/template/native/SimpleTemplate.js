import ActionConstants from "../../../action/ActionConstants";
import Template from "../Template";

export default class SimpleTemplate extends Template{
	constructor(domId, actionCreator, store){
		super(domId, actionCreator, store);
		this.uiButton = null;
		this.uiMainContainer = null;

		this._onPaletteColorsSetToken = this.onPaletteColorsSet.bind(this);
		this._onSelectorColorsSetToken = this.onSelectorColorsSet.bind(this);
	}

	mount(){
		this.uiMainContainer = document.getElementById(this._domId);
		this.uiButton = document.createElement("button");
		this.uiButton.innerHTML = "click me";
		this.uiButton.addEventListener("click", this.buttonClickedEvent.bind(this));

		this.uiMainContainer.classList.add("pcp");
		this.uiMainContainer.appendChild(this.uiButton);

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
		console.log("onPaletteColorsSet: ");
		console.log(this._store.getPaletteColors());
	}

	onSelectorColorsSet(){
		console.log("onSelectorColorsSet:");
		console.log(this._store.getSelectorColors());
	}

	buttonClickedEvent(e){
		let newPalette = [
			{color: "#adadad", name: "meow"},
			{color: "#dadada", name: "meow"},
			{color: "#fedcba", name: "meow"},
		];
		this._actionCreator[ActionConstants.SET_PALETTE_COLORS](newPalette);
	}
}
