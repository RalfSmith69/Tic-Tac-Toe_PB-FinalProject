
const readline = require('readline');

// Erstellt eine Schnittstelle zum Lesen von Benutzereingaben
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let currentPlayer = null; // Variable zur Verfolgung des aktuellen Spielers
let winner = null; // Variable zur Verfolgung des Gewinners

// Spielerobjekte mit Namen und Symbolen
const players = [
  { name: 'Spieler 1', symbol: 'X' },
  { name: 'Spieler 2', symbol: 'O' }
];

// Das Spielbrett, initialisiert mit Zahlen von 1 bis 9 für die Positionen
let board = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9']
];

// Funktion zum Drucken des Spielbretts in der Konsole
function printBoard() {
  console.clear();
  console.log('Wähle eine Nummer von 1-9 und bestätige mit ENTER, um dein Zeichen zu setzen.\n');
  console.log('\n' +
    ` ${board[0][0]} │ ${board[0][1]} │ ${board[0][2]} \n` +
    `───┼───┼───\n` +
    ` ${board[1][0]} │ ${board[1][1]} │ ${board[1][2]} \n` +
    `───┼───┼───\n` +
    ` ${board[2][0]} │ ${board[2][1]} │ ${board[2][2]} \n`
  );
}

// Funktion zum Überprüfen, ob das Spielbrett voll ist
function isBoardFull() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 'X' && board[i][j] !== 'O') {
        return false;
      }
    }
  }
  return true;
}

// Funktion zur Überprüfung des Gewinners
function checkWinner() {
  // Überprüft die Reihen und Spalten auf gleiche Symbole
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
      winner = board[i][0];
    }
    if (board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
      winner = board[0][i];
    }
  }
  // Überprüft die Diagonalen auf gleiche Symbole
  if ((board[0][0] === board[1][1] && board[0][0] === board[2][2]) ||
      (board[0][2] === board[1][1] && board[0][2] === board[2][0])) {
    winner = board[1][1];
  }
  // Wenn ein Gewinner gefunden wurde oder das Brett voll ist, beendet das Spiel
  if (winner) {
    const winnerName = players.find(player => player.symbol === winner).name;
    console.clear();
    console.log(` 🎉 🎉 Herzlichen Glückwunsch ${winnerName}, du hast gewonnen! 🎉 🎉 `);
    console.log('***********************************************************');
    rl.close();
  } else if (isBoardFull()) {
    console.clear();
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('+ DAS WAR LEIDER NIX! UNENTSCHIEDEN VERSUCHT ES NOCHMLAS IHR LOOSER...🤣🤣 +');
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    rl.close();
  }
}

// Funktion zum Wechseln des aktuellen Spielers
function switchPlayer() {
  currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
}

// Funktion zum Ausführen eines Spielzugs
function playTurn(move) {
  let found = false;
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === move) {
        if (cell !== 'X' && cell !== 'O') {
          board[rowIndex][colIndex] = currentPlayer.symbol;
          found = true;
        }
      }
    });
  });
  return found;
}

// Funktion zum Abfragen der Spielerdetails (Name und Symbol)
function askPlayerDetails(playerIndex) {
  rl.question(`${players[playerIndex].name}, wie lautet dein Name? Drücke Enter, um den Standardnamen "${players[playerIndex].name}" zu verwenden: `, (name) => {
    if (name) players[playerIndex].name = name;
    rl.question(`Welches Symbol möchtest du verwenden? Drücke Enter, um das Standardzeichen ${players[playerIndex].symbol} zu verwenden: `, (symbol) => {
      if (symbol) players[playerIndex].symbol = symbol;
      if (playerIndex === 0) {
        askPlayerDetails(1);
      } else {
        if (players[0].symbol === players[1].symbol) {
          console.clear();
          console.log('Beide Spieler können nicht dasselbe Symbol verwenden. Bitte versuchen Sie es erneut.');
          askPlayerDetails(0);
        } else {
          currentPlayer = players[0];
          startGame();
        }
      }
    });
  });
}

// Funktion zum Starten des Spiels
function startGame() {
  printBoard();
  console.log(`Spieler ${currentPlayer.name} ist an der Reihe.\n`);
  console.log('Bitte wählen Sie ein Feld/Zahl aus, in das Sie Ihr Symbol setzen möchten.\n');
  rl.on('line', (input) => {
    if (!winner && playTurn(input)) {
      console.clear();
      printBoard();
      if (!winner && !isBoardFull()) {
        switchPlayer();
        console.log(`Spieler ${currentPlayer.name} ist an der Reihe.\n`);
      }
      checkWinner();
    } else {
      console.clear();
      console.log('Ungültiger Zug. Bitte erneut versuchen.\n');
      printBoard();
      console.log(`Spieler ${currentPlayer.name} ist an der Reihe.\n`);
    }
  });
}


console.clear();
console.log('***********************');
console.log('* RALF `S TIC TAC TOE *');
console.log('***********************');
console.log('😀 Lass uns eine Runde spielen und sehen wer gewinnt! 😃 \n');

// Beginnt mit der Abfrage der Spielerdetails für Spieler 1
askPlayerDetails(0);