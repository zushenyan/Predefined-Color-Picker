var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var Model = pcp.Model;

describe("Model", function(){
	var model = null;
	var palette = ["#ff0000", "#00ff00", "#0000ff"];
	var selector = ["#0000ff", "#00ff00", "#ff0000"];

	describe("constructor", function(){
		it("should construct correctly", function(){
			model = new Model(palette.slice(0), selector.slice(0));
			expect(model.palette.paletteColors).to.be.eql(palette);
			expect(model.palette.selectorColors).to.be.eql(selector);
		});
	});

	describe("setPaletteColors", function(){
		it("should set color correctly", function(){
			model.setPaletteColors(selector.slice(0));
			expect(model.palette.paletteColors).to.be.eql(selector);
		});
		it("should execute callback", function(){
			function callback(p){
				expect(p).to.be.equal(model.palette);
			}
			model.setPaletteColors(selector.slice(0), callback);
		});
	});

	describe("setSelectorColors", function(){
		it("should set color correctly", function(){
			model.setSelectorColors(palette.slice(0));
			expect(model.palette.selectorColors).to.be.eql(palette);
		});
		it("should execute callback", function(){
			function callback(p){
				expect(p).to.be.equal(model.palette);
			}
			model.setSelectorColors(selector.slice(0), callback);
		});
	});

	describe("changePaletteColor", function(){
		var index = 1;
		var color = "#666666";
		it("change correctly", function(){
			model.changePaletteColor(index, color);
			expect(model.palette.paletteColors[index]).to.be.equal(color);
		});
		it("should execute callback", function(){
			index = 0;
			color = "#555555";
			function callback(p){
				expect(p.paletteColors[index]).to.be.equal(color);
			}
			model.changePaletteColor(index, color, callback);
		});
		it("should throw", function(){
			index = 10;
			function run(){
				model.changePaletteColor(index, color);
			}
			expect(run).to.throw(Error);
		});
	});
});
