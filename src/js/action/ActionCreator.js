import ActionConstants from "./ActionConstants";

export default class ActionCreator{
	constructor(dispatcher){
		this._dispatcher = dispatcher;
		Object.keys(ActionConstants).forEach((key) => {
			this[ActionConstants[key]] = (data) => {
				this._dispatcher.dispatch({
					type: ActionConstants[key],
					data: data
				});
			};
		});
	}
}
