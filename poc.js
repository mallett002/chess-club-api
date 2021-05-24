// playing with this library for learning
import chessJs from 'chess.js';

const chess = new chessJs.Chess();

chess.move('a4');
chess.move('Nc6'); // if special piece, need to prepend its letter
chess.move('d4');

console.log(chess.ascii());
console.log(chess.moves({square: 'g8', verbose: true}));


// // console.log('before move: ', chess.ascii());
// const moves = chess.moves({square: 'c6', verbose: true}); // can use it's "san" key for standard algebraic notation
// // console.log({moves});

// const moveToCell = moves.find((move) => move.to === 'b8');
// // console.log('moving to: ', moveToCell);
// chess.move(moveToCell.san);

// console.log(chess.ascii());
// console.log('turn: ', chess.turn());
