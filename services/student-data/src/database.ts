import { Sequelize } from "sequelize-typescript";
import { Answer } from "./models/Answer";
import { Progress } from "./models/Progress";

export const loadSequelize = () => {
	return new Sequelize({
		dialect: "postgres",
		host: process.env.POSTGRES_HOST,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		models: [Answer, Progress],
	});
}
