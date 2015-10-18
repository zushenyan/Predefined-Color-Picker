import {PubSub} from "./PubSub";
import {PCP} from "./PCP";

(function(window){
	"use strict";

	let pkg = {
		PCP: PCP,
		PubSub: PubSub
	}

	window.pcp = pkg;
})(window);
