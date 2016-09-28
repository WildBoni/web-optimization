# Website Performance Optimization portfolio project

Your challenge, if you wish to accept it (and we sure hope you will), is to optimize this online portfolio for speed! In particular, optimize the critical rendering path and make this page render as quickly as possible by applying the techniques you've picked up in the [Critical Rendering Path course](https://www.udacity.com/course/ud884).

To get started, check out the repository and inspect the code.

## Getting started

##### Online version

You can see the online optimized version at [https://wildboni.github.io/dist/index.html](https://wildboni.github.io/dist/index.html).


##### Running locally

1. Clone the GitHub repository

  ```sh
  $> git clone https://github.com/WildBoni/wildboni.github.io.git
  ```

2. Install [Node.js](https://nodejs.org/)

3.  Open command line and
  ``` sh
  $> cd /path/to/your-project-folder
  $> npm install
  ```
###### Now gulp.js and all its dependencies are ready to run!

1. To play around with the source files in app folder, you can setup a web server and see live browser refresh changes by using
- ``` sh
  $> cd /path/to/your-project-folder
  $> gulp devtool
  ```
>  If you save changes to an .html, .css or .js file, the browser page will be automatically refreshed!
2. To apply changes and setup the dist version of the optimized website, simply
- ``` sh
  $> cd /path/to/your-project-folder
  $> gulp
  ```
>This will automatically run a few gulp tasks:
- Deleting the existing dist folder
- ``` sh
  $> gulp clean:dist
  ```
- Minifying .js and .css files
- ``` sh
  $> gulp compress-js
  $> gulp minify-css
  ```
- Optimizing images
- ``` sh
  $> gulp images
  $> gulp images2
  ```
- Copying html files
- ``` sh
  $> gulp html
  $> gulp html2
  ```
> Every command above will create files in a brand new dist folder
- Running a web server and opening browser window on dist/index.html
- ``` sh
  $> gulp distServer
  ```

### Optimize index.html

To get a faster page load a few changes have been made:

- Inline style.css
- Add media="print" to print.css link
- Async load javascript files
- Script webfont load
- Optimize larger images

### Optimize pizza.html and main.js

The "pizzapocalypse" has been soved using the following methods:

###### pizza.html
- Inline style.css

###### main.js
- Re-factor changePizzaSizes function according to "stop FSL" lesson: get rid of weird size calculations and move querySelector outside of for loop.
- ``` sh
  function changePizzaSizes(size) {
    switch(size) {
      case "1":
        newWidth = 25;
        break;
      case "2":
        newWidth = 33.3;
        break;
      case "3":
        newWidth = 50;
        break;
      default:
        console.log("bug in sizeSwitcher");
    }
    var randomPizzas = document.querySelectorAll(".randomPizzaContainer");
    for (var i = 0; i < randomPizzas.length; i++) {
      randomPizzas[i].style.width = newWidth + "%";
    }
  }
  ```
- Move randomPizzas assignment ouside of the for loop
- ``` sh
    var pizzasDiv = document.getElementById("randomPizzas");
    for (var i = 2; i < 100; i++) {
        pizzasDiv.appendChild(pizzaElementGenerator(i));
    }
  ```
- Add a scroll event listener that calls onScroll function
- ``` sh
    window.addEventListener('scroll', onScroll);
  ```
- onScroll function uses ticking variable to control requestAnimationFrame, that optimizes the updatePositions function, creating smooth background pizzas animation when page is scrolled
- ``` sh
    var ticking = false;
    function onScroll() {
	    requestTick();
    }
    function requestTick() {
        if(!ticking) {
            requestAnimationFrame(updatePositions);
            ticking = true;
        }
    }
  ```
- updatePositions runs faster thanks to prePhase variable, that avoids forced reflow by moving scrollTop outside of for loop
  ``` sh
    function updatePositions() {
        frame++;
        window.performance.mark("mark_start_frame");
	    ticking = false;
        var items = document.querySelectorAll('.mover');
        var prePhase = document.body.scrollTop / 1250;
        for(var i = 0; i < items.length; i++) {
            var phase = Math.sin(prePhase + (i % 5));
            items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
        }
        window.performance.mark("mark_end_frame");
        window.performance.measure("measure_frame_duration", "mark_start_frame", "mark_end_frame");
        if (frame % 10 === 0) {
            var timesToUpdatePosition = window.performance.getEntriesByName("measure_frame_duration");
        logAverageFrame(timesToUpdatePosition);
        }
    }
  ```
-  The number of background pizzas is now controlled through screen height: less pizzas means faster loading!
- ``` sh
    document.addEventListener('DOMContentLoaded', function() {
        var cols = 8;
        var s = 256;
        // set a reasonable number of rows based on screen height
        var rows = Math.round(window.screen.height / s);
        var flyingPizzaNum = cols * rows;
        // getElementById seems to be faster than querySelector
        var flyingPizza = document.getElementById("movingPizzas1");
        for (var i = 0; i < flyingPizzaNum; i++) {
            var elem = document.createElement('img');
            elem.className = 'mover';
            // use properly resized png
            elem.src = "images/pizza_background.png";
            elem.style.height = "100px";
            elem.style.width = "73.333px";
            elem.basicLeft = (i % cols) * s;
            elem.style.top = (Math.floor(i / cols) * s) + 'px';
            flyingPizza.appendChild(elem);
            // no need to call updatePositions() froom here
        }
    });
  ```
### Useful links and resources
* [Gulp for begnners](https://css-tricks.com/gulp-for-beginners/)
* [Web Font Loader](https://github.com/typekit/webfontloader)
* [QuerySelector vs getElements](http://stackoverflow.com/questions/14377590/queryselector-and-queryselectorall-vs-getelementsbyclassname-and-getelementbyid)
* [Browser Rendering Optimization](https://github.com/nghuuphuoc/Browser-Rendering-Optimization)
* [Optimizing JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript.html "javascript")
* [Faster animations with requestAnimationFrame](http://www.html5rocks.com/en/tutorials/speed/animations/#debouncing-scroll-events)
* [scroll event explained](https://developer.mozilla.org/en-US/docs/Web/Events/scroll)
* [Udacity website optimization course](https://www.udacity.com/course/website-performance-optimization--ud884)
