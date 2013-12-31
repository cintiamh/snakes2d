var snakesModule = function() {
    var blocks_num = 25,
        block_size = 0,
        direction = [
            {x: -1, y: 0},
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 1}
        ],
        direction_index = 0,
        height = window.innerHeight,
        period = 600, // ms
        size = 0,
        snake = null,
        stage = null,
        width = window.innerWidth;

    // A Node is a segment of Snake's body
    function Node(x, y) {
        this.x = x;
        this.y = y;
        this.body = new Kinetic.Rect({
            x: this.x * block_size,
            y: this.y * block_size,
            width: block_size,
            height: block_size,
            fill: "#00FFFF",
            stroke: "#CCCCFF",
            strokeWidth: 1
        });
        this.next = null;
    }

    // Snake is a linked list, we have a reference to the head
    function Snake(x, y) {
        var snakeLayer = new Kinetic.Layer();
        // head
        this.head = new Node(x, y);
        snakeLayer.add(this.head.body);
        // body
        this.head.next = new Node(x + 1, y);
        snakeLayer.add(this.head.next.body);
        // tail
        this.head.next.next = new Node(x + 2, y);
        snakeLayer.add(this.head.next.next.body);
        stage.add(snakeLayer);
        var animation = animate(snakeLayer);
        animation.start();
    }

    Snake.prototype.move = function() {
        var node = this.head;
        while (node != null) {
            node.x = node.x + direction[direction_index].x;
            node.y = node.y + direction[direction_index].y;
            node.body.setX(node.x * block_size);
            node.body.setY(node.y * block_size);
            node = node.next;
        }
    }

    function getSmallestSide() {
        width = window.innerWidth;
        height = window.innerHeight;
        if (width > height) {
            size = height;
        }
        else {
            size = width;
        }
    }

    function createCanvas() {
        getSmallestSide();
        stage = new Kinetic.Stage({
            container: 'container',
            width: size,
            height: size
        });
        block_size = size / blocks_num;
    }

    function drawGridLine(x0, y0, x1, y1) {
        var line = new Kinetic.Line({
            points: [x0, y0, x1, y1],
            stroke: "#CCC",
            strokeWidth: 1
        });
        return line;
    }

    function drawGrid() {
        var gridLayer = new Kinetic.Layer();
        var group = new Kinetic.Group({
            x: 0,
            y: 0
        })
        for (var i = 0; i <= blocks_num; i++) {
            var lineHor = drawGridLine(0, i * block_size, size, i * block_size);
            var lineVer = drawGridLine(i * block_size, 0, i * block_size, size);
            group.add(lineHor);
            group.add(lineVer);
        }
        gridLayer.add(group);
        stage.add(gridLayer);
    }

    // Creates initial snake in the middle of grid
    function createSnake() {
        var middle = Math.floor(blocks_num / 2);
        snake = new Snake(middle, middle);
    }

    function animate(layer) {
        var start = 0;
        return new Kinetic.Animation(function(frame) {
            if (frame.time - start >= period) {
                start = frame.time;
                snake.move();
            }
        }, layer);
    }

    function handleStart() {
        console.log("Start");
    }

//    function addEventListeners() {
//        canvas.addEventListener("touchstart", handleStart, false);
//        canvas.addEventListener("click", handleStart, false);
//    }

    function init() {
        createCanvas();
        drawGrid();
        createSnake();

//        addEventListeners();
    }

    return {
        init: init
    };
}();

(function() {
    snakesModule.init();
})();
