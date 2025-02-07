import "reflect-metadata"
import express from "express";
import router from "./api/index";
import dotenv from "dotenv"
import { loadSequelize } from "./database";

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use("/api/v1", router);
dotenv.config()

loadSequelize().sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
