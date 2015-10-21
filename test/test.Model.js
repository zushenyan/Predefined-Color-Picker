var sinon = require("sinon");
var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var Model = pcp.Model;
var Color = pcp.Color;

describe("Model", function(){
	var model = null;
	var listener = {
		onPaletteColorsSet(p){ },
		onSelectorColorsSet(s){ },
		onPaletteColorChanged(p, index, newColor){ }
	};
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

	var tokens, sub1, sub2, sub3;

	describe("constructor", function(){
		it("should construct correctly", function(){
			model = new Model(palette, selector, listener);
			expect(model.palette.colors).to.eql(tp);
			expect(model.selector.colors).to.eql(ts);
			expect(model.listener).to.equal(listener);
		});
	});

	describe("setPaletteColors", function(){
		it("should set color correctly", function(){
			model.setPaletteColors(selector);
			expect(model.palette.colors).to.eql(ts);
		});
		it("should execute callback", function(){
			listener.onPaletteColorsSet = function(p){ expect(p.colors).to.eql(ts); };
			model.setPaletteColors(selector);
			listener.onPaletteColorsSet = function(p){};
		});
	});

	describe("setSelectorColors", function(){
		it("should set color correctly", function(){
			model.setSelectorColors(palette);
			expect(model.selector.colors).to.eql(tp);
		});
		it("should execute callback", function(){
			listener.onSelectorColorsSet = function(s){ expect(s.colors).to.eql(tp); };
			model.setSelectorColors(palette);
			listener.onSelectorColorsSet = function(s){};
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
			listener.onPaletteColorChanged = function(p, index, newColor){ expect(p.colors[index]).to.eql(Color.transform(newColor)); };
			model.changePaletteColor(index, color);
			listener.onPaletteColorChanged = function(p, index, newColor){};
		});
		it("should throw", function(){
			index = 10;
			function run(){
				model.changePaletteColor(index, color);
			}
			expect(run).to.throw(Error);
		});
	});

	describe("subscribe", function(){
		it("should trigger publish", function(){
			sub1 = function(palette){
				expect(palette).to.eql(model.palette);
				expect(palette).to.not.equal(model.palette);
			};
			sub2 = function(selector){
				expect(selector).to.eql(model.selector);
				expect(selector).to.not.equal(model.selector);
			};
			sub3 = function(palette, index, newColor){
				expect(palette).to.eql(model.palette);
				expect(palette).to.not.equal(model.palette);
				expect(index).to.be.equal(0);
				expect(newColor).to.be.eql(newColor);
			};
			var newc = {color: "#cbacba", name: "123"};

			tokens = model.subscribe(sub1, sub2, sub3);

			model.setPaletteColors(model.palette.colors);
			model.setSelectorColors(model.selector.colors);
			model.changePaletteColor(0, newc);
		});
	});

	describe("unsubscribe", function(){
		it("should really unsubscribe", function(){
			var spy1 = sinon.spy(sub1);
			var spy2 = sinon.spy(sub2);
			var spy3 = sinon.spy(sub3);

			var result = model.unsubscribe(tokens);
			var newc = {color: "#cbacba", name: "123"};
			model.setPaletteColors(model.palette.colors);
			model.setSelectorColors(model.selector.colors);
			model.changePaletteColor(0, newc);

			expect(spy1.callCount).to.be.equal(0);
			expect(spy2.callCount).to.be.equal(0);
			expect(spy3.callCount).to.be.equal(0);
		});
	});
});
