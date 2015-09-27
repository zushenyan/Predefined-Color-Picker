# Predefined-Color-Picker
PCP - Predefined Color Picker is an lightweight widget which is used to perform simple color picking job.

## Change Log
* v0.1.3
  * United the formation of event object.
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
1. Copy files from `dist/predefined-color-picker-x.x.x` directory to your project directory.
2. Include these files:
```html
<html>
  <head>
    <link rel="stylesheet" href="css/pcp.css">
  </head>
  <body>
    <script src="js/pcp.min.js"></script>
  </body>
</html>
 ```
## Usage
First assian an id named after whatever you want to an element
```html
<div id="my-pcp"></div>
```
Then in your JavaScript, do the following
```JavaScript
var palette = [
  {color: "#121212"     , label: "A"},   // @color - should be a string in RGB format or default color name.
  {color: "red"         , label: "" },   // @name  - the label on the option.
  {color: PCP.COLOR_NONE, label: "C"}    // assign PCP.COLOR_NONE if you want no color option.
];

var selector = [...]; // same as paletteColors

var pcp = new pcp.PCP().init("my-pcp", palette, selector);
```
After you have `new` the PCP object, the dom elements will be automatically created.

Change current palette or selector:
```JavaScript
  var palette = [
    {label: "E"   , color:"yellow"},
    {label: "None", color:"green"},
    {label: ""    , color:PCP.COLOR_NONE}
  ];
  pcp.setPalette(palette);
  pcp.setSelector(palette);
```

If you want to subscribe changes on color selection:
```JavaScript
var event1 = pcp.addEventListener(function(event){...}); // this function will return a unique token which is used for removing event from listening.
```

event is an object containing following:
```JavaScript
// on setPalette is called
event.type;     // {string} "setPalette"
event.colorSet; // {array} current colors and labels set from the palette.

// on setSelector is called
event.type;     // {string} "setSelector"
event.colorSet; // {array} current colors and labels set from the selector.

// on palette color is being selected
event.type;     // {string} "selection".
event.index;    // {number} the index of selected palette color.
event.color;    // {string} selected color from selector.
event.colorSet; // {array} current colors and labels set from the palette.
event.target;   // {htmlelement} dom element that was being selected.
```

Do this if no longer need to listen on change:
```JavaScript
pcp.removeEventListener(event1);
```

## Tools
* Package manager
  * gulp
  * npm
* Transpiler/Pre-processor
  * babel
  * sass

## Author & Licence
MIT, made by Andrew Yan
