import DefaultTemplate from "./view/DefaultTemplate";

let DEFAULT_CONFIG = {
	id: "pcp",
	palette: [
		{color: "", name: "A"},
		{color: "", name: "B"},
		{color: "", name: "C"},
		{color: "", name: "D"},
		{color: "", name: "E"},
	],
	selector: [
		{color: "", name: ""},
		{color: "#ff0000", name: ""},
		{color: "#e3ff00", name: ""},
		{color: "#00baff", name: ""},
		{color: "#0021ff", name: ""},
	],
	template: DefaultTemplate
};

export { DEFAULT_CONFIG as default };
