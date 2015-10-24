/**
	@abstract
*/
export default class Template{
	constructor(domId, actionCreator, store){
		if(this.constructor === "Template"){ throw new Error("Template is an abstract class!"); }
		this._domId = domId || null;
		this._actionCreator = actionCreator || null;
		this._store = store || null;
		return this;
	}

	clear(){ throw new Error("Needs to be implemented."); }
	start(){ throw new Error("Needs to be implemented."); }
}
