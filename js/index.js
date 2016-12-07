var c = document.getElementById("content");
var cc = c.getContext("2d");
var global = {
    browserType: "PCBrowser",
    paleWidth: 486,
    paleHeight: 666,
    radius: 10,
    lineWidth: 5.6,
    step: 18,
    precise: 36
};
var food = {
    totalNum: 50,
    concurrentNum: 1,
    energy: 1,
    presentFoodNum: 0,
    foodsLocation: new Array(),
    //创建食物
    createFood: function () {
        if (food.presentFoodNum <= 0) {
            for (i = 0; i < food.concurrentNum; i++) {
                //不同的食物，添加不同的类型，有不同的效果
                food.foodsLocation[i] = [Math.floor((Math.random() * (global.paleWidth + 1)) / global.precise) * global.precise,
                    Math.floor((Math.random() * (global.paleHeight + 1)) / global.precise) * global.precise
                ];
                food.presentFoodNum++;
            }
        }
    }
};

var snake = {
    body: new Array(), //蛇身
    length: 1,
    head: 1, //前进方向：0-上，1-下，2-左，3-右
    speed: 5, //前进速度

    moveTimer: null,
    //重绘蛇身
    move: function () {
        food.createFood();
        switch (snake.head) {
            case 0:
                var newPart = [snake.body[snake.body.length - 1][0], snake.body[snake.body.length - 1][1] - global.step];
                if (newPart[1] < 0)
                    newPart[1] += global.paleHeight;
                break;
            case 1:
                var newPart = [snake.body[snake.body.length - 1][0], snake.body[snake.body.length - 1][1] + global.step];
                if (newPart[1] > global.paleHeight)
                    newPart[1] -= global.paleHeight;
                break;
            case 2:
                var newPart = [snake.body[snake.body.length - 1][0] - global.step, snake.body[snake.body.length - 1][1]];
                if (newPart[0] < 0)
                    newPart[0] += global.paleWidth;
                break;
            case 3:
                var newPart = [snake.body[snake.body.length - 1][0] + global.step, snake.body[snake.body.length - 1][1]];
                if (newPart[0] > global.paleWidth)
                    newPart[0] -= global.paleWidth;
                break;
        }
        snake.body.push(newPart);
        snake.checkCrashSelf();
        snake.checkCrashFood(snake.body[snake.body.length - 1]);
        cc.clearRect(3, 3, global.paleWidth - 10, global.paleHeight - 10);
        if (snake.body.length > snake.length) {
            snake.body = snake.body.splice(1, snake.length);
        }
        for (var i = 0; i < snake.body.length; i++) {
            if (i == snake.body.length - 1) {
                snake.paintCycle(snake.body[i], 3, 5);
            } else {
                snake.paintCycle(snake.body[i], 5.6, 3);
            }
        }
        snake.paintCycle(food.foodsLocation, 5.6, 3);
    },
    //检测撞自己
    checkCrashSelf: function () {
        var die = false;
        for (var i = 0; i < snake.body.length - 1; i++) {
            for (var j = i + 1; j < snake.body.length; j++) {
                if (snake.body[i][0] == snake.body[j][0] && snake.body[i][1] == snake.body[j][1]) {
                    die = true;
                }
            }
        }
        if (die) {
            snake.die();
        }
    },
    //检测碰到食物
    checkCrashFood: function (headLocation) {
        for (var i = 0; i < food.foodsLocation.length; i++) {
            var x = Math.abs(food.foodsLocation[i][0] - headLocation[0]);
            var y = Math.abs(food.foodsLocation[i][1] - headLocation[1]);
            if (x <= 10 && y <= 10) {
                snake.length++;
                food.foodsLocation.splice(i, 1);
                food.presentFoodNum--;
            }
        }
        //snake.length ++;
    },
    //更改方向
    changeHead: function () {
        if (event.keyCode == 37 && snake.head != 3) {
            snake.head = 2;
            snake.move();
        } else if (event.keyCode == 38 && snake.head != 1) {
            snake.head = 0;
            snake.move();
        } else if (event.keyCode == 39 && snake.head != 2) {
            snake.head = 3;
            snake.move();
        } else if (event.keyCode == 40 && snake.head != 0) {
            snake.head = 1;
            snake.move();
        }
    },

    //蛇挂了
    die: function () {
        alert("You die!");
        clearInterval(snake.moveTimer);
    },
    //画个圆，蛇身体的一部分
    paintCycle: function (location, lineWidth, radius) {
        if (location[0] instanceof Array === true) {
            for (i = 0; i < location.length; i++) {
                snake.paintCycle(location[i], lineWidth, global.radius);
            }
            return;
        }
        cc.beginPath();
        cc.arc(location[0], location[1], global.radius, 0, 360, false);
        cc.fillStyle = "blue";
        cc.fill();
        cc.closePath();
    }
};

$(window).load(function () {
    global.browserType = checkBrowser();
    c.width = global.paleWidth;
    c.height = global.paleHeight;
    if (global.browserType == "appBrowser") {
        c.width = 960;
        c.height = 1305;
        global.paleWidth = 960;
        global.paleHeight = 1305;
        global.radius = 18;
        global.lineWidth = 20;
        global.step = 22;
    }
    cc.beginPath();
    cc.fillStyle = "#FFFF00";
    cc.lineWidth = 4;
    cc.moveTo(0, 0);
    cc.lineTo(global.paleWidth - 3, 0);
    cc.lineTo(global.paleWidth - 3, global.paleHeight - 3);
    cc.lineTo(0, global.paleHeight - 3);
    cc.lineTo(0, 0);
    cc.stroke();
    cc.closePath();
    var initX = Math.floor((Math.random() * (global.paleWidth + 1)) / global.precise) * global.precise;
    var initY = Math.floor((Math.random() * (global.paleHeight + 1)) / global.precise) * global.precise;
    var initLocation = [initX, initY];
    alert(initLocation);
    snake.body.push(initLocation);
    //snake.paintCycle(initLocation, 3, 5);
    snake.moveTimer = setInterval(snake.move, 600);
    if (global.browserType == "PCBrowser") {
        document.onkeydown = snake.changeHead;
    } else if (global.browserType == "appBrowser") {
        isTouchDevice();
    }

});

//判断是否支持触摸事件
function isTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        bindEvent(); //绑定事件
    }
    catch (e) {
        alert("不支持TouchEvent事件！" + e.message);
    }
}
//绑定事件
function bindEvent() {
    document.addEventListener('touchstart', touchStartFunc, false);
    document.addEventListener('touchmove', touchMoveFunc, false);
    document.addEventListener('touchend', touchEndFunc, false);
}

//touchstart事件
function touchStartFunc(evt) {
    try {
        //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
        var touch = evt.touches[0]; //获取第一个触点
        var x = Number(touch.pageX); //页面触点X坐标
        var y = Number(touch.pageY); //页面触点Y坐标
        //记录触点初始位置
        startX = x;
        startY = y;
        var text = 'TouchStart事件触发：（' + x + ', ' + y + '）';
    }
    catch (e) {
        alert('touchStartFunc：' + e.message);
    }
}

//touchmove事件，这个事件无法获取坐标
function touchMoveFunc(evt) {
    try {
        //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
        var touch = evt.touches[0]; //获取第一个触点
        var x = Number(touch.pageX); //页面触点X坐标
        var y = Number(touch.pageY); //页面触点Y坐标

        var text = 'TouchMove事件触发：（' + x + ', ' + y + '）';
        text += 'TouchStart事件触发：（' + startX + ', ' + startY + '）';
        //判断滑动方向 前进方向：0-上，1-下，2-左，3-右
        if ((x - startX > 0 && y - startY > 0 ) || (x - startX > 0 && y - startY < 0 ) && (Math.abs(x - startX) >= Math.abs(y - startY)) && snake.head != 2) {
            snake.head = 3;
        } else if ((x - startX > 0 && y - startY < 0 ) || (x - startX < 0 && y - startY < 0 ) && (Math.abs(x - startX) <= Math.abs(y - startY)) && snake.head != 1) {
            snake.head = 0;
        } else if ((x - startX < 0 && y - startY < 0 ) || (x - startX < 0 && y - startY > 0 ) && (Math.abs(x - startX) >= Math.abs(y - startY)) && snake.head != 3) {
            snake.head = 2;
        } else if ((x - startX > 0 && y - startY > 0 ) || (x - startX < 0 && y - startY > 0 ) && (Math.abs(x - startX) <= Math.abs(y - startY)) && snake.head != 0) {
            snake.head = 1;
        }
    }
    catch (e) {
        alert('touchMoveFunc：' + e.message);
    }
}

//touchend事件
function touchEndFunc(evt) {
    try {
        //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
    }
    catch (e) {
        alert('touchEndFunc：' + e.message);
    }
}

