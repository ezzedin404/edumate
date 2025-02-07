import { Sequelize } from "sequelize-typescript";
import { MultipleChoiceQuestion } from "./models/MultipleChoiceQuestion";
import { WrittenQuestion } from "./models/WrittenQuestion";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  models: [MultipleChoiceQuestion, WrittenQuestion],
});

export default sequelize;