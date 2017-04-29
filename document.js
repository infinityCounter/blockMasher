$(document).ready(function(){

    var gameOver = false;
    const blockWidth = 70, blockHeight = 40;

    function randomColor(){
        var colorCode = "#";
        while(true){
            var randNum = Math.floor(Math.random() * 16);
            colorCode +=  randNum.toString(16);
            if(colorCode.length >= 7)
                break;
        }
        return colorCode;
    }


    function generateBlocks(numOfBlocks, context){

        var posFromTop = posFromLeft = 20;
        var blockConfigArray = [];
        for(var counter = 0; counter < numOfBlocks; counter++ ){
            context.beginPath();
            context.rect(posFromLeft, posFromTop, blockWidth, blockHeight);
            color = randomColor();
            context.fillStyle = color;
            context.fill();
            context.closePath();

            let blockConfig = {
                "pos" : [posFromLeft, posFromTop],
                "color" : color,
                "isDestroyed" : false,
            };

            blockConfigArray.push(blockConfig);

            posFromLeft += 90;
            if(posFromLeft > 420){
                posFromLeft = 20;
                posFromTop += 60;
            }
        }
        return blockConfigArray;
    }

    function generateBar(context, canvasWidth, canvasHeight){

        const barWidth = 90;
        const barHeight = 20;
        const posFromTop = canvasHeight - 40;
        var posFromLeft = (canvasWidth - barWidth)/2;
        const color = randomColor();
        context.beginPath();
        context.rect(posFromLeft, posFromTop, barWidth, barHeight);
        context.fillStyle = color;
        context.fill();
        context.closePath();

        return function(lor){
            context.beginPath();
            if(lor === 0){
                posFromLeft -= 10;
                if(posFromLeft < 0) {
                    posFromLeft = 0;
                }
            }else{
                posFromLeft += 10;
                if(posFromLeft >= canvasWidth - barWidth) {
                    posFromLeft = canvasWidth - barWidth;
                }

            }
            context.rect(posFromLeft, posFromTop, barWidth, barHeight);
            context.fillStyle = color;
            context.fill();
            context.closePath();
        }
    }

    function redrawCanvas(blockConfigArr, context){

        blockConfigArr.forEach(function(blockConfig) {
            context.beginPath();
            context.rect(blockConfig.pos[0], blockConfig.pos[1], blockWidth, blockHeight);
            context.fillStyle = blockConfig.color;
            context.fill();
            context.closePath();
        }, this);
    }
    
    function main(){

        const canvas = $("#gameArea")[0];
        var canvasContext = canvas.getContext('2d');
        var blockConfigs = generateBlocks(10, canvasContext);
        const bar = generateBar(canvasContext, canvas.width, canvas.height);

        $(document).keydown(function(e){
            e.preventDefault();
            console.log("keydown");
            console.log(e);
            console.log(canvas.height);
            console.log(canvas.width);
            if(e.keyCode == 37){
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                redrawCanvas(blockConfigs, canvasContext);
                bar(0);
            }else if(e.keyCode == 39){
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                redrawCanvas(blockConfigs, canvasContext);
                bar(1);
            }
        });

    }

    main();
});