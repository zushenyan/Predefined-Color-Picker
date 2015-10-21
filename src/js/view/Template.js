import ModelEventListener from "../model/ModelEventListener";

/**
	@abstract
*/
export default class Template extends ModelEventListener{
	constructor(domId, controller){
		super();
		if(this.constructor === "Template"){ throw new Error("Template is an abstract class!"); }
		this.domId = domId || null;
		this.controller = controller || null;
		this.uiMainContainer = document.getElementById(this.domId) || null;
		return this;
	}

	clear(){ this.uiMainContainer.innerHTML = ""; }
	start(){ throw new Error("Need to be implemented.") }
}
