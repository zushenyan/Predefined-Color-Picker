class MyTemplate extends pcp.Template {
	constructor(domId, controller){
		super(domId, controller);
		this.uiHelloWorld = null;
	}

	start(){
		this.uiHelloWorld = document.createElement("div");
		this.uiHelloWorld.appendChild(document.createTextNode("Hello World!"));
		this.uiMainContainer.appendChild(this.uiHelloWorld);
	}

	clear(){
		super.clear();
	}

	onPaletteColorsSet(palette){}
	onSelectorColorsSet(selector){}
	onPaletteColorChanged(palette, index, newColor){}
}
