// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2
let birdImg;

let bird = {
    x : birdX,
    y: birdY,
    width : birdWidth,
    height : birdHeight
}

// pipes
let pipeArray =[];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY= 0;

let topPipeImg;
let bottomPipeImg;

// phy
let velocityX = -2;
let velocityY = 0; // bird jump speed
let gravity = 0.25;

let gameOver = false;
let Score=0;
let GM = false;

window.onload = function(){
    board= document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context= board.getContext("2d"); // draw on board

    // draw flappy bird
    //context.fillStyle = "green";
    //context.fillRect(bird.x , bird.y, bird.width , bird.height);

    // load imgs
    birdImg = new Image();
    birdImg.src = "imgs/pngegg.png";
    topPipeImg = new Image();
    topPipeImg.src = "imgs/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "imgs/bottompipe.png";

    // game control
    requestAnimationFrame(update);
    document.addEventListener("keydown",moveBird);

    document.getElementById("startButton").addEventListener("click",function(){
        if (!GM){
            GM = true;
            gameOver= false;
            velocityY=-2;
        }
    });

    document.getElementById("restartButton").addEventListener("click",function(){
        bird.y = birdY;
        velocityY = -2;
        pipeArray = [];
        Score = 0;
        gameOver= false;
        GM = true;
    });
    setInterval(placePipes,1500)
}

function update(){
    requestAnimationFrame(update);
    if (!GM){
        return;
    }
    if (gameOver){
       GM=false; 
       setTimeout(function(){
       alert("GAME OVER!\n YOUR SCORE: "+Score);
       },100)
       return;
    }
    context.clearRect(0 ,0, board.width , board.height);
    
    // bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY , 0);
    context.drawImage(birdImg , bird.x , bird.y ,bird.width, bird.height);// apply gravity to current bird.y, limit the bird.y to top of the canvas
     
    if(bird.y + bird.height>= board.height){
        bird.y = board.height - bird.height;
        gameOver = true;
    }

    // pipes
    for (let i = 0; i<pipeArray.length; i++){
        let pipe =pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x ,pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x+ pipe.width){
            Score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    // clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x< -pipeWidth){
        pipeArray.shift();
    }
    // score
    context.fillStyle= "black";
    context.font="45px sans-serif";
    context.fillText(Score ,5,45);
}

function placePipes(){
    if (!GM||gameOver){
        return;
    }
    
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x : pipeX ,
        y: randomPipeY,
        width: pipeWidth,
        height : pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x : pipeX,
        y: randomPipeY + pipeHeight+ openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if (!GM|| gameOver){
        return;
    }
    if (e.code == "Space"|| e.code == "ArrowUp"|| e.code== "KeyX"){
       // jump
       velocityY = -6;
    }
}

function detectCollision(a ,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}