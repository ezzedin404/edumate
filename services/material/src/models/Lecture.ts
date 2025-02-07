import {
  AllowNull,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Course } from "./Course";

@Table
export class Lecture extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  lectureName!: string;

  @ForeignKey(() => Course)
  @AllowNull(false)
  @Column
  courseId!: number;

  @BelongsTo(() => Course)
  @AllowNull(false)
  @Column
  course!: Course;
}
