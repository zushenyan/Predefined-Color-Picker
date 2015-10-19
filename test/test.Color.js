var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var Color = pcp.Color;

describe("Color", function(){
	var color = null;

	describe("constructor", function(){
		it("should construct properly", function(){
			color = new Color();
			expect(color.color).to.be.empty;
			expect(color.name).to.be.empty;
		});
	});

	describe("assign color", function(){
		it("should work", function(){
			var c = "#555555";
			color.color = c;
			expect(color.color).to.equal(c);
		});
		it("should throw", function(){
			function run(){
				var c = "#qwe";
				color.color = c;
			}
			expect(run).to.throw(Error);
		});
	});

	describe("transform", function(){
		it("should transform single object correctly", function(){
			var c = {
				color: "#aaaaaa",
				name: "foo"
			};
			var result = Color.transform(c);
			expect(result).to.be.instanceof(Color);
			expect(result.color).to.equal(c.color);
			expect(result.name).to.equal(c.name);
		});
		it("should transform array of objects correctly", function(){
			var c = [
				{ color: "#aaaaaa", name: "foo" },
				{ color: "#123123", name: "" },
				{ color: "", name: "1" }
			];
			var result = Color.transform(c);
			expect(result[0].color).to.eql(c[0].color);
			expect(result[0].name).to.eql(c[0].name);
			expect(result[1].color).to.eql(c[1].color);
			expect(result[1].name).to.eql(c[1].name);
			expect(result[2].color).to.eql(c[2].color);
			expect(result[2].name).to.eql(c[2].name);
			expect(result).to.have.length(3);
		});
		it("shuold throw", function(){
			function run(){
				Color.transform("abc");
			}
			expect(run).to.throw(Error);
		});
		it("shuold not transform Color", function(){
			var c = [
				new Color("#aabbcc", "test"),
				new Color("#ffffff", "ppp"),
				{ color: "#dddddd", name: "meow"}
			];
			var c2 = new Color("#eeddff", "trueColor");
			var result1 = Color.transform(c);
			var result2 = Color.transform(c2);
			expect(result1[0]).to.eql(c[0]);
			expect(result1[1]).to.eql(c[1]);
			expect(result1[2]).to.eql(Color.transform(c[2]));
			expect(result2).to.eql(c2);
		});
	});
});
