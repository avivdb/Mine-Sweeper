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

gIsHint = false;
var gNegsToHide = []
var gBestScore = Infinity

function onInit() {
    resetGame()
    resetWatch()
    resetHints()
    gBoard = buildBoard()
    console.table('gBoard:', gBoard);
    // document.getElementById("result").innerHTML = localStorage.getItem("bestscore");
    renderBoard(gBoard)

}

function gameOver() {
    gGame.lives--
    console.log('gGame.lives:', gGame.lives);
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
    console.log('gameover');
}

function checkGameOver() {

    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === NUM_TO_SHOW) {
        console.log('you won');
        stopWatch()
        renderSmiley('😁')
        if (elapsedTime < gBestScore) {
            gBestScore = elapsedTime
            localStorage.setItem("bestscore", gBestScore);
        }
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

    stopWatch()
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
    renderLives()
    renderSmiley('😀')

}
function renderLives() {
    elLives = document.querySelector(".lives")
    console.log('elLives:', elLives);
    var str = ''
    for (var i = 0; i < gGame.lives; i++) {
        str += '❤️'
    }
    elLives.innerText = str
}

function getHint(elHint) {
    // console.log('elHint:', elHint);
    if (elHint.classList.contains('clicked-hint')) return
    elHint.classList.add('clicked-hint')
    gIsHint = true;
    const cells = document.querySelectorAll(".cell")
    cells.forEach(cell => {
        cell.addEventListener('click', hintclickedHandler)
    })

}

function hintclickedHandler(event) {
    elCell = event.target
    var pos = getPosition(elCell)
    console.log('elCell:', elCell);
    console.log('pos:', pos);
    revealNegs(pos.i, pos.j, gBoard)
    setTimeout(() => {
        hideNegs(gNegsToHide, gBoard)
    }, 1000)
    const cells = document.querySelectorAll(".cell")
    cells.forEach(cell => {
        cell.removeEventListener('click', hintclickedHandler)
    })
    gIsHint = false
}

function revealNegs(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            var cell = mat[i][j]
            if (!cell.isShown) {
                cell.isShown = true;
                gNegsToHide.push({ i, j })
            }
            const className = `cell cell-${i}-${j}`
            var strHTML = `<td  class="${className}"><span class="content">${cell.minesAroundCount}</span></td>`
            renderCell({ i, j }, strHTML)
        }
    }


}

function hideNegs(cellsPoss, mat) {

    for (var i = 0; i < gNegsToHide.length; i++) {
        var posI = cellsPoss[i].i
        var posJ = cellsPoss[i].j
        var cell = mat[posI][posJ]
        cell.isShown = false;
        const className = `cell cell-${posI}-${posJ}`
        var strHTML = `<td onclick="onCellClicked(this)" oncontextmenu="flagMine(event)" class="${className}"><span style="visibility:hidden" class="minesAroundCount">${cell}</span></td>`
        renderCell(cellsPoss[i], strHTML)
    }
    gNegsToHide = []
}

function resetHints() {
    var elhints = document.querySelector(".hints")
    var strHTML = `<span onclick="getHint(this)" class="hint hint1">💡</span><span onclick="getHint(this)"
    class="hint hint2">💡</span><span onclick="getHint(this)" class="hint hint3">💡</span>`
    elhints.innerHTML = strHTML

}