var sinon = require("sinon");
var expect = require("chai").expect;
var pcp = require("../dist/js/Main");
var Store = pcp.Store;
var ActionCreator = pcp.ActionCreator;
var Dispatcher = pcp.Dispatcher;
var ActionConstants = pcp.ActionConstants;

describe("Flux", function(){
	var dispatcher,
			store,
			actionCreator;

	describe("construction", function(){
		it("should construct properly", function(){
			dispatcher = new Dispatcher();
			store = new Store(dispatcher);
			actionCreator = new ActionCreator(dispatcher);
		});
	});

	describe("event flow", function(){
		var palette = [
			{color: "#ffffff", name: "T"},
			{color: "#eeeeee", name: "E"},
			{color: "#dddddd", name: "S"},
			{color: "#cccccc", name: "T"},
		];
		var selector = [
			{color: "#aaa111", name: "t"},
			{color: "#bbb222", name: "e"},
			{color: "#ccc333", name: "s"},
			{color: "#ddd444", name: "t"},
		];
		it("should set palette colors correctly", function(){
			var callback = function(){
				var pColors = store.getPaletteColors();
				expect(pColors).to.be.eql(pcp.Color.transform(palette));
			};

			store.addListener(ActionConstants.SET_PALETTE_COLORS, callback);
			actionCreator[ActionConstants.SET_PALETTE_COLORS](palette);
			store.removeListener(ActionConstants.SET_PALETTE_COLORS, callback);
		});

		it("should set selector colors correctly", function(){
			var callback = function(){
				var pColors = store.getSelectorColors();
				expect(pColors).to.be.eql(pcp.Color.transform(selector));
			};

			store.addListener(ActionConstants.SET_SELECTOR_COLORS, callback);
			actionCreator[ActionConstants.SET_SELECTOR_COLORS](selector);
			store.removeListener(ActionConstants.SET_SELECTOR_COLORS, callback);
		});

		it("should change palette color correctly", function(){
			var newColor = {color: "#fedcba", name: "this is a cat"};
			palette[0] = newColor;

			var callback = function(){
				var colors = store.getPaletteColors();
				expect(colors).to.be.eql(pcp.Color.transform(palette));
			};

			store.addListener(ActionConstants.CHANGE_PALETTE_COLOR, callback);
			actionCreator[ActionConstants.CHANGE_PALETTE_COLOR]({index: 0, newColor: newColor});
			store.removeListener(ActionConstants.CHANGE_PALETTE_COLOR, callback);
		});

		it("should change dom id", function(){
			var newId = "foobar";

			var callback = function(){
				expect(store.getDomId()).to.be.eql(newId);
			};

			store.addListener(ActionConstants.SET_DOM_ID, callback);
			actionCreator[ActionConstants.SET_DOM_ID](newId);
			store.removeListener(ActionConstants.SET_DOM_ID, callback);
		});

		it("should change template", function(){
			var template = "tempo-late";

			var callback = function(){
				expect(store.getTemplate()).to.be.eql(template);
			};

			store.addListener(ActionConstants.SET_TEMPLATE, callback);
			actionCreator[ActionConstants.SET_TEMPLATE](template);
			store.removeListener(ActionConstants.SET_TEMPLATE, callback);
		});

		it("should remove listener properly", function(){
			var callback = function(){};

			store.addListener(ActionConstants.SET_TEMPLATE, callback.bind(this));
			store.removeListener(ActionConstants.SET_TEMPLATE, callback);
			expect(store.listeners()).to.be.length(0);
		});
	});
});
