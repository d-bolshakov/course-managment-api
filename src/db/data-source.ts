import { DataSource } from "typeorm";
import { fileURLToPath } from "url";
import path from "path";

const entitiesPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "entities",
  "**"
);

const migrationsPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "migrations",
  "**"
);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: String(process.env.DB_PASS),
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [entitiesPath],
  subscribers: [],
  migrations: [migrationsPath],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
