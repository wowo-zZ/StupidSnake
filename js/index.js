var c = document.getElementById("a");
var cc = c.getContext("2d");
var paleWidth = 500;
var paleHeight = 375;


var snake = {
    body: new Array(), //蛇身
    length:4,
    head: 1, //前进方向：0-上，1-下，2-左，3-右
    speed: 5, //前进速度

    moveTimer: null,
    
    //重绘蛇身
    repaint: function(){
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
        cc.clearRect(0,0,paleWidth,paleHeight);
        snake.body.push(newPart);
        //alert(snake.body);
        if(snake.body.length > snake.length){
            snake.body = snake.body.splice(1,snake.length);
        }
        //alert(snake.body);
        for(i =0 ;i < snake.body.length; i++){
            snake.paintCycle(snake.body[i],5.6, 3);
        }
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
        cc.beginPath();
        cc.fillStyle = "#FFFFFF";
        cc.lineWidth = lineWidth;
        cc.arc(location[0], location[1], radius, 0, Math.PI * 2, true);
        cc.stroke();    
        cc.closePath();
    }
}

$(window).load(function() {
    var initX = Math.floor(Math.random() * (paleWidth + 1));
    var initY = Math.floor(Math.random() * (paleHeight + 1));
    var initLocation = [initX,initY];
    snake.body.push(initLocation);
    snake.paintCycle(initLocation, 5.6, 3);
    snake.moveTimer = setInterval(snake.repaint, 600);
    document.onkeydown = snake.changeHead;
})



