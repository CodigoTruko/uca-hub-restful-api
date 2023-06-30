export default () => ({
    port: parseInt(process.env.apit_PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST || "localhost",
      port: parseInt(process.env.MONGODB_PORT, 10) || 5432,
      name: process.env.MONGODB_NAME || "uca-hub"
    }
  });