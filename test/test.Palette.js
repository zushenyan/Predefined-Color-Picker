var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var Palette = pcp.Palette;

describe("Palette", function(){
	var palette = null;
	var list = ["#000000", "#222222", "#333333", "#555555", "#ffffff"];

	describe("constructor", function(){
		it("should constrcut properly", function(){
			palette = new Palette();
			expect(palette.paletteColors).to.be.empty;
			expect(palette.selectorColors).to.be.empty;
		});
	});

	describe("assign paletteColors", function(){
		it("should set pattle correctly", function(){
			palette.paletteColors = list.slice(0);
			expect(palette.paletteColors).to.be.eql(list);
		});
	});

	describe("assign selectorColors", function(){
		it("should set selector correctly", function(){
			palette.selectorColors = list.slice(0);
			expect(palette.selectorColors).to.be.eql(list);
		});
	});

	describe("changePaletteColor", function(){
		it("should change target element", function(){
			var index = 2;
			var color = "#ababab";
			palette.changePaletteColor(index, color);
			expect(palette.paletteColors[index]).to.be.equal(color);

			index = 0;
			color = "#cccccc";
			palette.changePaletteColor(index, color);
			expect(palette.paletteColors[index]).to.be.equal(color);
		});
		it("should throw when out of bound", function(){
			var index = 10;
			var color = "#ababab";
			function run(){
				palette.changePaletteColor(index, color);
			}
			expect(run).to.throw(Error);
		});
		it("should throw when passing invalid hex color code", function(){
			var index = 2;
			var color = "#ab";
			function run(){
				palette.changePaletteColor(index, color);
			}
			expect(run).to.throw(Error);
		});
	});
});
