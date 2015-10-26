class MyTemplate extends pcp.Template {
	constructor(domId, actionCreator, store){
		super(domId, actionCreator, store);
		this.uiButton = null;
		this.uiMainContainer = null;

		this._reportToken = this._report.bind(this);
	}

	mount(){
		this.uiButton = document.createElement("button");
		this.uiButton.addEventListener("click", (e) => {
			let palette = [
				{color: "", name: "C"},
				{color: "", name: "A"},
				{color: "", name: "T"},
			];
			this._actionCreator[pcp.ActionConstants.SET_PALETTE_COLORS](palette);
		});
		this.uiButton.innerHTML = "press me to modify color(see console)";
		this.uiMainContainer = document.getElementById(this._domId);
		this.uiMainContainer.appendChild(this.uiButton);

		this._store.addListener(pcp.ActionConstants.SET_PALETTE_COLORS, this._reportToken);
		this._store.addListener(pcp.ActionConstants.SET_SELECTOR_COLORS, this._reportToken);
		this._store.addListener(pcp.ActionConstants.CHANGE_PALETTE_COLOR, this._reportToken);
	}

	unmount(){
		this._store.removeListener(pcp.ActionConstants.SET_PALETTE_COLORS, this._reportToken);
		this._store.removeListener(pcp.ActionConstants.SET_SELECTOR_COLORS, this._reportToken);
		this._store.removeListener(pcp.ActionConstants.CHANGE_PALETTE_COLOR, this._reportToken);
	}

	_report(){
		console.log(this._store.getPaletteColors());
		console.log(this._store.getSelectorColors());
	}
}
