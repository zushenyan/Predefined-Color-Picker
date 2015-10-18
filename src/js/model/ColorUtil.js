export class ColorUtil {
	static isHexColors(colors){
		for(let i = 0; i < colors.length; i++){
			if(!ColorUtil.HEXCOLOR_REGEXP.test(colors[i])){
				return false;
			}
		}
		return true;
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
			return "#" + hexCode;
		});
		return colors;
	}

	static get HEXCOLOR_REGEXP(){ return /^#[0-9|a-f]{6}$/i; }
}
