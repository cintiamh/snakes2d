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
        this.prev = null;
    }

    // Snake is a linked list, we have a reference to the head
    function Snake(x, y) {
        this.snakeLayer = new Kinetic.Layer();
        this.head = null;
        this.tail = null;
        this.x = x;
        this.y = y;

        this.add(); // head
        this.add(); // tail
        this.add(); // body

        stage.add(this.snakeLayer);
        var animation = animate(this.snakeLayer);
        animation.start();
    }

    Snake.prototype.add = function() {
        var node = new Node(this.x, this.y);
        this.snakeLayer.add(node.body);

        if (this.head == null) {
            this.head = node;
            this.tail = this.head;
        }
        else {
            node.prev = this.tail;
            this.tail.next = node;
            this.tail = node;
            this.move();
        }
    }

    Snake.prototype.move = function() {
        var node = null,
            positions = [];

        node = this.head;

        while (node.next != null) {
            positions.push({x: node.x, y: node.y});
            node = node.next;
        }

        node = this.head;
        node.x = (node.x + direction[direction_index].x + blocks_num) % blocks_num;
        node.y = (node.y + direction[direction_index].y + blocks_num) % blocks_num;
        node.body.setX(node.x * block_size);
        node.body.setY(node.y * block_size);

        for (var i = 0; i < positions.length; i++) {
            node = node.next;
            node.x = positions[i].x;
            node.y = positions[i].y;
            node.body.setX(node.x * block_size);
            node.body.setY(node.y * block_size);
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
        addEventListeners();
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

    function addEventListeners() {
        var canvas = document.getElementsByTagName('canvas')[0];
        canvas.addEventListener("touchstart", handleStart, false);
        canvas.addEventListener("click", handleStart, false);
    }

    function changeDirection(dir) {
        if (dir > 0) {
            direction_index = (direction_index + direction.length + 1) % direction.length;
        }
        else {
            direction_index = (direction_index + direction.length - 1) % direction.length;
        }
    }

    function init() {
        createCanvas();
        drawGrid();
        createSnake();
    }

    return {
        init: init,
        changeDirection: changeDirection
    };
}();

(function() {
    snakesModule.init();

    window.onkeydown = function(event) {
        switch (event.keyCode) {
            case 37:
                snakesModule.changeDirection(-1);
                break;
            case 39:
                snakesModule.changeDirection(1);
                break;
        }
    }
})();
