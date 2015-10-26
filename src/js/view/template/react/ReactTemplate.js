import React from "react";
import ReactDOM from "react-dom";
import Template from "../Template";
import MainComponent from "./MainComponent";

export default class ReactTemplate extends Template {
	constructor(domId, actionCreator, store){
		super(domId, actionCreator, store);
	}

	mount(){
		ReactDOM.render(
			<MainComponent actionCreator={ this._actionCreator } store={ this._store } />,
			document.getElementById(this._domId)
		);
	}

	unmount(){
		ReactDOM.unmountComponentAtNode(document.getElementById(this._domId));
	}
}
