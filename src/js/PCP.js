import ColorUtil from "./model/ColorUtil";
import Color from "./model/Color";
import Palette from "./model/Palette";
import Model from "./model/Model";
import Controller from "./controller/Controller";
import View from "./view/View";
import DefaultTemplate from "./view/DefaultTemplate";
import DummyTemplate from "./view/DummyTemplate";
import Config from "./Config";

export default class PCP{
	constructor(config){
		this.model = null;
		this.controller = null;
		this.view = null;

		this._config = this._createConfig();

		this.model = new Model();
		this.controller = new Controller(this.model);
		this.view = new View(this._config.query("id"), this.controller, this._config.query("template"));
		this.model.listener = this.view;

		this.set(config);
	}

	set(newConfig = {}){
		Object.keys(newConfig).forEach((key) => {
			let newValue = newConfig[key];
			this._config.update(key, newValue);
			this._config.exec(key);
		});
	}

	run(){
		this.controller.exec("setPaletteColors", this._config.query("palette"));
		this.controller.exec("setSelectorColors", this._config.query("selector"));
	}

	_createConfig(){
		let dc = PCP.DEFAULT_CONFIG;
		let c = new Config();
		c.append("id", dc["id"], ()=>{ this.view.domId = this._config.query("id"); });
		c.append("palette", dc["palette"], ()=>{ this.controller.exec("setPaletteColors", this._config.query("palette")); });
		c.append("selector", dc["selector"], ()=>{ this.controller.exec("setSelectorColors", this._config.query("selector")); });
		c.append("template", dc["template"], ()=>{ this.view.template = this._config.query("template"); });
		return c;
	}

	static get DEFAULT_CONFIG(){
		return {
			id: "pcp",
			palette: [
				{color: "", name: "A"},
				{color: "", name: "B"},
				{color: "", name: "C"},
				{color: "", name: "D"},
				{color: "", name: "E"},
			],
			selector: [
				{color: "", name: ""},
				{color: "#ff0000", name: ""},
				{color: "#e3ff00", name: ""},
				{color: "#00baff", name: ""},
				{color: "#0021ff", name: ""},
			],
			template: DefaultTemplate
		};
	}
}
