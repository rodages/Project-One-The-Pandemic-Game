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
    pauses:1,
    points:0,
    virusFreePopulation:68429595,
    cheatcodes:["ienjoycheating","fairplayforall","iwantmyfreedom","doitfortheteam","iwantitovernow"],
    cheatCodeArr:[],
    mask:false,
    lockdown:false,
    single:false,
    double:false,
    booster:false,
}

const strainsArr = ["ancestral", "alpha", "beta", "gamma", "delta", "omicron"]
const helpersArr = ["mask","vaccine","lockdown",]


const strainsObj = {
    ancestral:{
        name:"ancestral",
        speed:1,
        damagePoints:10,
        size:5,
        splitting:"",
        fading:"",
        resistant:false,
    },
    alpha :{
        name:"alpha",
        speed:2,
        damagePoints:30,
        size:4,
        splitting:"split",
        fading:"",
        resistant:false,
    },
    beta :{
        name:"beta",
        speed:3,
        damagePoints:30,
        size:3,
        splitting:"",
        fading:"fade",
        resistant:false,
    },
    gamma :{
        name:"gamma",
        speed:4,
        damagePoints:40,
        size:2,
        splitting:"",
        fading:"",
        resistant:true,
    },
    delta :{
        name:"delta",
        speed:5,
        damagePoints:50,
        size:2,
        splitting:"split",
        fading:"fade",
        resistant:false,
    },
    omicron :{
        name:"omicron",
        speed:6,
        damagePoints:60,
        size:1,
        splitting:"split",
        fading:"fade",
        resistant:true,
    },
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
            bar.style.left=parseFloat(bar.style.left)-(playArea.width/100)+"px"
        }
    }
    else if(e.code==="ArrowRight"){
        if(parseFloat(bar.style.left)+(bar.offsetWidth*1.25)<gameField.clientWidth){
            bar.style.left=parseFloat(bar.style.left)+(playArea.width/100)+"px"
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

let height = 0;
let first = setInterval(() => {
    let barHeight = parseInt(window.getComputedStyle(bar).getPropertyValue("top"));
    let ballHeight = parseInt(window.getComputedStyle(ball).getPropertyValue("height"));
    let ballToBarCollisionPoint = parseInt(playArea.height-barHeight+ballHeight);
    ball.style.top = height+"px";
    // bar.style.width = `10px`

    //drops the ball
    if(height<gameField.scrollHeight-ballToBarCollisionPoint){
        // console.log("did not hit")
        // console.log(gameField.scrollHeight-ballToBarCollisionPoint)
        // console.log(height);
        // console.log(collisionCheck(ball,bar));
        height++
    }
    //checks for collision and increases the score
    else if(height==gameField.scrollHeight-ballToBarCollisionPoint){
        
        console.log("collision");
        console.log(collisionCheck(ball,bar))
        state.score++
        console.log(state.points)
        height++
        //check for arrow up to collect points
        //increase score
    }
    //cancells interval, removes the ball from the screen
    else if(height>gameField.scrollHeight-ballToBarCollisionPoint){
        console.log(height)
        console.log(`finished`);
        clearInterval(first);
    }
}, 1);

//check if the ball is in the range of the bar
function collisionCheck (ball,bar){
    const ballLocation = {
        left:ball.offsetLeft,
        right:ball.offsetLeft+ball.offsetWidth
    }
    const barLocation = {
        left:bar.offsetLeft,
        right:bar.offsetLeft+bar.offsetWidth
    }
    const withinBar = (barLocation.left<ballLocation.right && barLocation.right>ballLocation.left)

    return withinBar
}

//event listener to add pressed letter to cheatcode arr
document.addEventListener("keydown",(e)=>{
    addLetterToCheatCodeArr(e.code[e.code.length-1].toLowerCase())
})

//NEEDTOREMOVECONSOLELOG
//
//adds pressedbutton to cheat arr
function addLetterToCheatCodeArr(letter){
    if(state.cheatCodeArr.length<14){
        //adds letter to the array
        state.cheatCodeArr=[...state.cheatCodeArr,letter]
        console.log(state.cheatCodeArr.join(""))
    }else if(state.cheatCodeArr.length==14){
        //discards first letter, adds current letter to cheatcode array
        state.cheatCodeArr = [...state.cheatCodeArr.slice(1),letter]
        console.log(state.cheatCodeArr.join(""))
        //checks if cheatcodecriteria has been met
        console.log(state.cheatcodes.includes(state.cheatCodeArr.join("")))
    }
    else{
        console.log("something went wrong")
        console.log(letter)
        console.log(state.cheatCodeArr)
    }
}
