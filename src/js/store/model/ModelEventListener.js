export default class ModelEventListener{
	constructor(){
		if(this.constructor === "ModelEventListener"){
			throw new Error("This class is an interface! Shouldn't be instantiated!");
		}
		return this;
	}

	onPaletteColorsSet(palette){ throw new Error("Needs to be implemented."); }
	onSelectorColorsSet(selector){ throw new Error("Needs to be implemented."); }
	onPaletteColorChanged(palette, index, newColor){ throw new Error("Needs to be implemented."); }
}
