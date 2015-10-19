var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var Model = pcp.Model;
var Color = pcp.Color;

describe("Model", function(){
	var model = null;
	var palette = [
		{color: "#ff0000", name: ""},
		{color: "#00ff00", name: "123"},
		{color: "#0000ff", name: "234"}
	];
	var selector = [
		{color: "#0000ff", name: "ggyy"},
		{color: "#00ff00", name: ""},
		{color: "#ff0000", name: "qwe"}
	];

	var tp = Color.transform(palette);
	var ts = Color.transform(selector);

	describe("constructor", function(){
		it("should construct correctly", function(){
			model = new Model(palette, selector);
			expect(model.palette.colors).to.eql(tp);
			expect(model.selector.colors).to.eql(ts);
		});
	});

	describe("setPaletteColors", function(){
		it("should set color correctly", function(){
			model.setPaletteColors(selector);
			expect(model.palette.colors).to.eql(ts);
		});
		it("should execute callback", function(){
			function callback(p){
				expect(p).to.equal(model.palette);
			}
			model.setPaletteColors(selector, callback);
		});
	});

	describe("setSelectorColors", function(){
		it("should set color correctly", function(){
			model.setSelectorColors(palette);
			expect(model.selector.colors).to.eql(tp);
		});
		it("should execute callback", function(){
			function callback(p){
				expect(p).to.equal(model.selector);
			}
			model.setSelectorColors(selector, callback);
		});
	});

	describe("changePaletteColor", function(){
		var index = 1;
		var color = {color:"#666666", name: "ooo"};
		it("change correctly", function(){
			model.changePaletteColor(index, color);
			expect(model.palette.colors[index]).to.eql(Color.transform(color));
		});
		it("should execute callback", function(){
			index = 0;
			color = {color:"#555555", name: "ooo"};
			function callback(p, index, newColor){
				expect(index).to.be.equal(index);
				expect(p.colors[index]).to.eql(Color.transform(newColor));
				expect(p.colors[index]).to.eql(Color.transform(color));
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
