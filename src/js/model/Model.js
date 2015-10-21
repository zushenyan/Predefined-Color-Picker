import Palette from "./Palette";
import PubSub from "../util/PubSub";
import Util from "../util/Util";

export default class Model{
	constructor(paletteColors, selectorColors, listener){
		this.palette = new Palette(paletteColors);
		this.selector = new Palette(selectorColors);
		this.broadcaster = new PubSub();
		this.listener = listener;
	}

	setPaletteColors(colors){
		this.palette.colors = colors;
		if(this.listener){
			let copy = Util.deepClone(this.palette);
			this.listener.onPaletteColorsSet(copy);
			this.broadcaster.publish("onPaletteColorsSet", copy);
		}
	}

	setSelectorColors(colors){
		this.selector.colors = colors;
		if(this.listener){
			let copy = Util.deepClone(this.selector);
			this.listener.onSelectorColorsSet(copy);
			this.broadcaster.publish("onSelectorColorsSet", copy);
		}
	}

	changePaletteColor(index, newColor){
		newColor = this.palette.changeColor(index, newColor);
		if(this.listener){
			let copy = Util.deepClone(this.palette);
			this.listener.onPaletteColorChanged(copy, index, newColor);
			this.broadcaster.publish("onPaletteColorChanged", copy, index, newColor);
		}
	}

	/**
		@arg {function} callbacks.
		@return {Symbol} tokens - will return a list of tokens. Use this to unsubscribe.
	*/
	subscribe(onPaletteColorsSet, onSelectorColorsSet, onPaletteColorChanged){
		let tokens = [];
		tokens.push(this.broadcaster.subscribe("onPaletteColorsSet", onPaletteColorsSet));
		tokens.push(this.broadcaster.subscribe("onSelectorColorsSet", onSelectorColorsSet));
		tokens.push(this.broadcaster.subscribe("onPaletteColorChanged", onPaletteColorChanged));
		return tokens;
	}

	/**
		@return {Object, boolean} results - will return removed subscriber or false if not found.
	*/
	unsubscribe(tokens){
		let results = [];
		for(let i = 0; i < tokens.length; i++){
			results.push(this.broadcaster.unsubscribe("onPaletteColorsSet", tokens[i]));
			results.push(this.broadcaster.unsubscribe("onSelectorColorsSet", tokens[i]));
			results.push(this.broadcaster.unsubscribe("onPaletteColorChanged", tokens[i]));
		}
		return results;
	}
}
