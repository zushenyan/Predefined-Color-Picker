import Store from "./store/Store";
import Dispatcher from "./dispatcher/Dispatcher";
import ActionCreator from "./action/ActionCreator";
import ActionConstants from "./action/ActionConstants";
import View from "./view/View";
import DEFAULT_CONFIG from "./DefaultConfig";

export default class PCP {
	constructor(config){
		this._config = this._createConfig();

		this._dispatcher = new Dispatcher();
		this._store = new Store(this._dispatcher);
		this._actionCreator = new ActionCreator(this._dispatcher);
		this._view = new View(this._actionCreator, this._store);

		this.set(DEFAULT_CONFIG);
	}

	set(newConfig = {}){
		Object.keys(newConfig).forEach((key) => {
			this._config[key].update(newConfig[key]);
		});
	}

	get(key){
		return this._config[key].query();
	}

	subscribe(onPaletteColorsSet, onSelectorColorsSet){
		this._store.addListener(ActionConstants.SET_PALETTE_COLORS, onPaletteColorsSet);
		this._store.addListener(ActionConstants.SET_SELECTOR_COLORS, onSelectorColorsSet);
	}

	unsubscribe(onPaletteColorsSet, onSelectorColorsSet){
		this._store.removeListener(ActionConstants.SET_PALETTE_COLORS, onPaletteColorsSet);
		this._store.removeListener(ActionConstants.SET_SELECTOR_COLORS, onSelectorColorsSet);
	}

	_createConfig(){
		let c = {
			id: {
				query: () => { return this._store.getDomId(); },
				update: (id) => { this._actionCreator[ActionConstants.SET_DOM_ID](id); }
			},
			palette: {
				query: () => { return this._store.getPaletteColors(); },
				update: (palette) => { this._actionCreator[ActionConstants.SET_PALETTE_COLORS](palette); }
			},
			selector: {
				query: () => { return this._store.getSelectorColors(); },
				update: (palette) => { this._actionCreator[ActionConstants.SET_SELECTOR_COLORS](palette); }
			},
			template: {
				query: () => { return this._store.getTemplate(); },
				update: (template) => { this._actionCreator[ActionConstants.SET_TEMPLATE](template); }
			}
		};
		return c;
	}
}
