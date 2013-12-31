var snakesModule = function() {
    var apple = null,
        blocks_num = 25,
        block_size = 0,
        count = 0,
        direction = [
            {x: -1, y: 0},
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 1}
        ],
        direction_index = 0,
        height = window.innerHeight,
        period = 500, // ms
        size = 0,
        snake = null,
        stage = null,
        startTime = 0,
        width = window.innerWidth;

    function Apple() {
        var radius = block_size / 2;
        this.x = 0;
        this.y = 0;
        this.layer = new Kinetic.Layer();
        this.apple = new Kinetic.Circle({
            x: this.x * block_size + radius,
            y: this.y * block_size + radius,
            radius: radius,
            fill: "#FF0000"
        });
        this.layer.add(this.apple);
    }

    Apple.prototype.setPosition = function(x, y) {
        var radius = block_size / 2;
        this.x = x;
        this.y = y;
        this.apple.setX(this.x * block_size + radius);
        this.apple.setY(this.y * block_size + radius);
        this.layer.draw();
    }

    Apple.prototype.move = function() {
        var x = Math.floor(Math.random() * blocks_num),
            y = Math.floor(Math.random() * blocks_num);

        if (snake.isColliding(x, y, true)) {
            this.move();
        }
        else {
            this.setPosition(x, y);
        }
    }

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

    Node.prototype.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
        this.body.setX(this.x * block_size);
        this.body.setY(this.y * block_size);
    }

    // Snake is a linked list, we have a reference to the head
    function Snake(x, y) {
        this.layer = new Kinetic.Layer();
        this.group = new Kinetic.Group();
        this.layer.add(this.group);
        this.head = null;
        this.tail = null;
        this.x = x;
        this.y = y;

        this.add(); // head
        this.add(); // tail
        this.add(); // body

        stage.add(this.layer);
        var animation = animate(this.layer);
        animation.start();
    }

    Snake.prototype.add = function() {
        count++;
        var node = new Node(this.x, this.y);
        this.group.add(node.body);
//        this.layer.add(node.body);

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
        if (this.head != null && this.tail != null) {
            var node = this.tail;
            while (node != this.head) {
                node.setPosition(node.prev.x, node.prev.y);
                node = node.prev;
            }
            // got to head
            node.setPosition(
                (node.x + direction[direction_index].x + blocks_num) % blocks_num,
                (node.y + direction[direction_index].y + blocks_num) % blocks_num);

            if (this.checkGameOver()) {
                console.log("Game Over");
                console.log(count);
                this.group.remove();
                overlay();
//                location.reload(false);
            }
            this.getApple();
        }
    }

    Snake.prototype.isColliding = function(x, y, head) {
        var node = this.head;
        if (!head) {
            node = node.next;
        }
        while (node != null) {
            if (node.x == x && node.y == y) {
                return true;
            }
            node = node.next;
        }
        return false;
    }

    Snake.prototype.checkGameOver = function() {
        if (this.isColliding(this.head.x, this.head.y, false)) {
            return true;
        }
        return false;
    }

    Snake.prototype.getApple = function() {
        if (this.head != null && this.tail != null && apple) {
            if (this.head.x == apple.x && this.head.y == apple.y) {
                this.add();
                apple.move();
            }
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

    function createApple() {
        apple = new Apple();
        stage.add(apple.layer);
        apple.move();
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

    function reloadGame() {
        location.reload(false);
        overlay();
    }

    function addEventListeners() {
//        var canvas = document.getElementsByTagName('canvas')[0];
//        canvas.addEventListener("touchstart", handleStart, false);
//        canvas.addEventListener("click", handleStart, false);
        var reload_btn = document.getElementById('reload');
        reload_btn.addEventListener("touchstart", reloadGame, false);
        reload_btn.addEventListener("click", reloadGame, false);
    }

    function changeDirection(dir) {
        if (dir > 0) {
            direction_index = (direction_index + direction.length + 1) % direction.length;
        }
        else {
            direction_index = (direction_index + direction.length - 1) % direction.length;
        }
    }

    function overlay() {
        el = document.getElementById("overlay");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
        score_span = document.getElementById("score");
        score_span.innerHTML = count;
    }

    function init() {
        createCanvas();
        drawGrid();
        createSnake();
        createApple();
        addEventListeners();
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
