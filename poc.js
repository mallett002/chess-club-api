const chessJs = require('chess.js')

const chess = new chessJs.Chess();


// chess.load('k7/8/n7/8/8/8/8/7K b - - 0 1');

// console.log({
//   inCheck: chess.in_check(),
//   in_checkmate: chess.in_checkmate(),
//   inDraw: chess.in_draw(),
//   in_stalemate: chess.in_stalemate(),
//   insufficient_material: chess.insufficient_material(),
// });

// console.log(chess.ascii());

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

// Fallen soldiers (TLDR, save pieces into db)
// console.log('start', chess.ascii());
chess.move('Nf3');
chess.move('Nc6');
chess.move('Nh4');
chess.move('b6');
chess.move('Ng6');
chess.move('e5');
chess.move('b4');
chess.move('c5');
// console.log(chess.turn());

console.log(chess.ascii());
console.log(chess.moves({verbose: true}));
const things = [
  {
    color: 'b',
    from: 'a8',
    to: 'b8',
    flags: 'n',
    piece: 'r',
    san: 'Rb8'
  },
  {
    color: 'b',
    from: 'c8',
    to: 'b7',
    flags: 'n',
    piece: 'b',
    san: 'Bb7'
  },
  {
    color: 'b',
    from: 'c8',
    to: 'a6',
    flags: 'n',
    piece: 'b',
    san: 'Ba6'
  },
  {
    color: 'b',
    from: 'd8',
    to: 'e7',
    flags: 'n',
    piece: 'q',
    san: 'Qe7'
  },
  {
    color: 'b',
    from: 'd8',
    to: 'f6',
    flags: 'n',
    piece: 'q',
    san: 'Qf6'
  },
  {
    color: 'b',
    from: 'd8',
    to: 'g5',
    flags: 'n',
    piece: 'q',
    san: 'Qg5'
  },
  {
    color: 'b',
    from: 'd8',
    to: 'h4',
    flags: 'n',
    piece: 'q',
    san: 'Qh4'
  },
  {
    color: 'b',
    from: 'f8',
    to: 'e7',
    flags: 'n',
    piece: 'b',
    san: 'Be7'
  },
  {
    color: 'b',
    from: 'f8',
    to: 'd6',
    flags: 'n',
    piece: 'b',
    san: 'Bd6'
  },
  {
    color: 'b',
    from: 'f8',
    to: 'c5',
    flags: 'n',
    piece: 'b',
    san: 'Bc5'
  },
  {
    color: 'b',
    from: 'f8',
    to: 'b4',
    flags: 'c',
    piece: 'b',
    captured: 'p',
    san: 'Bxb4'
  },
  {
    color: 'b',
    from: 'g8',
    to: 'h6',
    flags: 'n',
    piece: 'n',
    san: 'Nh6'
  },
  {
    color: 'b',
    from: 'g8',
    to: 'f6',
    flags: 'n',
    piece: 'n',
    san: 'Nf6'
  },
  {
    color: 'b',
    from: 'g8',
    to: 'e7',
    flags: 'n',
    piece: 'n',
    san: 'Nge7'
  },
  {
    color: 'b',
    from: 'a7',
    to: 'a6',
    flags: 'n',
    piece: 'p',
    san: 'a6'
  },
  {
    color: 'b',
    from: 'a7',
    to: 'a5',
    flags: 'b',
    piece: 'p',
    san: 'a5'
  },
  {
    color: 'b',
    from: 'd7',
    to: 'd6',
    flags: 'n',
    piece: 'p',
    san: 'd6'
  },
  {
    color: 'b',
    from: 'd7',
    to: 'd5',
    flags: 'b',
    piece: 'p',
    san: 'd5'
  },
  {
    color: 'b',
    from: 'f7',
    to: 'f6',
    flags: 'n',
    piece: 'p',
    san: 'f6'
  },
  {
    color: 'b',
    from: 'f7',
    to: 'f5',
    flags: 'b',
    piece: 'p',
    san: 'f5'
  },
  {
    color: 'b',
    from: 'f7',
    to: 'g6',
    flags: 'c',
    piece: 'p',
    captured: 'n',
    san: 'fxg6'
  },
  {
    color: 'b',
    from: 'h7',
    to: 'h6',
    flags: 'n',
    piece: 'p',
    san: 'h6'
  },
  {
    color: 'b',
    from: 'h7',
    to: 'h5',
    flags: 'b',
    piece: 'p',
    san: 'h5'
  },
  {
    color: 'b',
    from: 'h7',
    to: 'g6',
    flags: 'c',
    piece: 'p',
    captured: 'n',
    san: 'hxg6'
  },
  {
    color: 'b',
    from: 'b6',
    to: 'b5',
    flags: 'n',
    piece: 'p',
    san: 'b5'
  },
  {
    color: 'b',
    from: 'c6',
    to: 'b8',
    flags: 'n',
    piece: 'n',
    san: 'Nb8'
  },
  {
    color: 'b',
    from: 'c6',
    to: 'e7',
    flags: 'n',
    piece: 'n',
    san: 'Nce7'
  },
  {
    color: 'b',
    from: 'c6',
    to: 'd4',
    flags: 'n',
    piece: 'n',
    san: 'Nd4'
  },
  {
    color: 'b',
    from: 'c6',
    to: 'b4',
    flags: 'c',
    piece: 'n',
    captured: 'p',
    san: 'Nxb4'
  },
  {
    color: 'b',
    from: 'c6',
    to: 'a5',
    flags: 'n',
    piece: 'n',
    san: 'Na5'
  },
  {
    color: 'b',
    from: 'e5',
    to: 'e4',
    flags: 'n',
    piece: 'p',
    san: 'e4'
  }
]

/*
  database schema:
    


*/

// Playing ------------------------------------------------
// const things = [ { color: 'b', from: 'a8', to: 'b8', flags: 'n', piece: 'r', san: 'Rb8' }, { color: 'b', from: 'c8', to: 'b7', flags: 'n', piece: 'b', san: 'Bb7' }, { color: 'b', from: 'c8', to: 'a6', flags: 'n', piece: 'b', san: 'Ba6' }, { color: 'b', from: 'd8', to: 'e7', flags: 'n', piece: 'q', san: 'Qe7' }, { color: 'b', from: 'd8', to: 'f6', flags: 'n', piece: 'q', san: 'Qf6' }, { color: 'b', from: 'd8', to: 'g5', flags: 'n', piece: 'q', san: 'Qg5' }, { color: 'b', from: 'd8', to: 'h4', flags: 'n', piece: 'q', san: 'Qh4' }, { color: 'b', from: 'f8', to: 'e7', flags: 'n', piece: 'b', san: 'Be7' }, { color: 'b', from: 'f8', to: 'd6', flags: 'n', piece: 'b', san: 'Bd6' }, { color: 'b', from: 'f8', to: 'c5', flags: 'n', piece: 'b', san: 'Bc5' }, { color: 'b', from: 'f8', to: 'b4', flags: 'c', piece: 'b', captured: 'p', san: 'Bxb4' }, { color: 'b', from: 'g8', to: 'h6', flags: 'n', piece: 'n', san: 'Nh6' }, { color: 'b', from: 'g8', to: 'f6', flags: 'n', piece: 'n', san: 'Nf6' }, { color: 'b', from: 'g8', to: 'e7', flags: 'n', piece: 'n', san: 'Nge7' }, { color: 'b', from: 'a7', to: 'a6', flags: 'n', piece: 'p', san: 'a6' }, { color: 'b', from: 'a7', to: 'a5', flags: 'b', piece: 'p', san: 'a5' }, { color: 'b', from: 'd7', to: 'd6', flags: 'n', piece: 'p', san: 'd6' }, { color: 'b', from: 'd7', to: 'd5', flags: 'b', piece: 'p', san: 'd5' }, { color: 'b', from: 'f7', to: 'f6', flags: 'n', piece: 'p', san: 'f6' }, { color: 'b', from: 'f7', to: 'f5', flags: 'b', piece: 'p', san: 'f5' }, { color: 'b', from: 'f7', to: 'g6', flags: 'c', piece: 'p', captured: 'n', san: 'fxg6' }, { color: 'b', from: 'h7', to: 'h6', flags: 'n', piece: 'p', san: 'h6' }, { color: 'b', from: 'h7', to: 'h5', flags: 'b', piece: 'p', san: 'h5' }, { color: 'b', from: 'h7', to: 'g6', flags: 'c', piece: 'p', captured: 'n', san: 'hxg6' }, { color: 'b', from: 'b6', to: 'b5', flags: 'n', piece: 'p', san: 'b5' }, { color: 'b', from: 'c6', to: 'b8', flags: 'n', piece: 'n', san: 'Nb8' }, { color: 'b', from: 'c6', to: 'e7', flags: 'n', piece: 'n', san: 'Nce7' }, { color: 'b', from: 'c6', to: 'd4', flags: 'n', piece: 'n', san: 'Nd4' }, { color: 'b', from: 'c6', to: 'b4', flags: 'c', piece: 'n', captured: 'p', san: 'Nxb4' }, { color: 'b', from: 'c6', to: 'a5', flags: 'n', piece: 'n', san: 'Na5' }, { color: 'b', from: 'e5', to: 'e4', flags: 'n', piece: 'p', san: 'e4' } ];

// console.log(things.length);
// const thing = things.find((item) => {
//   return /x/.test(item.san);
// });

// console.log("thing", thing);