import {gql, GraphQLClient} from 'graphql-request';

import {graphqlUrl} from '../utils';

describe('create player', () => {
  const createPlayerMutation = gql`
    mutation CreatePlayer($username: String!, $password: String!){
      createPlayer(username: $username, password: $password) {
        token
      }
    }
  `;

  let gqlClient;

  beforeEach(() => {
    gqlClient = new GraphQLClient(graphqlUrl);
  });

  it('should be able to create a player', async () => {
    const response = await gqlClient.request(createPlayerMutation, {
      username: 'billy',
      password: 'password'
    });
    console.log({response});

    expect(response).not.toBeNull();
  });
});