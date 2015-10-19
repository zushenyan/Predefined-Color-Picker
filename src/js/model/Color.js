import ColorUtil from "./ColorUtil";

export default class Color{
	constructor(color, name){
		this._color = "";

		this.color = color || "";
		this.name = name || "";
	}

	set color(color){
		if(!ColorUtil.isHexColors(color)){ throw new Error(color + " contains invalid hex color code"); }
		this._color = color;
	}

	get color(){ return this._color; }

	/**
		Accepts object or list of objects containing format like below and transform it to array of Color
		{
			color: "#123456",
			name: "ggyy"
		}
	*/
	static transform(colors){
		if(colors instanceof Array){
			let list = [];
			for(let i = 0; i < colors.length; i++){
				if(colors[i] instanceof Color){ list.push(colors[i]); }
				else{ list.push(new Color(colors[i].color, colors[i].name)); }
			}
			return list;
		}
		else if(colors instanceof Color){
			return colors;
		}
		else if(colors instanceof Object){
			return new Color(colors.color, colors.name);
		}
		else {
			throw new Error(colors + " is neither array or object");
		}
	}
}
