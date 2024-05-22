'use strict'

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



function findEmptyPos(gBoard) {
    // console.log('gBoard:', gBoard);
    var emptyPoss = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            // console.log('cell:', cell);
            if (cell.minesAroundCount === 0) {
                // console.log('empty');
                var pos = { i: i, j: j }
                emptyPoss.push(pos)
            }
        }
    }
    var randIdx = getRandomIntInclusive(0, emptyPoss.length)
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