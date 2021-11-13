import { indexToRank, indexToFile } from '../helpers/board';
import { IGameStatus, IPosition } from '../interfaces/board';

export const flattenPositions = (positions): IPosition[] => {
  const flattenedPositions = [];

  for (let rowIndex = 0; rowIndex < positions.length; rowIndex++) {
    for (let cellIndex = 0; cellIndex < positions.length; cellIndex++) {
      const label = `${indexToFile[cellIndex]}${indexToRank[rowIndex]}`;
      flattenedPositions.push({
        ...positions[rowIndex][cellIndex],
        label
      });
    }
  }

  return flattenedPositions;
};

export const mapChessStatusToGameStatus = (chess): IGameStatus => {
  if (chess.in_checkmate()) {
    return IGameStatus.CHECKMATE;
  } else if (chess.in_check()) {
    return IGameStatus.CHECK;
  } else if (chess.in_stalemate()){
    return IGameStatus.STALEMATE;
  } else if (chess.in_draw()){
    return IGameStatus.DRAW;
  }

  return IGameStatus.PLAY;
};
