export const createContext = ({ req }) => {
  const token = req.headers.authorization || '';

  console.log({token});
  
  // TODO: Try to retrieve a user with the token
  // const user = getUser(token);


  // Add the user to the context
  return { user: {username: 'will', playerId: 'some-id'} };
};
