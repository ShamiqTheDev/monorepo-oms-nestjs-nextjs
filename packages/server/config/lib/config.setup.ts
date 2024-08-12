export default () => ({
  port: parseInt(import.meta.env.VITE_PORT, 10) || 3333,
  cors: import.meta.env.VITE_CORS,
  node_env: import.meta.env.VITE_NODE_ENV,
  jwt: {
    secret: import.meta.env.VITE_JWT_SECRET,
    expires_in: import.meta.env.VITE_JWT_EXPIRES_IN,
    refresh_expires_in: import.meta.env.VITE_REFRESH_JWT_EXPIRES_IN,
  },
  database: {
    user: import.meta.env.VITE_DATABASE_USER,
    password: import.meta.env.VITE_DATABASE_PASSWORD,
    port: parseInt(import.meta.env.VITE_DATABASE_PORT as unknown as string, 10),
    name: import.meta.env.VITE_DATABASE_NAME,
    ref: import.meta.env.VITE_DATABASE_REF,
    region: import.meta.env.VITE_DATABASE_REGION,
  },
  resend_api_key: import.meta.env.VITE_RESEND_API_KEY,
  hostname: import.meta.env.VITE_HOSTNAME,
});
