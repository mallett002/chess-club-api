export const applyServerRoutes = (app) => {
  app.get('/health', (req, res) => {
    res.send('healthy');
  });
}