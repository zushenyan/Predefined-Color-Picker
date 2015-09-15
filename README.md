# Predefined-Color-Picker
PCP - Predefined Color Picker is an lightweight widget which is used to perform simple color picking job.

## Getting start
1. Copy files from `js/pcp.min.js` and `css/pcp.css` to your project directory.
2. Include these files:
```html
<html>
  <head>
    ...
    <link rel="stylesheet" href="pcp.css"> 
    <script src="pcp.min.js"></script>
    ...
  </head>
  ...
</html>
 ```
## Usage
First assian an id named after whatever you want to an element
```html
<div id="my-pcp"></div>
```
Then in your JavaScript, do the following
```JavaScript
var paletteColors = [
  {color: "#121212"     , name: "A"},   // @color - should be a string in RGB format or default color name.
  {color: "red"         , name: "" },   // @name  - the label on the option.
  {color: PCP.COLOR_NONE, name: "C"}    // assign PCP.COLOR_NONE if you want no color option.
];

var selectorColors = [...]; // same as paletteColors

var pcp = new PCP("my-pcp", paletteColors, selectorColors);
```
After you have `new` the PCP object, the dom elements will be automatically created.

If you want to subscribe changes on color selection:
```JavaScript
pcp.addEventListener(function(event){...}, listenerName); // event returns {index, color}
```
event will return `index` number which corresponds to the upper part colors(palette) and color in string.

And do the following if no longer need to listen on change:
```JavaScript
pcp.removeEventListener(listenerName);
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
