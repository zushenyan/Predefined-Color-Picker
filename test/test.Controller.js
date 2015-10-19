var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var Model = pcp.Model;
var Controller = pcp.Controller;
var Color = pcp.Color;

describe("Model", function(){
	var model = null;
	var controller = null;

	var palette = [
		{color: "#ff0000", name: "a"},
		{color: "#00ff00", name: "b"},
		{color: "#0000ff", name: "c"}
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
			controller = new Controller(model);
			expect(controller.model).to.equal(model);
		});
	});

	describe("exec", function(){
		it("should execute command correctly", function(){
			function callback1(p){
				expect(p.colors).to.eql(tp);
			}
			function callback2(s){
				expect(s.colors).to.eql(ts);
			}
			controller.exec("setPaletteColors", palette, callback1);
			controller.exec("setSelectorColors", selector, callback2);
		});
		it("should throw", function(){
			function run(){
				controller.exec("make me money");
			}
			expect(run).to.throw(Error);
		});
	});

	describe("query", function(){
		it("should query correctly", function(){
			var pc = controller.query("palette");
			var sc = controller.query("selector");
			expect(pc.colors).to.eql(tp);
			expect(sc.colors).to.eql(ts);
		});
	});
});
