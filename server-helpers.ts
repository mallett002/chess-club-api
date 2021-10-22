export const createContext = ({ req }) => {
  const token = req.headers.authorization || '';

  return {token};
};
