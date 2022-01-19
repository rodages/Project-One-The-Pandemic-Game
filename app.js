//div where gameplay happens
const gameField = document.querySelector(".game-field");
//div with stats/parameters and info
const infoField = document.querySelector(".game-info-display-field");
//playing area parameters
const domPowerUpList = document.querySelector(".power-up-list");
const domStrainsList = document.querySelector(".strains-list");
const domJabsList = document.querySelector(".jabs-list");

const playArea = {
    height:gameField.scrollHeight,
    width: gameField.scrollWidth,
    //"px" needs to be added when used
    collisionPoint:parseInt(gameField.scrollHeight/100*90)
}
//bar parameters
const barObject = {
    //when used "px" needs to be added
    width: playArea.width / 5,
    left:playArea.width/2-(playArea.width/20),
}
let bar = initiateBar()
let crowdLevel = initiateCrowd()

function startGame() {
    initiatePlayArea();
    initiateBar();
    initiateCrowd();
}
startGame()

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
        damagePoints:20,
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
const strainsArr = ["ancestral", "alpha", "beta", "gamma", "delta", "omicron"]
const powerUpsArr = ["mask", "lockdown", "vaccine"]

//takes string of strain, returns state.intensity
function updateIntensity(strain, state) {
    const stateObj = { ...state }
    let reducer = 1
        if (state.mask){
        reducer = 5
    }
    if (stateObj.lockdown) {
        reducer *=5
    }

    if (state.booster) {
        reducer = Math.max(reducer*2,30)
    } else if (state.double) {
        reducer +=10
    } else if (state.single) {
        reducer +=5
    }
    if (reducer == 1) {
        reducer=0
    } else if (reducer > 100) {
        reducer = 120
    }
    if (strainsArr.includes(strain)) {
        if (strain === "omicron" || strain === "gamma") {
            stateObj.intensity =stateObj.intensity- strainsObj[strain].damagePoints
        } else {
            stateObj.intensity =stateObj.intensity- strainsObj[strain].damagePoints+reducer
        }
        console.log(stateObj.intensity)
    } else { console.log("something went wrong", strain) }
    return stateObj.intensity
}


const state = {
    highscore:null,
    currentPoints: 0,
    infected:0,
    virusFreePopulation:68429595,
    cheatcodes:["ienjoycheating","fairplayforall","iwantmyfreedom","doitfortheteam","iwantitovernow"],
    cheatCodeArr: [],
    currentStrains: ["ancestral"],
    currentPowerUps: [],
    maxJabs: 0,
    intensity:1000,
    mask:false,
    lockdown:false,
    single:false,
    double:false,
    booster:false,
}

function updateGameParameters(stateObj) {
    stateObj.currentStrains = setStrains(stateObj)
    stateObj.currentPowerUps = setPowerUps(stateObj)
    stateObj.maxJabs = setJabs(stateObj)
}
function setPowerUps(state) {
    const stateObj = {...state}
    const maskPoints = 2000
    const lockdownPoints = 3000
    const vaccinePoints = 6000
    // if (stateObj.currentPowerUps.length === 3) {
    //     console.log(`all powerups enabled`)
    //     console.log(stateObj)
    // }
    //vaccine
    if (stateObj.currentPoints >= vaccinePoints) {
        stateObj.currentPowerUps = [...powerUpsArr]
        console.log(`all powerups enabled`)
        console.log(stateObj.currentPowerUps)
    }
    //lockdown
    else if (stateObj.currentPoints >= lockdownPoints) {
        stateObj.currentPowerUps = [...powerUpsArr.slice(0, 2)]
        console.log(`lockdowns enabled`);
        console.log(stateObj.currentPowerUps)
    } else if (stateObj.currentPoints >= maskPoints) {
        stateObj.currentPowerUps = [...powerUpsArr.slice(0, 1)]
        console.log(`masks enabled`);
        console.log(stateObj.currentPowerUps)
    } else {
        console.log(`too little points or something went wrong`)
        console.log(stateObj)
    }
    createLis(domPowerUpList,stateObj.currentPowerUps,)
    return stateObj.currentPowerUps
}
function setJabs(state) {
    const stateObj = {...state}
    const singleJabPoints = 6000;
    const doubleJabPoints = 9000;
    const boosterJabPoints = 11000;
    //booster treshold
    if (stateObj.currentPoints >= boosterJabPoints) {
        stateObj.maxJabs = 3;
        console.log(`booster jab available`)
        console.log(stateObj)
    }
    //double
    else if (stateObj.currentPoints >= doubleJabPoints) {
        stateObj.maxJabs = 2;
        console.log(`double jab available`)
        console.log(stateObj)
    }
    //single 
    else if (stateObj.currentPoints >= singleJabPoints) {
        stateObj.maxJabs = 1;
        console.log(`single jab available`)
        console.log(stateObj)
        

    } else {
        console.log(`too little points or something went wrong`)
        console.log(stateObj)
    }
    return stateObj.maxJabs
}
function setStrains(state) {
    const stateObj = { ...state }
    const alphaPoints = 4000;
    const betaPoints = 5000;
    const gammaPoints = 7000;
    const deltaPoints = 8000;
    const omicronPoints = 10000;
    //omicron
    if (stateObj.currentPoints >= omicronPoints) {
        stateObj.currentStrains = [...strainsArr]
        console.log(stateObj.currentStrains, `currentStrains`)
        console.log(`omicron enabled`)
    }
    // delta
    else if (stateObj.currentPoints >= deltaPoints) {
        stateObj.currentStrains = [...strainsArr.slice(0, 5)]
        console.log(stateObj.currentStrains, `currentStrains`)
        console.log(`delta enabled`)
    }
    // gamma
    else if (stateObj.currentPoints >= gammaPoints) {
        stateObj.currentStrains = [...strainsArr.slice(0, 4)]
        console.log(stateObj.currentStrains, `currentStrains`)
        console.log(`gamma enabled`)
    }
    // beta
    else if (stateObj.currentPoints >= betaPoints) {
        stateObj.currentStrains = [...strainsArr.slice(0, 3)]
        console.log(stateObj.currentStrains, `currentStrains`)
        console.log(`beta enabled`)
    }
    //alpha
    else if (stateObj.currentPoints >= alphaPoints) {
        stateObj.currentStrains = [...strainsArr.slice(0, 2)]
        console.log(stateObj.currentStrains, `currentStrains`)
        console.log(`alpha enabled`)
    } else {
        console.log(`too little points or something went wrong`)
        console.log(stateObj)
    }
    createLis(domStrainsList,stateObj.currentStrains,)
    return stateObj.currentStrains
}

function createLis(parentElement, powerupType) {
    if (parentElement.children.length !== powerupType.length) {
        powerupType.forEach(item => {
            if (!parentElement.querySelector(`.${item}`)) {
                const li = document.createElement("li")
                li.innerText = item[0].toUpperCase()+item.slice(1)
                li.classList.add(item);
                parentElement.appendChild(li)
            }
        })
    }
}





//ball for testing
function ballsLocation(area, ballsWidth) {
    const location = Math.floor(Math.random() * playArea.width) + 1
    // console.log(location, `location`)
    // console.log(area, `area`)
    // console.log(ballsWidth,`ballswidth`)
    if (location + ballsWidth > area) {
        return location - ballsWidth
    }
    return location
}

const createBall = (strain) => {
    if (strainsArr.includes(strain)) {
        const ball = document.createElement("div")
        // console.log(strainsObj[strain].size)
        const ballSize = parseInt(playArea.width / 30)*strainsObj[strain].size;
        strainsObj[strain].enhancements.forEach(enhancement => ball.classList.add(enhancement));
        ball.style.height = ballSize + "px"
        ball.style.width = ballSize + "px"
        ball.classList.add("ball");
        ball.style.left = ballsLocation(playArea.width, ballSize) + "px"
        // ball.innerText=strainsObj[strain].name
        // console.log(ball);
        gameField.appendChild(ball)
        return ball
    } else { console.log("something went wrong", strain) }
    
}


const dropBall = (strain) => {
    const ball = createBall(strain);
    let start, previousTimeStamp;
    const speed = parseFloat(0.05 * strainsObj[strain].speed).toFixed(4);
    console.log(speed);


    function step(timestamp) {
        if (start === undefined) {
            start = timestamp;
        }
        const elapsed = timestamp - start;

        const height = elapsed * speed

        // let barHeight = parseInt(window.getComputedStyle(bar).getPropertyValue("top"));
        //need to rename to collisionPoint
        let barHeight = playArea.collisionPoint
        // let ballHeight = parseInt(window.getComputedStyle(ball).getPropertyValue("height"));
        let ballHeight = parseInt(ball.style.height)
        console.log(ballHeight)
        //ball height
        let ballToBarCollisionPoint = playArea.height - playArea.collisionPoint + ballHeight
        console.log(ballToBarCollisionPoint,`balltobarcollisionpoint`)
        // let ballToBarCollisionPoint = parseInt(playArea.height - barHeight + ballHeight);
        //ball to bar collision point offset by ball height
        //level at which the actual collision point is between bar and ball offset by its height
        const barCollisionPoint = gameField.scrollHeight - ballToBarCollisionPoint
        console.log(barCollisionPoint,`barcollisionpoint`)
        ball.style.top = height + "px";
        // console.log(ball.style.top);
        // console.log(`height ${height}`)
        // console.log(`barCollisionPoint ${barCollisionPoint}`)
        
        //checks for collision and increases the score
        if(Math.abs(height-barCollisionPoint)<1){
            
            console.log("collision");
            console.log(collisionCheck(ball, bar))
            //needs to be made into function
            state.currentPoints = state.currentPoints+=strainsObj[strain].damagePoints
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
// dropBall("ancestral")
// dropBall("alpha")
// dropBall("beta")
// dropBall("gamma")
// dropBall("delta")
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
// textFit(document.querySelector(".bar"), { widthOnly: true, })

function initiatePlayArea (){
    const gameField = document.querySelector(".game-field");
    playArea.height = gameField.scrollHeight,
    playArea.width = gameField.scrollWidth,
    playArea.collisionPoint = parseInt(gameField.scrollHeight/100*90)
}
function initiateBar() {
    //when used "px" needs to be added
    barObject.width = playArea.width / 5;
    barObject.left = playArea.width / 2 - (playArea.width / 20);
    const bar = document.querySelector(".bar");
    //!!!!!not sure why this ends up being a big without -20
    bar.style.height = playArea.height - playArea.collisionPoint + "px";
    bar.style.width = parseInt(barObject.width) + "px";
    bar.style.top = playArea.collisionPoint + "px"
    bar.style.left = barObject.left + "px";
    return bar
}

function initiateCrowd() {
    const crowdLevel = document.querySelector(".crowd")
    crowdLevel.style.top = playArea.collisionPoint + "px";
    crowdLevel.style.height = playArea.height - playArea.collisionPoint + "px";
    return crowdLevel
}

//bar controlls
document.addEventListener("keydown",(e)=>{
    if(e.code==="ArrowLeft"){
        if(parseFloat(bar.style.left)>gameField.clientLeft){
            bar.style.left=parseFloat(bar.style.left)-(playArea.width/50)+"px"
        } else if (parseFloat(bar.style.left) < 0) {
            bar.style.left=0+"px"
        }
    }
    else if(e.code==="ArrowRight"){
        if(parseFloat(bar.style.left)+(barObject.width)<gameField.clientWidth){
            bar.style.left=parseFloat(bar.style.left)+(playArea.width/50)+"px"
        }
    }
})
