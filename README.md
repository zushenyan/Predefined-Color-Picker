# Predefined-Color-Picker
PCP - Predefined Color Picker is an lightweight widget which is used to perform simple color picking job.

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
  {color: "#121212"     , name: "A"},   // @color - should be a string in RGB format or default color name.
  {color: "red"         , name: "" },   // @name  - the label on the option.
  {color: PCP.COLOR_NONE, name: "C"}    // assign PCP.COLOR_NONE if you want no color option.
];

var selector = [...]; // same as paletteColors

var pcp = new pcp.PCP().init("my-pcp", palette, selector);
```
After you have `new` the PCP object, the dom elements will be automatically created.

If you want to subscribe changes on color selection:
```JavaScript
var event1 = pcp.addEventListener(function(event){...}); // this function will return a unique token which is used for removing event from listening.
```

event is an object containing following:
```JavaScript
event.index;    // {number} the index of selected palette color.
event.color;    // {string} selected color from selector.
event.colorSet; // {array} current colors and names set from the palette.
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
