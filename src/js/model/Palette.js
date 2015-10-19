import Color from "./Color";

export default class Palette {
	constructor(colors){
		this._colors = null;
		this.colors = colors || [];
	}

	set colors(colors){ this._colors = Color.transform(colors); }
	get colors(){ return this._colors; }

	changeColor(index, newColor){
		if(this._colors[index] === undefined){ throw new Error("target index " + index + " is not exist."); }
		if(!(newColor instanceof Color)){
			newColor = Color.transform(newColor);
		}
		this._colors[index] = newColor;
	}
}
