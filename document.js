//When document loaded
$(document).ready(function(){

    var gameOver = false; //Of no use yet
    const blockWidth = 70, blockHeight = 40; 

    /**
     * Generate Random html color code
     * 
     * */
    function randomColor(){
        var colorCode = "#";
        while(true){
            //Generate random number between 0 and 15
            var randNum = Math.floor(Math.random() * 16);
            //Convert to hexadecimal char, 0 - F and append to colorCode string
            colorCode +=  randNum.toString(16);
            if(colorCode.length >= 7)
                break;
        }
        return colorCode;
    }


    /**
     * Generate blocks 
     * 
     * int numOfBlocks
     * 2dContext context
     */
    function generateBlocks(numOfBlocks, context){

        //Start at the top left
        var posFromTop = posFromLeft = 20;
        //Array to hold position of blocks for redrawing
        var blockConfigArray = [];
        for(var counter = 0; counter < numOfBlocks; counter++ ){

            //Draw block
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

            //Shift position to draw next block
            posFromLeft += 90;
            if(posFromLeft > 420){
                posFromLeft = 20;
                posFromTop += 60;
            }
        }
        return blockConfigArray;
    }

    /**
     * Generate launch bar
     * 
     * 2dContext context
     * int canvasWidth
     * int canvasHeight
     * 
     * Geenrates launch bar centered in the lower canvas.
     * Returns a function closure to move the bar (redraw in new position)
     */
    function generateBar(context, canvasWidth, canvasHeight){

        const barWidth = 90;
        const barHeight = 20;
        const posFromTop = canvasHeight - 40;
        var posFromLeft = (canvasWidth - barWidth)/2;
        const color = randomColor();
        //Draw bar
        context.beginPath();
        context.rect(posFromLeft, posFromTop, barWidth, barHeight);
        context.fillStyle = color;
        context.fill();
        context.closePath();

        /**
         * Move bar left or right
         * 
         * int lor
         * 
         * Accepts an integer, and moves bar in direction. 0 for left, any non zero number for right
         */
        return function(lor){

            context.beginPath();
            //If to move left
            if(lor === 0){
                //draw 10 pixels to the left
                posFromLeft -= 10;
                if(posFromLeft < 0) {
                    posFromLeft = 0;
                }
            }else{
                posFromLeft += 10;
                /*If position from left is greater than or equal to canvas width minus bar width
                * i.e. If the bar has touched the edge of the canvas
                */
                if(posFromLeft >= canvasWidth - barWidth) {
                    posFromLeft = canvasWidth - barWidth;
                }

            }
            //draw bar
            context.rect(posFromLeft, posFromTop, barWidth, barHeight);
            context.fillStyle = color;
            context.fill();
            context.closePath();
        }
    }

    /**
     * Redraw Canvas after clearing
     * 
     * Array blockConfigArr
     * 2dContext context
     * 
     * Draws onto context from data in blockConfigArr
     */
    function redrawCanvas(blockConfigArr, context){

        blockConfigArr.forEach(function(blockConfig) {
            context.beginPath();
            context.rect(blockConfig.pos[0], blockConfig.pos[1], blockWidth, blockHeight);
            context.fillStyle = blockConfig.color;
            context.fill();
            context.closePath();
        }, this);
    }
    
    /**
     * Main Function
     * 
     */
    function main(){

        const canvas = $("#gameArea")[0];
        var canvasContext = canvas.getContext('2d');
        //Generate blocks
        var blockConfigs = generateBlocks(10, canvasContext);
        //Generate bar
        const bar = generateBar(canvasContext, canvas.width, canvas.height);

        //Add even listener to the page
        $(document).keydown(function(e){
            e.preventDefault();
            //If left arrow key pressed
            if(e.keyCode == 37){
                //Clear canvas
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                redrawCanvas(blockConfigs, canvasContext);
                //Move launch bar left
                bar(0);

            }else if(e.keyCode == 39){
                //If right arrow pressed
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                redrawCanvas(blockConfigs, canvasContext);
                //Move launch bar right
                bar(1);
            }
        });

    }

    //Execute program
    main();
});