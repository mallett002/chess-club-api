export const applyServerRoutes = (app) => {
  app.get('/health', (req, res) => {
    res.send('healthy');
  });

  app.post('create-account', (req, res) => {
    /*
      - Take in a username, password
      - encrypt the password
      - store the username and password in the DB.
      - authenticate the user (give them a JWT)
    */
  });
}