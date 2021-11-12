const chessJs = require('chess.js')

const chess = new chessJs.Chess();

chess.move('g4');
chess.move('e5');
chess.move('f3');
console.log(chess.moves({verbose: true}).filter((m) => m.san.includes('#')).length)
chess.move('Qh4#');

const inCheck = chess.in_checkmate();
console.log({inCheck});

console.log(chess.ascii());
console.log(chess.turn());
// console.log(chess.moves({verbose: true}));

// chess.load('rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1');

// console.log(chess.moves());

// chess.move('a4');
// chess.move('Nc6'); // if special piece, need to prepend its letter
// chess.move('d4');

// console.log(chess.ascii());
// // console.log(chess.moves({square: 'g8', verbose: true}));
// const movesVerbose = chess.moves({verbose: true});
// const moves = chess.moves();
// const turn = chess.turn();

// const move1 = chess.move('e6');
// const move2 = chess.move('e6');
// const move3 = chess.move('e6');

// console.log({move1, move2, move3});


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
