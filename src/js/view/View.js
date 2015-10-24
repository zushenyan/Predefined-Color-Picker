import ActionConstants from "../action/ActionConstants";

export default class View {
	constructor(actionCreator, store){
		this._actionCreator = actionCreator;
		this._store = store;

		this._templateInstance = null;

		this._store.addListener(ActionConstants.SET_DOM_ID, this._onDomIdSet.bind(this));
		this._store.addListener(ActionConstants.SET_TEMPLATE, this._onTemplateSet.bind(this));
	}

	_onDomIdSet(){
		this._onTemplateSet();
	}

	_onTemplateSet(){
		let templatePrototype = this._store.getTemplate();
		let domId = this._store.getDomId();

		if(!templatePrototype || !domId || domId === ""){ return; }
		if(this._templateInstance){ this._templateInstance.clear() };
		this._templateInstance = new templatePrototype(domId, this._actionCreator, this._store);
		this._templateInstance.start();
	}
}
