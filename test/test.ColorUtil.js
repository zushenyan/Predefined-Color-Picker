var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var ColorUtil = pcp.ColorUtil;

describe("ColorUtil", function(){
	var goodColors = [
		{color: "#ffffff"	, name: "meow"},
		{color: ""				, name: "test"},
		{color: "#aaaaaa" , name: ""},
		{color: "#bbbbbb"	, name: "qqqq"}
	];
	var badColors = [
		{color: "#ffffff"	, name: ""},
		{color: "#aaa"		, name: "test"},
		{color: "#bbbbbb"	, name: "wow"}
	];

	describe("isHexColors", function(){
		it("should work", function(){
			var colors = goodColors.map(function(obj){ return obj.color; });
			var result = ColorUtil.isHexColors(colors);
			expect(result).to.be.true;
		});
		it("should not work", function(){
			var colors = badColors.map(function(obj){ return obj.color; });
			var result = ColorUtil.isHexColors(badColors);
			expect(result).to.be.false;
		});
		it("shuold throw", function(){
			function run(){
				ColorUtil.isHexColors({});
			}
			expect(run).to.throw(Error);
		})
	});

	describe("serialToColors", function(){
		it("should work", function(){
			var serial = "ffffff++aaaaaa+bbbbbb";
			var result = ColorUtil.serialToColors(serial);
			expect(result[0]).to.be.equal("#ffffff");
			expect(result[1]).to.be.equal("");
			expect(result[2]).to.be.equal("#aaaaaa");
			expect(result[3]).to.be.equal("#bbbbbb");
		});
	});

	describe("colorsToSerial", function(){
		it("shuold work", function(){
			var result = ColorUtil.colorsToSerial(goodColors);
			expect(result).to.be.equal("ffffff++aaaaaa+bbbbbb");
		});
	});
});
