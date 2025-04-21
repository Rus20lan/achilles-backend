import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

import sequelize from "./config/db.js";
import { router as authRouters } from "./routes/auth.js";
import { router as titlesRouters } from "./routes/titles.js";
import { router as designsRouters } from "./routes/designs.js";
import { router as designRouters } from "./routes/design.js";
import { router as resourcesRouters } from "./routes/resources.js";
import { router as resourceRouters } from "./routes/resource.js";
import { router as titleRouters } from "./routes/title.js";
import { router as factsRouters } from "./routes/facts.js";
import { router as factRouters } from "./routes/fact.js";
import { router as volumesRouters } from "./routes/volumes.js";
import funPassport from "./middleware/passport.js";

const app = express();

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully"))
  .catch((error) =>
    console.error("Unable to connect to the database: ", error)
  );

app.use(passport.initialize()); // Подключаем passport к нашему backend
funPassport(passport); // Подключение стратегии к passport

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRouters);
app.use("/api/titles", titlesRouters);
app.use("/api/title", titleRouters);

app.use("/api/facts", factsRouters);
app.use("/api/fact", factRouters);

app.use("/api/designs", designsRouters);
app.use("/api/design", designRouters);
app.use("/api/resources", resourcesRouters);
app.use("/api/resource", resourceRouters);

app.use("/api/volumes", volumesRouters);

export default app;
