export class DefaultTemplate{
	constructor(){
		this.domId = "";

		this.uiPaletteContainer = null;
		this.uiSelectorContainer = null;
		this.uiMainContainer = null;

		this.uiPaletteContainer = document.createElement("div");
		this.uiSelectorContainer = document.createElement("div");
		this.uiMainContainer = document.getElementById(this.domId);

		this.uiPaletteContainer.classList.add("pcp-palette");
		this.uiSelectorContainer.classList.add("pcp-selector");
		this.uiMainContainer.appendChild(this._uiPaletteContainer);
		this.uiMainContainer.appendChild(this._uiSelectorContainer);
	}
}
