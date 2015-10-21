export default class ColorUtil {
	static isHexColors(colors){
		if(typeof colors === "string" || colors instanceof String){
			return isValid(colors);
		}
		else if(colors instanceof Array){
			for(let i = 0; i < colors.length; i++){
				if(!isValid(colors[i])){ return false; }
			}
			return true;
		}
		else{
			throw new Error(colors + " is not a string or array");
		}

		function isValid(hexCode){
			if(!ColorUtil.HEXCOLOR_REGEXP.test(hexCode) && hexCode !== ColorUtil.COLOR_NONE){
				return false;
			}
			return true;
		}
	}

	static colorsToSerial(colors){
		let serial = "";
		for(let i = 0; i < colors.length; i++){
			serial += colors[i].slice(1);
			if(i + 1 < colors.length){
				serial += "+";
			}
		}
		return serial;
	}

	static serialToColors(serial){
		let rawColors = serial.split("+");
		let colors = rawColors.map(function(hexCode){
			if(hexCode === ColorUtil.COLOR_NONE){
				return hexCode;
			}
			else{
				return "#" + hexCode;
			}
		});
		return colors;
	}

	static get HEXCOLOR_REGEXP(){ return /^#[0-9|a-f]{6}$/i; }
	static get COLOR_NONE(){ return ""; }
}
