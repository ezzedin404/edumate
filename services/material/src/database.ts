import { Sequelize } from "sequelize-typescript";
import { Lecture } from "./models/Lecture";
import { Course } from "./models/Course";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  models: [Lecture, Course],
});

export default sequelize;