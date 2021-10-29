import { getPgClient } from "./db-client";

export const getPostgresHealth = async () => {
  const pgClient = getPgClient();

  try {
    await pgClient.raw('SELECT');

    return true;
  } catch {
    return false;
  }
};