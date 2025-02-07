import {
	Model,
	Table,
	Column,
	PrimaryKey,
	AutoIncrement,
	AllowNull,
	AfterDestroy,
} from "sequelize-typescript";

@Table
export class Course extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number;

	@AllowNull(false)
	@Column
	tutorId!: number;

	@AllowNull(false)
	@Column
	name!: string;

	@AllowNull(false)
	@Column
	likes!: number;

	@AllowNull(false)
	@Column
	dislikes!: number;
}
