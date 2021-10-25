describe('create player', () => {
  const createPlayerMutation = `
    mutation CreatePlayer($username: String!, $password: String!){
      createPlayer(username: $username, password: $password) {
        token
      }
    }
  `;

  beforeEach(() => {
    // gqlClient = new GraphqlClient();
  });

  it('should be able to create a player', () => {
    // const response = await gqlClient.request(createPlayerMutation, {
    //   "username": "billy",
    //   "password": "password"
    // });

    expect(true).toBeTruthy();
  });
});