var PCP = pcp.PCP; // namespace

var palette = [
	{color: PCP.COLOR_NONE, label: "A"},
	{color: "red", label: "B"},
	{color: "green", label: "C"},
	{color: "blue", label: "D"},
];

var pcp = new PCP().init("pcp1", palette, palette);

var t1 = pcp.addEventListener(function(e){
	console.log("I am event1");
	console.log(e);
}, "event1");

var t2 = pcp.addEventListener(function(e){
	console.log("I am event2");
	console.log(e);
}, "event2");

var t3 = pcp.addEventListener(function(e){
	console.log("I am event3");
	console.log(e);
}, "event3");

pcp.removeEventListener(t2);

var palette2 = [
	{color: PCP.COLOR_NONE, label: "Test"},
	{color: PCP.COLOR_NONE, label: "qq"},
	{color: PCP.COLOR_NONE, label: "123"},
	{color: PCP.COLOR_NONE, label: "11"}
];

var pcp2 = new PCP().init("pcp2", palette2, palette);
pcp2.addEventListener(function(e){
	console.log("I am event1 in pcp2");
	console.log(e);
}, "event1");

pcp.setPalette(palette);
