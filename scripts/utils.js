'use strict'
var startTime;
var elapsedTime = 0;
var timerInterval = null
var running = false;

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function countNegs(cellI, cellJ, mat) { // 7,0
    var NegsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === cellI && j === cellJ) continue

            if (mat[i][j].minesAroundCount === MINE) NegsCount++
        }
    }
    return NegsCount
}



function findEmptyPos(board, firstClickPos) {
    // console.log('gBoard:', gBoard);
    var emptyPoss = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (!cell.isMine && !(i >= firstClickPos.i - 1 && i <= firstClickPos.i + 1 && j >= firstClickPos.j - 1 && j <= firstClickPos.j + 1)) {
                var pos = { i: i, j: j }
                emptyPoss.push(pos)
            }
        }
    }
    if (emptyPoss.length === 0) return null;
    var randIdx = getRandomIntInclusive(0, emptyPoss.length - 1)
    var randPos = emptyPoss[randIdx]

    return randPos
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

function startWatch() {
    if (timerInterval) clearInterval(timerInterval);
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTime, 10);
    running = true;

}
function updateTime() {

    elapsedTime = Date.now() - startTime;
    document.getElementById("display").textContent = (elapsedTime / 1000).toFixed(3);
}
function stopWatch() {
    console.log('stop')
    running = false;
    clearInterval(timerInterval)
    timerInterval = null;
}

function resetWatch() {
    if (timerInterval) clearInterval(timerInterval);
    elapsedTime = 0
    startTime = 0
    // elapsedTime = 0;
    timerInterval = null
    running = false;

}