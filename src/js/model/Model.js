import {Palette} from "./Palette";

export class Model{
	constructor(paletteColors, selectorColors){
		this.palette = new Palette();
		this.setPaletteColors(paletteColors);
		this.setSelectorColors(selectorColors);
	}

	setPaletteColors(colors, callback){
		this.palette.paletteColors = colors;
		if(callback){ callback(this.palette); }
	}

	setSelectorColors(colors, callback){
		this.palette.selectorColors = colors;
		if(callback){ callback(this.palette); }
	}

	changePaletteColor(index, newColor, callback){
		this.palette.changePaletteColor(index, newColor);
		if(callback){ callback(this.palette); }
	}
}
