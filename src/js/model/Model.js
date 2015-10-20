import Palette from "./Palette";

export default class Model{
	constructor(paletteColors, selectorColors, listener){
		this.palette = new Palette(paletteColors);
		this.selector = new Palette(selectorColors);
		this.listener = listener;
	}

	setPaletteColors(colors){
		this.palette.colors = colors;
		if(this.listener){ this.listener.onPaletteColorsSet(this.palette); }
	}

	setSelectorColors(colors){
		this.selector.colors = colors;
		if(this.listener){ this.listener.onSelectorColorsSet(this.selector); }
	}

	changePaletteColor(index, newColor){
		newColor = this.palette.changeColor(index, newColor);
		if(this.listener){ this.listener.onPaletteColorChanged(this.palette, index, newColor); }
	}
}
