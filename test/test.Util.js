var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var Util = pcp.Util;
var Palette = pcp.Palette;

describe("Util", function(){
	var source, target;
	describe("deepClone", function(){
		it("should clone properly", function(){
			source = {
				counter: 0,
				get next(){ return ++this.counter; }
			};
			target = Util.deepClone(source);
			expect(target).to.not.equal(source);
		});
		it("should clone getter/setter", function(){
			expect(target.hasOwnProperty("next")).to.be.true;
			target.next;
			expect(target.counter).to.be.equal(1);
			expect(source.counter).to.be.equal(0);
		});
		it("should work on custom objects", function(){
			var c = [
				{color: "#111111", name: "test1"},
				{color: "#222222", name: "test2"},
				{color: "#333333", name: "test3"}
			];

			source = new Palette(c);
			target = Util.deepClone(source);

			target.colors[0].name = "weee";

			expect(source.colors[0].name).to.equal(c[0].name);
			expect(target.colors[0].name).to.equal("weee");
		});
		it("should work with object literal", function(){
			var obj1 = {
				a: 1,
				get b(){ return "i am b in MyObj"; },
				c: {
					a: "I am a in MyObj.c",
					b: {
						a: [
							{num: 1},
							{num: 2}
						],
						b: new String("I am b(String Object) in MyObj.c.b")
					},
					set c(val){ a = val; }
				},
				d: [1,2,3,4]
			};
			var obj2 = Util.deepClone(obj1);
			expect(obj1).to.eql(obj2);
			expect(obj1).to.not.equal(obj2);
		});
		it("should work with symbol right?", function(){
			var a = {
				symbol: Symbol()
			};
			var b = Util.deepClone(a);
			expect(a.symbol).to.equal(b.symbol);
		});
	});
});
