'use strict';

var gMineField;
var gMinesPlaces = [];

const MINE_IMG = '<img src="images/mine4.png" alt="o">'
const FLAG_IMG = '<img src="images/flag2.png" alt="1">'

var gDifficult;
const gLevel = [
    { SIZE: 4, MINES: 2 },
    { SIZE: 8, MINES: 12 },
    { SIZE: 12, MINES: 30 }
]

var colors = ['rgb(87, 87, 95)', 'rgb(255, 212, 71)', 'rgb(255, 169, 71)', 'rgb(255, 99, 71)', 'rgb(243, 74, 44)', 'rgb(116, 33, 18)', ' rgb(66, 26, 19)', ' rgb(34, 22, 20)']

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
    gMineField = createMineField(gLevel[1].SIZE, gLevel[1].SIZE);
    console.log(gMineField);
    renderMineField(gMineField);
    // gMineField[0][2].isMine = true;
    // gMineField[1][1].isMine = true;
    // gMineField[5][5].isMine = true;
    // gMineField[2][2].minesAroundCount = 2;
    // gMineField[3][3].minesAroundCount = 3;

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
    while (mineCount !== gLevel[1].MINES) { //Build array with randoms positions for mines
        var cellI = getRandomInteger(0, gLevel[1].SIZE - 1)
        var cellJ = getRandomInteger(0, gLevel[1].SIZE - 1)
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


// data-i="${i}" data-j="${j}"


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


// function seriousRenderBoard(board) {
//     var strHtml = '';
//     for (var i = 0; i < board.length; i++) {
//         strHtml += '<tr>'
//         for (var j = 0; j < board[0].length; j++) {
//             strHtml += `<td 
//             onclick="cellClicked(this)"></td>`
//         }
//         strHtml += '</tr>'
//     }


//     // implementMinesAroundCount(board)

//     var elMineField = document.querySelector('.mineField')
//     elMineField.innerHTML = strHtml
// }

// function cellClicked(currCell) {
//     console.log('GG');
//     revealCell(currCell);
// }


function cellClicked(clickedCell, i, j) {
    // console.log(clickedCell, i, j);
    // console.log(gMineField[i][j].minesAroundCount);
    // console.log(clickedCell.className);
    if (gMineField[i][j].isShown || gMineField[i][j].isMarked) return;
    if (gMineField[i][j].isMine) { //function gameOver
        // revealAllMines();
        clickedCell.innerHTML = MINE_IMG;
        clickedCell.style.backgroundColor = 'rgb(209, 35, 35)'
        var elGameOver = document.querySelector('.gameOver');
        elGameOver.style.display = 'block';
        console.log('GameOver');
        return;
    }
    if (gMineField[i][j].minesAroundCount === 0) { //empty cell
        clickedCell.style.backgroundColor = 'rgb(87, 87, 95)';
        gMineField[i][j].isShown = true;
        revealNeighbors(i, j);
    }
    if (gMineField[i][j].minesAroundCount > 0) {
        clickedCell.style.backgroundColor = colors[gMineField[i][j].minesAroundCount];
        gMineField[i][j].isShown = true;
        clickedCell.innerText = gMineField[i][j].minesAroundCount;
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

function revealNeighbors(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > gMineField.length - 1) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > gMineField[0].length - 1) continue
            if (i === cellI && j === cellJ) continue
                // var currMinesAround = gMineField[i][j].minesAroundCount;
            if (!gMineField[i][j].isMine) {
                renderCell(i, j);
            }
            // if (gMineField[i][j].minesAroundCount === 0) {
            //     revealNeighbors(i, j)
            // }
        }
    }





    // var x = 5;
    // var y = 5;
    // var elCell = document.querySelector(`${x},${y}`);
    // console.log(elCell);
    // elCell.dataset.i
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