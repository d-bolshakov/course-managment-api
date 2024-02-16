import "reflect-metadata";
// importing loader for dependency injection container this way instead of importing the setupContainer() function
// to register dependencies during module import resolution because injection of controllers in router files
// happens during import resolution too
import "./loaders/di-registry.loader.js";
import express from "express";
import { ErrorHandlerMiddleware } from "./middleware/error-handler.middleware.js";
import { loadMiddleware } from "./loaders/middleware.loader.js";
import { loadRoutes } from "./loaders/routes.loader.js";

const PORT = process.env.PORT || 5000;

const app = express();

loadRoutes(app);
loadMiddleware(app);

app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
