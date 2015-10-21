var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var Palette = pcp.Palette;
var Color = pcp.Color;

describe("Palette", function(){
	var palette = null;
	var list = [
		{color: "#000000", name: "ggyy"},
		{color: "#222222", name: ""},
		{color: ""			 , name: "test"},
		{color: "#333333", name: "meow"},
		{color: "#555555", name: "qqq"},
		{color: "#ffffff", name: " "}
	];

	describe("constructor", function(){
		it("should constrcut properly", function(){
			palette = new Palette();
			expect(palette.colors).to.be.empty;
		});
	});

	describe("assign colors", function(){
		it("should set pattle correctly", function(){
			palette.colors = list;
			expect(palette.colors).to.eql(Color.transform(list));
		});
	});

	describe("changeColor", function(){
		it("should change target element", function(){
			var index = 2;
			var color = new Color("#ababab");
			palette.colors = list;
			palette.changeColor(index, color);
			expect(palette.colors[index]).to.equal(color);

			index = 0;
			color = new Color("#cccccc", "foobar");
			var rawColor = {color: "#cccccc", name: "foobar"};
			palette.colors = list;
			palette.changeColor(index, rawColor);
			expect(palette.colors[index]).to.eql(color);
		});
		it("should throw when out of bound", function(){
			var index = 10;
			var color = new Color("#ababab");
			function run(){
				palette.changeColor(index, color);
			}
			expect(run).to.throw(Error);
		});
		it("should throw when passing invalid hex color code", function(){
			function run(){
				var index = 2;
				var color = new Color("#ab");
				palette.changeColor(index, color);
			}
			expect(run).to.throw(Error);
		});
	});
});
