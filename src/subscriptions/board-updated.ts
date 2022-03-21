import  { withFilter } from 'graphql-subscriptions';
import { getPubSub } from '../services/pub-sub';
import { BOARD_UPDATED } from '../constants';

const boardUpdatedSubscription = withFilter(
  () => {
    const pubSub = getPubSub();

    return pubSub.asyncIterator([BOARD_UPDATED])
  },
  (payload, variables) => {
    return payload.boardUpdated.gameId === variables.gameId;
  }
);

export default boardUpdatedSubscription;
