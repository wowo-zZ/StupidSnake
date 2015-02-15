var c = document.getElementById("a");
var cc = c.getContext("2d");
var paleWidth = c.width;
var paleHeight = c.height;

var food = {
    totalNum:50,
    concurrenctNum:1,
    energy:1,
    presetnFoodNum:0,
    foodsLocation:new Array(),
    createFood:function(){
        if(food.presetnFoodNum <= 0){
            for(i = 0; i < food.concurrenctNum; i++){
                food.foodsLocation[i] = [Math.floor(Math.random() * (paleWidth + 1)),Math.floor(Math.random() * (paleHeight + 1))];
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
                    newPart[1] += paleHeight;
                break;
            case 1:
                var newPart = [snake.body[snake.body.length-1][0],snake.body[snake.body.length-1][1]+11];
                if(newPart[1] > paleHeight)
                    newPart[1] -= paleHeight;
                break;
            case 2:
                var newPart = [snake.body[snake.body.length-1][0]-11,snake.body[snake.body.length-1][1]];
                if(newPart[0] < 0)
                    newPart[0] += paleWidth;
                break;
            case 3:
                var newPart = [snake.body[snake.body.length-1][0]+11,snake.body[snake.body.length-1][1]];
                if(newPart[0] > paleWidth)
                    newPart[0] -= paleWidth;
                break;
        }
        snake.body.push(newPart);
        snake.checkCrashSelf();
        snake.checkCrashFood(snake.body[snake.body.length-1]);
        cc.clearRect(3,3,paleWidth-10,paleHeight-10);
        if(snake.body.length > snake.length){
            snake.body = snake.body.splice(1,snake.length);
        }
        for(i =0 ;i < snake.body.length; i++){
            snake.paintCycle(snake.body[i],5.6, 3);
        }
        snake.paintCycle(food.foodsLocation,5.6, 3);
    },
    checkCrashSelf:function(){
        
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
        }else if(event.keyCode == 38 && snake.head != 1){
            snake.head = 0;
        }else if(event.keyCode == 39 && snake.head != 2){
            snake.head = 3;
        }else if(event.keyCode == 40 && snake.head != 0){
            snake.head = 1;
        }
    },
    
    //画个圆，蛇身体的一部分
    paintCycle: function(location, lineWidth, radius) {
        if(location[0] instanceof Array === true){
            for(i = 0; i < location.length; i++){
                snake.paintCycle(location[i], lineWidth, radius);
            }
            return ;
        }
        cc.beginPath();
        cc.fillStyle = "#FFFFFF";
        cc.lineWidth = lineWidth;
        cc.arc(location[0], location[1], radius, 0, Math.PI * 2, true);
        cc.stroke();    
        cc.closePath();
    }
}

$(window).load(function() {
    cc.beginPath();
    cc.fillStyle = "#FFFF00";
    cc.lineWidth = 4;
    cc.moveTo(0,0);
    cc.lineTo(paleWidth-3,0);
    cc.lineTo(paleWidth-3,paleHeight-3);
    cc.lineTo(0,paleHeight-3);
    cc.lineTo(0,0);
    cc.stroke();
    cc.closePath();
    var initX = Math.floor(Math.random() * (paleWidth + 1));
    var initY = Math.floor(Math.random() * (paleHeight + 1));
    var initLocation = [initX,initY];
    snake.body.push(initLocation);
    snake.paintCycle(initLocation, 5.6, 3);
    snake.moveTimer = setInterval(snake.move, 600);
    document.onkeydown = snake.changeHead;
})



