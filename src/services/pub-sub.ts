// Todo: For production PubSub: https://www.apollographql.com/docs/apollo-server/data/subscriptions#production-pubsub-libraries
import { PubSub } from 'graphql-subscriptions';

let pubSub;

export const getPubSub = () => {
  if (!pubSub) {
    pubSub = new PubSub();
  }

  return pubSub;
};
