import {gql, GraphQLClient} from 'graphql-request';
import { createRandomPlayerPayload } from '../factories/player';
import {graphqlUrl} from '../utils';
import { deletePlayers } from '../utils/db';

describe('create player', () => {
  const createPlayerMutation = gql`
    mutation CreatePlayer($username: String!, $password: String!){
      createPlayer(username: $username, password: $password) {
        token
      }
    }
  `;

  let gqlClient;

  beforeEach(async () => {
    gqlClient = new GraphQLClient(graphqlUrl);

    await deletePlayers();
  });

  it('should be able to create a player', async () => {
    const createPlayerPayload = createRandomPlayerPayload();
    const response = await gqlClient.request(createPlayerMutation, createPlayerPayload);
    console.log({response});

    expect(response).not.toBeNull();
  });
});