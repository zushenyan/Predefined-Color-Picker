var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var ColorUtil = pcp.ColorUtil;

describe("ColorUtil", function(){
	var goodColors = ["#ffffff", "#aaaaaa", "#bbbbbb"];
	var badColors = ["#ffffff", "#aaa", "#bbbbbb"];

	describe("isHexColors", function(){
		it("should work", function(){
			var result = ColorUtil.isHexColors(goodColors);
			expect(result).to.be.true;
		});
		it("should not work", function(){
			var result = ColorUtil.isHexColors(badColors);
			expect(result).to.be.false;
		});
	});

	describe("serialToColors", function(){
		it("should work", function(){
			var serial = "ffffff+aaaaaa+bbbbbb";
			var result = ColorUtil.serialToColors(serial);
			expect(result[0]).to.be.equal("#ffffff");
			expect(result[1]).to.be.equal("#aaaaaa");
			expect(result[2]).to.be.equal("#bbbbbb");
		});
	});

	describe("colorsToSerial", function(){
		it("shuold work", function(){
			var result = ColorUtil.colorsToSerial(goodColors);
			expect(result).to.be.equal("ffffff+aaaaaa+bbbbbb");
		});
	});
});
