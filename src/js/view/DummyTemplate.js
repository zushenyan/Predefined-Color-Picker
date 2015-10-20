import Template from "./Template";

export default class DummyTemplate extends Template{
	constructor(domId, controller){
		super(domId, controller);
		this.uiButton = null;
	}

	start(){
		this.uiButton = document.createElement("button");
		this.uiButton.innerHTML = "click me";
		this.uiButton.addEventListener("click", this.buttonClickedEvent.bind(this));

		this.uiMainContainer.classList.add("pcp");
		this.uiMainContainer.appendChild(this.uiButton);
	}

	onPaletteColorsSet(palette){
		console.log("onPaletteColorsSet: ");
		console.log(palette);
	}

	onSelectorColorsSet(selector){
		console.log("onSelectorColorsSet:");
		console.log(selector);
	}

	onPaletteColorChanged(palette, index, newColor){
		console.log("onPaletteColorChanged:");
		console.log("palette: ");
		console.log(palette);
		console.log("index: ");
		console.log(index);
		console.log("newColor: ");
		console.log(newColor);
	}

	buttonClickedEvent(e){
		let newPalette = [
			{color: "#adadad", name: "meow"},
			{color: "#dadada", name: "meow"},
			{color: "#fedcba", name: "meow"},
		];
		this.controller.exec("setPaletteColors", newPalette);
	}
}
