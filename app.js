//div where gameplay happens
const gameField = document.querySelector(".game-field");
//div with stats/parameters and info
const infoField = document.querySelector(".game-info-display-field");
//playing area parameters

const playArea = {
    height:gameField.scrollHeight,
    width:gameField.scrollWidth,
}
//bar parameters
const barObject={
    width:playArea.width/10+"px",
    left:playArea.width/2-(playArea.width/20)+"px",
}
const state = {
    score:0
}

//bar
const bar = document.createElement("div");
bar.classList.add("bar");
bar.style.width=parseInt(barObject.width)+"px";
bar.style.left=barObject.left
bar.style.top=parseInt(playArea.height/100*90)+"px"
// bar.style.left=100+"px"
gameField.appendChild(bar);

//bar controlls
document.addEventListener("keydown",(e)=>{
    if(e.code==="ArrowLeft"){
        if(parseFloat(bar.style.left)>gameField.clientLeft){
            bar.style.left=parseFloat(bar.style.left)-(playArea.width/20)+"px"
        }
    }
    else if(e.code==="ArrowRight"){
        if(parseFloat(bar.style.left)+(bar.offsetWidth*1.25)<gameField.clientWidth){
            bar.style.left=parseFloat(bar.style.left)+(playArea.width/20)+"px"
        }
    }
})

//ball for testing
console.log(playArea)
const ball = document.createElement("div");
console.log(ball);
ball.classList.add("ball");
ball.style.width=parseInt(playArea.width/30)+"px";
ball.style.height=playArea.width/30+"px";
gameField.appendChild(ball);

//needs to be in private execution context
//height means where the ball/virus will be dropped from
let height = 600;
let first = setInterval(() => {
    let barHeight = parseInt(window.getComputedStyle(bar).getPropertyValue("top"));
    let ballHeight = parseInt(window.getComputedStyle(ball).getPropertyValue("height"));
    let ballToBarCollisionPoint = parseInt(playArea.height-barHeight+ballHeight);
    ball.style.top = height+"px";
    
    if(height<gameField.scrollHeight-ballToBarCollisionPoint){
        console.log("did not hit")
        console.log(gameField.scrollHeight-ballToBarCollisionPoint)
        console.log(height);
        height++
    }
    else if(height==gameField.scrollHeight-ballToBarCollisionPoint){
        console.log("collision");
        console.log(state.score)
        state.score++
        console.log(state.score)
        height++
        //check for arrow up to collect points
        //increase score
    } else if(height>gameField.scrollHeight-ballToBarCollisionPoint){
        console.log(height)
        console.log(`finished`);
        clearInterval(first);
    }
    // else{
    //     //
        // ball.style.top = height+20+"px";
    // }
}, 100);



