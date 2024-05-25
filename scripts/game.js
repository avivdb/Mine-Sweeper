var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
}
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gBestScore = {
    easy: Infinity,
    medium: Infinity,
    expert: Infinity
}
var gNumCellClick = 0
var gBoard = []
var gBoards
var gGameHistory = [];
var gMinePositions = []
var gNumToShow = gLevel.SIZE ** 2 - gLevel.MINES
var gNegsToHide = []
var gIsMegaHint = false
var gIsHint = false;
var gNumMegaClicks = 0
var gMegaPos1
var gMegaPos2
var gMegaToHide = []
var gNumSafeClicks = 3
var gIsExterminator = false
var gIsCreate = false
var gIsAdd = false
const MINE = '💣'
const FLAG = '🏳️'

function onInit() {

    resetGame()

}

function saveGameState() {
    const gameState = {
        board: JSON.parse(JSON.stringify(gBoard)),
        game: JSON.parse(JSON.stringify(gGame)),
        numCellClick: gNumCellClick,
        minePositions: JSON.parse(JSON.stringify(gMinePositions)),
        shownCount: gGame.shownCount,
        markedCount: gGame.markedCount,
        lives: gGame.lives,
        numSafeClicks: gNumSafeClicks,
        megaHint: {
            isMegaHint: gIsMegaHint,
            megaPos1: gMegaPos1,
            megaPos2: gMegaPos2,
            megaToHide: JSON.parse(JSON.stringify(gMegaToHide)),
            numMegaClicks: gNumMegaClicks
        },
        hint: {
            isHint: gIsHint,
            negsToHide: JSON.parse(JSON.stringify(gNegsToHide))
        }
    };
    gGameHistory.push(gameState)
}

function saveBestScore() {

    if (gLevel.SIZE === 4) {
        if (elapsedTime < localStorage.getItem("bestscoreeasy")) {
            gBestScore.easy = elapsedTime
            localStorage.setItem("bestscoreeasy", gBestScore.easy);
        }
    } else if (gLevel.SIZE === 8) {
        if (elapsedTime < localStorage.getItem("bestscoremedium")) {
            gBestScore.medium = elapsedTime
            localStorage.setItem("bestscoremedium", gBestScore.medium);
        }
    } else if (gLevel.SIZE === 12) {
        if (elapsedTime < localStorage.getItem("bestscoreexpert")) {
            gBestScore.expert = elapsedTime
            localStorage.setItem("bestscoreexpert", gBestScore.expert);
        }
    }

}

function loadBestScore() {

    if (localStorage.getItem("bestscoreeasy") === null) {
        localStorage.setItem("bestscoreeasy", Infinity);
    }
    if (localStorage.getItem("bestscoremedium") === null) {
        localStorage.setItem("bestscoremedium", Infinity);
    }
    if (localStorage.getItem("bestscoreexpert") === null) {
        localStorage.setItem("bestscoreexpert", Infinity);
    }
    if (gLevel.SIZE === 4)
        document.getElementById("best-score").innerHTML = localStorage.getItem("bestscoreeasy");
    else if (gLevel.SIZE === 8)
        document.getElementById("best-score").innerHTML = localStorage.getItem("bestscoremedium");
    else if (gLevel.SIZE === 12)
        document.getElementById("best-score").innerHTML = localStorage.getItem("bestscoreexpert");

}

function gameOver() {

    gGame.lives--
    renderLives()
    if (gGame.lives > 0) return
    gGame.isOn = false
    for (var i = 0; i < gMinePositions.length; i++) {
        var pos = gMinePositions[i]
        gBoard[pos.i][pos.j].isShown = true
        renderCell(pos, MINE)
    }
    stopWatch()
    renderSmiley('😵')

}

function checkGameOver() {

    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === gNumToShow) {
        stopWatch()
        renderSmiley('😁')
        saveBestScore()
    }

}

function setLevel(lvl) {

    stopWatch()
    resetWatch()
    document.getElementById("display").textContent = (0).toFixed(3)
    switch (lvl) {
        case 'beginner':
            gLevel.SIZE = 4
            gLevel.MINES = 2
            onInit()
            break
        case 'medium':
            gLevel.SIZE = 8
            gLevel.MINES = 14
            onInit()
            break
        case 'expert':
            gLevel.SIZE = 12
            gLevel.MINES = 32
            onInit()
            break
    }

}

function resetGame() {

    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3
    }
    gBoard = []
    gMinePositions = []
    gGame.isOn = true
    gNumToShow = gLevel.SIZE ** 2 - gLevel.MINES
    gNumCellClick = 0
    gNumMegaClicks = 0
    gGameHistory = []
    gNumSafeClicks = 3
    gBoard = buildBoard()
    resetWatch()
    renderBoard(gBoard)
    stopWatch()
    renderLives()
    renderSmiley('😀')
    loadBestScore()
    renderSafeClick()
    resetCreateButton()
    resetHints()
    saveGameState()

}

function renderLives() {

    elLives = document.querySelector(".lives")
    var str = ''
    for (var i = 0; i < gGame.lives; i++) {
        str += '❤️'
    }
    elLives.innerText = str
}

function renderSmiley(smiley) {
    var elSmiley = document.querySelector(".smiley")
    elSmiley.innerHTML = `<span onclick="onInit()">${smiley}</span>`
}

