export default class Config{
	constructor(){
		this.values = {};
		this.actions = {};
	}

	append(key, value, action){
		this.values[key] = value;
		this.actions[key] = action;
	}

	update(key, value, action = this.actions[key]){
		if(this.values.hasOwnProperty(key) && this.actions.hasOwnProperty(key)){
			this.values[key] = value;
			this.actions[key] = action;
			return true;
		}
		return false;
	}

	query(key){
		return this.values[key];
	}

	exec(key, ...args){
		return this.actions[key] ? this.actions[key](...args) : null;
	}
}
