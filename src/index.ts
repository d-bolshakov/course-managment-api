import "reflect-metadata";
import { setupContainer } from "./loaders/di-registry.loader.js";
import express from "express";
import { ErrorHandlerMiddleware } from "./middleware/error-handler.middleware.js";
import { loadMiddleware } from "./loaders/middleware.loader.js";
import { loadRoutes } from "./loaders/routes.loader.js";

const PORT = process.env.PORT || 5000;

const app = express();

setupContainer();
loadMiddleware(app);
loadRoutes(app);

app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
