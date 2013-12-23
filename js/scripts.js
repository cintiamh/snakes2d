var SNAKES = {};

// Block
SNAKES.Block = function() {

}

// Grid
SNAKES.Grid = function() {

}

// apple
SNAKES.Apple = function() {

}

// Snake's body section
SNAKES.Body = function() {

}

// snake
SNAKES.Snake = function() {

}

// game
SNAKES.Game = function() {

}


// main function - animation loop
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

(function animloop(){
    requestAnimFrame(animloop);
//    render();
})();
