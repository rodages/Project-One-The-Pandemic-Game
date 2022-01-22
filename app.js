//DIV WHERE GAME IS PLAYED
const gameField = document.querySelector(".game-field");
//DIV WITH STATS/PARAMETERS/INFO
const infoField = document.querySelector(".game-info-display-field");
//DOM ELEMENTS
const domPowerUpsList = document.querySelector(".power-up-list");
const domStrainsList = document.querySelector(".strains-list");
const domJabsList = document.querySelector(".jabs-list");

const domCurrentPoints = document.querySelector(".points");
const domCurrentInfections = document.querySelector(".infections");

//PLAYAREA PARAMS
const playArea = {
    //"px" needs to be added when used
    height:gameField.scrollHeight,
    width: gameField.scrollWidth,
    collisionPoint:parseInt(gameField.scrollHeight/100*90)
}
//BAR PARAMS
const barObject = {
    //when used "px" needs to be added
    width: Math.round(playArea.width / 5),
    left:playArea.width/2-(playArea.width/20),
}
//MAIN GAME STATE
const state = {
    highscore:null,
    currentPoints: 0,
    currentInfections:0,
    population:6850,
    cheatcodes:["ienjoycheating","fairplayforall","iwantmyfreedom","doitfortheteam","iwantitovernow"],
    cheatCodeArr: [],
    currentStrains: ["ancestral"],
    currentPowerUps: [],
    collectedJabs: [],
    collectedPowerUps: [],
    emergencyStop:false,
    maxJabs: 0,
    intensity:1000,
    mask:false,
    lockdown:false,
    single:false,
    double:false,
    booster:false,
    gameWon:false,
    gameLost:false,
    cheats : {
        cheatBar:{
            active:null,
            oldBarWidth:null,
        },
        powerUps:{
            empty:[],
            default:["mask", "lockdown", "vaccine"],
            old:[]
        }
    },
}

//DROPABLE ITEMS STATE AND PARAMS
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
        enhancements: ["beta","fade"],
    },
    gamma :{
        name:"gamma",
        speed:1.9,
        damagePoints:40,
        size:1.2,
        enhancements: ["gamma","resistant"],
    },
    delta: {
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
const powerUpsObj = {
    mask: {
        bonusPointsPercent: 10,
        barWidthPercent: 30,
        speed: 1.7,
        size: 1.3,
        enhancements: ["mask",],
        powerUpDuration: 5000,
        reocurrance: 10000,
    },
    lockdown: {
        bonusPointsPercent: 0,
        barWidthPercent: 50,
        speed: 3,
        size: 1,
        enhancements: ["lockdown",],
        powerUpDuration: 15000,
        reocurrance: 30000,
    },
    vaccine: {
        speed: 2.2,
        size: 1.2,
        enhancements: ["vaccine",],
        reocurrance: 20000,
    },
    single: {
        bonusPointsPercent: 20,
        barWidthPercent: 35,
        powerUpDuration: 30000,
        treshold:4000,
    },
    double: {
        bonusPointsPercent: 30,
        barWidthPercent: 40,
        powerUpDuration: 20000,
        treshold:6000,
    },
    booster: {
        bonusPointsPercent: 50,
        barWidthPercent: 45,
        powerUpDuration: 15000,
        treshold:9000,
    },
}
//OPTIONS
const strainsArr = ["ancestral", "alpha", "beta", "gamma", "delta", "omicron"]
const powerUpsArr = ["mask", "lockdown", "vaccine"]
const jabsList = ["single","double","booster"];
//POWERUP INTERVALS STORED IN CASE THEY SHOULD GET CANCELLED
const intervalsObj = {
    mask: null,
    lockdown: null,
    vaccine:null,
    id:0,
}

//timeout will be stored here for jabs
let vaccineTimeOutVariable

//DEFAULT LOAD PARAMS FOR SCREEN OBJECTS
let bar = initiateBar()
let crowdLevel = initiateCrowd()

function startGame() {
    initiatePlayArea();
    initiateBar();
    initiateCrowd();
    updateGameParameters(state)
}
startGame()


//POWERUP UPDATE FUNCTIONS
function togglePowerUp(powerUpType){
    state[powerUpType]=!state[powerUpType]
}

function setPowerUpTimeOut(powerUpType){
    const duration = powerUpsObj[powerUpType].powerUpDuration
    if(powerUpType==="vaccine"){
        setVaccineLevel()
    }else{
        if(powerUpType==="lockdown"){
            resetBallDropIntensity()
        }
        togglePowerUp(powerUpType)
        setTimeout(()=>{
            togglePowerUp(powerUpType)
            
        },duration)
    }
}
function resetBallDropIntensity(){
    const endPowerUpInterval = setInterval(()=>{state.intensity = 1000},100)
            setTimeout(()=>{
                clearInterval(endPowerUpInterval)
            },powerUpsObj.lockdown.powerUpDuration*1.5)
}

//needs to be refactored - too much repetitions
function setVaccineLevel(){
    if(state.booster){
        //do nothing
        console.log(`already max vaccinations`)
    }else if(state.double){
        if(state.currentPoints>=powerUpsObj.booster.treshold){
            clearTimeout(vaccineTimeOutVariable)
            state.double=false
            state.booster=true
            toggleClassesHTML("booster",domJabsList)
            const duration = powerUpsObj.booster.powerUpDuration
            console.log(`got booster`)
            vaccineTimeOutVariable = setTimeout(()=>{
                state.booster = false;
                state.double = true;
                console.log(`booster jab worn out`)
                toggleClassesHTML("booster",domJabsList)
                //make double wear out 
                vaccineTimeOutVariable=setTimeout(()=>{
                    state.double = false;
                    state.single = true;
                    console.log(`double jab worn out`)
                    toggleClassesHTML("double",domJabsList)
                    //make single wear out
                    vaccineTimeOutVariable=setTimeout(()=>{
                        state.single = false;
                        console.log(`first jab worn out`)
                        toggleClassesHTML("single",domJabsList)
                    },duration)
                },duration)
            },duration)
        }
    } else if(state.single){
        //if enought points for second jab
        if(state.currentPoints>=powerUpsObj.double.treshold){
            clearTimeout(vaccineTimeOutVariable)
            state.single=false
            state.double=true
            toggleClassesHTML("double",domJabsList)
            const duration = powerUpsObj.double.powerUpDuration
            console.log(`got second jab`)
            vaccineTimeOutVariable=setTimeout(()=>{
                state.double = false;
                state.single = true;
                console.log(`double jab worn out`)
                toggleClassesHTML("double",domJabsList)
                //make single wear out
                vaccineTimeOutVariable=setTimeout(()=>{
                    state.single = false;
                    console.log(`first jab worn out`)
                    toggleClassesHTML("single",domJabsList)
                },duration)
            },duration)
        }//otherwise do nothing
    } else{
        state.single = true
        toggleClassesHTML("single",domJabsList)
        const duration = powerUpsObj.single.powerUpDuration
        console.log(`got first jab`)
        vaccineTimeOutVariable=setTimeout(()=>{
            state.single = false;
            console.log(`first jab worn out`)
            toggleClassesHTML("single",domJabsList)
        },duration)
    }
}

function toggleClassesHTML(element,htmlListItem){
    return htmlListItem.querySelector(`.${element}`).classList.toggle("active")
}

//activates cheatBar
function setCheatBar(){
    state.cheats.cheatBar.active=true;
    state.cheats.cheatBar.oldBarWidth=barObject.width
}
function clearCheatBar(){
    state.cheats.cheatBar.active=false;
}
function updateCheatBar(){
    const cheatBar = {...state.cheats.cheatBar}
    if(cheatBar.active){
        state.cheats.cheatBar.oldBarWidth = barObject.width
        barObject.width =setBarWidthRounded(100)
        bar.style.width = barObject.width + "px"
        bar.style.left=0+"px"
        return barObject.width
    }else if(cheatBar.oldBarWidth){
        barObject.width=cheatBar.oldBarWidth
        bar.style.width = barObject.width + "px"
        state.cheats.cheatBar.oldBarWidth = null;
        bar.style.left = playArea.width/2 - barObject.width/2 + "px"
        return barObject.width
    }
}
//both functions can be done reusable as they follow lockdown->booster->double->single->mask
//returns width only to barObject, but does not assign
function setBarWidthRounded(widthParams) {
    return Math.round(playArea.width/100*widthParams) 
}
function updateBar() {
    
    if(state.cheats.cheatBar.active || state.cheats.cheatBar.oldBarWidth){
        updateCheatBar()
    }else{
        //at the moment bar shrinks from right to left - need to make it central
        if (state.lockdown) {
            barObject.width = setBarWidthRounded(powerUpsObj.lockdown.barWidthPercent)
        } else if (state.booster) {
            barObject.width = setBarWidthRounded(powerUpsObj.booster.barWidthPercent)
        } else if (state.double) {
            barObject.width = setBarWidthRounded(powerUpsObj.double.barWidthPercent)
        } else if (state.single) {
            barObject.width = setBarWidthRounded(powerUpsObj.single.barWidthPercent)
        } else if (state.mask) {
            barObject.width = setBarWidthRounded(powerUpsObj.mask.barWidthPercent)
        } else {
            barObject.width = Math.round(playArea.width/100*20)
        }
        bar.style.width = barObject.width + "px"
        if (parseInt(bar.style.width) + parseInt(bar.style.left) > playArea.width) {
            bar.style.left = parseInt(playArea.width) - parseInt(bar.style.width) + "px";
        }
    }
    
    return barObject.width
}
//returns updatedPoints
function addBonusPoints(strain,state,powerUpsObj) {
    let points = strainsObj[strain].damagePoints
    // const stateObject = { ...state }
    if (state.lockdown) {
        //points remain standard
    } else if (state.booster) {
        points += points/100*powerUpsObj.booster.bonusPointsPercent
    } else if (state.double) {
        points += points/100*powerUpsObj.double.bonusPointsPercent
    } else if (state.single) {
        points += points/100*powerUpsObj.single.bonusPointsPercent
    } else if (state.mask) {
        points += points/100*powerUpsObj.mask.bonusPointsPercent
    }
    return points
}

//takes string of strain, returns state.intensity
function updateIntensity(strain, state) {
    const stateObj = { ...state }
    let reducePoints = strainsObj[strain].damagePoints


    if (stateObj.lockdown) {
        reducePoints = parseInt(reducePoints/3)
    }
    if (stateObj.booster) {
        reducePoints /= 3
    }
    if (stateObj.mask) {
        reducePoints -= 5
    }
    if (strain === "omicron" || strain === "gamma") {
        stateObj.intensity = stateObj.intensity - reducePoints
    } else {
        if (stateObj.double) {
            reducePoints /=2
        } else if (stateObj.single) {
            reducePoints -= 5
        }
        stateObj.intensity = stateObj.intensity - reducePoints
    }
    //safeguards from going cray cray
    if (stateObj.intensity < 500) {
        stateObj.intensity = 500
    }
    return stateObj.intensity
}

function recursiveTimeout(stateIntensity) {
    //dropElement(elementFunc,type,arr,obj,nameOfClass)
    //createElement = (type,arr,obj,nameOfClass)
    const strain = randomElementOfArray(state.currentStrains)
    // dropBall(strain)
    dropElement(createElement,strain,state.currentStrains,strainsObj,"ball")
    state.intensity = updateIntensity(strain,state)
    if(state.emergencyStop){
        console.log(`emergency stop used: ${stateIntensity}`)
    }else{
        console.log(stateIntensity)
        stateIntensity = state.intensity
        setTimeout(()=>recursiveTimeout(stateIntensity),stateIntensity)
    }
}


//state.currentStrains || state.currentPowerUps
function randomElementOfArray(arr) {
    const index = Math.floor(Math.random() * arr.length)
    return arr[index]
}

function updateGameParameters(stateObj) {
    stateObj.currentStrains = setStrains(stateObj)
    stateObj.currentPowerUps = setPowerUps(stateObj)
    stateObj.maxJabs = setJabs(stateObj)
    updateBar()
}

function setPowerUps(state) {
    const stateObj = {...state}
    const maskPoints = 500
    const lockdownPoints = 2000
    const vaccinePoints = 4000
    //vaccine
    if (stateObj.currentPoints >= vaccinePoints) {
        if (powerUpsArr.length > stateObj.currentPowerUps.length) {
            intervalsObj.vaccine = setInterval(()=>{
                    dropElement(createElement,"vaccine",powerUpsArr,powerUpsObj,"power-up")
                    },powerUpsObj.vaccine.reocurrance)
            stateObj.currentPowerUps = [...powerUpsArr]
            console.log(`all powerups enabled`)
            console.log(stateObj.currentPowerUps)
            dropElement(createElement,"vaccine",powerUpsArr,powerUpsObj,"power-up")
        }
    }
    //lockdown
    else if (stateObj.currentPoints >= lockdownPoints) {
        if ([...powerUpsArr.slice(0, 2)].length > stateObj.currentPowerUps.length) {
            stateObj.currentPowerUps = [...powerUpsArr.slice(0, 2)]
            intervalsObj.lockdown = setInterval(()=>{
                    dropElement(createElement,"lockdown",powerUpsArr,powerUpsObj,"power-up")
                    },powerUpsObj.lockdown.reocurrance)
            console.log(`lockdowns enabled`);
            console.log(stateObj.currentPowerUps)
            dropElement(createElement,"lockdown",powerUpsArr,powerUpsObj,"power-up")
        }
    } else if (stateObj.currentPoints >= maskPoints) {
        //will run only once
        if ([...powerUpsArr.slice(0, 1)].length > stateObj.currentPowerUps.length) {
            stateObj.currentPowerUps = [...powerUpsArr.slice(0, 1)]
            intervalsObj.mask = setInterval(()=>{
                    dropElement(createElement,"mask",powerUpsArr,powerUpsObj,"power-up")
                    },powerUpsObj.mask.reocurrance)
            console.log(`masks enabled`);
            console.log(stateObj.currentPowerUps)
            dropElement(createElement,"mask",powerUpsArr,powerUpsObj,"power-up")
        }
        
    } else {
        console.log(`too little points or something went wrong`)
        console.log(stateObj)
    }
    createLis(domPowerUpsList,stateObj.currentPowerUps,)
    return stateObj.currentPowerUps
}

function setJabs(state) {
    const stateObj = {...state}
    const singleJabPoints = powerUpsObj.single.treshold;
    const doubleJabPoints = powerUpsObj.double.treshold;
    const boosterJabPoints = powerUpsObj.booster.treshold;
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
    const alphaPoints = 1000;
    const betaPoints = 2000;
    const gammaPoints = 4000;
    const deltaPoints = 5000;
    const omicronPoints = 8000;
    //omicron
    if (stateObj.currentPoints >= omicronPoints) {
        if(strainsArr.length>stateObj.currentStrains.length){
            stateObj.currentStrains = [...strainsArr]
            console.log(stateObj.currentStrains, `currentStrains`)
            console.log(`omicron enabled`)
        }
    }
    // delta
    else if (stateObj.currentPoints >= deltaPoints) {
        if(strainsArr.slice(0, 5).length>stateObj.currentStrains.length){
            stateObj.currentStrains = [...strainsArr.slice(0, 5)]
            console.log(stateObj.currentStrains, `currentStrains`)
            console.log(`delta enabled`)
        }
    }
    // gamma
    else if (stateObj.currentPoints >= gammaPoints) {
        if(strainsArr.slice(0,4)>stateObj.currentStrains.length){
            stateObj.currentStrains = [...strainsArr.slice(0, 4)]
            console.log(stateObj.currentStrains, `currentStrains`)
            console.log(`gamma enabled`)
        }
    }
    // beta
    else if (stateObj.currentPoints >= betaPoints) {
        if(strainsArr.slice(0, 3)>stateObj.currentStrains){
            stateObj.currentStrains = [...strainsArr.slice(0, 3)]
            console.log(stateObj.currentStrains, `currentStrains`)
            console.log(`beta enabled`)
        }
    }
    //alpha
    else if (stateObj.currentPoints >= alphaPoints) {
        if(strainsArr.slice(0, 2).length>stateObj.currentStrains.length){
            stateObj.currentStrains = [...strainsArr.slice(0, 2)]
            console.log(stateObj.currentStrains, `currentStrains`)
            console.log(`alpha enabled`)
        }
    } else {
        console.log(`too little points or something went wrong`)
        console.log(stateObj)
    }
    createLis(domStrainsList,stateObj.currentStrains,)
    return stateObj.currentStrains
}

function createLis(parentElement, elementType) {
    if (parentElement.children.length !== elementType.length) {
        elementType.forEach(item => {
            if (!parentElement.querySelector(`.${item}`)) {
                const li = document.createElement("li")
                li.innerText = item[0].toUpperCase()+item.slice(1)
                li.classList.add(item);
                parentElement.appendChild(li)
            }
        })
    }
}

//ball is falling too random atm - need to limit possibility to /screen from previous ball
//new func take prev drop location - set range to 2/screen - if left range out of screen ->add extra range to the right-same on the right
function elementLocation(area, elementWidth) {
    const location = Math.floor(Math.random() * playArea.width) + 1
    // console.log(location, `location`)
    // console.log(area, `area`)
    // console.log(elementWidth,`elementWidth`)
    if (location + elementWidth > area) {
        return location - elementWidth
    }
    return location
}


function createElement(type,arr,obj,nameOfClass) {
    if (arr.includes(type)) {
        const domElement = document.createElement("div")
        const domElementSize = parseInt(playArea.width / 30)*obj[type].size;
        obj[type].enhancements.forEach(enhancement => domElement.classList.add(enhancement));
        domElement.style.height = domElementSize + "px"
        domElement.style.width = domElementSize + "px"
        domElement.classList.add(nameOfClass);
        domElement.style.left = elementLocation(playArea.width, domElementSize) + "px"
        gameField.appendChild(domElement)
        return domElement
    } else { console.log("something went wrong", strain) }
    
}

function recursiveTimeout(stateIntensity) {
    //dropElement(elementFunc,type,arr,obj,nameOfClass)
    //createElement = (type,arr,obj,nameOfClass)
    const strain = randomElementOfArray(state.currentStrains)
    // dropBall(strain)
    dropElement(createElement,strain,state.currentStrains,strainsObj,"ball")
    state.intensity = updateIntensity(strain,state)
    if(state.emergencyStop){
        console.log(`emergency stop used: ${stateIntensity}`)
    }else{
        console.log(stateIntensity)
        stateIntensity = state.intensity
        setTimeout(()=>recursiveTimeout(stateIntensity),stateIntensity)
    }
}

function reqAnimationDelay(stateIntensity){
    const strain = randomElementOfArray(state.currentStrains)

    let start, nextDrop

    function spawn(timestamp){
        if(!start){
            start = timestamp
        }
        if(!nextDrop){
            nextDrop = state.intensity
        }
        timepassed = timestamp - start

        if(timepassed>nextDrop){
            nextDrop=timepassed+state.intensity
            dropElement(createElement,strain,state.currentStrains,strainsObj,"ball")
            state=state
            if(state.intensity<400){
                state.intensity=400
            }
        }
        
        
        
    //condition to continue
        if(!state.gameWon||!state.gameLost){
            requestAnimationFrame(spawn)
        }
    }
    window.requestAnimationFrame(spawn)
}

//elementFunc -  creates ball or powerup | type - strain or type of powerup
//createElement("mask",powerUpsArr,powerUpsObj,"power-up")
function dropElement(elementFunc,type,arr,obj,nameOfClass) {
    const domElement = elementFunc(type,arr,obj,nameOfClass);
    let start
    //needs to be refactored for element
    const speed = parseFloat(0.05 * obj[type].speed).toFixed(4);

    function step(timestamp) {
        if (start === undefined) {
            start = timestamp;
        }
        const elapsed = timestamp - start;

        const height = elapsed * speed

        //need to rename to collisionPoint
        let barHeight = playArea.collisionPoint
        let elementHeight = parseInt(domElement.style.height)
        //ball height
        let elementToBarCollisionPoint = playArea.height - barHeight + elementHeight
        // console.log(elementToBarCollisionPoint,`elementToBarCollisionPoint`)
        // let elementToBarCollisionPoint = parseInt(playArea.height - barHeight + elementHeight);
        //ball to bar collision point offset by ball height
        //level at which the actual collision point is between bar and ball offset by its height
        const barCollisionPoint = gameField.scrollHeight - elementToBarCollisionPoint
        // console.log(barCollisionPoint,`barcollisionpoint`)
        domElement.style.top = height + "px";
        
        //checks for collision and increases the score
        if (Math.abs(height - barCollisionPoint) < 1) {
            if (arr.includes("ancestral")) {
                if (collisionCheck(domElement, bar)) {
                    updateScores(state, type, domElement)
                } else {
                    updateInfections(state, type, domElement)
                }
            } else if (!arr.includes("ancestral")) {
                if (collisionCheck(domElement, bar)){
                    setPowerUpTimeOut(domElement.classList[0])
                }
            }
            updateGameParameters(state)
            setTimeout(()=>domElement.remove(),500)
            }        
        else if(height<barCollisionPoint){
            window.requestAnimationFrame(step);
            }
        }
    window.requestAnimationFrame(step)
}

function updateScores(state,strain,ball) {
    // const stateObj = { ...state }
    const points = addBonusPoints(strain,state,powerUpsObj)
    state.currentPoints += points
    ball.innerText = points
    ball.style.backgroundColor = "green";
    domCurrentPoints.innerText = state.currentPoints
}
function updateInfections(state,strain,ball) {
    // const stateObj = { ...state }
    state.currentInfections += strainsObj[strain].damagePoints
    ball.innerText = strainsObj[strain].damagePoints
    ball.style.backgroundColor = "red";
    domCurrentInfections.innerText = state.currentInfections
}


function collisionCheck (element,bar){
    const elementLocation = {
        left:element.offsetLeft,
        right:element.offsetLeft+element.offsetWidth
    }
    const barLocation = {
        left:bar.offsetLeft,
        right:bar.offsetLeft+bar.offsetWidth
    }
    const withinBar = (barLocation.left<elementLocation.right && barLocation.right>elementLocation.left)

    return withinBar
}

function executeCheatCode(cheatcode){
    console.log(cheatcode)
    switch(cheatcode){
        case "ienjoycheating":
            ienjoycheating();
            break;
        case "fairplayforall":
            fairplayforall();
            break;
        case "iwantmyfreedom":
            iwantmyfreedom();
            break;
        case "doitfortheteam":
            doitfortheteam();
            break;
        case "iwantitovernow":
            iwantitovernow();
            break;
        default:
            console.log("no code")
    }
}
function ienjoycheating(){
    setCheatBar()
    updateBar()
}
function fairplayforall(){
    clearCheatBar()
    updateBar()
}
function iwantmyfreedom(){
    state.cheats.powerUps.old = [...state.currentPowerUps];
    state.currentPowerUps = [...state.cheats.powerUps.empty]
}
function doitfortheteam(){
    //sets powerups to default
    state.currentPowerUps = [...state.cheats.powerUps.old]
}

function iwantitovernow(){
    //stop game
    //display win screen
}

//NEEDTOREMOVECONSOLELOG
//
//adds pressedbutton to cheat arr
function addLetterToCheatCodeArr(letter){
    if(state.cheatCodeArr.length<14){
        //adds letter to the array
        state.cheatCodeArr=[...state.cheatCodeArr,letter]
        //test
        if(state.cheatCodeArr.length==14){
            if(state.cheatcodes.includes(state.cheatCodeArr.join(""))){
                executeCheatCode(state.cheatCodeArr.join(""))
            }
            
            //function to execute cheatcode with switch statement
        }
    }else if(state.cheatCodeArr.length==14){
        //discards first letter, adds current letter to cheatcode array
        state.cheatCodeArr = [...state.cheatCodeArr.slice(1),letter]
        //checks if cheatcodecriteria has been met
        if(state.cheatcodes.includes(state.cheatCodeArr.join(""))){
            executeCheatCode(state.cheatCodeArr.join(""))
        }
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

function initiatePlayArea (){
    const gameField = document.querySelector(".game-field");
    playArea.height = gameField.scrollHeight,
    playArea.width = gameField.scrollWidth,
    playArea.collisionPoint = parseInt(gameField.scrollHeight/100*90)
}
function initiateBar() {
    //when used "px" needs to be added
    barObject.width = Math.round(playArea.width / 5);
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

// recursiveTimeout()
