import { Express } from "express";
import clubRoutes from "./club.routes";
import eventRoutes from "./event.routes";
import quizRoutes from "./quiz.routes";

export const setupRoutes = (app: Express) => {
  app.use("/api/clubs", clubRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/quizzes", quizRoutes);
  // app.use("/api/tables", table);
};
