// playing with this library for learning
// import chessJs from 'chess.js';
const chessJs = require('chess.js')

const chess = new chessJs.Chess();

chess.move('a4');
chess.move('Nc6'); // if special piece, need to prepend its letter
chess.move('d4');

console.log(chess.ascii());
// console.log(chess.moves({square: 'g8', verbose: true}));
const moves = chess.moves({verbose: true});
const turn = chess.turn();

console.log({
  turn,
  moves,
  positions: chess.board()
});

const fen = chess.fen();
console.log({fen});


// const moves = chess.moves({square: 'c6', verbose: true}); // can use it's "san" key for standard algebraic notation

// const moveToCell = moves.find((move) => move.to === 'b8');
// // console.log('moving to: ', moveToCell);
// chess.move(moveToCell.san);

// console.log(chess.ascii());
// console.log('turn: ', chess.turn());

/*
- 1. Create a game
  const chess = new chessJs.Chess();

- 2. Send game data to clients:
  const moves = chess.moves({verbose: true});
  const turn = chess.turn();
  const board = chess.board();

  {
    turn
    positions
    moves
    gameId
    players: [{
      username
      color
      playerId
    }]
  }

- 3. Player "w" moves:
    {square: 'c6'}
    chess.move({square: 'c6'});
    chess.fen() --> Save into db for this gameId

- 4. Send back updated game data to clients (subscription will handle this)
  const moves = chess.moves({verbose: true});
  const turn = chess.turn();
  const board = chess.board();

*/
