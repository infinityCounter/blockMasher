//When document loaded
$(document).ready(function(){

    var gameOver = false; //Of no use yet
    var gameStart = false;
    const blockWidth = 70, blockHeight = 40;
    const barWidth = 90, barHeight = 20, barShift = 10, barGap = 20;
    const ballRadius = 20,  ballShiftX = 5, ballShiftY = -5;


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
        var posFromTop = posFromLeft = barGap;
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
            posFromLeft += (barWidth + barGap);
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
         *Object containing data on position and move operations
         */
        return {
            "config" : {
                "pos" : [posFromLeft, posFromTop],
                "color" : color
            },
            /**
            * Move bar left or right
            * 
            * int lor
            * 
            * Accepts an integer, and moves bar in direction. 0 for left, any non zero number for right
            */
            "move" : function(lor){

                        //If to move left
                        if(lor === 0){
                            //draw 10 pixels to the left
                            this.config.pos[0] -= barShift;
                            if(this.config.pos[0] < 0) {
                                this.config.pos[0] = 0;
                            } 
                        }else{
                            this.config.pos[0] += barShift;
                            /*If position from left is greater than or equal to canvas width minus bar width
                            * i.e. If the bar has touched the edge of the canvas
                            */
                            if(this.config.pos[0] >= canvasWidth - barWidth) {
                                this.config.pos[0] = canvasWidth - barWidth;
                            }

                        }
                    }
        };
    }

    function generateBall(context, canvasHeight, canvasWidth){

        var posFromLeft = (canvasWidth - ballRadius) / 2;
        var posFromTop = canvasHeight - barHeight - 40;
        const color = randomColor();
        context.beginPath();
        context.arc(posFromLeft, posFromTop, ballRadius, 0, Math.PI * 2, false);
        context.fillStyle = color;
        context.fill();
        context.closePath();

        return {
            "config" : {
                "pos" : [posFromLeft, posFromTop],
                "color" : color,
                "lambda" : [ballShiftX, ballShiftY]
            },

            "move" : function (barConfig) {

                this.config.pos[0] += this.config.lambda[0];
                if(this.config.pos[0] >= (canvasWidth - ballRadius)){

                    this.config.pos[0] = (canvasWidth - ballRadius);
                    this.config.lambda[0] = -(this.config.lambda[0]);
                }else if(this.config.pos[0] <= ballRadius){

                    this.config.pos[0] = ballRadius;
                    this.config.lambda[0] = -(this.config.lambda[0]);
                }

                this.config.pos[1] += this.config.lambda[1];
                if(this.config.pos[1] <=  ballRadius){

                    this.config.pos[1] = ballRadius;
                    this.config.lambda[1] = -(this.config.lambda[1]);
                }else if(this.config.pos[1] >= (canvasHeight - ballRadius)){

                    this.config.pos[1] = (canvasHeight - ballRadius);
                    this.config.lambda[1] = -(this.config.lambda[1]);
                }
                if(barConfig !== undefined && barConfig !== null){
                    var overBar = (this.config.pos[0] <= (barConfig.pos[0] + barWidth) && this.config.pos[0] >= barConfig.pos[0]);
                    var touchingBar = ((this.config.pos[1] + ballRadius) >= barConfig.pos[1] && 
                                        (this.config.pos[1] + ballRadius) <= (barConfig.pos[1] + barHeight));
                    if(overBar && touchingBar){
                        console.log("Ball on bar!");
                        this.config.lambda[0] = -(this.config.lambda[0]);
                        this.config.lambda[1] = -(this.config.lambda[1]);
                    }
                }
            }
        }
    }

    /**
     * Redraw Canvas after clearing
     * 
     * Array blockConfigArr
     * 2dContext context
     * 
     * Draws onto context from data in block configuration object, bar config object, and ball cofig object
     */
    function redrawCanvas(blockConfigArr, barConfig, ballConfig, context){

        blockConfigArr.forEach(function(blockConfig) {
            context.beginPath();
            context.rect(blockConfig.pos[0], blockConfig.pos[1], blockWidth, blockHeight);
            context.fillStyle = blockConfig.color;
            context.fill();
            context.closePath();
        }, this);

        context.beginPath();
        context.rect(barConfig.pos[0], barConfig.pos[1], barWidth, barHeight);
        context.fillStyle = barConfig.color;
        context.fill();
        context.closePath();

        context.beginPath();
        context.arc(ballConfig.pos[0], ballConfig.pos[1], ballRadius, 0, Math.PI * 2, false);
        context.fillStyle = ballConfig.color;
        context.fill();
        context.closePath();
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
        const ball = generateBall(canvasContext, canvas.width, canvas.height);

        //Add even listener to the page
        $(document).keydown(function(e){
            e.preventDefault();
            
            //If the space bar pressed, start the game
            if(e.keyCode == 32 && !gameStart){
                gameStart = true;
                ball.move();
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                redrawCanvas(blockConfigs, bar.config, ball.config, canvasContext);

                //Move ball every 300 milliseconds and redraw canvas
                setInterval(function(){
                    ball.move(bar.config);
                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    redrawCanvas(blockConfigs, bar.config, ball.config, canvasContext);
                }, 100);
            
            //If left arrow key pressed
            }else if(e.keyCode == 37 && gameStart){
                
                //Move launch bar left
                bar.move(0);
                //Clear canvas
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                redrawCanvas(blockConfigs, bar.config, ball.config, canvasContext);

            }else if(e.keyCode == 39 && gameStart){
                //If right arrow pressed
                
                //Move launch bar right
                bar.move(1);
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                redrawCanvas(blockConfigs, bar.config, ball.config, canvasContext);
            }
        });

    }

    //Execute program
    main();
});