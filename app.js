//div where gameplay happens
const gameField = document.querySelector(".game-field");
//div with stats/parameters and info
const infoField = document.querySelector(".game-info-display-field");
//playing area parameters

const playArea = {
    height:gameField.scrollHeight,
    width: gameField.scrollWidth,
    collisionPoint:parseInt(gameField.scrollHeight/100*90)
}
//bar parameters
const barObject={
    width: playArea.width / 5 + "px",
    left:playArea.width/2-(playArea.width/20)+"px",
}

const strainsObj = {
    ancestral:{
        name:"ancestral",
        speed:1,
        damagePoints:10,
        size:1.5,
        enhancements: ["ancestral"],
    },
    alpha :{
        name:"alpha",
        speed:1.5,
        damagePoints:30,
        size:1.4,
        enhancements: ["alpha","split"],
    },
    beta :{
        name:"beta",
        speed:1.7,
        damagePoints:30,
        size:1.3,
        enhancements: [,"beta","fade"],
    },
    gamma :{
        name:"gamma",
        speed:1.9,
        damagePoints:40,
        size:1.2,
        enhancements: ["gamma","resistant"],
    },
    delta :{
        name:"delta",
        speed:2.5,
        damagePoints:50,
        size:1.1,
        enhancements: ["delta","split","fade"],
    },
    omicron :{
        name:"omicron",
        speed:3,
        damagePoints:60,
        size:1,
        enhancements: ["omicron","split","fade","resistant"],
    },
}
const strainsArr = ["ancestral", "alpha", "beta", "gamma", "delta", "omicron",]
const powerUpsArr = ["mask","lockdown", "vaccine"]

const state = {
    highscore:null,
    currentPoints: 0,
    infected:0,
    virusFreePopulation:68429595,
    cheatcodes:["ienjoycheating","fairplayforall","iwantmyfreedom","doitfortheteam","iwantitovernow"],
    cheatCodeArr: [],
    currentStrains: ["ancestral",],
    currentPowerUps: [],
    maxJabs: 0,
    intensity:1,
    mask:false,
    lockdown:false,
    single:false,
    double:false,
    booster:false,
}
function setGameParameters(state) {
    //max settings reached
    if (maxJabs === 3) {
        console.log(`max settings reached`);
        return
    }
    //set max settings -> booster
    if (state.currentPoints > 11000) {
        state.currentPowerUps = [...powerUpsArr];
        maxJabs = 3;
        console.log(`max settings,booster`)
        console.log(state)
        return
    
    }
    //enable omicron
    else if (state.currentPoints > 10000) {
        state.currentStrains = [...strainsArr]
        console.log(`omicron enabled`)
        console.log(state);
        return
    }
    //enable double
    else if (state.currentPoints > 9000) {
        state.maxJabs = 2;
        console.log(`2jabs`);
        return
    }
    // enable delta
    else if (state.currentPoints > 8000) {
        state.currentStrains = [...strainsArr.slice(0, 5)]
        console.log(`delta enabled`)
        return
    }
    //
    console.log(`nothing happened`);
}





//bar
const bar = document.createElement("div");
const crowdLevel = document.createElement("div");

bar.classList.add("bar");
crowdLevel.classList.add("collision-point");

bar.style.width = parseInt(barObject.width) + "px";
//centers initial bar
bar.style.left = barObject.left

bar.style.top = playArea.collisionPoint + "px"
crowdLevel.style.top = playArea.collisionPoint + "px";
bar.innerText = "NHS"

gameField.appendChild(bar);
gameField.appendChild(crowdLevel)

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
function ballsLocation(area, ballsWidth) {
    const location = Math.floor(Math.random() * playArea.width) + 1
    console.log(location, `location`)
    console.log(area, `area`)
    console.log(ballsWidth,`ballswidth`)
    if (location + ballsWidth > area) {
        return location - ballsWidth
    }
    return location
}

const createBall = (strain) => {
    if (strainsArr.includes(strain)) {
        const ball = document.createElement("div")
        console.log(strainsObj[strain].size)
        const ballSize = parseInt(playArea.width / 30)*strainsObj[strain].size;
        strainsObj[strain].enhancements.forEach(enhancement => ball.classList.add(enhancement));
        ball.style.height = ballSize + "px"
        ball.style.width = ballSize + "px"
        ball.classList.add("ball");
        ball.style.left = ballsLocation(playArea.width, ballSize) + "px"
        // ball.innerText=strainsObj[strain].name
        console.log(ball);
        gameField.appendChild(ball)
        return ball
    } else { console.log("something went wrong", strain) }
    
}


const dropBall = (strain) => {
    // const ball = document.createElement("div");
    // ball.classList.add("ball");
    // ball.style.width=parseInt(playArea.width/30)+"px";
    // ball.style.height=playArea.width/30+"px";
    // gameField.appendChild(ball);
    const ball = createBall(strain);
    let start, previousTimeStamp;
    const speed = 0.05 * strainsObj[strain].speed;


    function step(timestamp) {
        if (start === undefined) {
            start = timestamp;
        }
        const elapsed = timestamp - start;

        const height = elapsed * speed

        let barHeight = parseInt(window.getComputedStyle(bar).getPropertyValue("top"));
        let ballHeight = parseInt(window.getComputedStyle(ball).getPropertyValue("height"));
        let ballToBarCollisionPoint = parseInt(playArea.height - barHeight + ballHeight);
        const barCollisionPoint = gameField.scrollHeight-ballToBarCollisionPoint
        ball.style.top = height + "px";
        // console.log(ball.style.top);
        // console.log(`height ${height}`)
        // console.log(`barCollisionPoint ${barCollisionPoint}`)
        
        //checks for collision and increases the score
        if(Math.abs(height-barCollisionPoint)<1){
            
            console.log("collision");
            console.log(collisionCheck(ball,bar))
            state.score++
            console.log(state.points)
            //check for arrow up to collect points
            //increase score
        }
        //cancells interval, removes the ball from the screen
        else if(height<barCollisionPoint){
            window.requestAnimationFrame(step);
        }
        
    }
    window.requestAnimationFrame(step)
}
dropBall("ancestral")
dropBall("alpha")
dropBall("beta")
dropBall("gamma")
dropBall("delta")
dropBall("omicron")



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

//responsiveness if window size get changed during the game
// {function resized() {
//     bar.style.width = parseInt(document.querySelector(".game-field").clientWidth / 10) + "px";
//     console.log(ball.width);
//     ball.width = parseInt(document.querySelector(".game-field").clientWidth / 30) + "px";
//     console.log(ball.width);
//     window.onresize = resized}
// }

//NEEDTOREMOVECONSOLELOG
//
//adds pressedbutton to cheat arr
function addLetterToCheatCodeArr(letter){
    if(state.cheatCodeArr.length<14){
        //adds letter to the array
        state.cheatCodeArr=[...state.cheatCodeArr,letter]
        // console.log(state.cheatCodeArr.join(""))
    }else if(state.cheatCodeArr.length==14){
        //discards first letter, adds current letter to cheatcode array
        state.cheatCodeArr = [...state.cheatCodeArr.slice(1),letter]
        // console.log(state.cheatCodeArr.join(""))
        //checks if cheatcodecriteria has been met
        // console.log(state.cheatcodes.includes(state.cheatCodeArr.join("")))
        //function to execute cheatcode with switch statement
    }
    else{
        console.log("something went wrong")
        console.log(letter)
        console.log(state.cheatCodeArr)
    }
}
//event listener to add pressed letter to cheatcode arr
document.addEventListener("keydown",(e)=>{
    addLetterToCheatCodeArr(e.code[e.code.length-1].toLowerCase())
})

//adds list of cheatcodes
state.cheatcodes.forEach(cheatCode=>{
    const li = document.createElement("li")
    li.textContent = cheatCode
    document.querySelector(".cheat-codes").appendChild(li)
})
//will adjust the NHS to fit the bar div
textFit(document.querySelector(".bar"), { widthOnly: true, })
