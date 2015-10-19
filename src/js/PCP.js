import ColorUtil from "./model/ColorUtil";
import Color from "./model/Color";
import Palette from "./model/Palette";
import Model from "./model/Model";
import Controller from "./controller/Controller";
import View from "./view/View";

export default class PCP{
	constructor(){
		this.model = null;
		this.controller = null;
		this.view = null;

		this.domId = "pcp";
		this.palette = [
			new Color("", "A"),
			new Color("#eeeeee", "B"),
			new Color("", "C"),
			new Color("", "D"),
			new Color("", "E"),
			new Color("", "F"),
		];

		this.selector = [
			new Color("#ff0000", "A"),
			new Color("#e3ff00", "B"),
			new Color("", "C"),
			new Color("#00baff", ""),
			new Color("#0021ff", ""),
			new Color("#c000c4", ""),
		];

		this.model = new Model();
		this.controller = new Controller(this.model);
		this.view = new View(this.domId, this.controller);

		this.controller.exec("setPaletteColors", this.palette, this.view.paletteColorsChanged.bind(this.view));
		this.controller.exec("setSelectorColors", this.selector, this.view.selectorColorsChanged.bind(this.view));
	}
}
