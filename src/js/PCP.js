import Model from "./model/Model";
import Controller from "./controller/Controller";
import View from "./view/View";
import ConfigDB from "./util/ConfigDB";
import DEFAULT_CONFIG from "./DefaultConfig";

export default class PCP{
	constructor(config){
		this._model = null;
		this._controller = null;
		this._view = null;

		this._config = this._createConfig();

		this._model = new Model();
		this._controller = new Controller(this._model);
		this._view = new View(this._config.query("id"), this._controller, this._config.query("template"));
		this._model.listener = this._view;

		this.set(config, false);
	}

	set(newConfig = {}, run = true){
		Object.keys(newConfig).forEach((key) => {
			let newValue = newConfig[key];
			this._config.update(key, newValue);
			if(run){
				this._config.exec(key);
			}
		});
	}

	run(){
		Object.keys(this._config.actions).forEach((key) => {
			this._config.exec(key);
		});
	}

	subscribe(onPaletteColorsSet, onSelectorColorsSet, onPaletteColorChanged){
		return this._controller.exec("subscribe", onPaletteColorsSet, onSelectorColorsSet, onPaletteColorChanged);
	}

	unsubscribe(tokens){
		return this._controller.exec("unsubscribe", tokens);
	}

	_createConfig(){
		let dc = DEFAULT_CONFIG;
		let c = new ConfigDB();
		c.append("id", dc["id"], ()=>{ this._view.domId = this._config.query("id"); });
		c.append("palette", dc["palette"], ()=>{ this._controller.exec("setPaletteColors", this._config.query("palette")); });
		c.append("selector", dc["selector"], ()=>{ this._controller.exec("setSelectorColors", this._config.query("selector")); });
		c.append("template", dc["template"], ()=>{ this._view.template = this._config.query("template"); });
		return c;
	}
}
