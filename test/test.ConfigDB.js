var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var Config = pcp.ConfigDB;

describe("ConfigDB", function(){
	var config = null;

	describe("constructor", function(){
		it("should construct properly", function(){
			config = new Config();
			expect(config.values).to.be.empty;
			expect(config.actions).to.be.empty;
		});
	});

	describe("append", function(){
		it("should work", function(){
			function func1(){
				return "foo is 5";
			}

			function func2(){
				return "color is red";
			}

			config.append("foo", 5, func1);
			config.append("test", "ggyy");
			config.append("color", {name: "red"}, func2);
			expect(config.values).to.have.all.keys(["foo", "test", "color"]);
			expect(config.actions).to.have.all.keys(["foo", "test","color"]);
			expect(config.actions["foo"]).to.equal(func1);
			expect(config.actions["color"]).to.equal(func2);
		});
	});

	describe("query", function(){
		it("should work", function(){
			expect(config.query("foo")).to.equal(5);
			expect(config.query("test")).to.equal("ggyy");
			expect(config.query("color")).to.eql({name: "red"});
		});
	});

	describe("exec", function(){
		it("should work", function(){
			expect(config.exec("foo")).to.equal("foo is 5");
			expect(config.exec("test")).to.be.null;
			expect(config.exec("color")).to.equal("color is red");
		});
	});

	describe("update", function(){
		it("should work", function(){
			function func2(){
				return "test is cool";
			}

			expect(config.update("test", "cool", func2)).to.be.true;
			expect(config.query("test")).to.equal("cool");
			expect(config.exec("test")).to.equal("test is cool");

			expect(config.update("foo", "fine")).to.be.true;
			expect(config.query("foo")).to.equal("fine");
			expect(config.exec("foo")).to.equal("foo is 5");
		});
	});
});
