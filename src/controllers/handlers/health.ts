import { getPostgresHealth } from "../../repository/health";


export default async (__, res) => {
  const postgresHealthy = await getPostgresHealth();

  res.status(200).json({
    postgresHealthy
  });
};
