function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInteger(min, max) {
    var numRange = max - min + 1; // range of allowed numbers
    return Math.floor(Math.random() * numRange) + min; // shift by min value
}

function timeFormatter(timeInMilliseconds) {
    var time = new Date(timeInMilliseconds);
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var milliseconds = time.getMilliseconds().toString();

    if (minutes.length < 2) {
        minutes = '0' + minutes;
    }

    if (seconds.length < 2) {
        seconds = '0' + seconds;
    }

    while (milliseconds.length < 3) {
        milliseconds = '0' + milliseconds;
    }

    return minutes + ' : ' + seconds;

}