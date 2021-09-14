const defaultPort = 4000;

interface Environment {
  apollo: {
    introspection: boolean,
    playground: boolean
  },
  port: number|string,
  postgresHost: string
}

export const env: Environment = {
  apollo: {
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production'
  },
  postgresHost: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.PORT || defaultPort
};
