import events from "events";
import ActionConstants from "../action/ActionConstants";
import Palette from "./model/Palette";

export default class Store extends events.EventEmitter {
	constructor(dispatcher){
		super();
		this._dispatcher = dispatcher;

		this._palette = new Palette();
		this._selector = new Palette();
		this._domId = "";
		this._template = "";

		this._register();
	}

	getPaletteColors(){
		return this._palette.colors;
	}

	getSelectorColors(){
		return this._selector.colors;
	}

	getDomId(){
		return this._domId;
	}

	getTemplate(){
		return this._template;
	}

	_register(){
		this._dispatcher.register((payload) => {
			switch(payload.type){
				case ActionConstants.SET_PALETTE_COLORS:
					this._palette.colors = payload.data;
					this.emit(ActionConstants.SET_PALETTE_COLORS);
					break;
				case ActionConstants.SET_SELECTOR_COLORS:
					this._selector.colors = payload.data;
					this.emit(ActionConstants.SET_SELECTOR_COLORS);
					break;
				case ActionConstants.CHANGE_PALETTE_COLOR:
					this._palette.changeColor(payload.data.index, payload.data.newColor);
					this.emit(ActionConstants.CHANGE_PALETTE_COLOR);
					break;
				case ActionConstants.SET_DOM_ID:
					this._domId = payload.data;
					this.emit(ActionConstants.SET_DOM_ID);
					break;
				case ActionConstants.SET_TEMPLATE:
					this._template = payload.data;
					this.emit(ActionConstants.SET_TEMPLATE);
					break;
			}
		});
	}
}
