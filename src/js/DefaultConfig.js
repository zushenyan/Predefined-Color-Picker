import NativeTemplate from "./view/template/native/NativeTemplate";
import ReactTemplate from "./view/template/react/ReactTemplate";

let DEFAULT_CONFIG = {
	id: "",
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
	template: ReactTemplate
};

export { DEFAULT_CONFIG as default };
