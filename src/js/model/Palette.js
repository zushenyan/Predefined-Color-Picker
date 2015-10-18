import { ColorUtil } from "./ColorUtil";

export class Palette {
	constructor(paletteColors, selectorColors){
		this._paletteColors = paletteColors || [];
		this._selectorColors = selectorColors || [];
	}

	set paletteColors(colors){
		if(!ColorUtil.isHexColors(colors)){ throw new Error(colors + " contains invalid hex color code"); }
		this._paletteColors = colors;
	}

	set selectorColors(colors){
		if(!ColorUtil.isHexColors(colors)){ throw new Error(colors + " contains invalid hex color code"); }
		this._selectorColors = colors;
	}

	get paletteColors(){ return this._paletteColors; }
	get selectorColors(){ return this._selectorColors; }

	changePaletteColor(index, newColor){
		if(!this._paletteColors[index]){ throw new Error("target is not exist."); }
		if(!ColorUtil.isHexColors([newColor])){ throw new Error(newColor + " is not an invalid hex color code"); }
		this._paletteColors[index] = newColor;
	}
}
