// For production PubSub: https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries
import { PubSub } from 'apollo-server';

let pubSub;

export const getPubSub = () => {
  if (!pubSub) {
    pubSub = new PubSub();
  }

  return pubSub;
};
