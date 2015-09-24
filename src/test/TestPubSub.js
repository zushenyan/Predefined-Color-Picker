var pubsub = new pcp.PubSub();

var sub1 = pubsub.subscribe("foo", function(msg){
	console.log("sub1: " + msg);
});

var sub2 = pubsub.subscribe("foo", function(msg){
	console.log("sub2: " + msg);
});

var sub3 = pubsub.subscribe("bar", function(msg){
	console.log("sub3: " + msg);
});

var sub4 = pubsub.subscribe("lala", doSomething);
var sub5 = pubsub.subscribe("lala", doSomething);

console.log(pubsub.subscribers());
var removed = pubsub.unsubscribe("foo", sub2);
var removed = pubsub.unsubscribe("foo", sub1);
console.log(removed);

pubsub.publish("foo", "so meow meow");
pubsub.publish("bar", "much meow meow");
pubsub.publish("foobar", "no such meow meow");
pubsub.publish("lala", "meow!");

console.log(pubsub.availableTopics());
console.log(pubsub.hasTopic("meow"));
console.log(pubsub.hasTopic("foo"));
console.log(pubsub.hasTopic("bar"));
console.log(pubsub.subscribers());

function doSomething(msg){
	console.log("hehehehe: " + msg);
}
