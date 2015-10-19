import Palette from "./Palette";

export default class Model{
	constructor(paletteColors, selectorColors){
		this.palette = new Palette(paletteColors);
		this.selector = new Palette(selectorColors);
	}

	setPaletteColors(colors, callback){
		this.palette.colors = colors;
		if(callback){ callback(this.palette); }
	}

	setSelectorColors(colors, callback){
		this.selector.colors = colors;
		if(callback){ callback(this.selector); }
	}

	changePaletteColor(index, newColor, callback){
		this.palette.changeColor(index, newColor);
		if(callback){ callback(this.palette, index, newColor); }
	}
}
