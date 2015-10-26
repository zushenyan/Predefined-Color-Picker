# Predefined-Color-Picker
PCP - Predefined Color Picker is an lightweight widget which is used to perform simple color picking job.

Works on all **the latest** desktop browsers and mobile devices.

This version is written in Flux and React, however, I didn't tight up Flux with React directly, instead, I separated View in Flux more further. By using Template in View as an adapter, UI is now switchable during runtime as long as it conforms Template's interface.

There is a version of PCP written in traditional MVC. Look [here](https://github.com/zushenyan/Predefined-Color-Picker/tree/master).

## Tools
* JS
  * Babel
  * React
    * Flux
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
* v0.2.1
  * Now it has a [sister version](https://github.com/zushenyan/Predefined-Color-Picker/tree/react-flux) made with React and Flux.
  * You can still write your own template.
  * In React-Flux version, there are some changes in writing template, check out [here](#template) for more details.
  * In React-Flux version, some features have been changed also.
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

var mypcp = new pcp.PCP({
  id: "mypcp",
  palette: palette,
  selector: selector
});
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

Messed up something in config? `pcp.DEFAULT_CONFIG` to the rescue!
```js
mypcp.set(pcp.DEFAULT_CONFIG);
```

Use `get` to get option value you want
```js
var id = mypcp.get("id");
var template = mypcp.get("template");
```

If you want to subscribe changes on color selection:
```js
onPaletteColorsSet = function(){...};
onSelectorColorsSet = function(){...};

mypcp.subscribe(onPaletteColorsSet, onSelectorColorsSet);
```

If no longer need to listen on changes:
```js
mypcp.unsubscribe(onPaletteColorsSet);
```

Don't like default template? Change it!
```js
mypcp.set({template: pcp.SimpleTemplate});
```
`SimpleTemplate` is an extremely simple template used for showing how to build a template.

Convert colors to serial or serials to colors
```js
ver serial = pcp.ColorUtil.colorsToSerial(mypcp.get("selector")); // "+ff0000+e3ff00+00baff+0021ff"
var colors = pcp.ColorUtil.serialToColors(serial); // ["", "#ff0000", "#e3ff00", "#00baff", "#0021ff"]
```

# <a name="template"></a>Build Your Own Template
You can write your own template as long as you conform `pcp.Template` interface.

If you are using ES6:
```js
class MyAwesomeTemplate extends pcp.Template {
  constructor(domId, actionCreator, store){
    super(domId, actionCreator, store);
    // Only variable declaration is allowed here.
    // Doing other things may lead to unexpected result.
    this.uiMyContainer = null;
    this.myVar = null;
    ...
  }

  // Override this!
  // It's called when id option in config is changed.
  // Construction begins here.
  mount(){
    this.uiMyContainer = document.createElement("div");
    ...
  }

  // Override this if necessary.
  // It's called when id option in config is changed.
  unmount(){
    ...
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

## How To Use Store
`Store` is introduced when you extend `Object` from `Template`.

`Store` exposes some getters to let outside world know `Store`'s state:
```js
this._store.getPaletteColors();   // returns palette colors.
this._store.getSelectorColors();  // returns selector colors.
this._store.getDomId();           // returns current dom parent id.
this._store.getTemplate();        // returns current template it uses.
```

## How To Use ActionCreator
This section teaches you how to use `ActionCreator` in PCP.

`ActionCreator` is introduced when you extend `Object` from `Template`.

To use `ActionCreator`, combining with `ActionConstants` is required:
```js
this._actionCreator[pcp.ActionConstants.SET_PALETTE_COLORS](palette);
```

`ActionConstants` provides some constants to let you decide what type of events or actions you want to listen on or execute.
```js
ActionConstants.SET_PALETTE_COLORS;
ActionConstants.SET_SELECTOR_COLORS;
ActionConstants.CHANGE_PALETTE_COLOR;
ActionConstants.SET_DOM_ID;
ActionConstants.SET_TEMPLATE;
```

All of above accept only one parameter, except for `ActionConstants.CHANGE_PALETTE_COLOR` which needs to pass in an `Object` with extra keys:
```js
this._actionCreator[pcp.ActionConstants.CHANGE_PALETTE_COLOR]({index: 5, newColor: {color: "#123123", name: "meow"}});
```

## Author & Licence
MIT, made by Andrew Yan
