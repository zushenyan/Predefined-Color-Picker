import Util from "../util/Util";

export default class Controller{
	constructor(model){
		this.model = model || null;
	}

	exec(command, ...args){
		if(this.model[command] instanceof Function){
			return this.model[command](...args);
		}
		else if(this.model[command] instanceof String){
			return new String(this.model[command]);
		}
		else if(this.model[command] instanceof Array){
			return this.model[command].slice(0);
		}
		else if(this.model[command] instanceof Object){
			return Util.deepClone(this.model[command]);
		}
		else if(this.model[command]){
			return this.model[command];
		}
		else{
			throw new Error("No such command: " + command);
		}
	}

	/**
		Just a wrapper for semantic-comfort purpose.
		Let you feels like you really want to look up something intead of executing something.
	*/
	query(command){
		return this.exec(command);
	}
}
