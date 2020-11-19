'use strict';

var gMineField;
var gMinesPlaces = [];

const gLevel = [
    { SIZE: 4, MINES: 2 },
    { SIZE: 8, MINES: 12 },
    { SIZE: 12, MINES: 30 }
]
var gLevelSizeChecked = gLevel[0].SIZE;
var gLevelMineChecked = gLevel[0].MINES;
var gTimerIntervalId;
var gTimerOn = false;
var gTimer;
var gMineFieldCells = gLevelSizeChecked * gLevelSizeChecked;
var gShownCount = 0;

const MINE_IMG = '<img src="images/mine2.png" alt="o">'
const FLAG_IMG = '<img src="images/flag2.png" alt="1">'

var gDifficult;

const colors = ['rgb(87, 87, 95)', 'rgb(255, 212, 71)', 'rgb(255, 169, 71)', 'rgb(255, 99, 71)', 'rgb(243, 74, 44)', 'rgb(116, 33, 18)', ' rgb(66, 26, 19)', ' rgb(34, 22, 20)']

// each cell {
//  minesAroundCount: 4,
//  isShown: true,
//  isMine: false,
//  isMarked: true
// }

// function print(event) {
//     // event.cancelBubble = false;
//     console.log('Event:', event);
// }

function initGame() {
    buildMineField();
    placeMines(gMineField);
    implementMinesAroundCount(gMineField);
}


//create matrix mineFiled and render it
function buildMineField() {
    gMineField = createMineField(gLevelSizeChecked, gLevelSizeChecked);
    renderMineField(gMineField);
}

function createMineField(ROWS, COLS) { //create mat with object
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push({
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            })
        }
        mat.push(row)
    }
    return mat
}


function placeMines(mineField) {
    var mineCount = 0;
    while (mineCount !== gLevelMineChecked) { //Build array with randoms positions for mines
        var cellI = getRandomInteger(0, gLevelSizeChecked - 1)
        var cellJ = getRandomInteger(0, gLevelSizeChecked - 1)
        var minePos = { i: cellI, j: cellJ }
        var isMineAlready = false;
        for (var i = 0; i < gMinesPlaces.length; i++) {
            if (gMinesPlaces[i].i === minePos.i && gMinesPlaces[i].j === minePos.j) {
                isMineAlready = true;
            }
        }
        if (!isMineAlready) {
            gMinesPlaces.push(minePos)
            mineCount++;
        }
    }
    for (var i = 0; i < gMinesPlaces.length; i++) { //Implement the mines in the Model 
        var currPosI = gMinesPlaces[i].i;
        var currPosJ = gMinesPlaces[i].j;
        mineField[currPosI][currPosJ].isMine = true;
        // var elCurrCell = document.querySelector(`[data-i="${currPosI}"][data-j="${currPosJ}"]`);
        // elCurrCell =
    }
    return mineField;
}


// function renderMineField(gMineField) {
//     var strHtml = '';
//     for (var i = 0; i < gMineField.length; i++) {
//         strHtml += '<tr>'
//         for (var j = 0; j < gMineField[0].length; j++) {
//             strHtml += `<td onclick="cellClicked(this,${i},${j})" >`
//             if (gMineField[i][j].isMine && gMineField[i][j].isShown)
//                 strHtml += MINE_IMG
//         }
//         strHtml += '</td></tr>'
//     }

//     var elMineField = document.querySelector('.mineField')
//     elMineField.innerHTML = strHtml
// }




function renderMineField(gMineField) {
    var strHtml = '';
    for (var i = 0; i < gMineField.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < gMineField[0].length; j++) {
            strHtml += `<td data-i="${i}" data-j="${j}" oncontextmenu="rightClick(this,${i},${j})" onclick="cellClicked(this,${i},${j})" ></td>`
        }
        strHtml += '</tr>'
    }
    // implementMinesAroundCount(gMineField)
    var elMineField = document.querySelector('.mineField')
    elMineField.innerHTML = strHtml
}


// oncontextmenu="rightClick(event , this)"


function cellClicked(clickedCell, i, j) {

    if (!gTimerOn) {
        gTimerOn = true;
        timer();
    }
    if (gMineField[i][j].isShown || gMineField[i][j].isMarked) return;
    if (gMineField[i][j].isMine) {
        // revealAllMines();
        clickedCell.innerHTML = MINE_IMG;
        clickedCell.style.backgroundColor = 'rgb(209, 35, 35)'
        gameOver();
        return;
    }
    if (gMineField[i][j].minesAroundCount === 0) { //empty cell
        clickedCell.style.backgroundColor = 'rgb(87, 87, 95)';
        gMineField[i][j].isShown = true;
        gShownCount++;
        revealNeighbors(i, j);
    }
    if (gMineField[i][j].minesAroundCount > 0) {
        clickedCell.style.backgroundColor = colors[gMineField[i][j].minesAroundCount];
        gMineField[i][j].isShown = true;
        clickedCell.innerText = gMineField[i][j].minesAroundCount;
        gShownCount++;
    }
    if (gShownCount === gMineFieldCells - gLevelMineChecked) { // implement flag --> gShown'+'MINES
        gameWin();
    }
}

function renderCell(i, j) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
        // if (gMineField[i][j].minesAroundCount === 0) {
        //     revealNeighbors(i, j);
        // }
    if (gMineField[i][j].minesAroundCount > 0) {
        elCell.innerText = gMineField[i][j].minesAroundCount;
    }
    elCell.style.backgroundColor = colors[gMineField[i][j].minesAroundCount];
    gMineField[i][j].isShown = true;
}

function minesAroundCountFunction(mat, pos) { //mines -> not array
    var count = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            if (mat[i][j].isMine) count++
        }
    }
    return count
}

function revealNeighbors(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > gMineField.length - 1) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > gMineField[0].length - 1) continue
            if (i === cellI && j === cellJ) continue
            if (!gMineField[i][j].isMine) {
                if (!gMineField[i][j].isShown) {
                    gShownCount++;
                }
                renderCell(i, j);
            }
        }
    }
}



// function rightClick(event, cell) {
//     console.log(cell);
// }

// function getBoardSize() {
//     var elInputs = document.querySelectorAll('input');
//     for (var i = 0; i < elInputs.length; i++) {
//         if (elInputs[i].checked) {
//             var currLength = elInputs[i].value;
//         }
//     }
// gDifficult = currLength;
// }

function implementMinesAroundCount(mineField) {
    for (var i = 0; i < mineField.length; i++) {
        for (var j = 0; j < mineField[0].length; j++) {
            var currMinesAround = minesAroundCountFunction(mineField, { i: i, j: j }) //mines -> not array
                // console.log('i:' + i + ' j: ' + j + ' minesAround: ' + currMinesAround);
            mineField[i][j].minesAroundCount = currMinesAround;
        }

    }
}


// function rightClick(elbtn, i, j) {
//     oncontextmenu = "return false;"
// }


function timer() {
    var currTime = Date.now();
    var elTimer = document.querySelector('.timer');
    gTimerIntervalId = setInterval(function() {
        gTimer = Date.now() - currTime;
        elTimer.innerText = gTimer / 1000;
    }, 100)
}

function gameOver() {
    // revealAllMines(mineField);
    var elGameOver = document.querySelector('.gameOver');
    elGameOver.style.display = 'block';
    var elTime = document.querySelector('.time');
    elTime.innerText = timeFormatter(gTimer);
    gShownCount = 0;
    newTimer();
}

function gameWin() {
    var elGameWin = document.querySelector('.gameWin');
    elGameWin.style.display = 'block';
    var elTime = document.querySelector('.time');
    elTime.innerText = timeFormatter(gTimer);
    gShownCount = 0;
    newTimer();
}

function newTimer() {
    clearInterval(gTimerIntervalId);
    gTimerOn = false;
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '00:00'
}

function revealAllMines(mineField) {
    for (var i = 0; i < gMinesPlaces.length; i++) {

    }
}

function restartGame() {
    var elGameOver = document.querySelector('.gameOver');
    elGameOver.style.display = 'none';
    var elGameWin = document.querySelector('.gameWin');
    elGameWin.style.display = 'none';
    gShownCount = 0;
    newTimer();
    gMinesPlaces = [];
    initGame();
}