# Predefined-Color-Picker
PCP - Predefined Color Picker is an lightweight widget which is used to perform simple color picking job.

Visit [Guitar Scale Builder](https://github.com/zushenyan/Guitar-Scale-Builder) for PCP demonstration.

Works on all **the latest** desktop browsers and mobile devices.

## Tools
* JS
  * Babel
* CSS
  * Sass
* Task Runner
  * gulp
* Package Manager
  * npm
* Test
  * Mocha + Chai + Sinon
* CI
  * Travis-CI

## Change Log
* v0.2.0
  * Completely rewrite the structure. From a mess to MVC(or MV*) unicorn land.
  * Now be able to write your own **Template** for PCP, see [here](#template).
  * Not compatible with v0.1.3. Behaviors changed much.
  * Make palette options more visible.
* v0.1.3
  * United the formation of event object.
  * Supports ES6 feature - Symbol on all platforms. Thanks to babelify!
  * Make distinction between color-none and colored option more clear.
* v0.1.2
  * Notify event listener on `setPalette()` and `setSelector()`.
* v0.1.1
  * Rewrite the structure to make it more beautiful.
  * Change instantiation statement from `new pcp.PCP()` to `new pcp.PCP().init()`, read instruction below for details.
  * Rename `setPaletteColors()` to `setPalette()`.
  * Rename `setSelectorColors()` to `setSelector()`.
* v0.1.0
  * An new lovely widget was born, wha!

## Getting start
1. Copy `dist` directory to your project directory.
2. Include these files:
```html
<html>
  <head>
    <link rel="stylesheet" href="pcp/dist/css/Main.min.css">
  </head>
  <body>
    <script src="pcp/dist/js/Main.min.js"></script>
  </body>
</html>
 ```
## Usage
First assign an id named after whatever you want to an element
```html
<div id="mypcp"></div>
```
Then in your JavaScript, do the following
```js
var palette = [
  {color: "#121212" , name: "A"},   // @color - Should be string in hex formation.
  {color: "#abcabc" , name: "" },   // @name  - The name you want an option to display.
  {color: ""        , name: "C"}    // Assign "" if you want a "color none" option .
];

var selector = [...];
<<<<<<< HEAD

var mypcp = new pcp.PCP({
  id: "mypcp",
  palette: palette,
  selector: selector
});

=======

var mypcp = new pcp.PCP({
  id: "mypcp",
  palette: palette,
  selector: selector
});

>>>>>>> dev
mypcp.run();
```

Change current palette or selector:
```js
  var palette = [
    {name: "E"   , color: "#123321"},
    {name: "None", color: "#a1b2c3"},
    {name: ""    , color: ""}
  ];
  mypcp.set({palette: palette});
  // or
  mypcp.set({selector: palette});
```

If you don't want `set` run immediately, set second argument to false, and use `mypcp.run()` to start changing.
```
mypcp.set(config, false);
mypcp.run();
```

Messed up something in config? `pcp.DEFAULT_CONFIG` can save you from panic!
```js
mypcp.set(pcp.DEFAULT_CONFIG);
```

If you want to subscribe changes on color selection:
```js
onPaletteColorsSet = function(){...};
onSelectorColorsSet = function(){...};
onPaletteColorChanged = function(){...};

var tokens = mypcp.subscribe(onPaletteColorsSet, onSelectorColorsSet, onPaletteColorChanged); // will return an list of unique token used for  canceling subscription.
```
Keep tokens carefully, you will need them for canceling subscription.

If no longer need to listen on changes:
```js
mypcp.unsubscribe(tokens);
```

Don't like default template? Change it!
```js
mypcp.set({template: pcp.DummyTemplate});
```
`DummyTemplate` is an extremely simple template used for showing how to build a template.

# <a name="template"></a>Build Your Own Template
You can write your own template as long as you conform `pcp.Template` interface.

If you are using ES6:
```js
class MyAwesomeTemplate extends pcp.Template {
  constructor(domId, controller){
    super(domId, controller);
    // Only variable declaration is allowed here.
    // Doing other things may lead to unexpected result.
    this.uiMyContainer = null;
    this.myVar = null;
    ...
  }

  // Override this!
  // It's called when id option in config is changed.
  // Construction begins here.
  start(){
    this.uiMyContainer = document.createElement("div");
    ...
  }

  // Override this if necessary.
  // It's called when id option in config is changed.
  clear(){
    ...
  }

  // Override these 3 functions!
  // It's called when palette option in config is changed.
  onPaletteColorsSet(palette){
    // do stuff
  }

  // It's called when selector option in config is changed.
  onSelectorColorsSet(selector){
    // do stuff
  }

  // It's called when this.controller.exec("changePaletteColor", index, newColor) is called.
  onPaletteColorChanged(palette, index, newColor){
    // do stuff
  }
}
```

When you've done writing, do these to load your template.
```html
...
<script src="pcp/dist/js/Main.min.js"></script>
<script src="MyAwesomeTemplate.js"></script>
<script>
  // do
  mypcp.set({
    template: MyAwesomeTemplate // Good!
  });

  // don't
  mypcp.set({
    template: new MyAwesomeTemplate() // You are doing it wrong!
  });
</script>
...
```

## How To Use Controller
This section teaches you how to use controller in PCP.

Controller is introduced when you extend Object from Template.
```js
class MyTemplate extends pcp.Template {
  ...
  doStuff(){
    this.controller.exec("changePaletteColor", 0, newColor);
  }
  ...
}
```

Controller in PCP lets you to manipulate stuffs in Model. It prevents users from operating model directly for the sake of hiding complex details.
```js
// exec used for manipulation something.
controller.exec("setPaletteColors", colors);

// query, as you expected, only lets you look up thins.
controller.query("palette");
```

Controller provides some commands for `exec`
```js
var colors = [
  {color: "#000000", name: ""},
  {color: "#111111", name: "A"},
  {color: "#222222", name: "B"},
];
var index = 0;
var newColor = {color: "#112233", name: "foo"};

// for setting palette colors like you do `pcp.set({palette: colors})` to config
controller.exec("setPaletteColors", colors);

// for setting selector colors like you do `pcp.set({selector: colors})` to config
controller.exec("setSelectorColors", colors);

// for changing palette color, throw error when index is out of bound or newColor's formation is not valid.
controller.exec("changePaletteColor", index, newColor);

// for subscription and canceling.
var tokens = controller.exec("subscribe", onPaletteColorsSet, onSelectorColorsSet, onPaletteColorChanged);
controller.exec("unsubscribe", tokens);
```

Controller also provides some commands for `query` for users to check out what information they need
```js
// Returns a copy of palette object.
// Palette object contains
// {Array} colors - An array of Color objects. Use colors[0].color or colors[0].name to access properties you want.
controller.query("palette");

// Same to above.
controller.query("selector");
```

## Author & Licence
MIT, made by Andrew Yan
