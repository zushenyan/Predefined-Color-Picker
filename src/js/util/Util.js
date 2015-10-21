let Util = {
	deepClone: function(source){
		return cloneHelper({}, source);

		function cloneHelper(target, source){
			for(let key in source){
				// use getOwnPropertyDescriptor instead of source[key] to prevent from trigering setter/getter.
				let descriptor = Object.getOwnPropertyDescriptor(source, key);
				if(descriptor.value instanceof String){
					target[key] = new String(descriptor.value);
				}
				else if(descriptor.value instanceof Array){
					target[key] = cloneHelper([], descriptor.value);
				}
				else if(descriptor.value instanceof Object){
					let prototype = Reflect.getPrototypeOf(descriptor.value);
					let cloneObject = cloneHelper({}, descriptor.value);
					Reflect.setPrototypeOf(cloneObject, prototype);
					target[key] = cloneObject;
				}
				else {
					Object.defineProperty(target, key, descriptor);
				}
			}
			let prototype = Reflect.getPrototypeOf(source);
			Reflect.setPrototypeOf(target, prototype);

			return target;
		}
	}
};

export { Util as default };
