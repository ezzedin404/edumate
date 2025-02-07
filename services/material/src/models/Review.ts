import {
  AllowNull,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  IsIn,
  Unique
} from "sequelize-typescript";
import { Course } from "./Course";

@Table
export class Review extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Unique
  @Column
  studentId!: number;

  @ForeignKey(() => Course)
  @AllowNull(false)
  @Column
  courseId!: number;

  @BelongsTo(() => Course)
  @AllowNull(false)
  @Column
  course!: Course;
  
  @AllowNull(false)
  @Column
  @IsIn([[1], [2], [3], [4], [5]])
  score!: number;

  @Column
  detail!: string;

}
