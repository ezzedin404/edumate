import "reflect-metadata"
import express from "express";
import sequelize from "./database";
import router from "./api/index";
import { ensureBucketExists } from "./services/minio";

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use("/api/v1", router);
ensureBucketExists()

sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
