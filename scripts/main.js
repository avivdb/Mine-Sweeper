'use strict'

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gBoard = []
var gMinePositions = []
const MINE = '💣'
const FLAG = '🏳️'
var NUM_TO_SHOW = gLevel.SIZE ** 2 - gLevel.MINES


function onInit() {
    gBoard = []
    gGame.isOn = true
    gBoard = buildBoard()
    addMines(gLevel.MINES)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)

}

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

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`
            strHTML += `<td onclick="onCellClicked(this)" oncontextmenu="flagMine(event)" class="${className}"><span style="visibility:hidden" class="minesAroundCount">${cell}</span></td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML

}

function renderCell(location, value) {

    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value

}

function onCellClicked(elCell) {

    if (!gGame.isOn) {
        return
    }

    var pos = getPosition(elCell)
    var cell = gBoard[pos.i][pos.j]

    if (cell.isMarked) return
    if (cell.minesAroundCount === MINE) gameOver()

    gGame.shownCount++
    checkGameOver()
    const className = `cell cell-${pos.i}-${pos.j}`
    var strHTML = `<td  class="${className}"><span class="content">${cell.minesAroundCount}</span></td>`
    renderCell(pos, strHTML)
    cell.isShown = true

}

function getPosition(elCell) {

    var list = elCell.classList
    var posStr = list[1]
    var posArr = posStr.split("-")
    var i = +posArr[1]
    var j = +posArr[2]
    var pos = { i, j }

    return pos

}

function addMines(numMines) {

    for (var i = 0; i < numMines; i++) {
        var pos = findEmptyPos(gBoard)
        gBoard[pos.i][pos.j].minesAroundCount = MINE
        gBoard[pos.i][pos.j].isMine = true
        gMinePositions.push(pos)

    }

}

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {

        for (var j = 0; j < board.length; j++) {
            var mineCount = countNegs(i, j, board)
            if (board[i][j].minesAroundCount === MINE) continue
            board[i][j].minesAroundCount = mineCount
            board[i][j].minesAroundCount = mineCount
        }

    }

}

function gameOver() {

    gGame.isOn = false
    for (var i = 0; i < gMinePositions.length; i++) {
        var pos = gMinePositions[i]
        gBoard[pos.i][pos.j].isShown = true
        renderCell(pos, MINE)
    }
    console.log('gameover');

}

function flagMine(event) {


    event.preventDefault()
    var cell = event.target
    var pos = getPosition(cell)

    if (event.button === 2) {

        const className = `cell cell-${pos.i}-${pos.j}`
        var cell = gBoard[pos.i][pos.j]
        var strHtml = `<td onclick="onCellClicked(this)" oncontextmenu="flagMine(event)" class="${className}"><span style="visibility:hidden" class="minesAroundCount">${cell}</span></td>`

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