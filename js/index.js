var c = document.getElementById("a");
var cc = c.getContext("2d");
var global = {
    browserType:"PCBrowser",
    paleWidth:500,
    paleHeight:680,
    radius:3,
    lineWidth:5.6,
}
var food = {
    totalNum:50,
    concurrenctNum:1,
    energy:1,
    presetnFoodNum:0,
    foodsLocation:new Array(),
    createFood:function(){
        if(food.presetnFoodNum <= 0){
            for(i = 0; i < food.concurrenctNum; i++){
                food.foodsLocation[i] = [Math.floor(Math.random() * (global.paleWidth + 1)),Math.floor(Math.random() * (global.paleHeight + 1))];
                food.presetnFoodNum ++;
            }
        }
    },
}
var snake = {
    body: new Array(), //蛇身
    length:1,
    head: 1, //前进方向：0-上，1-下，2-左，3-右
    speed: 5, //前进速度

    moveTimer: null,
    
    //重绘蛇身
    move: function(){
        food.createFood();
        switch(snake.head){
            case 0:
                var newPart = [snake.body[snake.body.length-1][0],snake.body[snake.body.length-1][1]-11];
                if(newPart[1] < 0)
                    newPart[1] += global.paleHeight;
                break;
            case 1:
                var newPart = [snake.body[snake.body.length-1][0],snake.body[snake.body.length-1][1]+11];
                if(newPart[1] > global.paleHeight)
                    newPart[1] -= global.paleHeight;
                break;
            case 2:
                var newPart = [snake.body[snake.body.length-1][0]-11,snake.body[snake.body.length-1][1]];
                if(newPart[0] < 0)
                    newPart[0] += global.paleWidth;
                break;
            case 3:
                var newPart = [snake.body[snake.body.length-1][0]+11,snake.body[snake.body.length-1][1]];
                if(newPart[0] > global.paleWidth)
                    newPart[0] -= global.paleWidth;
                break;
        }
        snake.body.push(newPart);
        snake.checkCrashSelf();
        snake.checkCrashFood(snake.body[snake.body.length-1]);
        cc.clearRect(3,3,global.paleWidth-10,global.paleHeight-10);
        if(snake.body.length > snake.length){
            snake.body = snake.body.splice(1,snake.length);
        }
        for(i =0 ;i < snake.body.length; i++){
            if(i == snake.body.length - 1){
                snake.paintCycle(snake.body[i],3, 5);
            }else {
                snake.paintCycle(snake.body[i],5.6, 3);
            }
        }
        snake.paintCycle(food.foodsLocation,5.6, 3);
    },
    checkCrashSelf:function(){
        var die = false;
        for(i = 0; i < snake.body.length - 1; i++){
            for(j = i + 1; j < snake.body.length; j++){
                if(snake.body[i][0] == snake.body[j][0] && snake.body[i][1] == snake.body[j][1]){
                    die = true;
                }
            }
        }
        if(die){
            snake.die();
        }
    },
    checkCrashFood:function(headLocation){
        for(i =0 ;i < food.foodsLocation.length; i++){
            var x = Math.abs(food.foodsLocation[i][0] - headLocation[0]);
            var y = Math.abs(food.foodsLocation[i][1] - headLocation[1]);
            if(x <= 5 && y <= 5){
                snake.length ++;
                food.foodsLocation.splice(i,1);
                food.presetnFoodNum --;
            }
        }
        //snake.length ++;
    },
    //更改方向
    changeHead:function(){
        if(event.keyCode == 37 && snake.head != 3){
            snake.head = 2;
            snake.move();
        }else if(event.keyCode == 38 && snake.head != 1){
            snake.head = 0;
            snake.move();
        }else if(event.keyCode == 39 && snake.head != 2){
            snake.head = 3;
            snake.move();
        }else if(event.keyCode == 40 && snake.head != 0){
            snake.head = 1;
            snake.move();
        }
    },
    //蛇挂了
    die:function(){
        alert("You die!");
        clearInterval(snake.moveTimer);
    },
    //画个圆，蛇身体的一部分
    paintCycle: function(location, lineWidth, radius) {
        if(location[0] instanceof Array === true){
            for(i = 0; i < location.length; i++){
                snake.paintCycle(location[i], lineWidth, global.radius);
            }
            return ;
        }
        cc.beginPath();
        cc.arc(location[0], location[1], global.radius, 0, 360, false);
        cc.fillStyle = "red";
        cc.lineWidth = lineWidth;
        cc.fill();    
        cc.closePath();
    }
}

$(window).load(function() {
    global.browserType = checkBrowser();
    if(global.browserType == "appBrowser"){
        c.width = 960;
        c.height = 1305;
        global.paleWidth = 960;
        global.paleHeight = 1305;
        global.radius = 10;
        global.lineWidth = 20;
    }
    cc.beginPath();
    cc.fillStyle = "#FFFF00";
    cc.lineWidth = 4;
    cc.moveTo(0,0);
    cc.lineTo(global.paleWidth-3,0);
    cc.lineTo(global.paleWidth-3,global.paleHeight-3);
    cc.lineTo(0,global.paleHeight-3);
    cc.lineTo(0,0);
    cc.stroke();
    cc.closePath();
    var initX = Math.floor(Math.random() * (global.paleWidth + 1));
    var initY = Math.floor(Math.random() * (global.paleHeight + 1));
    var initLocation = [initX,initY];
    snake.body.push(initLocation);
    snake.paintCycle(initLocation, 3, 5);
    snake.moveTimer = setInterval(snake.move, 600);
    if(global.browserType == "PCBrowser"){
        document.onkeydown = snake.changeHead;
    }else if(global.browserType == "appBrowser"){
        
    }
    
})



