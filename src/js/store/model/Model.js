import Palette from "./Palette";

export default class Model{
	constructor(paletteColors, selectorColors){
		this._palette = new Palette(paletteColors);
		this._selector = new Palette(selectorColors);
	}

	setPaletteColors(colors){
		this._palette.colors = colors;
	}

	getPaletteColors(){
		return this._palette.colors;
	}

	setSelectorColors(colors){
		this._selector.colors = colors;
	}

	getSelectorColors(){
		return this._selector.colors;
	}

	changePaletteColor(index, newColor){
		newColor = this._palette.changeColor(index, newColor);
	}
}
