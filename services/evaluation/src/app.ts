import "reflect-metadata"
import express from "express";
import sequelize from "./database";
import router from "./api/index";

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use("/api/v1", router);

sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
