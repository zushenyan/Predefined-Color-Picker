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

		if(!templatePrototype){ return; }
		if(!document.getElementById(domId)){ console.log(`"${domId}" does not exist`); return; }
		if(this._templateInstance){ this._templateInstance.unmount() };
		this._templateInstance = new templatePrototype(domId, this._actionCreator, this._store);
		this._templateInstance.mount();
	}
}
