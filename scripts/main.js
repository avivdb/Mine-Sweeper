'use strict'

function buildBoard() {

    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])

        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                location: { i: i, j: j },
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

        }
    }

    return board

}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j];
            const className = `cell cell-${i}-${j}`;
            var strHTMLCell = '';
            if (cell.isShown) {
                strHTMLCell = `<td class="${className}">${cell.isMine ? MINE : cell.minesAroundCount}</td>`;
            } else if (cell.isMarked) {
                strHTMLCell = `<td onclick="onCellClicked(this)" oncontextmenu="flagMine(event)" class="${className}">${FLAG}</td>`;
            } else {
                strHTMLCell = `<td onclick="onCellClicked(this)" oncontextmenu="flagMine(event)" class="${className}"></td>`;
            }
            strHTML += strHTMLCell;
        }
        strHTML += '</tr>';
    }
    const elContainer = document.querySelector('.board');
    elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function onCellClicked(elCell) {

    if (!gGame.isOn) return
    if (gIsHint) return
    if (gIsMegaHint) return

    if (gIsCreate) return


    var pos = getPosition(elCell)
    renderSmiley('😬')
    var cell = gBoard[pos.i][pos.j]

    if (gNumCellClick === 0) {

        if (!gIsAdd) addMines(gLevel.MINES, pos)
        setMinesNegsCount(gBoard)
        expandshown(pos.i, pos.j, gBoard)
        startWatch()
        setTimeout(() => {
            renderSmiley('😀')

        }, 130)
        removeCreateButton()


    }
    else {
        if (cell.isMarked || cell.isShown) return;
        if (cell.isMine) {
            gameOver()
            return
        }
        if (cell.minesAroundCount === 0) {
            expandshown(pos.i, pos.j, gBoard)
        } else {
            cell.isShown = true
            gGame.shownCount++
            const className = `cell cell-${pos.i}-${pos.j}`
            var strHTML = `<td class="${className}">${cell.minesAroundCount}</td>`

            renderCell(pos, strHTML)
        }
    }

    saveGameState()
    checkGameOver()
    setTimeout(() => {
        renderSmiley('😀')

    }, 130)
    gNumCellClick++
}

function expandshown(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === cellI && j === cellJ) continue

            var pos = { i: i, j: j }
            var cell = mat[i][j]
            if (!cell.isShown && !cell.isMarked && !cell.isMine) {
                cell.isShown = true
                gGame.shownCount++
                const className = `cell cell-${pos.i}-${pos.j}`
                var strHTML = `<td  class="${className}"><span class="content">${cell.minesAroundCount}</span></td>`
                renderCell(pos, strHTML)
                if (cell.minesAroundCount === 0) expandshown(i, j, mat)

            }

        }
    }

}

function addMines(numMines, firstClickPos) {
    var minesAdded = 0
    while (minesAdded < numMines) {
        var pos = findEmptyPos(gBoard, firstClickPos);
        if (!gBoard[pos.i][pos.j].isMine && (pos.i !== firstClickPos.i || pos.j !== firstClickPos.j)) {
            gBoard[pos.i][pos.j].minesAroundCount = MINE;
            gBoard[pos.i][pos.j].isMine = true;
            gMinePositions.push(pos);
            minesAdded++;

        }
    }
}

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {

        for (var j = 0; j < board.length; j++) {
            var mineCount = countNegs(i, j, board)
            if (board[i][j].minesAroundCount === MINE) continue
            board[i][j].minesAroundCount = mineCount
        }

    }

}

function flagMine(event) {


    event.preventDefault()
    var cell = event.target
    var pos = getPosition(cell)

    if (event.button === 2) {

        const className = `cell cell-${pos.i}-${pos.j}`
        var cell = gBoard[pos.i][pos.j]
        var strHtml = `<td onclick="onCellClicked(this)" oncontextmenu="flagMine(event)" class="${className}"><span style="visibility:hidden" class="minesAroundCount">${cell}</span></td>`
        if (cell.isShown || !gGame.isOn) return
        if (!cell.isMarked) {

            cell.isMarked = true
            gGame.markedCount++
            checkGameOver()
            renderCell(pos, FLAG)

        } else {

            cell.isMarked = false
            gGame.markedCount--
            renderCell(pos, strHtml)

        }
    }

}
