var snakesModule = function() {
    var apple = null,
        blocks_num = 25,
        block_size = 0,
        count = 0,
        game_over = false,
        height = window.innerHeight,
        period = 500, // ms
        size = 0,
        snake = null,
        stage = null,
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
            y = Math.floor(Math.random() * blocks_num),
            isColliding = false;
        for (var i = 0; i < snake.length; i++) {
            if (snake.nodes[i].x == x && snake.nodes[i].y == y) {
                isColliding = true;
            }
        }
        if (isColliding) {
            this.move();
        }
        else {
            this.setPosition(x, y);
        }
    }

    // A Node is a segment of Snake's nodes
    function Node(x, y) {
        this.body = new Kinetic.Rect({
            x: this.x * block_size,
            y: this.y * block_size,
            width: block_size,
            height: block_size,
            fill: "#00FFFF",
            stroke: "#CCCCFF",
            strokeWidth: 1
        });
        this.x = x;
        this.y = y;

        this.setPosition(x, y);
    }

    Node.prototype.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
        this.body.setX(this.x * block_size);
        this.body.setY(this.y * block_size);
    }

    // Snake is a linked list, we have a reference to the head
    function Snake() {
        this.nodes = [];
        this.direction = "left";
        this.group = new Kinetic.Group();
        this.layer = new Kinetic.Layer();
        this.length = 0;

        this.layer.add(this.group);
        this.add(); // head
        this.add(); // tail
        this.move();
        this.add(); // nodes
        this.move();
        count = 0;

        stage.add(this.layer);
    }

    Snake.prototype.getHead = function() {
        return this.length > 0 ? this.nodes[0] : null;
    }

    Snake.prototype.add = function() {
        count++;
        if (period > 10) {
            period -= 5;
            console.log(period);
        }
        var head = this.getHead(),
            node = new Node(Math.floor(blocks_num / 2), Math.floor(blocks_num / 2));

        if (head != null) {
            node.setPosition(this.nodes[this.length - 1].x, this.nodes[this.length - 1].y);
        }
        this.group.add(node.body);
        this.nodes.push(node);
        this.length = this.nodes.length;
    }

    Snake.prototype.move = function() {
        if (this.length > 0) {
            var head = this.getHead(),
                tail = this.nodes.pop();

            if (head != null) {
                var x = head.x,
                    y = head.y;
                switch (this.direction) {
                    case "left":
                        x = (x - 1 + blocks_num) % blocks_num;
                        break;
                    case "right":
                        x = (x + 1) % blocks_num;
                        break;
                    case "up":
                        y = (y - 1 + blocks_num) % blocks_num;
                        break;
                    case "down":
                        y = (y + 1) % blocks_num;
                        break;
                }
                tail.setPosition(x, y);
                this.nodes.unshift(tail);
            }

            this.getApple();
            this.checkGameOver();
        }
    }

    Snake.prototype.isColliding = function(x, y) {
        var head = this.getHead();
        if (head.x == x && head.y == y) {
            return true;
        }
        return false;
    }

    Snake.prototype.checkGameOver = function() {
        if (!game_over) {
            for (var i = 1; i < this.length; i ++) {
                if (this.isColliding(this.nodes[i].x, this.nodes[i].y)) {
                    game_over = true;
                    overlay();
                    this.group.remove();
                    break;
                }
            }
        }
    }

    Snake.prototype.getApple = function() {
        if (this.length > 0 && apple) {
            if (this.isColliding(apple.x, apple.y)) {
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

        drawGrid();
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
        snake = new Snake();
        addEventListeners();
    }

    function createApple() {
        apple = new Apple();
        stage.add(apple.layer);
        apple.move();
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
        createSnake();
        createApple();
        addEventListeners();

        window.onkeydown = function(event) {
            switch (event.keyCode) {
                case 37:
                    snake.direction = snake.direction == 'right' ? 'right' : 'left';
                    break;
                case 38:
                    snake.direction = snake.direction == 'down' ? 'down' : 'up';
                    break;
                case 39:
                    snake.direction = snake.direction == 'left' ? 'left' : 'right';
                    break;
                case 40:
                    snake.direction = snake.direction == 'up' ? 'up' : 'down';
                    break;
            }
        }

        var start = 0;
        var anim = new Kinetic.Animation(function(frame) {
            if ((frame.time - start) >= period) {
                snake.move();
                start = frame.time;
            }
        }, snake.layer);

        anim.start();
    }

    return {
        init: init
    };
}();

(function() {
    snakesModule.init();
})();
