/*
* Basic game settings and initilizing variables and consts
*/
let origBoard = []; //an array that keeps track of what's in each square: X, O or nothing
const player1 = 'O';
const player2 = 'X';
let playerPlaying = false;
const winCombos = [
    //* Array thats gonna show winning combinations
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];
//* cells variable is going to store a reference to each element that has a class 'cell'
const cells = document.querySelectorAll('.cell');

//* Function to start the game and setup initial variables (it will also run when clicking on the "Replay" button)
function initGame() {
    //* make the array every number from 0-9
    //* simple for loop to fill the empty array
    for (let i = 0; i < 9; i++) {
        origBoard.push(i);
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = ''; //* there will be nothing in the cell
        cells[i].style.removeProperty('background-color'); //* removing the background color
        //* calling the turnClick function
        //* Listening for a event to happen (clicking the cell of the table)
        cells[i].addEventListener('click', turnClick, false);
    }
}

//* Defining the turnClick funtion (what should happen when player click the cell)
function turnClick(square) {
    //* if id that was just clicked is a number, that means no one played in this spot
    if (typeof origBoard[square.target.id] === 'number') {
        //* square.target.id is the id we assigned to the table cells
        //* Calling turn function and passing the two arguments (squareId, player)
        if (!checkTie()) {
            if (playerPlaying) {
                turn(square.target.id, player1);
                playerPlaying = false;
            } else {
                turn(square.target.id, player2);
                playerPlaying = true;
            }
        }
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    //* updating the display so we can see where player clicked
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) {
        gameOver(gameWon);
    }
}

function checkWin(board, player) {
    //* finding every index that the player has played
    let plays = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === player) {
            plays.push(i);
        }
    }
    let gameWon = null;
    //* checking if the game has been won by looping through every winCombos
    for (let [index, win] of winCombos.entries()) {
        //* has the player played in every spot that counts as a win for that win
        if (win.every((elem) => plays.indexOf(elem) > -1)) {
            //* which win combo the player won at & which player had won
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}


//* Defining gameOver function
function gameOver(gameWon) {
    //* going through every index of the WinCombos
    for (let index of winCombos[gameWon.index]) {
        //*if the player1 won-set background color to blue, if player2 won-set background color to red
        document.getElementById(index).style.backgroundColor = gameWon.player === player1 ? "#4da6ff" : "#ff0000";
    }
    for (var i= 0; i < cells.length; i++ ) {
        //* making sure we cannot click on the cells anymore
        cells[i].removeEventListener('click', turnClick, false);
    }
    //* if Player1 won show "You win!", otherwise show "You lose."
    declareWinner(gameWon.player === player1 ? `${player1} win!` : `${player2} win!`);
}

//* Defining emptySuares function
//* Filter every element in the origBoard to see if the type of element equals number.
//* If yes, we are gonna return it (all the squares that are numbers are empty, the squares with X and O are not empty)
//* @returns a array that has numbers in the origboard
function emptySquares() {
    return origBoard.filter(s => typeof s === 'number');
}

//* Defining checkTie function that check if the match tied or not
function checkTie() {
    if (emptySquares().length === 0) {
        for (let i = 0; i < cells.length; i++) {
            //* setting the background color to green
            cells[i].style.backgroundColor = "#66ff66";
            //* making sure user cannot click anywhere as the game is over
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Game Tied! Play Again.");
        return true;
    }
    return false;
}

//* Defining declareWinner function
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

initGame();