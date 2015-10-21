import ModelEventListener from "../model/ModelEventListener";

export default class View extends ModelEventListener{
	constructor(domId, controller, template){
		super();
		this._templatePrototype = null;
		this._template = null;
		this._domId = null;

		this.controller = controller;
		this.domId = domId;
		this.template = template;
	}

	set domId(id){
		this._domId = id;
		if(this._templatePrototype){
			this.template = this._templatePrototype;
		}
	}

	get domId(){ return this._domId; }

	/**
		@arg {Template} template - only accepts the NAME of the object, for example:
		right way
		view.template = DefaultTemplate;
		wrong way
		view.template = new DefaultTemplate();
	*/
	set template(template){
		if(!template){ return; }
		if(this.template){ this._template.clear(); }
		this._templatePrototype = template;
		this._template = new this._templatePrototype(this.domId, this.controller);
		this.onPaletteColorsSet = this._template.onPaletteColorsSet.bind(this._template);
		this.onSelectorColorsSet = this._template.onSelectorColorsSet.bind(this._template);
		this.onPaletteColorChanged = this._template.onPaletteColorChanged.bind(this._template);

		this._template.start();
	}

	get template(){ return this._templatePrototype; }
}
