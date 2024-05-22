'use strict'
var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
const SIZE = gLevel.SIZE
const MINE = '💣'
const EMPTY = ' '



function onInit() {
    gGame = {
        score: 0,
        isOn: true,
        isVictory: false,
    }

    gBoard = buildBoard()
    addMines(2)
    setMinesNegsCount(gBoard)

    console.log('gBoard:', gBoard)
    renderBoard(gBoard)

}

function buildBoard() {
    const board = []

    for (var i = 0; i < SIZE; i++) {
        board.push([])

        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                location: { i: i, j: j },
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                // isMarked: false
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

            strHTML += `<td onclick="onCellClicked(this)" class="${className}"><span style="visibility:hidden" class="minesAroundCount">${cell}</span></td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function onCellClicked(elCell) {
    // if (!gGame.isOn) return
    // console.log('elCell:', elCell);
    var pos = getPosition(elCell)
    // console.log('pos:', pos);
    var cell = gBoard[pos.i][pos.j]
    // console.log('cell:', cell.minesAroundCount);
    if (cell.minesAroundCount === MINE) gameOver()

    const className = `cell cell-${pos.i}-${pos.j}`
    // console.log('className:', className);
    var strHTML = `<td  class="${className}"><span class="content">${cell.minesAroundCount}</span></td>`
    renderCell(pos, strHTML)
    cell.isShown = true
    // console.log('cell:', elCell);
}
function getPosition(elCell) {
    // console.log('elCell:', elCell);
    var list = elCell.classList
    // console.log('list:', list);
    var posStr = list[1]
    // console.log('posStr:', posStr);
    var posArr = posStr.split("-")
    // console.log('posArr:', posArr);
    var i = +posArr[1]
    var j = +posArr[2]
    var pos = { i, j }
    // console.log('pos:', pos);
    return pos
}
function addMines(numMines) {


    // console.log('pos:', pos);
    for (var i = 0; i < numMines; i++) {
        var pos = findEmptyPos(gBoard)
        gBoard[pos.i][pos.j].minesAroundCount = MINE
        gBoard[pos.i][pos.j].isMine = true

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
    console.log('gameover');
}
