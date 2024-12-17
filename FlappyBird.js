//Board
let Board;
let BoardWidth = 360;
let BoardHeight = 640;
let context;

// Bird

let BirdImg; // BirdImg cuz its an image
let BirdX = BoardWidth / 8 ; // to make it appear at the start
let BirdY = BoardHeight / 2; // to make it appear in the middle 
let BirdWidth = 34; // the resolution of bird is 408 x 228 so we take ratio to make it smaller 17/12 and just * 2 to make a litle bit bigger
let BirdHeight = 24;
let BirdVelocityY = 0;
let gravity = 0.4; // adds each second

let Bird = { // object  

    x : BirdX,
    y : BirdY,
    width : BirdWidth,
    height : BirdHeight,

}

// Pipes

let BottomPipeImg;
let TopPipeImg;

let PipeWidth = 64; // the ratio of widht and height are 384 x 3072 which is then simplifed to 64/512 best 
let PipeHeight = 512;
let PipeArray = []; // this holds all the pipes
let PipeX = BoardWidth;
let PipeY = 0;
let PipeVelocityX = -2; // cuz its going in left direction so negative;

// gameover score

let timeout;
let gameOver = false;
let score = 0;

// when user leaves ur tab this will fire
window.onblur = function(){
    clearInterval(timeout);
}

window.onload = function(){

    Board = document.getElementById('Board');
    Board.width = BoardWidth; // setting Canvas height and widht
    Board.height = BoardHeight;
    context = Board.getContext("2d");

   // context.fillRect(0,0,BoardWidth,BoardHeight); this is drawing canvas on canvas ; 

   //Draw Bird

    BirdImg = new Image(); // to let canvas know its an img
    BirdImg.src = "/imgs/flappybird.png";
    BirdImg.onload = function(){
        // Draw it here
        context.drawImage(BirdImg,Bird.x,Bird.y,Bird.width,Bird.height);
    }

  
    TopPipeImg = new Image();
    TopPipeImg.src = "/imgs/toppipe.png";

    BottomPipeImg = new Image();
    BottomPipeImg.src = "/imgs/bottompipe.png";



    requestAnimationFrame(update);

    // Spawn Pipes each 1.5 seconds

        timeout = setInterval(spawnPipes, 1500);

    document.addEventListener("keydown",KeyListen);
    // these event listeners stop the update function priority to go first
}
function update(){

    requestAnimationFrame(update);
    
    // return when gameover
    if (gameOver){
        return ;
    }

    // Clear each frame
    context.clearRect(0,0,Board.width,Board.height);
    
    // Bird move

    BirdVelocityY += gravity;
    // the movement works like this if space is pressed then velocity wi/ll be -6 but variable gravity keeps adding 
    // each second to velocityY so thats What creates the falling effect
    // the more u let it the faster it will fall 

    Bird.y = Math.max(Bird.y + BirdVelocityY , 0) // meth.max so it doesnt go offscreen

    // Update Bird


    context.drawImage(BirdImg,Bird.x,Bird.y,Bird.width,Bird.height);

     // Pipes
     console.log(PipeArray.length)

    for (let i = 0; i < PipeArray.length; i++) {
        let Pipe = PipeArray[i];
        context.drawImage(Pipe.img,Pipe.x,Pipe.y,Pipe.width,Pipe.height);
        Pipe.x += PipeVelocityX;

        if (!Pipe.passed && Bird.x > Pipe.x + Pipe.width){
            score += 1;
            Pipe.passed = true;
        }
        if (CollisionDetect(Bird,Pipe)){
            gameOver = true;
            context.clearRect(0,0,Board.width,Board.height);
            ShowText();    
        }
    }    
    while (PipeArray.length > 0 && PipeArray[0].x < -PipeWidth) {
        PipeArray.shift(); //removes first element from the array
    }

    // if bird falls 
    if (Bird.y > BoardHeight){
        gameOver = true;
        context.clearRect(0,0,Board.width,Board.height);
        ShowText();
    }

    //score
    context.font = "20px Impact"
    context.fillText(`score : ${score} L BOZO`,20,40)

}
// listen key code
function KeyListen(e){ // e is the keycode

    if (e.code == "Space" || e.code == "ArrowUp"){
        BirdVelocityY = -6; // since its a let var it will reset after time;

        //reset
        if (gameOver){
            Bird.y = BirdY;
            score = 0;
            PipeArray = [];
            gameOver = false;
            clearInterval(timeout);
            timeout = setInterval(spawnPipes, 1500);
        }

    }
}

// Pipe Spawner
function spawnPipes(){

    // we want this in negative so pipes dont float

    // -128 - (0-1) * 256
    let RandomPipeY = PipeY - (PipeHeight / 4) - Math.random() * (PipeHeight / 2);

    // we want an opening space between both pipes

    let openingspace = Math.min(Math.random(),0.3) * (Board.height / 4)

    //now we create top and bottompipe object and push to array

    let TopPipe = {
        img : TopPipeImg,
        x : PipeX,
        y : RandomPipeY,
        width : PipeWidth,
        height : PipeHeight,
        passed : false, // will be used as a way to detect if bird has passed pipe
    }
    PipeArray.push(TopPipe)
    let BottomPipe = {
        img : BottomPipeImg,
        x : PipeX,
        y : RandomPipeY + Board.height + openingspace , // becuase the y is in negative we need to make it come back to bottom
        width : PipeWidth,
        height : PipeHeight,
        passed : false, // will be used as a way to detect if bird has passed pipe
    }
    PipeArray.push(BottomPipe);
}
// DETECTS COLLISION
function CollisionDetect(a,b){

    return a.x < (b.x + b.width) &&  // if top left corner cant react top right corner
        (a.x + a.width) > b.x && // top right corner passes trhough top left corner
        a.y < (b.y + b.height) && // top left corner cant reach bottom left corner
        (a.y + a.height) > b.y; // bottom left corner can pass through top left corner
}

// gameOver 
function ShowText(){

    context.font = "40px Impact";
    context.fillStyle = "red";
    context.fillText(`${score} points`,10,Board.height/2);

}
