import Chance from 'chance';

const chance = new Chance();

export const createRandomPlayerPayload = (overrides = {}) => ({
  username: chance.string(),
  password: chance.string()
});
