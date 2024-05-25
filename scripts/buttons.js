function getHint(elHint) {
    if (elHint.classList.contains('clicked-hint')) return
    elHint.classList.add('clicked-hint')
    gIsHint = true;
    const cells = document.querySelectorAll(".cell")
    cells.forEach(cell => {
        cell.addEventListener('click', hintClickedHandler)
    })

}

function hintClickedHandler(event) {
    elCell = event.target
    var pos = getPosition(elCell)


    revealNegs(pos.i, pos.j, gBoard)
    setTimeout(() => {
        hideNegs(gNegsToHide, gBoard)
    }, 1000)
    const cells = document.querySelectorAll(".cell")
    cells.forEach(cell => {
        cell.removeEventListener('click', hintClickedHandler)
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

function undo() {

    if (gGameHistory.length > 1) {
        gGameHistory.pop();
        var lastState = gGameHistory[gGameHistory.length - 1];
        gBoard = lastState.board;
        gGame = lastState.game;
        gNumCellClick = lastState.numCellClick;
        gMinePositions = lastState.minePositions;
        gGame.shownCount = lastState.shownCount;
        gGame.markedCount = lastState.markedCount;
        gGame.lives = lastState.lives;
        gNumSafeClicks = lastState.numSafeClicks;
        gIsMegaHint = lastState.megaHint.isMegaHint;
        gMegaPos1 = lastState.megaHint.megaPos1;
        gMegaPos2 = lastState.megaHint.megaPos2;
        gMegaToHide = lastState.megaHint.megaToHide;
        gNumMegaClicks = lastState.megaHint.numMegaClicks;
        gIsHint = lastState.hint.isHint;
        gNegsToHide = lastState.hint.negsToHide;
        renderLives();
        renderBoard(gBoard);
        renderSafeClick();
    } else if (gGameHistory.length === 1) {
        resetGame()
    }

}

function getMegaHint() {

    if (gNumMegaClicks > 1) return
    gIsMegaHint = true;
    const cells = document.querySelectorAll(".cell")
    cells.forEach(cell => {
        cell.addEventListener('click', megaHintClickedHandler)
    })

}

function megaHintClickedHandler(event) {

    elCell = event.target
    var pos = getPosition(elCell)
    if (gNumMegaClicks === 0) {
        gMegaPos1 = pos
    }
    else if (gNumMegaClicks === 1) {
        gMegaPos2 = pos
        revealMegaHint(gMegaPos1, gMegaPos2, gBoard)
        setTimeout(() => {
            hideMega(gMegaToHide, gBoard)
        }, 2000)
        gIsMegaHint = false
        const cells = document.querySelectorAll(".cell")
        cells.forEach(cell => {
            cell.removeEventListener('click', megaHintClickedHandler)
        })
    }
    gNumMegaClicks++

}

function revealMegaHint(gMegaPos1, gMegaPos2, mat) {

    var iTop = (gMegaPos1.i > gMegaPos2.i) ? gMegaPos1.i : gMegaPos2.i
    var iBottom = (gMegaPos1.i > gMegaPos2.i) ? gMegaPos2.i : gMegaPos1.i
    var jTop = (gMegaPos1.j > gMegaPos2.j) ? gMegaPos1.j : gMegaPos2.j
    var jBottom = (gMegaPos1.j > gMegaPos2.j) ? gMegaPos2.j : gMegaPos1.j

    for (var i = iBottom; i <= iTop; i++) {
        for (var j = jBottom; j <= jTop; j++) {
            var cell = mat[i][j]
            if (!cell.isShown) {
                gMegaToHide.push(cell.location)
            }
            const className = `cell cell-${i}-${j}`
            var strHTML = `<td  class="${className}"><span class="content">${cell.minesAroundCount}</span></td>`
            renderCell({ i, j }, strHTML)
        }
    }

}

function hideMega(cellsPoss, mat) {

    for (var i = 0; i < cellsPoss.length; i++) {
        var posI = cellsPoss[i].i
        var posJ = cellsPoss[i].j
        var cell = mat[posI][posJ]
        cell.isShown = false;
        const className = `cell cell-${posI}-${posJ}`
        var strHTML = `<td onclick="onCellClicked(this)" oncontextmenu="flagMine(event)" class="${className}"><span style="visibility:hidden" class="minesAroundCount">${cell}</span></td>`
        renderCell(cellsPoss[i], strHTML)
    }
    gMegaToHide = []

}

function safeClick() {

    if (gNumSafeClicks === 0) return
    var safePoss = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isShown && !cell.isMine && !cell.isMark) {
                safePoss.push(cell.location)
            }
        }
    }
    var safePos = safePoss[getRandomIntInclusive(0, safePoss.length - 1)]
    var elCell = document.querySelector(`.cell-${safePos.i}-${safePos.j}`)
    elCell.classList.add('mark')
    setTimeout(() => {
        elCell.classList.remove('mark')
    }, 3000)
    gNumSafeClicks--
    renderSafeClick()

}

function renderSafeClick() {

    document.querySelector(".num-safe-clicks").innerHTML = gNumSafeClicks
    
}

function exterminator() {

    for (var i = 0; i < 3; i++) {
        var randPos = getRandomIntInclusive(0, gMinePositions.length - 1)
        var minePos = gMinePositions[randPos]
        gBoard[minePos.i][minePos.j].isMine = false
        gBoard[minePos.i][minePos.j].minesAroundCount = 0
        gLevel.MINES--
        gMinePositions.splice(randPos, 1)
        gNumToShow = gLevel.SIZE ** 2 - gLevel.MINES
    }
    setMinesNegsCount(gBoard)

}

function createManually() {

    var elCreate = document.querySelector(".create-button")
    if (!gIsCreate) {
        elCreate.classList.add('create-clicked')
        elCreate.innerHTML = 'Play'
        const cells = document.querySelectorAll(".cell")
        cells.forEach(cell => {
            cell.addEventListener('click', createClickedHandler)
        })
        gIsCreate = true
        gLevel.MINES = 0
    }
    if (gIsAdd) {
        removeCreateButton()
        const cells = document.querySelectorAll(".cell")
        cells.forEach(cell => {
            cell.removeEventListener('click', createClickedHandler)
        })
        gIsCreate = false
    }
    gIsAdd = true

}

function createClickedHandler(event) {

    var elCell = event.target
    var pos = getPosition(elCell)
    gBoard[pos.i][pos.j].minesAroundCount = MINE;
    gBoard[pos.i][pos.j].isMine = true;
    gMinePositions.push(pos);
    gLevel.MINES++
    gNumToShow = gLevel.SIZE ** 2 - gLevel.MINES

}

function removeCreateButton() {

    var elCreate = document.querySelector(".create-button")
    elCreate.classList.remove('create-clicked')
    elCreate.classList.add('button-done')
    elCreate.innerHTML = ''
    elCreate.removeAttribute('onClick')

}

function resetCreateButton() {

    var elCreate = document.querySelector(".create-button")
    elCreate.classList.remove('create-clicked', 'button-done')
    elCreate.innerHTML = 'Manually Create'
    elCreate.setAttribute('onclick', 'createManually()')
    gIsCreate = false
    gIsAdd = false

}