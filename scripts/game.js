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
var numCellClick = 0
var gBoard = []
var gMinePositions = []
const MINE = '💣'
const FLAG = '🏳️'
var NUM_TO_SHOW = gLevel.SIZE ** 2 - gLevel.MINES

function onInit() {
    resetGame()
    gBoard = buildBoard()
    console.table('gBoard:', gBoard);

    renderBoard(gBoard)

}

function gameOver() {
    gGame.lives--
    console.log('gGame.lives:', gGame.lives);
    if (gGame.lives !== 0) return
    gGame.isOn = false
    for (var i = 0; i < gMinePositions.length; i++) {
        var pos = gMinePositions[i]
        gBoard[pos.i][pos.j].isShown = true
        renderCell(pos, MINE)
    }
    console.log('gameover');

}

function checkGameOver() {

    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === NUM_TO_SHOW) {
        console.log('you won');
    }
}

function setLevel(lvl) {
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
    numCellClick = 0

}